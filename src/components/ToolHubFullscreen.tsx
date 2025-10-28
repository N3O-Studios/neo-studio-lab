import { useState, useEffect, useRef } from "react";
import { X, Send, Loader2, Save, Trash2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  updated_at: string;
}

interface ToolHubFullscreenProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessages?: Message[];
  onBackToTools: () => void;
}

export const ToolHubFullscreen = ({ isOpen, onClose, initialMessages = [], onBackToTools }: ToolHubFullscreenProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        loadSessions();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        loadSessions();
      } else {
        setSessions([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(2);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { messages: [...messages, userMessage] }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply || "Sorry, I couldn't process that."
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Auto-save to current session if exists
      if (currentSessionId && user) {
        await saveMessageToSession(currentSessionId, userMessage);
        await saveMessageToSession(currentSessionId, assistantMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveMessageToSession = async (sessionId: string, message: Message) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          role: message.role,
          content: message.content
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleSaveChat = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save chats.",
        variant: "destructive",
      });
      return;
    }

    if (sessions.length >= 2) {
      toast({
        title: "Maximum Chats Reached",
        description: "You can only save 2 chats. Delete one to save a new chat.",
        variant: "destructive",
      });
      return;
    }

    if (messages.length === 0) {
      toast({
        title: "No Messages",
        description: "Start chatting before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const title = messages[0]?.content.slice(0, 50) || 'New Chat';
      
      const { data: session, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({ 
          title,
          user_id: user.id 
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      for (const msg of messages) {
        await saveMessageToSession(session.id, msg);
      }

      setCurrentSessionId(session.id);
      await loadSessions();

      toast({
        title: "Chat Saved",
        description: "Your conversation has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving chat:', error);
      toast({
        title: "Error",
        description: "Failed to save chat. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadSession = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })));
      setCurrentSessionId(sessionId);
    } catch (error) {
      console.error('Error loading session:', error);
      toast({
        title: "Error",
        description: "Failed to load chat session.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      if (currentSessionId === sessionId) {
        setMessages([]);
        setCurrentSessionId(null);
      }

      await loadSessions();
      toast({
        title: "Chat Deleted",
        description: "Chat session has been deleted.",
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error",
        description: "Failed to delete chat session.",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <Button
            variant="ghost"
            onClick={onBackToTools}
            className="w-full justify-start"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            Saved Chats ({sessions.length}/2)
          </h3>
          {sessions.map((session) => (
            <Card
              key={session.id}
              className={`p-3 cursor-pointer transition-all ${
                currentSessionId === session.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card hover:bg-accent'
              }`}
              onClick={() => handleLoadSession(session.id)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{session.title}</p>
                  <p className="text-xs opacity-70">
                    {new Date(session.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSession(session.id);
                  }}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
          {sessions.length === 0 && user && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No saved chats yet
            </p>
          )}
          {!user && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Log in to save chats
            </p>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <Button
            onClick={handleSaveChat}
            disabled={isSaving || !user}
            variant="outline"
            className="w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Chat
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-border p-4 flex items-center justify-between bg-card/50">
          <h2 className="text-xl font-bold">Chat with NS</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border p-4 rounded-lg">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border p-6 bg-card/50">
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask NS anything about music..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="min-h-[80px] max-h-[200px] resize-none focus:ring-2 focus:ring-primary focus:shadow-glow transition-all"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
              className="h-[80px] w-[80px]"
            >
              <Send className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
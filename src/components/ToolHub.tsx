import { useState, useEffect, useRef } from "react";
import { X, Wand2, Music, Newspaper, MessageSquare, Send, Loader2, ExternalLink, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ToolHubFullscreen } from "./ToolHubFullscreen";

interface ToolHubProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tool = "chat" | "cover-art" | "chord-detector" | "news" | null;

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface NewsArticle {
  id: string;
  title: string;
  description: string | null;
  url: string;
  source: string;
  published_at: string | null;
}

export const ToolHub = ({ isOpen, onClose }: ToolHubProps) => {
  const [selectedTool, setSelectedTool] = useState<Tool>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coverArtPrompt, setCoverArtPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [chordAnalysis, setChordAnalysis] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedTool === "news") {
      loadNews();
    }
  }, [selectedTool]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadNews = async () => {
    setLoadingNews(true);
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error loading news:', error);
      toast({
        title: "Error",
        description: "Failed to load news articles",
        variant: "destructive",
      });
    } finally {
      setLoadingNews(false);
    }
  };

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: inputMessage };
    setMessages([userMessage]);
    setInputMessage("");
    setShowFullscreen(true);
  };

  const handleGenerateCoverArt = async () => {
    if (!coverArtPrompt.trim() || isLoading) return;

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-cover-art', {
        body: { prompt: coverArtPrompt }
      });

      if (error) throw error;

      if (data.image) {
        setGeneratedImage(data.image);
        toast({
          title: "Success",
          description: "Cover art generated successfully!",
        });
      }
    } catch (error) {
      console.error('Error generating cover art:', error);
      toast({
        title: "Error",
        description: "Failed to generate cover art. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['audio/wav', 'audio/mpeg', 'audio/flac', 'audio/x-flac'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(wav|mp3|flac)$/i)) {
        toast({
          title: "Invalid File",
          description: "Please upload a WAV, MP3, or FLAC file.",
          variant: "destructive",
        });
        return;
      }
      setAudioFile(file);
    }
  };

  const handleDetectChords = async () => {
    if (!audioFile || isLoading) return;

    setIsLoading(true);
    setChordAnalysis(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        const { data, error } = await supabase.functions.invoke('detect-chords', {
          body: { 
            audioData: base64Audio,
            fileName: audioFile.name
          }
        });

        if (error) throw error;

        if (data.analysis) {
          setChordAnalysis(data.analysis);
          toast({
            title: "Analysis Complete",
            description: "Chord detection completed successfully!",
          });
        }
        setIsLoading(false);
      };
      reader.readAsDataURL(audioFile);
    } catch (error) {
      console.error('Error detecting chords:', error);
      toast({
        title: "Error",
        description: "Failed to detect chords. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (showFullscreen) {
    return (
      <ToolHubFullscreen
        isOpen={showFullscreen}
        onClose={() => {
          setShowFullscreen(false);
          onClose();
        }}
        initialMessages={messages}
        onBackToTools={() => {
          setShowFullscreen(false);
          setMessages([]);
        }}
      />
    );
  }

  if (!isOpen) return null;

  const tools = [
    {
      id: "chat" as Tool,
      name: "Chat Assistant",
      icon: MessageSquare,
      description: "Ask NS anything",
    },
    {
      id: "cover-art" as Tool,
      name: "Cover Art Generator",
      icon: Wand2,
      description: "Generate album artwork",
    },
    {
      id: "chord-detector" as Tool,
      name: "Chord Detector",
      icon: Music,
      description: "Analyse audio chords",
    },
    {
      id: "news" as Tool,
      name: "News & Insights",
      icon: Newspaper,
      description: "Latest music news",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="w-full max-w-5xl h-[85vh] flex flex-col bg-card/95 backdrop-blur-sm border-primary/20 shadow-card relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
        
        {/* Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-border/50 backdrop-blur-sm">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Tool Hub
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-border/50 p-4 space-y-2 backdrop-blur-sm overflow-y-auto">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolSelect(tool.id)}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  selectedTool === tool.id
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-card/50 hover:bg-card border border-border/50 hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <tool.icon className="h-5 w-5" />
                  <span className="font-semibold">{tool.name}</span>
                </div>
                <p className={`text-sm ${
                  selectedTool === tool.id ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}>
                  {tool.description}
                </p>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col backdrop-blur-sm overflow-hidden">
            {/* Chat */}
            {selectedTool === "chat" && (
              <div className="flex-1 flex flex-col p-6 items-center justify-center">
                <div className="w-full max-w-2xl space-y-6">
                  <div className="text-center space-y-2">
                    <MessageSquare className="h-16 w-16 mx-auto text-primary opacity-50" />
                    <h3 className="text-2xl font-bold">Chat with NS</h3>
                    <p className="text-muted-foreground">
                      Your AI music production assistant
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Textarea
                      placeholder="Ask NS anything about music production, mixing, sound design..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[120px] resize-none focus:ring-2 focus:ring-primary focus:shadow-glow transition-all bg-background/50"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Start Conversation
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Cover Art Generator */}
            {selectedTool === "cover-art" && (
              <div className="flex-1 flex flex-col p-6 space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Cover Art Generator</h3>
                    <p className="text-muted-foreground">
                      Generate stunning album artwork with AI. Describe your vision below.
                    </p>
                  </div>

                  <Textarea
                    placeholder="Describe your cover art (e.g., 'Dark cyberpunk cityscape with neon lights and rain')"
                    value={coverArtPrompt}
                    onChange={(e) => setCoverArtPrompt(e.target.value)}
                    className="min-h-[100px] bg-background/50 border-border/50 focus:border-primary"
                    disabled={isLoading}
                  />

                  <Button
                    onClick={handleGenerateCoverArt}
                    disabled={isLoading || !coverArtPrompt.trim()}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Cover Art
                      </>
                    )}
                  </Button>
                </div>

                {generatedImage && (
                  <div className="flex-1 overflow-auto">
                    <Card className="p-4 bg-card/50 border-primary/20">
                      <img
                        src={generatedImage}
                        alt="Generated cover art"
                        className="w-full h-auto rounded-lg"
                      />
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* Chord Detector */}
            {selectedTool === "chord-detector" && (
              <div className="flex-1 flex flex-col p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">Chord Detector</h3>
                  <p className="text-muted-foreground">
                    Upload an audio file (WAV, MP3, or FLAC) to detect chords.
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".wav,.mp3,.flac,audio/wav,audio/mpeg,audio/flac"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <Card className="p-6 border-dashed border-2 border-border/50 hover:border-primary/50 transition-colors">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                    disabled={isLoading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {audioFile ? audioFile.name : 'Select Audio File'}
                  </Button>
                </Card>

                {audioFile && (
                  <Button
                    onClick={handleDetectChords}
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Music className="mr-2 h-4 w-4" />
                        Detect Chords
                      </>
                    )}
                  </Button>
                )}

                {chordAnalysis && (
                  <Card className="flex-1 overflow-auto p-4 bg-card/50">
                    <h4 className="font-semibold mb-2">Analysis Results:</h4>
                    <pre className="whitespace-pre-wrap text-sm">{chordAnalysis}</pre>
                  </Card>
                )}
              </div>
            )}

            {/* News */}
            {selectedTool === "news" && (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Latest News & Insights</h3>
                      <p className="text-sm text-muted-foreground">
                        Music production news and updates
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadNews}
                      disabled={loadingNews}
                      className="border-border/50 hover:border-primary/50"
                    >
                      {loadingNews ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Refresh"
                      )}
                    </Button>
                  </div>

                  {loadingNews && news.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : news.length === 0 ? (
                    <Card className="p-8 text-center bg-card/50 border-primary/20">
                      <Newspaper className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No news articles available yet. Check back soon!
                      </p>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {news.map((article) => (
                        <a
                          key={article.id}
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group"
                        >
                          <Card className="p-4 bg-card/50 hover:bg-card border-border/50 hover:border-primary/50 transition-all group-hover:shadow-glow">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-primary">
                                    {article.source}
                                  </span>
                                  {article.published_at && (
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(article.published_at).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-semibold group-hover:text-primary transition-colors">
                                  {article.title}
                                </h4>
                                {article.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {article.description}
                                  </p>
                                )}
                              </div>
                              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                            </div>
                          </Card>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
import { useState } from "react";
import { X, Upload, Wand2, Music, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface ToolHubProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tool = "chat" | "cover-art" | "chord-detector" | null;

export const ToolHub = ({ isOpen, onClose }: ToolHubProps) => {
  const [selectedTool, setSelectedTool] = useState<Tool>("chat");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
    if (tool !== "chat") {
      toast({
        title: "Tool Under Development",
        description: `Sorry! The ${tool === "cover-art" ? "Cover Art Generator" : "Chord Detector"} Tool is WIP.`,
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Block audio/video files
      const blockedExtensions = ['.mp3', '.wav', '.mp4', '.mov', '.avi', '.flac', '.m4a', '.aac'];
      const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      
      if (blockedExtensions.includes(fileExtension)) {
        toast({
          title: "File Type Not Supported",
          description: "Audio and video files cannot be uploaded to the chat. Please use the Chord Detector tool for audio analysis.",
          variant: "destructive",
        });
        e.target.value = "";
        return;
      }
    }
  };

  const tools = [
    {
      id: "chat" as Tool,
      name: "Chat Assistant",
      icon: AlertCircle,
      description: "Ask questions and get help",
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
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col bg-card/95 backdrop-blur-sm border-primary/20 shadow-card relative overflow-hidden">
        {/* Glow effect */}
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
          {/* Sidebar - Tool Selection */}
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

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col p-6 backdrop-blur-sm overflow-hidden">
            {selectedTool === "chat" && (
              <div className="flex-1 flex flex-col space-y-4">
                <Alert className="border-primary/30 bg-primary/5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Welcome to N3OStudios Tool Hub! Select a tool from the sidebar or ask me anything.
                  </AlertDescription>
                </Alert>
                
                <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-background/30 rounded-lg border border-border/50">
                  <div className="text-center text-muted-foreground py-8">
                    Chat functionality coming soon...
                  </div>
                </div>

                <div className="space-y-2">
                  <Textarea
                    placeholder="Type your message... (Note: Audio/video files are not supported in chat)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px] bg-background/50 border-border/50 focus:border-primary"
                  />
                  <div className="flex gap-2">
                    <label className="cursor-pointer">
                      <Input
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                        accept=".txt,.pdf,.doc,.docx,.json,.xml,.csv"
                      />
                      <Button variant="outline" className="border-border/50 hover:border-primary/50">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload File
                      </Button>
                    </label>
                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {selectedTool === "cover-art" && (
              <div className="flex-1 flex items-center justify-center">
                <Card className="p-8 text-center max-w-md bg-card/50 border-primary/20">
                  <Wand2 className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">Cover Art Generator</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate stunning album artwork with AI-powered image generation.
                  </p>
                  <Alert className="border-destructive/50 bg-destructive/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Sorry! The Cover Art Generator Tool is WIP.
                    </AlertDescription>
                  </Alert>
                </Card>
              </div>
            )}

            {selectedTool === "chord-detector" && (
              <div className="flex-1 flex items-center justify-center">
                <Card className="p-8 text-center max-w-md bg-card/50 border-primary/20">
                  <Music className="h-16 w-16 mx-auto mb-4 text-secondary" />
                  <h3 className="text-xl font-bold mb-2">Chord Detector</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload audio files to detect and analyse musical chords automatically.
                  </p>
                  <Alert className="border-destructive/50 bg-destructive/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Sorry! The Chord Detector Tool is WIP.
                    </AlertDescription>
                  </Alert>
                </Card>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

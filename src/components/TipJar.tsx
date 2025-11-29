import { X, Heart, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TipJarProps {
  onDismiss: () => void;
}

export const TipJar = ({ onDismiss }: TipJarProps) => {
  return (
    <Card className="animate-fade-in relative overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 p-4 shadow-glow">
      {/* Glow effect */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/20 rounded-full blur-2xl" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onDismiss}
        className="absolute top-2 right-2 h-6 w-6 hover:bg-primary/20"
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="flex items-start gap-3 pr-6">
        <div className="p-2 rounded-full bg-primary/20">
          <Heart className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1 space-y-3">
          <div>
            <p className="font-semibold text-foreground">Enjoying the tools?</p>
            <p className="text-sm text-muted-foreground">
              Support N3O's work and help keep these tools free!
            </p>
          </div>
          
          <a
            href="https://ko-fi.com/n3ostudios"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Coffee className="h-4 w-4" />
              Buy me a coffee
            </Button>
          </a>
        </div>
      </div>
    </Card>
  );
};

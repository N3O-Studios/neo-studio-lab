import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface HeroProps {
  onOpenToolHub: () => void;
}

export const Hero = ({ onOpenToolHub }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 animate-pulse" 
           style={{ animationDuration: '8s' }} />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '7s', animationDelay: '1s' }} />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
        {/* Logo/Brand */}
        <div className="space-y-2">
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
            N3OStudios
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            AI-Powered Tools for Music Producers
          </p>
        </div>

        {/* AI Disclaimer */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border animate-in fade-in duration-1000 delay-300">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-sm text-muted-foreground">
            AI systems can make mistakes. Always verify results.
          </p>
        </div>

        {/* CTA */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <Button 
            onClick={onOpenToolHub}
            size="lg"
            className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-glow transition-all hover:scale-105 hover:shadow-[0_0_40px_hsl(270_36%_71%/0.5)]"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Open Tool Hub
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

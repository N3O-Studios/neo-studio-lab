import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";

interface HeroProps {
  onOpenToolHub: () => void;
}

export const Hero = ({ onOpenToolHub }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, hsl(270 36% 71% / 0.1), hsl(300 7% 11%), hsl(207 44% 49% / 0.1))' }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ background: 'hsl(270 36% 71% / 0.2)', animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ background: 'hsl(207 44% 49% / 0.2)', animationDuration: '7s', animationDelay: '1s' }} />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ backgroundImage: 'linear-gradient(to right, hsl(270 36% 71%), hsl(207 44% 49%), hsl(270 36% 71%))' }}>
            N3OStudios
          </h1>
          <p className="text-xl md:text-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150" style={{ color: 'hsl(0 0% 65%)' }}>
            AI-Powered Tools for Music Producers
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm animate-in fade-in duration-1000 delay-300" style={{ background: 'hsl(300 7% 15% / 0.5)', border: '1px solid hsl(300 7% 25%)' }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'hsl(270 36% 71%)' }} />
          <p className="text-sm" style={{ color: 'hsl(0 0% 65%)' }}>
            AI systems can make mistakes. Always verify results.
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <Button 
            onClick={onOpenToolHub}
            size="lg"
            className="group relative overflow-hidden px-8 py-6 text-lg font-semibold rounded-xl transition-all hover:scale-105"
            style={{ background: 'hsl(270 36% 71%)', color: 'hsl(300 7% 11%)', boxShadow: '0 0 30px hsl(270 36% 71% / 0.3)' }}
          >
            <Wrench className="mr-2 h-5 w-5" />
            Tool Hub
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </Button>
        </div>
      </div>
    </section>
  );
};

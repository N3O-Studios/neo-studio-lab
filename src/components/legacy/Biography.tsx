import { Music, Youtube, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Biography = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, hsl(300 7% 11%), hsl(300 7% 11% / 0.95), hsl(300 7% 11%))' }} />
      <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full blur-3xl" style={{ background: 'hsl(270 36% 71% / 0.1)' }} />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 rounded-full blur-3xl" style={{ background: 'hsl(207 44% 49% / 0.1)' }} />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <Card className="p-8 md:p-12" style={{ background: 'hsl(300 7% 15% / 0.5)', backdropFilter: 'blur(12px)', border: '1px solid hsl(270 36% 71% / 0.2)' }}>
          <div className="space-y-6 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, hsl(270 36% 71%), hsl(207 44% 49%))' }}>
              About N3O
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'hsl(0 0% 90%)' }}>
              Hi, I'm N3O. I'm a teenage music producer and programmer whose passion is to make people feel something with my music. Below are some links to my socials. Ignore the temporary artist name of Kosmic Dark, That was made when I was a bit younger and is bound to change soon.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4" style={{ color: 'hsl(0 0% 80%)' }}>Connect With Me</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <a href="https://open.spotify.com/artist/7g1t8aR8ksGZPVDLhemiRt" target="_blank" rel="noopener noreferrer" className="group">
                <Button variant="outline" className="w-full h-auto py-4 transition-all group-hover:scale-105">
                  <div className="flex items-center gap-3">
                    <Music className="h-5 w-5" style={{ color: 'hsl(270 36% 71%)' }} />
                    <div className="text-left">
                      <div className="font-semibold">Spotify</div>
                      <div className="text-xs" style={{ color: 'hsl(0 0% 65%)' }}>Listen to my tracks</div>
                    </div>
                  </div>
                </Button>
              </a>
              <a href="https://www.youtube.com/@n3ostudios" target="_blank" rel="noopener noreferrer" className="group">
                <Button variant="outline" className="w-full h-auto py-4 transition-all group-hover:scale-105">
                  <div className="flex items-center gap-3">
                    <Youtube className="h-5 w-5" style={{ color: 'hsl(207 44% 49%)' }} />
                    <div className="text-left">
                      <div className="font-semibold">YouTube</div>
                      <div className="text-xs" style={{ color: 'hsl(0 0% 65%)' }}>Watch my content</div>
                    </div>
                  </div>
                </Button>
              </a>
              <a href="https://x.com/n3ostudios" target="_blank" rel="noopener noreferrer" className="group">
                <Button variant="outline" className="w-full h-auto py-4 transition-all group-hover:scale-105">
                  <div className="flex items-center gap-3">
                    <Twitter className="h-5 w-5" style={{ color: 'hsl(270 36% 71%)' }} />
                    <div className="text-left">
                      <div className="font-semibold">X (Twitter)</div>
                      <div className="text-xs" style={{ color: 'hsl(0 0% 65%)' }}>Follow for updates</div>
                    </div>
                  </div>
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

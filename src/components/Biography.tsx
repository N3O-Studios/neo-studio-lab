import { Music, Youtube, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Biography = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm border-primary/20 shadow-card">
          {/* Biography Text */}
          <div className="space-y-6 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About N3O
            </h2>
            <p className="text-lg text-foreground/90 leading-relaxed">
              Hi, I'm N3O. I'm a teenage music producer and programmer whose passion is to make people feel something with my music. Below are some links to my socials. Ignore the temporary artist name of Kosmic Dark, That was made when I was a bit younger and is bound to change soon.
            </p>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground/80 mb-4">Connect With Me</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <a 
                href="https://open.spotify.com/artist/7g1t8aR8ksGZPVDLhemiRt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
              >
                <Button 
                  variant="outline" 
                  className="w-full h-auto py-4 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group-hover:scale-105"
                >
                  <div className="flex items-center gap-3">
                    <Music className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <div className="font-semibold">Spotify</div>
                      <div className="text-xs text-muted-foreground">Listen to my tracks</div>
                    </div>
                  </div>
                </Button>
              </a>

              <a 
                href="https://www.youtube.com/@n3ostudios" 
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Button 
                  variant="outline" 
                  className="w-full h-auto py-4 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group-hover:scale-105"
                >
                  <div className="flex items-center gap-3">
                    <Youtube className="h-5 w-5 text-secondary" />
                    <div className="text-left">
                      <div className="font-semibold">YouTube</div>
                      <div className="text-xs text-muted-foreground">Watch my content</div>
                    </div>
                  </div>
                </Button>
              </a>

              <a 
                href="https://x.com/n3ostudios" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
              >
                <Button 
                  variant="outline" 
                  className="w-full h-auto py-4 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group-hover:scale-105"
                >
                  <div className="flex items-center gap-3">
                    <Twitter className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <div className="font-semibold">X (Twitter)</div>
                      <div className="text-xs text-muted-foreground">Follow for updates</div>
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
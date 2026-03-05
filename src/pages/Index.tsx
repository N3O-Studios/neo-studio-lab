import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProfileMenu } from "@/components/ProfileMenu";
import { Button } from "@/components/ui/button";
import { Shield, Bot, Zap, Terminal, ArrowRight } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { AdminDashboard } from "@/components/AdminDashboard";

const Index = () => {
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (showAdminDashboard && isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed top-4 right-4 z-40 flex gap-2">
          <Button variant="outline" onClick={() => setShowAdminDashboard(false)}>
            Back to Site
          </Button>
          {user && <ProfileMenu user={user} />}
        </div>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="h-6 w-6 text-secondary" />
            <span className="text-lg font-bold tracking-tight text-foreground">
              N3OS
            </span>
            <span className="text-xs font-mono text-muted-foreground border border-border rounded px-2 py-0.5">
              v2.0
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button variant="ghost" size="sm" onClick={() => setShowAdminDashboard(true)}>
                <Shield className="mr-1 h-4 w-4" />
                Admin
              </Button>
            )}
            {user ? (
              <ProfileMenu user={user} />
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-16">
        {/* Grid background */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--secondary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--secondary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-secondary/8 rounded-full blur-[100px]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-10">
          {/* Status indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/50 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground tracking-wide uppercase">
              Systems Online
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter">
              <span className="text-foreground">N3OS</span>
              <span className="text-primary">:</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI Agent Systems
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Autonomous AI tools built for creators. Deploy intelligent agents that analyze, generate, and transform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="group px-8 py-6 text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow transition-all hover:scale-[1.02]"
            >
              <Bot className="mr-2 h-5 w-5" />
              Explore Agents
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-base font-semibold rounded-lg border-border hover:border-secondary/50 hover:bg-secondary/5"
            >
              <Zap className="mr-2 h-5 w-5 text-secondary" />
              View Capabilities
            </Button>
          </div>
        </div>
      </section>

      {/* Placeholder section for future tool cards */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-mono text-muted-foreground tracking-widest uppercase mb-4">
            Coming Soon
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Agent Toolkit
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tool previews with images and descriptions will appear here — each linking to its dedicated agent page.
          </p>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Bot, title: "Chat Agent", desc: "Conversational AI assistant" },
              { icon: Zap, title: "Audio Analysis", desc: "Chord detection & audio intelligence" },
              { icon: Terminal, title: "Creative Engine", desc: "Generative art & cover design" },
            ].map((item, i) => (
              <div
                key={i}
                className="group p-8 rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card/80 transition-all cursor-pointer"
              >
                <item.icon className="h-8 w-8 text-primary mb-4 group-hover:text-secondary transition-colors" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-mono">N3OS © 2025</span>
          </div>
          <div className="flex gap-4">
            <a href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            <a href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

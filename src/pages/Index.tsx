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
        <div className="absolute top-1/4 left-1/5 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/5 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-10">
          {/* Status indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/50 backdrop-blur-sm shadow-[0_0_15px_hsl(var(--primary)/0.1)]">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_hsl(var(--secondary))]" />
            <span className="text-xs font-mono text-muted-foreground tracking-wide uppercase">
              Systems Online
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter">
              <span className="text-foreground">N3OS</span>
              <span className="text-primary">:</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
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
              className="group px-8 py-6 text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)]"
            >
              <Bot className="mr-2 h-5 w-5" />
              Explore Agents
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-base font-semibold rounded-lg border-border hover:border-secondary/50 hover:bg-secondary/5 text-foreground hover:text-foreground shadow-[0_0_15px_hsl(var(--secondary)/0.05)] hover:shadow-[0_0_30px_hsl(var(--secondary)/0.2)] transition-all"
            >
              <Zap className="mr-2 h-5 w-5 text-secondary" />
              View Capabilities
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-mono">&gt;_ n3os © 2025</span>
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

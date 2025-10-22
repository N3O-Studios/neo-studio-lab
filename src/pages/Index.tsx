import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Hero } from "@/components/Hero";
import { ToolHub } from "@/components/ToolHub";
import { Biography } from "@/components/Biography";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Index = () => {
  const [isToolHubOpen, setIsToolHubOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-40 flex gap-2">
        {user ? (
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        ) : (
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Login
          </Button>
        )}
      </div>
      <Hero onOpenToolHub={() => setIsToolHubOpen(true)} />
      <Biography />
      <Footer />
      <ToolHub isOpen={isToolHubOpen} onClose={() => setIsToolHubOpen(false)} />
    </div>
  );
};

export default Index;

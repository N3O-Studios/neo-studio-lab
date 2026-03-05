import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Hero } from "@/components/legacy/Hero";
import { ToolHub } from "@/components/ToolHub";
import { Biography } from "@/components/legacy/Biography";
import { Footer } from "@/components/legacy/Footer";
import { AdminDashboard } from "@/components/AdminDashboard";
import { ProfileMenu } from "@/components/ProfileMenu";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const LegacyV1 = () => {
  const [isToolHubOpen, setIsToolHubOpen] = useState(false);
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
      <div className="min-h-screen" style={{ background: 'hsl(300, 7%, 11%)' }}>
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
    <div className="min-h-screen" style={{ background: 'hsl(300, 7%, 11%)', color: 'hsl(0, 0%, 95%)' }}>
      <div className="fixed top-4 right-4 z-40 flex gap-2">
        {isAdmin && (
          <Button variant="default" onClick={() => setShowAdminDashboard(true)}>
            <Shield className="mr-2 h-4 w-4" />
            Admin
          </Button>
        )}
        {user ? (
          <ProfileMenu user={user} />
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

export default LegacyV1;

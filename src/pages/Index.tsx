import { useState } from "react";
import { Hero } from "@/components/Hero";
import { ToolHub } from "@/components/ToolHub";
import { Biography } from "@/components/Biography";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [isToolHubOpen, setIsToolHubOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Hero onOpenToolHub={() => setIsToolHubOpen(true)} />
      <Biography />
      <Footer />
      <ToolHub isOpen={isToolHubOpen} onClose={() => setIsToolHubOpen(false)} />
    </div>
  );
};

export default Index;

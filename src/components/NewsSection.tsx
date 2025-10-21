import { Card } from "@/components/ui/card";
import { ExternalLink, Newspaper, Music2, BookOpen } from "lucide-react";

export const NewsSection = () => {
  const newsItems = [
    {
      category: "Production News",
      icon: Newspaper,
      title: "Top 5 VST Plugins of 2025",
      excerpt: "Discover the most innovative virtual instruments and effects plugins that are shaping modern music production...",
      source: "MusicTech Magazine",
      link: "#",
    },
    {
      category: "New Releases",
      icon: Music2,
      title: "Analysing the Production Behind the Latest Chart Toppers",
      excerpt: "A deep dive into the mixing techniques and sound design choices that made these tracks stand out...",
      source: "Sound on Sound",
      link: "#",
    },
    {
      category: "Music Theory",
      icon: BookOpen,
      title: "Understanding Modal Interchange in Modern Pop",
      excerpt: "Learn how contemporary producers use borrowed chords to create emotional depth and harmonic interest...",
      source: "Berklee Online",
      link: "#",
    },
    {
      category: "Production News",
      icon: Newspaper,
      title: "AI in Music Production: Tools and Techniques",
      excerpt: "Explore how artificial intelligence is revolutionising workflow automation and creative sound design...",
      source: "Audio Engineering Society",
      link: "#",
    },
    {
      category: "Music Theory",
      icon: BookOpen,
      title: "Mastering Tension and Release in Your Arrangements",
      excerpt: "Essential composition techniques for building dynamic, engaging musical narratives that captivate listeners...",
      source: "Music Theory Academy",
      link: "#",
    },
    {
      category: "New Releases",
      icon: Music2,
      title: "Breaking Down This Week's Hottest Beats",
      excerpt: "From trap to house, we analyse the production elements that define today's trending sounds...",
      source: "EDM.com",
      link: "#",
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-background via-card/30 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Latest News & Insights
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest in music production, new releases, and theory
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item, index) => (
            <Card 
              key={index}
              className="group p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:scale-105 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {item.title}
                </h3>

                <p className="text-muted-foreground text-sm line-clamp-3">
                  {item.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">
                    Source: {item.source}
                  </span>
                  <ExternalLink className="h-4 w-4 text-secondary group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All content is openly sourced and properly attributed in compliance with copyright laws.
          </p>
        </div>
      </div>
    </section>
  );
};

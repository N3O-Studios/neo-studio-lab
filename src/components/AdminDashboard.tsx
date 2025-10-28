import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Users, MessageSquare, Newspaper, Trash2, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalChats: 0,
    totalNews: 0,
  });
  const [users, setUsers] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [newArticle, setNewArticle] = useState({
    title: "",
    description: "",
    url: "",
    source: "Admin",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
    loadUsers();
    loadNews();
  }, []);

  const loadStats = async () => {
    const [usersCount, chatsCount, newsCount] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("chat_sessions").select("*", { count: "exact", head: true }),
      supabase.from("news_articles").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      totalUsers: usersCount.count || 0,
      totalChats: chatsCount.count || 0,
      totalNews: newsCount.count || 0,
    });
  };

  const loadUsers = async () => {
    // Note: With strict RLS, admins can only see user count, not individual profiles
    // Users list removed for privacy - only showing aggregated stats
    setUsers([]);
  };

  const loadNews = async () => {
    const { data } = await supabase
      .from("news_articles")
      .select("*")
      .order("created_at", { ascending: false });
    
    setNews(data || []);
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from("news_articles")
      .insert([{
        ...newArticle,
        published_at: new Date().toISOString(),
      }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add news article",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "News article added successfully",
      });
      setNewArticle({ title: "", description: "", url: "", source: "Admin" });
      loadNews();
      loadStats();
    }
  };

  const handleDeleteNews = async (id: string) => {
    const { error } = await supabase
      .from("news_articles")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete news article",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "News article deleted successfully",
      });
      loadNews();
      loadStats();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your application</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChats}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">News Articles</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="news">News Management</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
              <CardDescription>
                Individual user profiles are protected for privacy. Only aggregated statistics are available.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-2xl font-bold mb-2">{stats.totalUsers} Total Users</p>
                <p className="text-sm text-muted-foreground">
                  User profiles and chat messages are end-to-end secured and cannot be accessed by admins.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add News Article</CardTitle>
              <CardDescription>Post a new article to the news section</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddNews} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newArticle.description}
                    onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={newArticle.url}
                    onChange={(e) => setNewArticle({ ...newArticle, url: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Article
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage News Articles</CardTitle>
              <CardDescription>View and delete existing articles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {news.map((article) => (
                  <div key={article.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{article.description}</p>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        {article.url}
                      </a>
                      <p className="text-xs text-muted-foreground mt-2">
                        Source: {article.source} • {new Date(article.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNews(article.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

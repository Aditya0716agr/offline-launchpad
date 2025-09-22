import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Heart, MapPin, Globe, MessageSquare, ArrowLeft, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Startup {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  location: string | null;
  website_url: string | null;
  whatsapp_link: string | null;
  view_count: number;
  created_at: string;
  categories: {
    name: string;
    slug: string;
  } | null;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface Vote {
  id: string;
  user_id: string;
}

const StartupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStartup();
    checkUser();
  }, [id]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchStartup = async () => {
    if (!id) return;

    try {
      const { data: startupData, error: startupError } = await supabase
        .from('startups')
        .select(`
          *,
          categories (name, slug),
          profiles (full_name, avatar_url)
        `)
        .eq('id', id)
        .eq('status', 'approved')
        .single();

      if (startupError) throw startupError;

      setStartup(startupData);

      // Increment view count
      await supabase.rpc('increment_view_count', { startup_id: id });

      // Fetch votes
      const { data: votesData } = await supabase
        .from('votes')
        .select('id, user_id')
        .eq('startup_id', id);

      setVotes(votesData || []);

      // Check if current user has voted
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          const userVote = votesData?.find(vote => vote.user_id === profileData.id);
          setHasVoted(!!userVote);
        }
      }
    } catch (error) {
      console.error('Error fetching startup:', error);
      toast({
        title: "Error",
        description: "Failed to load startup details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to vote",
      });
      return;
    }

    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profileData) return;

      if (hasVoted) {
        // Remove vote
        await supabase
          .from('votes')
          .delete()
          .eq('startup_id', id)
          .eq('user_id', profileData.id);
        
        setHasVoted(false);
        setVotes(prev => prev.filter(vote => vote.user_id !== profileData.id));
      } else {
        // Add vote
        await supabase
          .from('votes')
          .insert({
            startup_id: id,
            user_id: profileData.id,
          });
        
        setHasVoted(true);
        setVotes(prev => [...prev, { id: 'temp', user_id: profileData.id }]);
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to process vote",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-muted rounded mb-6"></div>
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-medium text-foreground mb-4">Startup not found</h1>
          <Button onClick={() => navigate('/explore')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explore
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate('/explore')} 
          variant="ghost"
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Explore
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="border-0 shadow-none bg-accent/5">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={startup.logo_url || ''} alt={startup.name} />
                    <AvatarFallback className="text-2xl font-medium">
                      {startup.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-medium text-foreground mb-2">
                          {startup.name}
                        </h1>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          {startup.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{startup.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{startup.view_count} views</span>
                          </div>
                        </div>
                        {startup.categories && (
                          <Badge variant="secondary" className="mt-2">
                            {startup.categories.name}
                          </Badge>
                        )}
                      </div>
                      
                      <Button
                        onClick={handleVote}
                        variant={hasVoted ? "default" : "outline"}
                        className="flex items-center gap-2"
                      >
                        <Heart className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} />
                        {votes.length}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border-0 shadow-none">
              <CardContent className="p-8">
                <h2 className="text-xl font-medium text-foreground mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {startup.description}
                </p>
              </CardContent>
            </Card>

            {/* Founder Info */}
            <Card className="border-0 shadow-none">
              <CardContent className="p-8">
                <h2 className="text-xl font-medium text-foreground mb-4">Founder</h2>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={startup.profiles.avatar_url || ''} />
                    <AvatarFallback>
                      {startup.profiles.full_name?.charAt(0) || 'F'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-foreground">
                    {startup.profiles.full_name || 'Anonymous Founder'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="border-0 shadow-none">
              <CardContent className="p-6">
                <h3 className="font-medium text-foreground mb-4">Get In Touch</h3>
                <div className="space-y-3">
                  {startup.website_url && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open(startup.website_url!, '_blank')}
                    >
                      <Globe className="w-4 h-4 mr-3" />
                      Visit Website
                    </Button>
                  )}
                  {startup.whatsapp_link && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open(startup.whatsapp_link!, '_blank')}
                    >
                      <MessageSquare className="w-4 h-4 mr-3" />
                      WhatsApp
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Launch Date */}
            <Card className="border-0 shadow-none">
              <CardContent className="p-6">
                <h3 className="font-medium text-foreground mb-4">Launch Info</h3>
                <div className="text-sm text-muted-foreground">
                  Listed on {new Date(startup.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDetail;
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronUp, MapPin, ExternalLink, MessageSquare, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

export interface Startup {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string | null;
  category: 'food' | 'wellness' | 'retail' | 'services' | 'beauty' | 'fitness' | 'education' | 'consulting' | 'other';
  location: string | null;
  website_url: string | null;
  whatsapp_link: string | null;
  upvote_count: number;
  view_count: number;
  launch_date: string | null;
  created_at: string;
}

interface StartupCardProps {
  startup: Startup;
  showLaunchBadge?: boolean;
}

export function StartupCard({ startup, showLaunchBadge = false }: StartupCardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(startup.upvote_count);
  const [isVoting, setIsVoting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      await checkVoteStatus(currentUser.id);
    }
  };

  const checkVoteStatus = async (userId: string) => {
    // TODO: Implement after types are generated
    // const { data } = await supabase
    //   .from('votes')
    //   .select('id')
    //   .eq('user_id', userId)
    //   .eq('startup_id', startup.id)
    //   .single();
    
    // setHasVoted(!!data);
    setHasVoted(false);
  };

  const handleVote = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to vote for startups.",
        variant: "destructive",
      });
      return;
    }

    setIsVoting(true);

    try {
      if (hasVoted) {
        // TODO: Remove vote after types are generated
        // const { error } = await supabase
        //   .from('votes')
        //   .delete()
        //   .eq('user_id', user.id)
        //   .eq('startup_id', startup.id);

        // if (error) throw error;
        
        setHasVoted(false);
        setVoteCount(prev => prev - 1);
      } else {
        // TODO: Add vote after types are generated
        // const { error } = await supabase
        //   .from('votes')
        //   .insert({
        //     user_id: user.id,
        //     startup_id: startup.id,
        //   });

        // if (error) throw error;
        
        setHasVoted(true);
        setVoteCount(prev => prev + 1);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      food: "bg-orange-100 text-orange-800",
      wellness: "bg-green-100 text-green-800",
      retail: "bg-blue-100 text-blue-800",
      services: "bg-purple-100 text-purple-800",
      beauty: "bg-pink-100 text-pink-800",
      fitness: "bg-red-100 text-red-800",
      education: "bg-indigo-100 text-indigo-800",
      consulting: "bg-gray-100 text-gray-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const isLaunchingToday = startup.launch_date === new Date().toISOString().split('T')[0];

  return (
    <Card className="card-startup group">
      <CardContent className="p-0">
        <div className="flex gap-4 p-6">
          {/* Vote Button */}
          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVote}
              disabled={isVoting}
              className={`vote-button ${hasVoted ? 'voted' : ''}`}
            >
              <ChevronUp className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{voteCount}</span>
            </Button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {startup.logo_url ? (
                <img 
                  src={startup.logo_url} 
                  alt={startup.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-muted-foreground">
                  {startup.name.charAt(0)}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Link 
                    to={`/startup/${startup.slug}`}
                    className="font-semibold text-lg hover:text-primary transition-colors"
                  >
                    {startup.name}
                  </Link>
                  {showLaunchBadge && isLaunchingToday && (
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      Launching Today
                    </Badge>
                  )}
                </div>
                
                <p className="text-muted-foreground mb-3 line-clamp-2">
                  {startup.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Badge variant="outline" className={getCategoryColor(startup.category)}>
                    {startup.category}
                  </Badge>
                  
                  {startup.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {startup.location}
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    Comments
                  </div>
                </div>
              </div>

              {/* External Links */}
              <div className="flex items-center gap-2">
                {startup.website_url && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    asChild
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <a 
                      href={startup.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
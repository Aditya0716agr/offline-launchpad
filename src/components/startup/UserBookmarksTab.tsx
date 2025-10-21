import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StartupCard } from "@/components/startup/StartupCard";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Startup {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  location: string | null;
  website_url: string | null;
  view_count: number;
  created_at: string;
  categories: {
    name: string;
    slug: string;
  } | null;
  votes: { id: string }[];
}

interface UserBookmarksTabProps {
  userProfile: any;
}

export const UserBookmarksTab = ({ userProfile }: UserBookmarksTabProps) => {
  const navigate = useNavigate();
  const [bookmarkedStartups, setBookmarkedStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      fetchBookmarkedStartups();
    }
  }, [userProfile]);

  const fetchBookmarkedStartups = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          startup_id,
          startups!inner (
            *,
            categories (name, slug),
            votes (id)
          )
        `)
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const startups = data?.map(bookmark => bookmark.startups as unknown as Startup) || [];
      setBookmarkedStartups(startups);
    } catch (error) {
      console.error('Error fetching bookmarked startups:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-lg mb-4"></div>
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (bookmarkedStartups.length === 0) {
    return (
      <Card className="border-0 shadow-none bg-accent/5">
        <CardContent className="p-12 text-center">
          <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium text-foreground mb-2">
            No saved startups yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Start exploring and save interesting startups to your collection
          </p>
          <Button onClick={() => navigate('/explore')}>
            Explore Startups
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-foreground">
        Saved Startups ({bookmarkedStartups.length})
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarkedStartups.map((startup) => (
          <div 
            key={startup.id}
            onClick={() => navigate(`/startups/${startup.slug || startup.id}`)}
            className="cursor-pointer"
          >
            <StartupCard startup={startup} viewMode="block" />
          </div>
        ))}
      </div>
    </div>
  );
};
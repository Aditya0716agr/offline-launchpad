import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookmarkButtonProps {
  startupId: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export const BookmarkButton = ({ 
  startupId, 
  size = "default",
  variant = "outline" 
}: BookmarkButtonProps) => {
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (userProfile) {
      checkBookmarkStatus();
    }
  }, [userProfile, startupId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();
      setUserProfile(profileData);
    }
  };

  const checkBookmarkStatus = async () => {
    if (!userProfile) return;

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', userProfile.id)
        .eq('startup_id', startupId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking bookmark status:', error);
      }

      setIsBookmarked(!!data);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const handleBookmark = async () => {
    if (!user || !userProfile) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save startups",
      });
      return;
    }

    setLoading(true);
    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', userProfile.id)
          .eq('startup_id', startupId);

        if (error) throw error;

        setIsBookmarked(false);
        toast({
          title: "Removed from saved",
          description: "This startup has been removed from your saved list",
        });
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: userProfile.id,
            startup_id: startupId,
          });

        if (error) throw error;

        setIsBookmarked(true);
        toast({
          title: "Saved successfully",
          description: "This startup has been added to your saved list",
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBookmark}
      disabled={loading}
      className={`flex items-center gap-2 ${isBookmarked ? 'text-primary' : ''}`}
    >
      <Bookmark 
        className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} 
      />
      {isBookmarked ? 'Saved' : 'Save'}
    </Button>
  );
};
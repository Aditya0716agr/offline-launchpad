import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoteButtonProps {
  startupId: string;
  currentVotes: number;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  onVoteChange?: (newVoteCount: number) => void;
}

export const VoteButton = ({ 
  startupId, 
  currentVotes,
  size = "default",
  variant = "ghost",
  onVoteChange
}: VoteButtonProps) => {
  const { toast } = useToast();
  const [isVoted, setIsVoted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [voteCount, setVoteCount] = useState(currentVotes);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (userProfile) {
      checkVoteStatus();
    }
  }, [userProfile, startupId]);

  useEffect(() => {
    setVoteCount(currentVotes);
  }, [currentVotes]);

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

  const checkVoteStatus = async () => {
    if (!userProfile) return;

    try {
      const { data, error } = await supabase
        .from('votes')
        .select('id')
        .eq('user_id', userProfile.id)
        .eq('startup_id', startupId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking vote status:', error);
      }

      setIsVoted(!!data);
    } catch (error) {
      console.error('Error checking vote status:', error);
    }
  };

  const handleVote = async () => {
    if (!user || !userProfile) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to vote for startups",
      });
      return;
    }

    setLoading(true);
    try {
      if (isVoted) {
        // Remove vote
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('user_id', userProfile.id)
          .eq('startup_id', startupId);

        if (error) throw error;

        setIsVoted(false);
        const newCount = Math.max(0, voteCount - 1);
        setVoteCount(newCount);
        onVoteChange?.(newCount);
        
        toast({
          title: "Vote removed",
          description: "Your vote has been removed",
        });
      } else {
        // Add vote
        const { error } = await supabase
          .from('votes')
          .insert({
            user_id: userProfile.id,
            startup_id: startupId,
          });

        if (error) throw error;

        setIsVoted(true);
        const newCount = voteCount + 1;
        setVoteCount(newCount);
        onVoteChange?.(newCount);
        
        toast({
          title: "Vote added",
          description: "Thank you for supporting this startup!",
        });
      }
    } catch (error) {
      console.error('Error toggling vote:', error);
      toast({
        title: "Error",
        description: "Failed to update vote status",
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
      onClick={handleVote}
      disabled={loading}
      className={`flex items-center gap-1 ${isVoted ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'} transition-colors`}
    >
      <Heart 
        className={`w-4 h-4 ${isVoted ? 'fill-current' : ''}`} 
      />
      <span className="text-sm font-medium">{voteCount}</span>
    </Button>
  );
};

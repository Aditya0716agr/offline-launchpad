import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { 
  Heart, MapPin, Globe, MessageSquare, ArrowLeft, Eye, Bookmark, 
  Share2, Calendar, Users, TrendingUp, Award, Star, ChevronDown,
  ChevronUp, ExternalLink, Mail, Phone, Instagram, Facebook, 
  Linkedin, Twitter, Clock, Target, Zap, CheckCircle, ArrowRight,
  Play, Image as ImageIcon, Building, Briefcase, GraduationCap,
  DollarSign, BarChart3, PieChart, Map, Send, Bell, Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CommentsSection } from "@/components/startup/CommentsSection";
import { BookmarkButton } from "@/components/startup/BookmarkButton";
import { StartupSEO } from "@/components/seo/StartupSEO";

interface Startup {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  gallery_images: string[] | null;
  location: string | null;
  city: string | null;
  state_region: string | null;
  full_address: string | null;
  website_url: string | null;
  whatsapp_link: string | null;
  email_contact: string | null;
  phone_number: string | null;
  social_instagram: string | null;
  social_facebook: string | null;
  social_linkedin: string | null;
  social_twitter: string | null;
  team_size: string | null;
  stage: string | null;
  looking_for: string[] | null;
  launch_date: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  categories: {
    name: string;
    slug: string;
  } | null;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    is_founding_member: boolean;
    bio: string | null;
  };
}

interface Vote {
  id: string;
  user_id: string;
}

// Custom hook for handling image aspect ratios
const useImageAspectRatio = () => {
  const [imageAspectRatios, setImageAspectRatios] = useState<Record<string, number>>({});

  const handleImageLoad = useCallback((src: string, img: HTMLImageElement) => {
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    setImageAspectRatios(prev => ({
      ...prev,
      [src]: aspectRatio
    }));
  }, []);

  const getImageClasses = useCallback((src: string) => {
    const aspectRatio = imageAspectRatios[src];
    if (!aspectRatio) return '';

    if (aspectRatio > 1.5) {
      // Wide image - span 2 columns
      return 'sm:col-span-2 lg:col-span-2';
    } else if (aspectRatio < 0.8) {
      // Tall image - span 2 rows
      return 'sm:row-span-2 lg:row-span-2';
    }
    return '';
  }, [imageAspectRatios]);

  return { handleImageLoad, getImageClasses };
};

// Reusable Gallery Image Component
const GalleryImage = ({ 
  src, 
  alt, 
  index, 
  onImageLoad, 
  getImageClasses 
}: { 
  src: string; 
  alt: string; 
  index: number; 
  onImageLoad: (src: string, img: HTMLImageElement) => void;
  getImageClasses: (src: string) => string;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className={`relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200/50 group cursor-pointer min-h-[200px] ${getImageClasses(src)}`}>
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        onLoad={(e) => {
          const img = e.target as HTMLImageElement;
          onImageLoad(src, img);
          setIsLoaded(true);
        }}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-slate-400" />
        </div>
      )}
    </div>
  );
};

const StartupDetail = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleImageLoad, getImageClasses } = useImageAspectRatio();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    fetchStartup();
    checkUser();
  }, [id, slug]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchStartup = async () => {
    if (!id && !slug) return;

    try {
      // Build query based on whether we have ID or slug
      let query = supabase
        .from('startups')
        .select(`
          *,
          categories (name, slug),
          profiles (full_name, avatar_url, is_founding_member, bio)
        `)
        .eq('status', 'approved' as any);

      // Use slug if available, otherwise use ID
      if (slug) {
        query = query.eq('slug', slug as any);
      } else if (id) {
        query = query.eq('id', id as any);
      }

      const { data: startupData, error: startupError } = await query.single();

      if (startupError) throw startupError;

      const startup = startupData as unknown as Startup;
      setStartup(startup);

      // Redirect from ID-based URL to slug-based URL for better SEO
      if (id && startup.slug && !slug) {
        const newUrl = `/startups/${startup.slug}`;
        window.history.replaceState(null, '', newUrl);
      }

      // Increment view count
      await supabase.rpc('increment_view_count', { startup_id: startup.id });

      // Fetch votes
      const { data: votesData } = await supabase
        .from('votes')
        .select('id, user_id')
        .eq('startup_id', startup.id as any);

      setVotes((votesData as unknown as Vote[]) || []);

      // Check if current user has voted
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id as any)
          .single();

        if (profileData && votesData) {
          const userVote = votesData.find((vote: any) => vote.user_id === (profileData as any).id);
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
          .eq('startup_id', startup?.id as any)
          .eq('user_id', (profileData as any).id);
        
        setHasVoted(false);
        setVotes(prev => prev.filter(vote => vote.user_id !== (profileData as any).id));
      } else {
        // Add vote
        await supabase
          .from('votes')
          .insert({
            startup_id: startup?.id,
            user_id: (profileData as any).id,
          } as any);
        
        setHasVoted(true);
        setVotes(prev => [...prev, { id: 'temp', user_id: (profileData as any).id }]);
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

  // Helper functions for enhanced features
  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = startup?.name || 'Check out this startup';
    const text = startup?.tagline || startup?.description || '';

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Startup link copied to clipboard",
        });
        break;
    }
    setShowShareMenu(false);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing ? "You're no longer following this startup" : "You're now following this startup for updates",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStageColor = (stage: string | null) => {
    switch (stage?.toLowerCase()) {
      case 'idea': return 'bg-blue-100 text-blue-800';
      case 'mvp': return 'bg-yellow-100 text-yellow-800';
      case 'beta': return 'bg-orange-100 text-orange-800';
      case 'launched': return 'bg-green-100 text-green-800';
      case 'scaling': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTeamSizeIcon = (size: string | null) => {
    switch (size?.toLowerCase()) {
      case 'solo': return <Users className="w-4 h-4" />;
      case '2-5': return <Users className="w-4 h-4" />;
      case '6-10': return <Users className="w-4 h-4" />;
      case '11-50': return <Building className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const handleNewsletterSubscribe = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to subscribe",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribing(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({
          email: email.trim(),
          startup_id: startup?.id,
          subscribed_at: new Date().toISOString(),
        } as any);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already Subscribed",
            description: "This email is already subscribed to updates",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Subscribed Successfully!",
          description: "You'll receive updates about this startup",
        });
        setEmail("");
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: "Subscription Failed",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/30">
      {startup && <StartupSEO startup={startup} />}
      <Navbar />
      
      {/* Elegant Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(5,150,105,0.04),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(5,150,105,0.02),transparent_50%)]"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/3 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-emerald-400/2 rounded-full blur-3xl opacity-40"></div>
        {startup.cover_image_url && (
          <div className="absolute inset-0 opacity-5">
            <img 
              src={startup.cover_image_url} 
              alt=""
              className="w-full h-full object-cover blur-3xl scale-110"
            />
          </div>
        )}
      </div>
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-8">
          {/* Navigation */}
          <div className="mb-8">
            <Button 
              onClick={() => navigate('/explore')} 
              variant="ghost"
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 backdrop-blur-sm text-sm"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Back to Explore
            </Button>
          </div>

          {/* Hero Content */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-900/5 p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-start gap-6">
              {/* Logo */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white border-2 border-slate-200 shadow-lg flex items-center justify-center overflow-hidden">
                  {startup.logo_url ? (
                    <img 
                      src={startup.logo_url} 
                      alt={startup.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl md:text-2xl font-bold text-slate-700">
                      {startup.name.charAt(0)}
                    </span>
                  )}
                </div>
                {startup.is_featured && (
                  <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-1.5 shadow-lg">
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                )}
              </div>

              {/* Main Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-3">
                      <h1 className="text-2xl md:text-3xl font-light text-slate-900 tracking-tight leading-tight" style={{letterSpacing: '-0.02em', lineHeight: '1.2'}}>
                        {startup.name}
                      </h1>
                    </div>
                    
                    {/* Tagline */}
                    {startup.tagline && (
                      <p className="text-base md:text-lg text-slate-600 mb-4 font-light leading-relaxed" style={{lineHeight: '1.6'}}>
                        {startup.tagline}
                      </p>
                    )}

                    {/* Category and Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {startup.categories && (
                        <Badge variant="outline" className="px-3 py-1 text-slate-600 border-slate-300 text-sm font-medium">
                          {startup.categories.name}
                        </Badge>
                      )}
                      {startup.profiles.is_founding_member && (
                        <Badge className="bg-amber-500 text-white border-amber-600 px-3 py-1 text-sm font-medium">
                          🎖 Founding Member
                        </Badge>
                      )}
                    </div>

                    {/* Key Metrics */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      {startup.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="font-medium">{startup.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">{startup.view_count.toLocaleString()} views</span>
                      </div>
                      {startup.team_size && (
                        <div className="flex items-center gap-2">
                          {getTeamSizeIcon(startup.team_size)}
                          <span className="font-medium">{startup.team_size} team</span>
                        </div>
                      )}
                      {startup.launch_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">Launched {formatDate(startup.launch_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[180px]">
                    <Button
                      onClick={handleVote}
                      variant={hasVoted ? "default" : "outline"}
                      className={`flex items-center gap-2 h-10 font-medium text-sm ${
                        hasVoted 
                          ? "bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white border-0" 
                          : "border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} />
                      {votes.length} Votes
                    </Button>
                    <BookmarkButton startupId={startup?.id!} />
                    <Button
                      variant="outline"
                      className="h-10 border-slate-300 text-slate-700 hover:bg-slate-50"
                      onClick={() => setShowShareMenu(!showShareMenu)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    {user && (
                      <Button
                        variant="outline"
                        className={`h-10 font-medium text-sm ${
                          isFollowing 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" 
                            : "border-slate-300 text-slate-700 hover:bg-slate-50"
                        }`}
                        onClick={handleFollow}
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share Menu */}
      {showShareMenu && (
        <div className="fixed right-6 top-32 z-50 bg-white/95 backdrop-blur-xl rounded-xl border border-slate-200/50 shadow-xl shadow-slate-900/10 p-3">
          <div className="flex flex-col gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleShare('twitter')}
              className="justify-start text-slate-700 hover:bg-slate-100"
            >
              <Twitter className="w-4 h-4 mr-3" />
              Twitter
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleShare('linkedin')}
              className="justify-start text-slate-700 hover:bg-slate-100"
            >
              <Linkedin className="w-4 h-4 mr-3" />
              LinkedIn
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleShare('facebook')}
              className="justify-start text-slate-700 hover:bg-slate-100"
            >
              <Facebook className="w-4 h-4 mr-3" />
              Facebook
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleShare('copy')}
              className="justify-start text-slate-700 hover:bg-slate-100"
            >
              <Share2 className="w-4 h-4 mr-3" />
              Copy Link
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs Navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm p-1 mb-6">
                  <TabsList className="grid w-full grid-cols-4 bg-transparent">
                    <TabsTrigger 
                      value="overview" 
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-600 text-sm font-medium rounded-xl"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="product"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-600 text-sm font-medium rounded-xl"
                    >
                      Product
                    </TabsTrigger>
                    <TabsTrigger 
                      value="gallery"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-600 text-sm font-medium rounded-xl"
                    >
                      Gallery
                    </TabsTrigger>
                    <TabsTrigger 
                      value="community"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-600 text-sm font-medium rounded-xl"
                    >
                      Community
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* About */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-slate-900">About</h2>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-base font-light" style={{lineHeight: '1.6'}}>
                      {startup.description || 'Innovative solution that transforms the industry.'}
                    </p>
                  </div>

                  {/* Traction Indicators */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-slate-900">Traction & Metrics</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-slate-50/80 border border-slate-200/50 rounded-xl">
                        <div className="text-2xl font-bold text-slate-900">{startup.view_count.toLocaleString()}</div>
                        <div className="text-sm text-slate-600 font-medium">Profile Views</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50/80 border border-slate-200/50 rounded-xl">
                        <div className="text-2xl font-bold text-slate-900">{votes.length}</div>
                        <div className="text-sm text-slate-600 font-medium">Community Votes</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50/80 border border-slate-200/50 rounded-xl">
                        <div className="text-2xl font-bold text-slate-900">{startup.team_size || 'N/A'}</div>
                        <div className="text-sm text-slate-600 font-medium">Team Size</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50/80 border border-slate-200/50 rounded-xl">
                        <div className="text-2xl font-bold text-slate-900">{startup.stage || 'N/A'}</div>
                        <div className="text-sm text-slate-600 font-medium">Stage</div>
                      </div>
                    </div>
                  </div>

                  {/* Gallery */}
                  {startup.gallery_images && startup.gallery_images.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm p-6">
                      <div className="mb-4">
                        <h2 className="text-xl font-semibold text-slate-900">Product Gallery</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr grid-rows-[masonry]">
                        {startup.gallery_images.slice(0, 6).map((image, index) => (
                          <GalleryImage
                            key={index}
                            src={image}
                            alt={`${startup.name} gallery ${index + 1}`}
                            index={index}
                            onImageLoad={handleImageLoad}
                            getImageClasses={getImageClasses}
                          />
                        ))}
                      </div>
                      {startup.gallery_images.length > 6 && (
                        <div className="mt-4 text-center">
                          <Button 
                            variant="outline" 
                            onClick={() => setActiveTab("gallery")}
                            className="text-slate-600 hover:text-slate-900 border-slate-300 hover:bg-slate-50"
                          >
                            View All {startup.gallery_images.length} Images
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Looking For */}
                  {startup.looking_for && startup.looking_for.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm p-6">
                      <div className="mb-4">
                        <h2 className="text-xl font-semibold text-slate-900">Opportunities</h2>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {startup.looking_for.map((item, index) => (
                          <Badge key={index} variant="outline" className="px-3 py-1 text-slate-700 border-slate-300 bg-white text-sm font-medium">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </TabsContent>

                {/* Product Tab */}
                <TabsContent value="product" className="space-y-6">
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-slate-900">Product Details</h2>
                    </div>
                    <div className="space-y-6">
                      {startup.stage && (
                        <div className="flex items-center gap-3">
                          <span className="text-base text-slate-600 font-medium">Stage:</span>
                          <Badge className={`px-3 py-1 text-sm font-medium ${getStageColor(startup.stage)}`}>
                            {startup.stage}
                          </Badge>
                        </div>
                      )}
                      
                      <p className="text-slate-700 leading-relaxed text-base font-light" style={{lineHeight: '1.6'}}>
                        {startup.description}
                      </p>
                      
                      {startup.website_url && (
                        <div className="pt-4">
                          <Button 
                            onClick={() => window.open(startup.website_url!, '_blank')}
                            className="w-full h-12 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white text-base font-medium rounded-xl"
                          >
                            <Globe className="w-4 h-4 mr-2" />
                            Visit Website
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Gallery Tab */}
                <TabsContent value="gallery" className="space-y-6">
                  {startup.gallery_images && startup.gallery_images.length > 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm p-6">
                      <div className="mb-4">
                        <h2 className="text-xl font-semibold text-slate-900">Product Gallery</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr grid-rows-[masonry]">
                        {startup.gallery_images.map((image, index) => (
                          <GalleryImage
                            key={index}
                            src={image}
                            alt={`${startup.name} gallery ${index + 1}`}
                            index={index}
                            onImageLoad={handleImageLoad}
                            getImageClasses={getImageClasses}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm p-12 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-3">No Gallery Images</h3>
                      <p className="text-slate-600 leading-relaxed">This startup hasn't uploaded any gallery images yet.</p>
                    </div>
                  )}
                </TabsContent>

                {/* Community Tab */}
                <TabsContent value="community" className="space-y-6">
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm p-6">
                    <CommentsSection startupId={startup?.id!} />
                  </div>
                </TabsContent>
            </Tabs>
          </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Get In Touch</h3>
                <div className="space-y-3">
                  {startup.website_url && (
                    <Button
                      variant="outline"
                      className="w-full justify-start h-10 border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-xl"
                      onClick={() => window.open(startup.website_url!, '_blank')}
                    >
                      <Globe className="w-4 h-4 mr-3" />
                      Visit Website
                    </Button>
                  )}
                  {startup.whatsapp_link && (
                    <Button
                      variant="outline"
                      className="w-full justify-start h-10 border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-xl"
                      onClick={() => window.open(startup.whatsapp_link!, '_blank')}
                    >
                      <MessageSquare className="w-4 h-4 mr-3" />
                      WhatsApp
                    </Button>
                  )}
                  {startup.email_contact && user && (
                    <Button
                      variant="outline"
                      className="w-full justify-start h-10 border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-xl"
                      onClick={() => window.open(`mailto:${startup.email_contact}`, '_blank')}
                    >
                      <Mail className="w-4 h-4 mr-3" />
                      Email
                    </Button>
                  )}
                  {startup.phone_number && user && (
                    <Button
                      variant="outline"
                      className="w-full justify-start h-10 border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-xl"
                      onClick={() => window.open(`tel:${startup.phone_number}`, '_blank')}
                    >
                      <Phone className="w-4 h-4 mr-3" />
                      Call
                    </Button>
                  )}
                </div>
              </div>

              {/* Social Links */}
              {(startup.social_instagram || startup.social_facebook || startup.social_linkedin || startup.social_twitter) && (
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Follow Us</h3>
                  <div className="flex gap-2">
                    {startup.social_instagram && (
                      <Button variant="outline" size="sm" asChild className="border-slate-300 text-slate-700 hover:bg-slate-50 p-3 rounded-xl">
                        <a href={startup.social_instagram} target="_blank" rel="noopener noreferrer">
                          <Instagram className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {startup.social_facebook && (
                      <Button variant="outline" size="sm" asChild className="border-slate-300 text-slate-700 hover:bg-slate-50 p-3 rounded-xl">
                        <a href={startup.social_facebook} target="_blank" rel="noopener noreferrer">
                          <Facebook className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {startup.social_linkedin && (
                      <Button variant="outline" size="sm" asChild className="border-slate-300 text-slate-700 hover:bg-slate-50 p-3 rounded-xl">
                        <a href={startup.social_linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {startup.social_twitter && (
                      <Button variant="outline" size="sm" asChild className="border-slate-300 text-slate-700 hover:bg-slate-50 p-3 rounded-xl">
                        <a href={startup.social_twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Launch Info */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Launch Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600 font-medium">Listed on {formatDate(startup.created_at)}</span>
                  </div>
                  {startup.launch_date && (
                    <div className="flex items-center gap-3 text-sm">
                      <Zap className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600 font-medium">Launched {formatDate(startup.launch_date)}</span>
                    </div>
                  )}
                  {startup.city && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600 font-medium">{startup.city}{startup.state_region && `, ${startup.state_region}`}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Team Section */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Team</h3>
                <div className="flex items-start gap-4">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={startup.profiles.avatar_url || ''} />
                    <AvatarFallback className="text-base">
                      {startup.profiles.full_name?.charAt(0) || 'F'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-slate-900">
                      {startup.profiles.full_name || 'Anonymous Founder'}
                    </h4>
                    {startup.profiles.bio && (
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {startup.profiles.bio}
                      </p>
                    )}
                    <div className="flex gap-2 mt-3">
                      {startup.social_linkedin && (
                        <Button variant="outline" size="sm" asChild className="p-2 h-8 w-8 rounded-lg">
                          <a href={startup.social_linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {startup.social_twitter && (
                        <Button variant="outline" size="sm" asChild className="p-2 h-8 w-8 rounded-lg">
                          <a href={startup.social_twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-slate-50/80 to-slate-100/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm p-6">
                <h3 className="font-semibold text-slate-900 mb-3 text-base">Stay Updated</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  Get notified about updates and new features
                </p>
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 text-sm rounded-xl"
                  />
                  <Button 
                    className="w-full h-10 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white text-sm font-medium rounded-xl"
                    onClick={handleNewsletterSubscribe}
                    disabled={isSubscribing}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    {isSubscribing ? "Subscribing..." : "Subscribe"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Disclaimer */}
      {startup.is_featured && (
        <section className="py-8 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-8 text-center">
            <p className="text-sm text-slate-500 italic">
              * This is only for show purpose
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default StartupDetail;
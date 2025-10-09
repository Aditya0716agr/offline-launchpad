import { useEffect, useState } from "react";
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

const StartupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
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
          profiles (full_name, avatar_url, is_founding_member, bio)
        `)
        .eq('id', id! as any)
        .eq('status', 'approved' as any)
        .single();

      if (startupError) throw startupError;

      setStartup(startupData as unknown as Startup);

      // Increment view count
      await supabase.rpc('increment_view_count', { startup_id: id! });

      // Fetch votes
      const { data: votesData } = await supabase
        .from('votes')
        .select('id, user_id')
        .eq('startup_id', id! as any);

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
          .eq('startup_id', id! as any)
          .eq('user_id', (profileData as any).id);
        
        setHasVoted(false);
        setVotes(prev => prev.filter(vote => vote.user_id !== (profileData as any).id));
      } else {
        // Add vote
        await supabase
          .from('votes')
          .insert({
            startup_id: id!,
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
          startup_id: id,
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
    <div className="min-h-screen bg-background relative">
      {startup && <StartupSEO startup={startup} />}
      <Navbar />
      
      {/* Blurred Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100"></div>
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
      <div className="relative">
        {/* Navigation */}
        <div className="container mx-auto px-6 py-3">
        <Button 
          onClick={() => navigate('/explore')} 
          variant="ghost"
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 backdrop-blur-sm text-sm"
        >
          <ArrowLeft className="w-3 h-3 mr-1" />
          Back to Explore
        </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-8">
        {/* Hero Content */}
        <div className="relative mb-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-slate-200/50 shadow-xl shadow-slate-900/5 p-4 md:p-6">
            <div className="flex flex-col lg:flex-row items-start gap-4">
              {/* Logo */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 md:w-18 md:h-18 rounded-xl bg-white border-2 border-slate-200 shadow-lg flex items-center justify-center overflow-hidden">
                  {startup.logo_url ? (
                    <img 
                      src={startup.logo_url} 
                      alt={startup.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg md:text-xl font-bold text-slate-700">
                      {startup.name.charAt(0)}
                    </span>
                  )}
                </div>
                {startup.is_featured && (
                  <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-1 shadow-lg">
                    <Star className="w-2 h-2 fill-current" />
                  </div>
                )}
              </div>

              {/* Main Info */}
                  <div className="flex-1 min-w-0">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                  <div className="flex-1">
                    <div className="mb-2">
                      <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                          {startup.name}
                        </h1>
                            </div>
                    
                    {/* Tagline */}
                    {startup.tagline && (
                      <p className="text-sm md:text-base text-slate-600 mb-3 font-medium leading-relaxed">
                        {startup.tagline}
                      </p>
                    )}

                    {/* Category and Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                          {startup.categories && (
                        <Badge variant="outline" className="px-2 py-1 text-slate-600 border-slate-300 text-xs">
                              {startup.categories.name}
                            </Badge>
                          )}
                          {startup.profiles.is_founding_member && (
                        <Badge className="bg-amber-500 text-white border-amber-600 px-2 py-1 text-xs font-medium">
                              🎖 Founding Member
                            </Badge>
                          )}
                        </div>

                    {/* Key Metrics */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      {startup.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="font-medium">{startup.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span className="font-medium">{startup.view_count.toLocaleString()} views</span>
                      </div>
                      {startup.team_size && (
                        <div className="flex items-center gap-1">
                          {getTeamSizeIcon(startup.team_size)}
                          <span className="font-medium">{startup.team_size} team</span>
                        </div>
                      )}
                      {startup.launch_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className="font-medium">Launched {formatDate(startup.launch_date)}</span>
                        </div>
                          )}
                        </div>
                      </div>
                      
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:min-w-[150px]">
                        <Button
                          onClick={handleVote}
                          variant={hasVoted ? "default" : "outline"}
                      className={`flex items-center gap-1 h-8 font-medium text-sm ${
                        hasVoted 
                          ? "bg-slate-900 hover:bg-slate-800 text-white" 
                          : "border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${hasVoted ? 'fill-current' : ''}`} />
                      {votes.length} Votes
                        </Button>
                        <BookmarkButton startupId={id!} />
                    <Button
                      variant="outline"
                      className="h-8 border-slate-300 text-slate-700 hover:bg-slate-50"
                      onClick={() => setShowShareMenu(!showShareMenu)}
                    >
                      <Share2 className="w-3 h-3" />
                    </Button>
                    {user && (
                      <Button
                        variant="outline"
                        className={`h-8 font-medium text-sm ${
                          isFollowing 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" 
                            : "border-slate-300 text-slate-700 hover:bg-slate-50"
                        }`}
                        onClick={handleFollow}
                      >
                        <Bell className="w-3 h-3 mr-1" />
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                    )}
                  </div>
                </div>
                      </div>
                    </div>
                  </div>
                </div>

        {/* Share Menu */}
        {showShareMenu && (
          <div className="absolute right-6 top-24 z-50 bg-white/95 backdrop-blur-xl rounded-xl border border-slate-200/50 shadow-xl shadow-slate-900/10 p-3">
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="bg-white/60 backdrop-blur-xl rounded-lg border border-slate-200/50 p-1 mb-4">
                <TabsList className="grid w-full grid-cols-4 bg-transparent">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-600 text-sm"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="product"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-600 text-sm"
                  >
                    Product
                  </TabsTrigger>
                  <TabsTrigger 
                    value="gallery"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-600 text-sm"
                  >
                    Gallery
                  </TabsTrigger>
                  <TabsTrigger 
                    value="community"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-600 text-sm"
                  >
                    Community
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-3">
                {/* About */}
                <div className="bg-white/70 backdrop-blur-xl rounded-lg border border-slate-200/50 shadow-lg shadow-slate-900/5 p-4">
                  <div className="mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">About</h2>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-sm">
                    {startup.description || 'Innovative solution that transforms the industry.'}
                  </p>
                </div>

                {/* Traction Indicators */}
                <div className="bg-white/70 backdrop-blur-xl rounded-lg border border-slate-200/50 shadow-lg shadow-slate-900/5 p-4">
                  <div className="mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">Traction & Metrics</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="text-center p-3 bg-slate-50/80 border border-slate-200/50 rounded-lg">
                      <div className="text-lg font-bold text-slate-900">{startup.view_count.toLocaleString()}</div>
                      <div className="text-xs text-slate-600 font-medium">Profile Views</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50/80 border border-slate-200/50 rounded-lg">
                      <div className="text-lg font-bold text-slate-900">{votes.length}</div>
                      <div className="text-xs text-slate-600 font-medium">Community Votes</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50/80 border border-slate-200/50 rounded-lg">
                      <div className="text-lg font-bold text-slate-900">{startup.team_size || 'N/A'}</div>
                      <div className="text-xs text-slate-600 font-medium">Team Size</div>
                      </div>
                    <div className="text-center p-3 bg-slate-50/80 border border-slate-200/50 rounded-lg">
                      <div className="text-lg font-bold text-slate-900">{startup.stage || 'N/A'}</div>
                      <div className="text-xs text-slate-600 font-medium">Stage</div>
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                {startup.gallery_images && startup.gallery_images.length > 0 && (
                  <div className="bg-white/70 backdrop-blur-xl rounded-lg border border-slate-200/50 shadow-lg shadow-slate-900/5 p-4">
                    <div className="mb-3">
                      <h2 className="text-lg font-semibold text-slate-900">Product Gallery</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {startup.gallery_images.map((image, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200/50 group cursor-pointer">
                          <img 
                            src={image} 
                            alt={`${startup.name} gallery ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Looking For */}
                {startup.looking_for && startup.looking_for.length > 0 && (
                  <div className="bg-white/70 backdrop-blur-xl rounded-lg border border-slate-200/50 shadow-lg shadow-slate-900/5 p-4">
                    <div className="mb-3">
                      <h2 className="text-lg font-semibold text-slate-900">Opportunities</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {startup.looking_for.map((item, index) => (
                        <Badge key={index} variant="outline" className="px-3 py-1 text-slate-700 border-slate-300 bg-white text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Product Tab */}
              <TabsContent value="product" className="space-y-3">
                <div className="bg-white/70 backdrop-blur-xl rounded-lg border border-slate-200/50 shadow-lg shadow-slate-900/5 p-4">
                  <div className="mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">Product Details</h2>
                  </div>
                  <div className="space-y-4">
                    {startup.stage && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-slate-600 font-medium">Stage:</span>
                        <Badge className={`px-2 py-1 text-xs font-medium ${getStageColor(startup.stage)}`}>
                          {startup.stage}
                        </Badge>
                      </div>
                    )}
                    
                    <p className="text-slate-700 leading-relaxed text-sm">
                      {startup.description}
                    </p>
                    
                    {startup.website_url && (
                      <div className="pt-2">
                        <Button 
                          onClick={() => window.open(startup.website_url!, '_blank')}
                          className="w-full h-8 bg-slate-900 hover:bg-slate-800 text-white text-sm"
                        >
                          <Globe className="w-3 h-3 mr-2" />
                          Visit Website
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Gallery Tab */}
              <TabsContent value="gallery" className="space-y-3">
                {startup.gallery_images && startup.gallery_images.length > 0 ? (
                  <div className="bg-white/70 backdrop-blur-xl rounded-lg border border-slate-200/50 shadow-lg shadow-slate-900/5 p-4">
                    <div className="mb-3">
                      <h2 className="text-lg font-semibold text-slate-900">Product Gallery</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {startup.gallery_images.map((image, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200/50 group cursor-pointer">
                          <img 
                            src={image} 
                            alt={`${startup.name} gallery ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/70 backdrop-blur-xl rounded-lg border border-slate-200/50 shadow-lg shadow-slate-900/5 p-8 text-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Gallery Images</h3>
                    <p className="text-sm text-slate-600">This startup hasn't uploaded any gallery images yet.</p>
                  </div>
                )}
              </TabsContent>

              {/* Community Tab */}
              <TabsContent value="community" className="space-y-3">
                <div className="bg-white/70 backdrop-blur-xl rounded-lg border border-slate-200/50 shadow-lg shadow-slate-900/5 p-4">
                  <CommentsSection startupId={id!} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            {/* Contact Information */}
            <div className="bg-white/70 backdrop-blur-xl rounded-lg border border-slate-200/50 shadow-lg shadow-slate-900/5 p-4 sticky top-6">
              <h3 className="text-base font-semibold text-slate-900 mb-3">Get In Touch</h3>
                <div className="space-y-2">
                  {startup.website_url && (
                    <Button
                      variant="outline"
                    className="w-full justify-start h-8 border-slate-300 text-slate-700 hover:bg-slate-50 text-sm"
                      onClick={() => window.open(startup.website_url!, '_blank')}
                    >
                      <Globe className="w-3 h-3 mr-2" />
                      Visit Website
                    </Button>
                  )}
                  {startup.whatsapp_link && (
                    <Button
                      variant="outline"
                    className="w-full justify-start h-8 border-slate-300 text-slate-700 hover:bg-slate-50 text-sm"
                      onClick={() => window.open(startup.whatsapp_link!, '_blank')}
                    >
                      <MessageSquare className="w-3 h-3 mr-2" />
                      WhatsApp
                    </Button>
                  )}
                {startup.email_contact && user && (
                  <Button
                    variant="outline"
                    className="w-full justify-start h-8 border-slate-300 text-slate-700 hover:bg-slate-50 text-sm"
                    onClick={() => window.open(`mailto:${startup.email_contact}`, '_blank')}
                  >
                    <Mail className="w-3 h-3 mr-2" />
                    Email
                  </Button>
                )}
                {startup.phone_number && user && (
                  <Button
                    variant="outline"
                    className="w-full justify-start h-8 border-slate-300 text-slate-700 hover:bg-slate-50 text-sm"
                    onClick={() => window.open(`tel:${startup.phone_number}`, '_blank')}
                  >
                    <Phone className="w-3 h-3 mr-2" />
                    Call
                  </Button>
                )}
              </div>
            </div>

            {/* Social Links */}
            {(startup.social_instagram || startup.social_facebook || startup.social_linkedin || startup.social_twitter) && (
              <div className="bg-white/70 backdrop-blur-xl rounded-lg border border-slate-200/50 shadow-lg shadow-slate-900/5 p-4">
                <h3 className="text-base font-semibold text-slate-900 mb-3">Follow Us</h3>
                <div className="flex gap-1">
                  {startup.social_instagram && (
                    <Button variant="outline" size="sm" asChild className="border-slate-300 text-slate-700 hover:bg-slate-50 p-2">
                      <a href={startup.social_instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram className="w-3 h-3" />
                      </a>
                    </Button>
                  )}
                  {startup.social_facebook && (
                    <Button variant="outline" size="sm" asChild className="border-slate-300 text-slate-700 hover:bg-slate-50 p-2">
                      <a href={startup.social_facebook} target="_blank" rel="noopener noreferrer">
                        <Facebook className="w-3 h-3" />
                      </a>
                    </Button>
                  )}
                  {startup.social_linkedin && (
                    <Button variant="outline" size="sm" asChild className="border-slate-300 text-slate-700 hover:bg-slate-50 p-2">
                      <a href={startup.social_linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-3 h-3" />
                      </a>
                    </Button>
                  )}
                  {startup.social_twitter && (
                    <Button variant="outline" size="sm" asChild className="border-slate-300 text-slate-700 hover:bg-slate-50 p-2">
                      <a href={startup.social_twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-3 h-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Launch Info */}
            <div className="bg-white/70 backdrop-blur-xl rounded-lg border border-slate-200/50 shadow-lg shadow-slate-900/5 p-4">
              <h3 className="text-base font-semibold text-slate-900 mb-3">Launch Info</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span className="text-slate-600 font-medium">Listed on {formatDate(startup.created_at)}</span>
                </div>
                {startup.launch_date && (
                  <div className="flex items-center gap-2 text-xs">
                    <Zap className="w-3 h-3 text-slate-500" />
                    <span className="text-slate-600 font-medium">Launched {formatDate(startup.launch_date)}</span>
                  </div>
                )}
                {startup.city && (
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span className="text-slate-600 font-medium">{startup.city}{startup.state_region && `, ${startup.state_region}`}</span>
                  </div>
                )}
              </div>
                </div>

            {/* Team Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-lg border border-slate-200/50 shadow-lg shadow-slate-900/5 p-4">
              <h3 className="text-base font-semibold text-slate-900 mb-3">Team</h3>
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={startup.profiles.avatar_url || ''} />
                  <AvatarFallback className="text-sm">
                    {startup.profiles.full_name?.charAt(0) || 'F'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-900">
                    {startup.profiles.full_name || 'Anonymous Founder'}
                  </h4>
                  {startup.profiles.bio && (
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {startup.profiles.bio}
                    </p>
                  )}
                  <div className="flex gap-1 mt-2">
                    {startup.social_linkedin && (
                      <Button variant="outline" size="sm" asChild className="p-1 h-6 w-6">
                        <a href={startup.social_linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-3 h-3" />
                        </a>
                      </Button>
                    )}
                    {startup.social_twitter && (
                      <Button variant="outline" size="sm" asChild className="p-1 h-6 w-6">
                        <a href={startup.social_twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="w-3 h-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
                </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-slate-50/80 to-slate-100/80 backdrop-blur-xl rounded-lg border border-slate-200/50 shadow-lg shadow-slate-900/5 p-4">
              <h3 className="font-semibold text-slate-900 mb-2 text-sm">Stay Updated</h3>
              <p className="text-xs text-slate-600 mb-3">
                Get notified about updates and new features
              </p>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-8 text-xs"
                />
                <Button 
                  className="w-full h-8 bg-slate-900 hover:bg-slate-800 text-white text-sm"
                  onClick={handleNewsletterSubscribe}
                  disabled={isSubscribing}
                >
                  <Bell className="w-3 h-3 mr-1" />
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
                </div>
          </div>
        </div>

        {/* Demo Disclaimer */}
        {startup.is_featured && (
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground/60 italic">
              * This is only for show purpose
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupDetail;
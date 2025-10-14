import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, CheckCircle, Users, TrendingUp, Heart, Eye, MapPin, ChefHat, Shirt, Heart as HeartIcon, Palette, Store, Package, Target, Share2, MessageCircle, Handshake, BarChart3, Search, Filter, Grid, List, Coffee, ShoppingBag, Wrench, Sparkles, Dumbbell, Home as HomeIcon, GraduationCap, Music, Plane, Briefcase, Leaf } from "lucide-react";
import { trackUrgencyBannerClick, trackFoundingMemberClaim } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useMemo, useCallback } from "react";
import { SEOHead } from "@/components/seo/SEOHead";
import { LazyImage } from "@/components/ui/LazyImage";
import { generateMetaTitle, generateMetaDescription, generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";
import { StartupCard } from "@/components/startup/StartupCard";
import { GeolocationButton } from "@/components/ui/geolocation-button";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Startup {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  location: string | null;
  website_url: string | null;
  view_count: number;
  upvote_count: number;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  founder_name: string;
  category: string;
  categories: {
    name: string;
    slug: string;
  } | null;
  votes: { id: string }[];
  profiles?: {
    is_founding_member?: boolean;
  };
}

export default function HomePage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isFoundingMember, setIsFoundingMember] = useState(false);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    checkUser();
    fetchCategories();
    fetchStartups();
  }, []);

  useEffect(() => {
    fetchStartups();
  }, [searchTerm, selectedLocation, sortBy, selectedCategories]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      // Check if already a founding member
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_founding_member')
        .eq('user_id', user.id as any)
        .single();
      
      if (profile && !profileError && (profile as any).is_founding_member) {
        setIsFoundingMember(true);
      }
    }
  };

  const claimFoundingMember = async () => {
    if (!user) {
      toast({
        title: "Sign up required",
        description: "Please sign up to claim your Founding Member badge",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_founding_member: true } as any)
        .eq('user_id', user.id as any);

      if (error) throw error;

      setIsFoundingMember(true);
      trackFoundingMemberClaim();
      
      toast({
        title: "🎖 Founding Member Badge Claimed!",
        description: "You're now part of the first 100 founders. Your badge will be displayed on your profile and startups.",
      });

      // Redirect to dashboard
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error: any) {
      console.error('Error claiming badge:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to claim badge",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories((data as any) || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      console.log('Fetching startups with filters:', {
        searchTerm,
        selectedCategories,
        selectedLocation,
        sortBy
      });

      // Try the new schema first (with category_id foreign key)
      let query = supabase
        .from('startups')
        .select(`
          *,
          categories (name, slug),
          votes (id),
          profiles (is_founding_member)
        `)
        .eq('status', 'approved' as any);

      // Apply search filter
      if (searchTerm && searchTerm.trim()) {
        query = query.or(`name.ilike.%${searchTerm.trim()}%,description.ilike.%${searchTerm.trim()}%`);
        console.log('Applied search filter:', searchTerm.trim());
      }

      // Apply category filters - need to get category IDs first
      if (selectedCategories.length > 0) {
        console.log('Getting category IDs for slugs:', selectedCategories);
        
        // First, get the category IDs for the selected slugs
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .in('slug', selectedCategories as any);
        
        if (categoryError) {
          console.error('Error fetching category IDs:', categoryError);
        } else if (categoryData && categoryData.length > 0) {
          const categoryIds = (categoryData as any).map((cat: any) => cat.id);
          query = query.in('category_id', categoryIds);
          console.log('Applied category filter with IDs:', categoryIds);
        }
      }

      // Apply location filter
      if (selectedLocation !== "all" && selectedLocation.trim()) {
        query = query.ilike('location', `%${selectedLocation.trim()}%`);
        console.log('Applied location filter:', selectedLocation.trim());
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'alphabetical':
          query = query.order('name', { ascending: true });
          break;
        case 'most_voted':
          // Sort by vote count - we'll need to count votes and sort by that
          // For now, we'll sort by created_at as a fallback since we need to implement vote counting
          query = query.order('created_at', { ascending: false });
          console.log('Most voted sorting not fully implemented yet, using newest as fallback');
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      console.log('Executing query...');
      const { data, error } = await query;

      if (error) {
        console.error('Query error:', error);
        
        // If the error is related to the categories relationship, try without it
        if (error.message.includes('categories') || error.message.includes('relation')) {
          console.log('Retrying query without categories relationship...');
          
          const fallbackQuery = supabase
            .from('startups')
            .select(`
              *,
              votes (id),
              profiles (is_founding_member)
            `)
            .eq('status', 'approved' as any);

          // Apply filters without category relationship
          if (searchTerm && searchTerm.trim()) {
            fallbackQuery.or(`name.ilike.%${searchTerm.trim()}%,description.ilike.%${searchTerm.trim()}%`);
          }

          if (selectedLocation !== "all" && selectedLocation.trim()) {
            fallbackQuery.ilike('location', `%${selectedLocation.trim()}%`);
          }

          // Apply sorting
          switch (sortBy) {
            case 'newest':
              fallbackQuery.order('created_at', { ascending: false });
              break;
            case 'oldest':
              fallbackQuery.order('created_at', { ascending: true });
              break;
            case 'alphabetical':
              fallbackQuery.order('name', { ascending: true });
              break;
            default:
              fallbackQuery.order('created_at', { ascending: false });
          }

          const { data: fallbackData, error: fallbackError } = await fallbackQuery;
          
          if (fallbackError) {
            console.error('Fallback query also failed:', fallbackError);
            throw fallbackError;
          }
          
          console.log('Fallback query successful, found startups:', fallbackData?.length || 0);
          setStartups((fallbackData as any) || []);
        } else {
          throw error;
        }
      } else {
        console.log('Query successful, found startups:', data?.length || 0);
        setStartups((data as any) || []);
      }
    } catch (error) {
      console.error('Error fetching startups:', error);
      toast({
        title: "Error",
        description: "Failed to load startups. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categorySlug: string) => {
    setSelectedCategories(prev => {
      // If clicking the same category, deselect it
      if (prev.includes(categorySlug)) {
        return [];
      }
      // Otherwise, select only this category (single selection)
      return [categorySlug];
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("all");
    setSelectedCategories([]);
    setSortBy("newest");
  };

  // Memoized computations for better performance
  const uniqueLocations = useMemo(() => 
    Array.from(new Set(startups.map(s => s.location).filter(Boolean))).sort(),
    [startups]
  );

  const featuredStartups = useMemo(() => 
    startups.filter(startup => startup.is_featured),
    [startups]
  );

  const filteredStartups = useMemo(() => {
    let filtered = startups;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(startup =>
        startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.founder_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply location filter
    if (selectedLocation && selectedLocation !== 'all') {
      filtered = filtered.filter(startup => startup.location === selectedLocation);
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(startup => selectedCategories.includes(startup.category));
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered = filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'most_viewed':
        filtered = filtered.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        break;
      case 'most_liked':
        filtered = filtered.sort((a, b) => (b.upvote_count || 0) - (a.upvote_count || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [startups, searchTerm, selectedLocation, selectedCategories, sortBy]);

  // Category icons mapping
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'Food & Beverage': Coffee,
      'Wellness & Health': Heart,
      'Retail & Fashion': ShoppingBag,
      'Services': Wrench,
      'Beauty & Personal Care': Sparkles,
      'Fitness & Sports': Dumbbell,
      'Home & Living': HomeIcon,
      'Education & Training': GraduationCap,
      'Entertainment': Music,
      'Travel & Hospitality': Plane,
      'Professional Services': Briefcase,
      'Sustainability': Leaf,
    };
    return iconMap[categoryName] || Wrench;
  };


  const valueProps = [
    {
      title: "Validate Your Ideas",
      description: "Get real feedback from experienced founders and potential customers before you invest heavily",
      icon: CheckCircle
    },
    {
      title: "Find Your Co-Founder",
      description: "Connect with complementary founders who share your vision and can fill skill gaps in your team",
      icon: Users
    },
    {
      title: "Access Investors", 
      description: "Showcase your validated business to a network of investors looking for promising non-tech startups",
      icon: TrendingUp
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Showcase Your Startup",
      description: "Create a compelling profile for your non-tech business and get discovered by the community"
    },
    {
      step: "2", 
      title: "Connect & Validate",
      description: "Get feedback from fellow founders, find potential cofounders, and validate your business ideas"
    },
    {
      step: "3",
      title: "Launch & Scale", 
      description: "Access investors, build partnerships, and accelerate your growth with our founder network"
    }
  ];

  // Enhanced SEO data
  const seoData = useMemo(() => ({
    title: generateMetaTitle("Discover Non-Tech Startups & Entrepreneurs | Startup Directory"),
    description: generateMetaDescription("Discover innovative non-tech startups and connect with entrepreneurs. Browse startup directory, find cofounders, get funding, and join the largest community of non-tech founders in India."),
    structuredData: [
      generateOrganizationSchema(),
      generateWebsiteSchema()
    ]
  }), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/30">
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords="non-tech startups, startup directory, find startups, startup discovery, non-tech founders, entrepreneur directory, startup community, business directory, startup listing, find cofounder, startup funding, business networking, startup ecosystem, entrepreneur platform, startup search, business discovery, startup database, founder network, startup marketplace, business opportunities, startup investment"
        url="https://knowfounders.com"
        structuredData={seoData.structuredData}
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Elegant background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(5,150,105,0.04),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(5,150,105,0.02),transparent_50%)]"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/3 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-emerald-400/2 rounded-full blur-3xl opacity-40"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
          
          <h1 className="text-4xl md:text-5xl font-light text-slate-900 mb-6 leading-tight tracking-tight" style={{letterSpacing: '-0.02em', lineHeight: '1.2'}}>
          Discover India's Hidden
            <span className="block bg-gradient-to-r from-primary via-primary to-emerald-600 bg-clip-text text-transparent font-normal">Startup Gems</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light" style={{lineHeight: '1.6'}}>
          The discovery platform where real-world products get the spotlight they deserve. Launch your food brand, wellness product, retail business, or service—get upvotes, feedback, and discovered by customers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <AuthModal defaultTab="signup">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white text-lg px-12 py-4 h-12 min-w-[240px] rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border-0"
                onClick={() => trackUrgencyBannerClick('signup')}
              >
                Launch Your Product
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </AuthModal>
            <Link to="/home">
              <Button variant="outline" size="lg" className="text-lg px-12 py-4 h-12 min-w-[240px] border-slate-200 hover:bg-white hover:border-slate-300 rounded-full font-medium transition-all duration-300 text-slate-700 shadow-sm hover:shadow-md bg-white/50 backdrop-blur-sm">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Trusted by <span className="font-medium text-slate-700">1000+ founders</span></span>
            </div>
            <div className="w-px h-4 bg-slate-200"></div>
            <span>Featured on <span className="font-medium text-slate-700">Product Hunt</span></span>
          </div>
        </div>
      </section>

      {/* Founding Member Promotion */}
      <section className="py-12 bg-gradient-to-r from-primary/5 via-emerald-50/50 to-primary/5 border-y border-primary/10">
        <div className="max-w-4xl mx-auto px-8 text-center">
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
                  First 100 startups get a <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">founding member</span> badge
                </h2>
                <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
                  + free featured spot! Join the exclusive community of early adopters and get your startup featured prominently.
                </p>
          <AuthModal defaultTab="signup">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white text-lg px-8 py-3 h-12 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Claim Yours
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </AuthModal>
        </div>
      </section>

      {/* Featured Startups Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-3 leading-tight tracking-tight" style={{letterSpacing: '-0.02em', lineHeight: '1.2'}}>
              Featured Non-Tech Startups
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-light" style={{lineHeight: '1.6'}}>
              Discover innovative businesses built by non-tech founders making their mark
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredStartups.slice(0, 3).map((startup) => (
              <Card key={startup.id} className="group bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden" style={{boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'}}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="w-12 h-12 ring-2 ring-slate-100">
                      <AvatarImage src={startup.logo_url || ''} alt={startup.name} />
                      <AvatarFallback className="text-base font-medium bg-gradient-to-br from-primary/10 to-emerald-100 text-primary">
                        {startup.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {startup.name}
                      </h3>
                      <p className="text-sm text-slate-500 mb-2 font-medium">{startup.founder_name}</p>
                      <Badge className="text-xs bg-gradient-to-r from-primary/10 to-emerald-100 text-primary border-primary/20 font-medium">
                        {startup.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2 font-light" style={{lineHeight: '1.6'}}>
                    {startup.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-600">{startup.view_count}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-600">{startup.upvote_count}</span>
                      </div>
                    </div>
                    {startup.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="truncate max-w-[100px] text-xs text-slate-500">{startup.location}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Section - All Startups */}
      <section className="py-16 bg-gradient-to-br from-slate-50/50 to-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-3 leading-tight tracking-tight" style={{letterSpacing: '-0.02em', lineHeight: '1.2'}}>
              Discover All Startups
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-light" style={{lineHeight: '1.6'}}>
              Browse through our complete directory of non-tech startups
            </p>
          </div>
          
          {/* Filters Section */}
          <div className="mb-8">
            {/* Categories Filter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  Categories
                </h3>
                {selectedCategories.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-slate-500 hover:text-slate-700 text-sm hover:bg-slate-100 rounded-lg"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const IconComponent = getCategoryIcon(category.name);
                  const isSelected = selectedCategories.includes(category.slug);
              return (
                    <Button
                      key={category.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleCategoryToggle(category.slug)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-primary to-emerald-600 text-white border-0 shadow-sm' 
                          : 'border-slate-200 text-slate-600 hover:border-primary/30 hover:text-primary hover:bg-primary/5 bg-white'
                      }`}
                    >
                      <IconComponent className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                      {category.name}
                    </Button>
              );
            })}
          </div>
        </div>

            {/* Location Filter */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                Location
              </h3>
              <div className="flex items-center gap-3">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-48 border-slate-200 focus:border-primary focus:ring-primary bg-white text-sm rounded-lg shadow-sm">
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    {uniqueLocations.map((location) => (
                      <SelectItem key={location} value={location!}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <GeolocationButton 
                  onLocationFound={(location) => setSelectedLocation(location)} 
                />
              </div>
            </div>
          </div>
          
          {/* Search and Controls */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search startups by name, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 py-3 text-sm border-slate-200 focus:border-primary focus:ring-primary rounded-xl bg-white/80 backdrop-blur-sm shadow-sm"
                />
                  </div>
                  
              {/* Controls */}
              <div className="flex gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 border-slate-200 focus:border-primary focus:ring-primary rounded-xl text-sm bg-white/80 backdrop-blur-sm shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                    <SelectItem value="most_voted">Most voted</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-sm">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`rounded-none px-3 py-2 ${viewMode === "grid" ? "bg-gradient-to-r from-primary to-emerald-600 text-white border-0" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <Grid className="w-4 h-4" />
                      </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`rounded-none border-l border-slate-200 px-3 py-2 ${viewMode === "list" ? "bg-gradient-to-r from-primary to-emerald-600 text-white border-0" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <List className="w-4 h-4" />
              </Button>
                </div>
          </div>
        </div>
          </div>
          
          {/* Startups Grid/List */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-lg mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : startups.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-12 text-center shadow-sm">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Search className="w-8 h-8 text-slate-400" />
          </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  No startups found
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  We couldn't find any startups matching your criteria. Try adjusting your search terms or explore different categories.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={clearFilters} 
                    variant="outline" 
                    size="sm"
                    className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg px-6"
                  >
                    Clear All Filters
                  </Button>
                  <Button 
                    onClick={() => setSearchTerm("")} 
                    variant="default"
                    size="sm"
                    className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white rounded-lg px-6"
                  >
                    Browse All Startups
                  </Button>
            </div>
          </div>
        </div>
          ) : (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {startups.map((startup) => (
                <div 
                  key={startup.id}
                  onClick={() => navigate(`/startup/${startup.id}`)}
                  className="cursor-pointer group"
                >
                  <StartupCard 
                    startup={startup} 
                    viewMode={viewMode}
                  />
                </div>
              ))}
          </div>
          )}
        </div>
      </section>


      <Footer />
    </div>
  );
}
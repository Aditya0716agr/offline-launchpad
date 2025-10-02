import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { StartupCard } from "@/components/startup/StartupCard";
import { Search, Filter, Grid, List, Coffee, Heart, ShoppingBag, Wrench, Sparkles, Dumbbell, Home, GraduationCap, Music, Plane, Briefcase, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GeolocationButton } from "@/components/ui/geolocation-button";
import { SEOHead } from "@/components/seo/SEOHead";

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
  created_at: string;
  categories: {
    name: string;
    slug: string;
  } | null;
  votes: { id: string }[];
  profiles?: {
    is_founding_member?: boolean;
  };
}

const Explore = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
    fetchStartups();
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  useEffect(() => {
    fetchStartups();
  }, [searchTerm, selectedLocation, sortBy, selectedCategories]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStartups = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('startups')
        .select(`
          *,
          categories (name, slug),
          votes (id),
          profiles (is_founding_member)
        `)
        .eq('status', 'approved');

      // Apply search filter
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      // Apply category filters
      if (selectedCategories.length > 0) {
        query = query.in('categories.slug', selectedCategories);
      }

      // Apply location filter
      if (selectedLocation !== "all") {
        query = query.ilike('location', `%${selectedLocation}%`);
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
          // This would need a more complex query in production
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setStartups(data || []);
    } catch (error) {
      console.error('Error fetching startups:', error);
      toast({
        title: "Error",
        description: "Failed to load startups",
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

  const uniqueLocations = Array.from(
    new Set(startups.map(s => s.location).filter(Boolean))
  ).sort();

  // Category icons mapping
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'Food & Beverage': Coffee,
      'Wellness & Health': Heart,
      'Retail & Fashion': ShoppingBag,
      'Services': Wrench,
      'Beauty & Personal Care': Sparkles,
      'Fitness & Sports': Dumbbell,
      'Home & Living': Home,
      'Education & Training': GraduationCap,
      'Entertainment': Music,
      'Travel & Hospitality': Plane,
      'Professional Services': Briefcase,
      'Sustainability': Leaf,
    };
    return iconMap[categoryName] || Wrench;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Discover Non-Tech Startups | Startup Directory | Know Founders"
        description="Browse and discover innovative non-tech startups across India. Find startups by category, location, and stage. Connect with founders, get funding, and join the startup ecosystem."
        keywords="startup directory, discover startups, non-tech startups, startup search, find startups, startup discovery, business directory, entrepreneur directory, startup listing, startup database, startup marketplace, business opportunities, startup investment, founder network, startup community"
        url="https://knowfounders.com/explore"
      />
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">

        {/* Filters Section */}
        <div className="mb-8">
          {/* Categories Filter */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
              {selectedCategories.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Clear all
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const IconComponent = getCategoryIcon(category.name);
                const isSelected = selectedCategories.includes(category.slug);
                return (
                  <Button
                    key={category.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleCategoryToggle(category.slug)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isSelected 
                        ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' 
                        : 'border-gray-200 text-gray-700 hover:border-green-300 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Location Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
            <div className="flex items-center gap-4">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-64 border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white">
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
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search startups by name, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 text-base border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-gray-200 focus:border-green-500 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                  <SelectItem value="most_voted">Most voted</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-none ${viewMode === "grid" ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`rounded-none border-l border-gray-200 ${viewMode === "list" ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? "Loading..." : `${startups.length} startups found`}
            </h2>
            {selectedCategories.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">in</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {categories.find(c => c.slug === selectedCategories[0])?.name}
                </span>
              </div>
            )}
            {selectedLocation !== "all" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">near</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {selectedLocation}
                </span>
              </div>
            )}
          </div>
          {startups.length > 0 && (
            <div className="text-sm text-gray-500">
              Showing {startups.length} result{startups.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Startups Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : startups.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-lg">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No startups found
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We couldn't find any startups matching your criteria. Try adjusting your search terms or explore different categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={clearFilters} 
                  variant="outline" 
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Clear All Filters
                </Button>
                <Button 
                  onClick={() => setSearchTerm("")} 
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Browse All Startups
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              : "space-y-6"
          }>
            {startups.map((startup) => (
              <div 
                key={startup.id}
                onClick={() => navigate(`/startup/${startup.id}`)}
                className="cursor-pointer"
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
    </div>
  );
};

export default Explore;

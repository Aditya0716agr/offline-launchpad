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
  slug: string;
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
  const [viewMode, setViewMode] = useState<"block" | "list">("list");
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
      setCategories((data as any) || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

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
      
      <div className="container mx-auto px-6 py-6">

        {/* Filters Section */}
        <div className="mb-4">
          {/* Categories Filter */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
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
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                      isSelected 
                        ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' 
                        : 'border-gray-200 text-gray-700 hover:border-green-300 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <IconComponent className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Location Filter */}
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Location</h3>
            <div className="flex items-center gap-2">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48 border-gray-200 focus:border-green-500 focus:ring-green-500 bg-white text-sm">
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
        <div className="mb-4">
          <div className="flex flex-col lg:flex-row gap-2">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search startups by name, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 py-2 text-sm border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36 border-gray-200 focus:border-green-500 rounded-lg text-sm">
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
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`rounded-none px-2 ${viewMode === "list" ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <List className="w-3 h-3" />
                </Button>
                <Button
                  variant={viewMode === "block" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("block")}
                  className={`rounded-none border-l border-gray-200 px-2 ${viewMode === "block" ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <Grid className="w-3 h-3" />
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
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center shadow-lg">
            <div className="max-w-sm mx-auto">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No startups found
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                We couldn't find any startups matching your criteria. Try adjusting your search terms or explore different categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button 
                  onClick={clearFilters} 
                  variant="outline" 
                  size="sm"
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Clear All Filters
                </Button>
                <Button 
                  onClick={() => setSearchTerm("")} 
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Browse All Startups
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className={
            viewMode === "block" 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              : "space-y-3"
          }>
            {startups.map((startup) => (
              <div 
                key={startup.id}
                onClick={() => navigate(`/startups/${startup.slug || startup.id}`)}
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

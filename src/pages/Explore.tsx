import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StartupCard } from "@/components/startup/StartupCard";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import type { Startup } from "@/components/startup/StartupCard";

// Mock data - will be replaced with real data from Supabase
const mockStartups: Startup[] = [
  {
    id: "1",
    name: "Fresh Bowls Co.",
    slug: "fresh-bowls-co",
    description: "Healthy, customizable grain bowls made with locally sourced ingredients. Perfect for busy professionals who want nutritious meals.",
    logo_url: null,
    category: "food",
    location: "Austin, TX",
    website_url: "https://freshbowlsco.com",
    whatsapp_link: null,
    upvote_count: 47,
    view_count: 234,
    launch_date: "2024-01-15",
    created_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "2",
    name: "Urban Yoga Studio",
    slug: "urban-yoga-studio",
    description: "Modern yoga studio offering classes for all levels. Specializing in hot yoga, meditation, and wellness workshops.",
    logo_url: null,
    category: "wellness",
    location: "Portland, OR",
    website_url: "https://urbanyoga.com",
    whatsapp_link: null,
    upvote_count: 32,
    view_count: 187,
    launch_date: "2024-02-01",
    created_at: "2024-01-25T00:00:00Z",
  },
  {
    id: "3",
    name: "Handmade Ceramics",
    slug: "handmade-ceramics",
    description: "Beautiful, handcrafted ceramic pieces for your home. Each piece is unique and made with sustainable materials.",
    logo_url: null,
    category: "retail",
    location: "Nashville, TN",
    website_url: "https://handmadeceramics.shop",
    whatsapp_link: null,
    upvote_count: 28,
    view_count: 156,
    launch_date: "2024-01-20",
    created_at: "2024-01-15T00:00:00Z",
  },
];

export default function Explore() {
  const [startups, setStartups] = useState<Startup[]>(mockStartups);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>(mockStartups);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    let filtered = [...startups];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(startup =>
        startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        startup.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(startup => startup.category === selectedCategory);
    }

    // Location filter
    if (selectedLocation !== "all") {
      filtered = filtered.filter(startup =>
        startup.location?.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "popular":
        filtered.sort((a, b) => b.upvote_count - a.upvote_count);
        break;
      case "views":
        filtered.sort((a, b) => b.view_count - a.view_count);
        break;
    }

    setFilteredStartups(filtered);
  }, [startups, searchQuery, selectedCategory, selectedLocation, sortBy]);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "food", label: "Food & Beverage" },
    { value: "wellness", label: "Wellness" },
    { value: "retail", label: "Retail" },
    { value: "services", label: "Services" },
    { value: "beauty", label: "Beauty" },
    { value: "fitness", label: "Fitness" },
    { value: "education", label: "Education" },
    { value: "consulting", label: "Consulting" },
    { value: "other", label: "Other" },
  ];

  const locations = [
    { value: "all", label: "All Locations" },
    { value: "austin", label: "Austin, TX" },
    { value: "portland", label: "Portland, OR" },
    { value: "nashville", label: "Nashville, TN" },
    { value: "denver", label: "Denver, CO" },
    { value: "seattle", label: "Seattle, WA" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Explore Startups</h1>
          <p className="text-xl text-muted-foreground">
            Discover amazing local businesses and innovative startups in your area
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search startups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {selectedCategory !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1">
                {categories.find(c => c.value === selectedCategory)?.label}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            
            {selectedLocation !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1">
                {locations.find(l => l.value === selectedLocation)?.label}
                <button
                  onClick={() => setSelectedLocation("all")}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}

            {searchQuery && (
              <Badge variant="outline" className="flex items-center gap-1">
                "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredStartups.length} of {startups.length} startups
          </p>
        </div>

        {/* Startups Grid */}
        <div className="space-y-6">
          {filteredStartups.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No startups found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or browse all categories
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedLocation("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            filteredStartups.map((startup) => (
              <StartupCard
                key={startup.id}
                startup={startup}
                showLaunchBadge={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
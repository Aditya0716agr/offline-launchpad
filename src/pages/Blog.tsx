import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Calendar, User, ArrowRight, Filter } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Blog categories
const categories = [
  { id: "all", name: "All Posts", slug: "all" },
  { id: "founder-stories", name: "Non-Tech Founder Stories", slug: "founder-stories" },
  { id: "validation", name: "Startup Validation", slug: "validation" },
  { id: "cofounders", name: "Finding Co-founders", slug: "cofounders" },
  { id: "fundraising", name: "Fundraising for Non-Tech", slug: "fundraising" },
  { id: "business-building", name: "Business Building", slug: "business-building" },
  { id: "platform-updates", name: "Platform Updates", slug: "platform-updates" }
];

// Sample blog posts data
const blogPosts = [
  {
    id: "1",
    title: "From Restaurant Owner to Tech-Enabled Food Empire: Sarah's Journey",
    excerpt: "How Sarah Chen transformed her local restaurant into a multi-city food delivery platform without writing a single line of code.",
    content: "Full article content here...",
    author: {
      name: "Sarah Chen",
      avatar: null,
      bio: "Founder of EcoClean Solutions"
    },
    category: "founder-stories",
    categoryName: "Non-Tech Founder Stories",
    publishedAt: "2024-01-15",
    readTime: "8 min read",
    featured: true,
    tags: ["success-story", "food-tech", "scaling"],
    image: null
  },
  {
    id: "2",
    title: "The Complete Guide to Validating Your Non-Tech Startup Idea",
    excerpt: "A step-by-step framework for testing your business concept before investing time and money into development.",
    content: "Full article content here...",
    author: {
      name: "Marcus Rodriguez",
      avatar: null,
      bio: "Startup Advisor & Mentor"
    },
    category: "validation",
    categoryName: "Startup Validation",
    publishedAt: "2024-01-12",
    readTime: "12 min read",
    featured: true,
    tags: ["validation", "framework", "market-research"],
    image: null
  },
  {
    id: "3",
    title: "How to Find Your Perfect Technical Co-founder",
    excerpt: "Practical strategies for non-tech founders to identify, approach, and partner with the right technical talent.",
    content: "Full article content here...",
    author: {
      name: "Jessica Park",
      avatar: null,
      bio: "Co-founder of FitLife Studio"
    },
    category: "cofounders",
    categoryName: "Finding Co-founders",
    publishedAt: "2024-01-10",
    readTime: "10 min read",
    featured: false,
    tags: ["cofounder", "partnership", "recruitment"],
    image: null
  },
  {
    id: "4",
    title: "Fundraising Without a Technical Background: What Investors Really Want",
    excerpt: "Insights from 50+ investor conversations on how non-tech founders can successfully raise capital.",
    content: "Full article content here...",
    author: {
      name: "David Kim",
      avatar: null,
      bio: "Investment Partner at Green Ventures"
    },
    category: "fundraising",
    categoryName: "Fundraising for Non-Tech",
    publishedAt: "2024-01-08",
    readTime: "15 min read",
    featured: false,
    tags: ["fundraising", "investors", "pitch"],
    image: null
  },
  {
    id: "5",
    title: "Building Operations That Scale: Lessons from 5 Non-Tech Founders",
    excerpt: "Real-world strategies for creating efficient systems and processes as your business grows.",
    content: "Full article content here...",
    author: {
      name: "Amanda Foster",
      avatar: null,
      bio: "Operations Expert & Founder"
    },
    category: "business-building",
    categoryName: "Business Building",
    publishedAt: "2024-01-05",
    readTime: "11 min read",
    featured: false,
    tags: ["operations", "scaling", "systems"],
    image: null
  },
  {
    id: "6",
    title: "New Feature: Enhanced Startup Discovery and Matching",
    excerpt: "Introducing our latest platform updates designed to help founders connect more effectively.",
    content: "Full article content here...",
    author: {
      name: "KnowFounders Team",
      avatar: null,
      bio: "Platform Development Team"
    },
    category: "platform-updates",
    categoryName: "Platform Updates",
    publishedAt: "2024-01-03",
    readTime: "5 min read",
    featured: false,
    tags: ["platform", "features", "updates"],
    image: null
  }
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 border-b border-border bg-muted/10">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-foreground mb-8 leading-tight tracking-tight">
              Founder Resources & Insights
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
              Learn from successful non-tech founders, get expert advice, and discover strategies that actually work.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="space-y-6 mb-12">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search articles, topics, or founders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 border-border focus:border-primary transition-all duration-300 rounded-2xl text-lg"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 h-auto rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {selectedCategory === "all" && (
        <section className="py-16 border-b border-border">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-2xl font-light text-foreground mb-8">Featured Stories</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="startup-card group">
                  <CardContent className="p-0">
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge className="category-badge text-xs">
                          {post.categoryName}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{post.readTime}</span>
                      </div>
                      
                      <h3 className="text-xl font-light text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={post.author.avatar || ""} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {post.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{post.author.name}</p>
                            <p className="text-xs text-muted-foreground">{post.author.bio}</p>
                          </div>
                        </div>
                        
                        <Link to={`/blog/${post.id}`}>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            Read More
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light text-foreground">
              {selectedCategory === "all" ? "All Articles" : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="startup-card group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="category-badge text-xs">
                      {post.categoryName}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-lg font-light text-foreground mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={post.author.avatar || ""} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {post.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{post.author.name}</span>
                    </div>
                    
                    <Link to={`/blog/${post.id}`}>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                        Read
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No articles found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

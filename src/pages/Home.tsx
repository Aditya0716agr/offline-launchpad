import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { Link } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, CheckCircle, Users, TrendingUp, Heart, Eye, MapPin } from "lucide-react";

export default function Home() {
  // Mock featured startups data - in real app, this would come from API
  const featuredStartups = [
    {
      id: "1",
      name: "EcoClean Solutions",
      description: "Sustainable cleaning products for modern homes",
      logo_url: null,
      location: "San Francisco, CA",
      view_count: 1247,
      upvote_count: 89,
      category: "Wellness",
      founder_name: "Sarah Chen"
    },
    {
      id: "2", 
      name: "Artisan Bread Co.",
      description: "Handcrafted sourdough bread delivered fresh daily",
      logo_url: null,
      location: "Portland, OR",
      view_count: 892,
      upvote_count: 67,
      category: "Food",
      founder_name: "Marcus Rodriguez"
    },
    {
      id: "3",
      name: "FitLife Studio",
      description: "Personalized fitness coaching for busy professionals",
      logo_url: null,
      location: "Austin, TX",
      view_count: 1156,
      upvote_count: 94,
      category: "Fitness",
      founder_name: "Jessica Park"
    },
    {
      id: "4",
      name: "GreenThumb Gardens",
      description: "Urban gardening solutions for apartment dwellers",
      logo_url: null,
      location: "Seattle, WA",
      view_count: 743,
      upvote_count: 52,
      category: "Wellness",
      founder_name: "David Kim"
    },
    {
      id: "5",
      name: "Craft & Co.",
      description: "Handmade jewelry and accessories from local artisans",
      logo_url: null,
      location: "Nashville, TN",
      view_count: 634,
      upvote_count: 41,
      category: "Retail",
      founder_name: "Amanda Foster"
    }
  ];

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-foreground mb-8 leading-tight tracking-tight">
            The Future of Non-Tech
            <span className="block text-primary font-normal">Entrepreneurship</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Join the platform built specifically for non-tech entrepreneurs. Validate ideas, find cofounders, and connect with investors who understand your business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <AuthModal defaultTab="signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-12 py-4 h-12 min-w-[240px] rounded-full font-medium transition-all duration-200 hover:scale-105">
                Join the Movement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </AuthModal>
            <Link to="/explore">
              <Button variant="outline" size="lg" className="text-lg px-12 py-4 h-12 min-w-[240px] border-border hover:bg-muted/50 rounded-full font-medium transition-all duration-200">
                Start Your Journey
              </Button>
            </Link>
          </div>

          <p className="text-lg text-muted-foreground">
            Trusted by <span className="font-medium text-foreground">industry leaders</span> and <span className="font-medium text-foreground">successful founders</span>
          </p>
        </div>
      </section>

      {/* Featured Startups Section */}
      <section className="py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6 leading-tight">
              Featured Non-Tech Startups
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Discover innovative businesses built by non-tech founders making their mark
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredStartups.slice(0, 3).map((startup) => (
              <Card key={startup.id} className="startup-card group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={startup.logo_url || ''} alt={startup.name} />
                      <AvatarFallback className="text-lg font-medium bg-primary/10 text-primary">
                        {startup.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {startup.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{startup.founder_name}</p>
                      <Badge className="category-badge text-xs">
                        {startup.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                    {startup.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{startup.view_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{startup.upvote_count}</span>
                      </div>
                    </div>
                    {startup.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate max-w-[100px]">{startup.location}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/explore">
              <Button variant="outline" size="lg" className="px-8 py-3 h-11 border-border hover:bg-muted/50 rounded-full font-medium transition-all duration-200">
                Continue Exploring
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Insights */}
      <section className="py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6 leading-tight">
              Latest Insights
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Learn from successful founders and get expert advice on building your non-tech startup
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                id: "1",
                title: "From Restaurant Owner to Tech-Enabled Food Empire",
                excerpt: "How Sarah Chen transformed her local restaurant into a multi-city food delivery platform without writing a single line of code.",
                category: "Founder Stories",
                readTime: "8 min read",
                author: "Sarah Chen"
              },
              {
                id: "2", 
                title: "The Complete Guide to Validating Your Non-Tech Startup Idea",
                excerpt: "A step-by-step framework for testing your business concept before investing time and money into development.",
                category: "Startup Validation",
                readTime: "12 min read",
                author: "Marcus Rodriguez"
              },
              {
                id: "3",
                title: "How to Find Your Perfect Technical Co-founder",
                excerpt: "Practical strategies for non-tech founders to identify, approach, and partner with the right technical talent.",
                category: "Finding Co-founders",
                readTime: "10 min read",
                author: "Jessica Park"
              }
            ].map((post) => (
              <Card key={post.id} className="startup-card group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="category-badge text-xs">
                      {post.category}
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
                    <span className="text-xs text-muted-foreground">By {post.author}</span>
                    <Link to={`/blog/${post.id}`}>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                        Read More
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/blog">
              <Button variant="outline" size="lg" className="px-8 py-3 h-11 border-border hover:bg-muted/50 rounded-full font-medium transition-all duration-200">
                Read More Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6 leading-tight">
              Everything You Need to Succeed as a Non-Tech Founder
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              From validating your initial idea to scaling your business, we provide the tools and community to help you thrive
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {valueProps.map((prop, index) => {
              const Icon = prop.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 border border-border group-hover:border-primary transition-colors duration-200">
                    <Icon className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  </div>
                  <h3 className="text-xl font-light text-foreground mb-4">{prop.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{prop.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-8 leading-tight tracking-tight">
              Your Journey Starts Here
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
              Join now and help shape the future of non-tech entrepreneurship
            </p>
          </div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            
            <div className="grid lg:grid-cols-3 gap-16 lg:gap-8">
              {howItWorks.map((step, index) => (
                <div key={index} className="relative group">
                  {/* Step Card */}
                  <div className="relative bg-background border border-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 group-hover:-translate-y-2">
                    {/* Step Number */}
                    <div className="absolute -top-6 left-8">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-lg shadow-lg">
                        {step.step}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="pt-6">
                      <h3 className="text-2xl font-light text-foreground mb-6 leading-tight group-hover:text-primary transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-lg group-hover:text-foreground/80 transition-colors duration-300">
                        {step.description}
                      </p>
                    </div>
                    
                    {/* Decorative Element */}
                    <div className="absolute top-8 right-8 w-2 h-2 bg-primary/20 rounded-full group-hover:bg-primary/40 transition-colors duration-300"></div>
                  </div>
                  
                  {/* Arrow Connector */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-16 -right-4 z-10">
                      <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Bottom CTA */}
          <div className="text-center mt-20">
            <div className="inline-flex items-center gap-3 text-muted-foreground">
              <div className="w-8 h-px bg-border"></div>
              <span className="text-sm font-medium">Ready to begin?</span>
              <div className="w-8 h-px bg-border"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 border-t border-border">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-8 leading-tight">
            Ready to Transform Your
            <span className="block text-primary font-normal">Entrepreneurial Journey?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Join the platform that non-tech entrepreneurs have been waiting for. Your feedback will directly influence our roadmap.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <AuthModal defaultTab="signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-12 py-4 h-12 min-w-[240px] rounded-full font-medium transition-all duration-200 hover:scale-105">
                Join the Movement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </AuthModal>
            <Link to="/explore">
              <Button variant="outline" size="lg" className="text-lg px-12 py-4 h-12 min-w-[240px] border-border hover:bg-muted/50 rounded-full font-medium transition-all duration-200">
                Explore the Vision
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
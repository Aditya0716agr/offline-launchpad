import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, CheckCircle, Users, TrendingUp, Heart, Eye, MapPin } from "lucide-react";
import { trackUrgencyBannerClick, trackFoundingMemberClaim } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { SEOHead } from "@/components/seo/SEOHead";

export default function Home() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isFoundingMember, setIsFoundingMember] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      // Check if already a founding member
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_founding_member')
        .eq('user_id', user.id)
        .single();
      
      if (profile?.is_founding_member) {
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
        .update({ is_founding_member: true })
        .eq('user_id', user.id);

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

  // Mock featured startups data - in real app, this would come from API
  const featuredStartups = [
    {
      id: "1",
      name: "Desi Delights",
      description: "Authentic regional Indian snacks delivered pan-India",
      logo_url: null,
      location: "Pune, Maharashtra",
      view_count: 1247,
      upvote_count: 89,
      category: "Food & Beverage",
      founder_name: "Priya Sharma"
    },
    {
      id: "2", 
      name: "KhadiCraft",
      description: "Handwoven khadi products supporting rural artisans",
      logo_url: null,
      location: "Jaipur, Rajasthan",
      view_count: 892,
      upvote_count: 67,
      category: "Retail & Fashion",
      founder_name: "Rajesh Agarwal"
    },
    {
      id: "3",
      name: "Ayur Wellness Hub",
      description: "Traditional Ayurvedic treatments with modern convenience",
      logo_url: null,
      location: "Kochi, Kerala",
      view_count: 1156,
      upvote_count: 94,
      category: "Health & Wellness",
      founder_name: "Dr. Meena Nair"
    },
    {
      id: "4",
      name: "Urban Tiffin",
      description: "Homestyle meals for working professionals in metros",
      logo_url: null,
      location: "Bengaluru, Karnataka",
      view_count: 743,
      upvote_count: 52,
      category: "Food & Beverage",
      founder_name: "Suresh Kumar"
    },
    {
      id: "5",
      name: "Village Connect",
      description: "Bridging rural farmers with urban organic food buyers",
      logo_url: null,
      location: "Nashik, Maharashtra",
      view_count: 634,
      upvote_count: 41,
      category: "Food & Beverage",
      founder_name: "Anita Patil"
    },
    {
      id: "6",
      name: "FitAtHome",
      description: "Personalized home fitness training for busy professionals",
      logo_url: null,
      location: "Delhi, NCR",
      view_count: 892,
      upvote_count: 73,
      category: "Health & Wellness",
      founder_name: "Vikram Singh"
    },
    {
      id: "7",
      name: "EcoThread",
      description: "Sustainable fashion for conscious consumers",
      logo_url: null,
      location: "Hyderabad, Telangana",
      view_count: 567,
      upvote_count: 45,
      category: "Retail & Fashion",
      founder_name: "Kavita Reddy"
    },
    {
      id: "8",
      name: "SkillBridge Academy",
      description: "Professional skill development for career advancement",
      logo_url: null,
      location: "Mumbai, Maharashtra",
      view_count: 934,
      upvote_count: 68,
      category: "Education & Training",
      founder_name: "Arjun Mehta"
    },
    {
      id: "9",
      name: "Herbal Glow",
      description: "Natural skincare solutions using traditional Indian herbs",
      logo_url: null,
      location: "Ahmedabad, Gujarat",
      view_count: 678,
      upvote_count: 56,
      category: "Beauty & Personal Care",
      founder_name: "Sunita Joshi"
    },
    {
      id: "10",
      name: "Smart Home Solutions",
      description: "Affordable home automation for Indian households",
      logo_url: null,
      location: "Chandigarh, Punjab",
      view_count: 789,
      upvote_count: 62,
      category: "Home & Lifestyle",
      founder_name: "Rohit Gupta"
    },
    {
      id: "11",
      name: "EventCraft",
      description: "Memorable events and celebrations for every occasion",
      logo_url: null,
      location: "Chennai, Tamil Nadu",
      view_count: 445,
      upvote_count: 38,
      category: "Entertainment",
      founder_name: "Deepika Iyer"
    },
    {
      id: "12",
      name: "Local Explorer",
      description: "Authentic local experiences and hidden gems",
      logo_url: null,
      location: "Lucknow, Uttar Pradesh",
      view_count: 356,
      upvote_count: 29,
      category: "Travel & Hospitality",
      founder_name: "Manoj Tiwari"
    },
    {
      id: "13",
      name: "BusinessBoost",
      description: "Strategic consulting for small business growth",
      logo_url: null,
      location: "Indore, Madhya Pradesh",
      view_count: 523,
      upvote_count: 41,
      category: "Services",
      founder_name: "Pooja Shah"
    },
    {
      id: "14",
      name: "Mindful Living",
      description: "Holistic wellness coaching for mental and physical health",
      logo_url: null,
      location: "Kolkata, West Bengal",
      view_count: 456,
      upvote_count: 34,
      category: "Health & Wellness",
      founder_name: "Amit Kumar"
    },
    {
      id: "15",
      name: "Green Wardrobe",
      description: "Pre-loved designer fashion for sustainable style",
      logo_url: null,
      location: "Bhubaneswar, Odisha",
      view_count: 234,
      upvote_count: 18,
      category: "Retail & Fashion",
      founder_name: "Neha Agarwal"
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
      <SEOHead
        title="Know Founders - Discover Non-Tech Startups & Entrepreneurs | Startup Directory"
        description="Discover innovative non-tech startups and connect with entrepreneurs. Browse startup directory, find cofounders, get funding, and join the largest community of non-tech founders in India."
        keywords="non-tech startups, startup directory, find startups, startup discovery, non-tech founders, entrepreneur directory, startup community, business directory, startup listing, find cofounder, startup funding, business networking, startup ecosystem, entrepreneur platform, startup search, business discovery, startup database, founder network, startup marketplace, business opportunities, startup investment"
        url="https://knowfounders.com"
      />
      <Navbar />
      
      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-primary/20">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center justify-center gap-3 text-center">
            <span className="text-2xl">🎖</span>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="font-semibold text-primary">First 100 founders get a Founding Member badge</span>
              <span className="text-muted-foreground">+ free featured spot!</span>
            </div>
            {user && !isFoundingMember ? (
              <Button 
                size="sm" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 ml-4"
                onClick={() => {
                  trackUrgencyBannerClick('claim_badge');
                  claimFoundingMember();
                }}
              >
                Claim Yours
              </Button>
            ) : user && isFoundingMember ? (
              <Badge className="ml-4 bg-amber-500 text-white border-amber-600">
                ✓ Claimed
              </Badge>
            ) : (
              <AuthModal defaultTab="signup">
                <Button 
                  size="sm" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 ml-4"
                  onClick={() => trackUrgencyBannerClick('claim_badge')}
                >
                  Claim Yours
                </Button>
              </AuthModal>
            )}
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-24 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-foreground mb-8 leading-tight tracking-tight">
            The Future of Non-Tech
            <span className="block text-primary font-normal">Entrepreneurship</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed font-light">
          Launchpad for non-tech entrepreneurs to showcase, validate, and grow. Takes less than 2 minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <AuthModal defaultTab="signup">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-12 py-4 h-12 min-w-[240px] rounded-full font-medium transition-all duration-200 hover:scale-105"
                onClick={() => trackUrgencyBannerClick('signup')}
              >
                List Your Startup Free
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
            {featuredStartups.slice(0, 6).map((startup) => (
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
                Add Your Startup
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
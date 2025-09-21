import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star, Users, TrendingUp, MapPin, Rocket, Heart, Target } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

export default function Home() {
  const featuredCategories = [
    { name: "Food & Beverage", count: 23, color: "bg-orange-100 text-orange-800", icon: "🍕" },
    { name: "Wellness", count: 18, color: "bg-green-100 text-green-800", icon: "🧘" },
    { name: "Retail", count: 31, color: "bg-blue-100 text-blue-800", icon: "🛍️" },
    { name: "Services", count: 27, color: "bg-purple-100 text-purple-800", icon: "🔧" },
    { name: "Beauty", count: 15, color: "bg-pink-100 text-pink-800", icon: "💄" },
    { name: "Fitness", count: 12, color: "bg-red-100 text-red-800", icon: "💪" },
  ];

  const stats = [
    { label: "Local Startups", value: "500+", icon: Rocket },
    { label: "Happy Customers", value: "10K+", icon: Heart },
    { label: "Cities Covered", value: "50+", icon: MapPin },
    { label: "Success Stories", value: "200+", icon: Target },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-6">
                <Badge variant="outline" className="bg-primary-light text-primary border-primary/20">
                  <Star className="h-3 w-3 mr-1" />
                  Discover Local Innovation
                </Badge>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Where Local 
                <br />
                <span className="text-primary">Startups Shine</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Discover amazing non-tech startups in your area. From innovative D2C brands to game-changing local services – find your next favorite business before everyone else does.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="btn-hero text-lg px-8">
                  <Link to="/explore">
                    Explore Startups
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <AuthModal defaultTab="signup">
                  <Button variant="outline" size="lg" className="btn-outline-primary text-lg px-8">
                    Launch Your Startup
                  </Button>
                </AuthModal>
              </div>

              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-border/50">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background"></div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Join 10,000+ users discovering local innovation
                </p>
              </div>
            </div>

            <div className="relative animate-slide-up">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={heroImage} 
                  alt="Local entrepreneurs and startups launching their businesses"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating cards */}
              <div className="absolute -top-4 -left-4 bg-card border border-border rounded-lg p-3 shadow-lg animate-scale-in">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">+23% this week</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-lg p-3 shadow-lg animate-scale-in" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">127 new launches</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore by Category</h2>
            <p className="text-xl text-muted-foreground">
              Find the perfect startup in your area of interest
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredCategories.map((category, index) => (
              <Link
                key={category.name}
                to={`/explore?category=${category.name.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
                className="group"
              >
                <Card className="card-feature h-full animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <Badge variant="outline" className={category.color}>
                      {category.count} startups
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Ready to Launch Your Startup?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join hundreds of founders who've successfully launched their businesses on our platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AuthModal defaultTab="signup">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Get Started for Free
              </Button>
            </AuthModal>
            
            <Button asChild variant="outline" size="lg" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/explore">
                Browse Startups
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
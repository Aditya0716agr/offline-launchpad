import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { Link } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, TrendingUp, Rocket, Heart, Star, ArrowRight, Target, Network, Zap } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export default function Home() {
  const stats = [
    { label: "Founder Connections", value: "2,500+", icon: Users },
    { label: "Funding Raised", value: "$12M+", icon: TrendingUp },
    { label: "Startups Launched", value: "480+", icon: Rocket },
    { label: "Success Stories", value: "150+", icon: Heart },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Showcase Your Startup",
      description: "Create a compelling profile for your non-tech business and get discovered by the community",
      icon: Target
    },
    {
      step: "2", 
      title: "Connect & Validate",
      description: "Get feedback from fellow founders, find potential cofounders, and validate your business ideas",
      icon: Network
    },
    {
      step: "3",
      title: "Launch & Scale", 
      description: "Access investors, build partnerships, and accelerate your growth with our founder network",
      icon: Zap
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      company: "Verde Coffee Co.",
      role: "Founder & CEO",
      content: "KnowFounders helped me connect with my co-founder and validate our sustainable coffee concept. We've since raised $500K in seed funding!",
      rating: 5
    },
    {
      name: "Marcus Rodriguez", 
      company: "Artisan Bread Works",
      role: "Founder",
      content: "The platform gave our bakery the exposure we needed. Found amazing mentors and secured partnerships that doubled our revenue.",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      company: "Mindful Wellness Studio", 
      role: "Co-Founder",
      content: "From idea validation to finding investors, KnowFounders was instrumental in turning our wellness concept into a thriving business.",
      rating: 5
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Non-tech entrepreneurs and startup founders" 
            className="w-full h-full object-cover opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-hero"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <Badge className="mb-8 bg-primary/10 text-primary border-primary/20 text-sm font-medium px-4 py-2">
            The Product Hunt for Non-Tech Startups
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight">
            Where Non-Tech Founders
            <span className="block text-primary">Launch & Connect</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Showcase your startup, validate ideas, find cofounders, and connect with investors - all in one platform built for founders without tech backgrounds
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <AuthModal defaultTab="signup">
              <Button size="lg" className="btn-minimal text-lg px-10 py-4 h-14 min-w-[200px]">
                Launch Your Startup
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </AuthModal>
            <Link to="/explore">
              <Button variant="outline" size="lg" className="text-lg px-10 py-4 h-14 min-w-[200px] border-primary/20 hover:bg-primary/5">
                Browse Startups
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            Join <span className="font-semibold text-primary">2,500+ founders</span> who've already launched their startups
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="group">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Everything You Need to Succeed as a Non-Tech Founder
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From validating your initial idea to scaling your business, we provide the tools and community to help you thrive
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {valueProps.map((prop, index) => {
              const Icon = prop.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="bg-primary/5 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors">
                    <Icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{prop.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{prop.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get started in three simple steps and join thousands of successful non-tech founders
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full">
                      <ArrowRight className="h-6 w-6 text-primary/30 mx-auto" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories / Testimonials */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Success Stories from Our Founder Community
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real founders, real results. See how KnowFounders helped turn ideas into thriving businesses
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 italic">
                  "{testimonial.content}"
                </blockquote>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-primary font-medium">{testimonial.role}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-8">
            Ready to Join the Future of
            <span className="block text-primary">Non-Tech Entrepreneurship?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Don't let your great business idea stay just an idea. Join KnowFounders today and turn your vision into reality with the support of our founder community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <AuthModal defaultTab="signup">
              <Button size="lg" className="btn-minimal text-lg px-12 py-4 h-14 min-w-[220px]">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </AuthModal>
            <Link to="/explore">
              <Button variant="outline" size="lg" className="text-lg px-12 py-4 h-14 min-w-[220px] border-primary/20 hover:bg-primary/5">
                Explore Community
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Free to join • No credit card required • Launch in minutes
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
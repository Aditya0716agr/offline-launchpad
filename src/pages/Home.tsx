import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { Link } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, TrendingUp, Rocket, Heart, Star, ArrowRight, Target, Network, Zap } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export default function Home() {
  const whyNow = [
    { 
      title: "Overlooked Market", 
      description: "95% of successful businesses are non-tech, yet founders lack dedicated platforms",
      icon: Target 
    },
    { 
      title: "Growing Opportunity", 
      description: "Non-tech entrepreneurship is booming but underserved by existing communities",
      icon: TrendingUp 
    },
    { 
      title: "Network Gap", 
      description: "Traditional business networks don't speak startup language or understand modern validation",
      icon: Network 
    },
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

  const visionStories = [
    {
      title: "Find Your Perfect Co-Founder",
      description: "Connect with complementary founders who share your vision and can fill the skill gaps in your team.",
      icon: Users,
      benefit: "Access to vetted co-founder matches"
    },
    {
      title: "Validate Before You Build", 
      description: "Get real feedback from experienced founders and potential customers before investing heavily.",
      icon: CheckCircle,
      benefit: "Risk-free idea validation"
    },
    {
      title: "Connect with Investors",
      description: "Showcase your validated business to investors specifically looking for promising non-tech startups.",
      icon: TrendingUp,
      benefit: "Direct access to startup investors"
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
          <Badge className="mb-8 bg-gradient-premium border-primary/30 text-primary text-sm font-semibold px-6 py-3 backdrop-blur-sm">
            🚀 Recently Launched • Be Among the First
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight">
            The Future of Non-Tech
            <span className="block bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Entrepreneurship Starts Here</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Be among the first founders to join a community built specifically for non-tech entrepreneurs. Validate ideas, find cofounders, and connect with investors who understand your business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <AuthModal defaultTab="signup">
              <Button size="lg" className="btn-minimal text-lg px-12 py-4 h-14 min-w-[220px] shadow-primary">
                Get Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </AuthModal>
            <Link to="/explore">
              <Button variant="outline" size="lg" className="text-lg px-12 py-4 h-14 min-w-[220px] border-primary/30 hover:bg-gradient-premium backdrop-blur-sm">
                See the Vision
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            Join the <span className="font-semibold text-primary">growing community</span> of visionary non-tech founders
          </p>
        </div>
      </section>

      {/* Why Now Section */}
      <section className="py-24 bg-gradient-premium">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Now? The Opportunity is Clear
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Non-tech entrepreneurship represents the largest underserved market in startup communities
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {whyNow.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="bg-gradient-card w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300 border border-primary/10">
                    <Icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
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
      <section className="py-24 bg-gradient-secondary">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Your Journey as an Early Member
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join now and help shape the future of non-tech entrepreneurship
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-primary">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full">
                      <ArrowRight className="h-6 w-6 text-primary/40 mx-auto" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision for Success */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Vision for Success: What We're Building Together
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              As an early member, you'll help shape these core features and be first to benefit from them
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {visionStories.map((story, index) => {
              const Icon = story.icon;
              return (
                <div key={index} className="bg-gradient-card border border-primary/10 rounded-xl p-8 hover:shadow-lg transition-all duration-300 group">
                  <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{story.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{story.description}</p>
                  <div className="text-sm font-medium text-primary bg-primary/5 px-3 py-1 rounded-full inline-block">
                    {story.benefit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Early Access CTA Section */}
      <section className="py-24 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-premium"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Badge className="mb-8 bg-primary/20 text-primary border-primary/30 text-sm font-medium px-4 py-2 backdrop-blur-sm">
            🎯 Exclusive Early Access
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-8">
            Shape the Future of
            <span className="block bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Non-Tech Entrepreneurship</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Join as a founding member and help build the platform non-tech entrepreneurs have been waiting for. Your feedback will directly influence our roadmap.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <AuthModal defaultTab="signup">
              <Button size="lg" className="btn-minimal text-lg px-12 py-4 h-14 min-w-[220px] shadow-primary">
                Become a Founding Member
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </AuthModal>
            <Link to="/explore">
              <Button variant="outline" size="lg" className="text-lg px-12 py-4 h-14 min-w-[220px] border-primary/30 hover:bg-gradient-premium backdrop-blur-sm">
                Explore the Vision
              </Button>
            </Link>
          </div>

          <div className="bg-gradient-card border border-primary/20 rounded-xl p-6 max-w-2xl mx-auto backdrop-blur-sm">
            <h3 className="font-semibold text-foreground mb-3">Early Member Benefits</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>✨ Lifetime founding member badge</p>
              <p>🎯 Direct influence on platform features</p>
              <p>🤝 Priority access to investor introductions</p>
              <p>💡 Free premium features for life</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
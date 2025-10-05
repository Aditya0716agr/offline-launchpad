import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Target, Heart, Globe, Award, TrendingUp, Handshake, Lightbulb, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/seo/SEOHead";

const About = () => {
  const teamMembers = [
    {
      name: "Founder & CEO",
      role: "Vision & Strategy",
      description: "Passionate about empowering non-tech entrepreneurs and building inclusive startup ecosystems.",
      icon: Lightbulb
    },
    {
      name: "Community Lead",
      role: "Growth & Engagement", 
      description: "Dedicated to fostering meaningful connections between founders and their communities.",
      icon: Users
    },
    {
      name: "Product Team",
      role: "Platform Development",
      description: "Building tools that make startup discovery and networking seamless and effective.",
      icon: Zap
    }
  ];

  const values = [
    {
      title: "Inclusivity",
      description: "We believe every entrepreneur deserves a platform to showcase their vision, regardless of their technical background.",
      icon: Heart
    },
    {
      title: "Community First",
      description: "Our platform thrives on authentic connections and mutual support between founders and their local communities.",
      icon: Users
    },
    {
      title: "Transparency",
      description: "We maintain open communication and clear policies to build trust with our users and partners.",
      icon: Shield
    },
    {
      title: "Innovation",
      description: "We continuously evolve our platform to meet the changing needs of the non-tech startup ecosystem.",
      icon: TrendingUp
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "Platform Launch",
      description: "Launched KnowFounders to bridge the gap in non-tech startup discovery"
    },
    {
      year: "2024",
      title: "1000+ Founders",
      description: "Reached our first milestone of 1000+ registered founders"
    },
    {
      year: "2024", 
      title: "Community Growth",
      description: "Featured on Product Hunt and multiple startup directories"
    },
    {
      year: "2024",
      title: "Expansion",
      description: "Expanding to serve founders across India and beyond"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About KnowFounders - Empowering Non-Tech Entrepreneurs | Our Mission & Story"
        description="Learn about KnowFounders' mission to empower non-tech entrepreneurs. Discover our story, values, and commitment to building inclusive startup ecosystems for real-world businesses."
        keywords="about knowfounders, non-tech startup platform, entrepreneur community, startup ecosystem, founder support, business networking, startup discovery platform"
        url="https://knowfounders.com/about"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-background via-muted/10 to-primary/5">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              About KnowFounders
            </Badge>
            <h1 className="text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight tracking-tight">
              Empowering Non-Tech
              <span className="block text-primary font-normal">Entrepreneurs</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              We're building the world's first dedicated platform for non-tech startups to get discovered, 
              validated, and connected with their communities.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 border-t border-border">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-light text-foreground mb-6 leading-tight">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                While the tech startup world gets all the attention, we noticed that some of the most innovative 
                and impactful businesses are built by non-tech founders. From food brands to wellness products, 
                from retail businesses to local services – these entrepreneurs are creating real value in their communities.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                KnowFounders exists to give these founders the platform they deserve. We believe every entrepreneur 
                should have access to discovery, validation, and community support – regardless of their technical background.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/explore">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Explore Startups
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline">
                    Join Our Community
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">1000+</h3>
                <p className="text-sm text-muted-foreground">Active Founders</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">50+</h3>
                <p className="text-sm text-muted-foreground">Cities Covered</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">15+</h3>
                <p className="text-sm text-muted-foreground">Categories</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Handshake className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">500+</h3>
                <p className="text-sm text-muted-foreground">Connections Made</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 border-t border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-foreground mb-4 leading-tight">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              These core principles guide everything we do at KnowFounders
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 border-t border-border">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-foreground mb-4 leading-tight">
              Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A passionate team dedicated to supporting non-tech entrepreneurs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => {
              const Icon = member.icon;
              return (
                <Card key={index} className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-16 border-t border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-foreground mb-4 leading-tight">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Key milestones in our mission to empower non-tech entrepreneurs
            </p>
          </div>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 border-t border-border">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-light text-foreground mb-6 leading-tight">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Have questions about KnowFounders? Want to partner with us? We'd love to hear from you.
          </p>
          
          <Card className="p-8 max-w-2xl mx-auto">
            <CardContent className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">Contact Information</h3>
                <p className="text-muted-foreground mb-4">
                  Reach out to us for any questions, partnerships, or feedback
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">@</span>
                  </div>
                  <a 
                    href="mailto:hertofhelp@gmail.com" 
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    hertofhelp@gmail.com
                  </a>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground">Based in India, serving globally</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24 hours during business days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

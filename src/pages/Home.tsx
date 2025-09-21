import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { Link } from "react-router-dom";

export default function Home() {
  const stats = [
    { label: "Startups", value: "500+" },
    { label: "Categories", value: "12" },
    { label: "Cities", value: "50+" },
    { label: "Launches", value: "200+" },
  ];

  const categories = [
    "Food & Beverage",
    "Wellness & Health", 
    "Retail & Fashion",
    "Services",
    "Beauty & Personal Care",
    "Fitness & Sports",
    "Home & Living",
    "Education & Training",
    "Entertainment",
    "Travel & Hospitality",
    "Professional Services",
    "Sustainability"
  ];

  const featuredStartups = [
    {
      name: "Verde Coffee Co.",
      description: "Sustainable coffee roasting with direct farmer partnerships",
      location: "Austin, TX"
    },
    {
      name: "Mindful Wellness Studio",
      description: "Holistic wellness center offering meditation and yoga",
      location: "Portland, OR"
    },
    {
      name: "Artisan Bread Works",
      description: "Handcrafted sourdough breads using ancient grains",
      location: "Denver, CO"
    },
    {
      name: "Local Harvest Market",
      description: "Community-supported agriculture with weekly deliveries",
      location: "Seattle, WA"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-6xl font-medium text-foreground mb-8 leading-tight">
            Discover Local Innovation
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Find and support amazing non-tech startups in your area. From D2C brands to local services.
          </p>
          
          <Link to="/explore">
            <Button className="btn-minimal text-lg px-8 py-3">
              Explore Startups
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-t border-secondary">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-medium text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 border-t border-secondary">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-medium text-foreground mb-16 text-center">
            Browse Categories
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/explore?category=${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="link-minimal text-center py-4"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Startups */}
      <section className="py-20 border-t border-secondary">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-3xl font-medium text-foreground">
              Featured Startups
            </h2>
            <Link to="/explore" className="link-minimal">
              View All
            </Link>
          </div>
          
          <div className="space-y-8">
            {featuredStartups.map((startup, index) => (
              <div key={index} className="border-b border-secondary pb-8 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-medium text-foreground mb-2">
                      {startup.name}
                    </h3>
                    <p className="text-muted-foreground mb-3 max-w-lg">
                      {startup.description}
                    </p>
                    <span className="text-sm text-muted-foreground">
                      {startup.location}
                    </span>
                  </div>
                  <Button variant="ghost" className="btn-ghost-minimal">
                    Visit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-secondary">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-medium text-foreground mb-8">
            Launch Your Startup
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join hundreds of founders building amazing businesses
          </p>
          
          <AuthModal defaultTab="signup">
            <Button className="btn-minimal text-lg px-8 py-3">
              Get Started
            </Button>
          </AuthModal>
        </div>
      </section>
    </div>
  );
}
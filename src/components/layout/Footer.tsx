import { Link } from "react-router-dom";
import { Heart, MapPin, Mail, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-medium text-foreground">KnowFounders</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connecting local communities with innovative startups. Discover, support, and grow together.
            </p>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Startups
                </Link>
              </li>
              <li>
                <Link to="/explore?category=food-beverage" className="text-muted-foreground hover:text-foreground transition-colors">
                  Food & Beverage
                </Link>
              </li>
              <li>
                <Link to="/explore?category=wellness-health" className="text-muted-foreground hover:text-foreground transition-colors">
                  Wellness & Health
                </Link>
              </li>
              <li>
                <Link to="/explore?category=retail-fashion" className="text-muted-foreground hover:text-foreground transition-colors">
                  Retail & Fashion
                </Link>
              </li>
            </ul>
          </div>

          {/* For Founders */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">For Founders</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/signup" className="text-muted-foreground hover:text-foreground transition-colors">
                  List Your Startup
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:hertofhelp@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  Contact Us
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/know-founder" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Linkedin className="w-3 h-3" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2024 KnowFounders. Made with ❤️ for local entrepreneurs.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
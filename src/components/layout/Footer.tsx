import { Link } from "react-router-dom";
import { Heart, MapPin, Mail, Linkedin, Twitter, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-gradient-to-br from-background via-muted/5 to-primary/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl sm:text-2xl font-semibold text-foreground">KnowFounders</span>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-sm">
              The discovery platform where real-world products get the spotlight they deserve. Launch your non-tech business and connect with customers.
            </p>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <a href="https://www.linkedin.com/company/know-founder" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-primary/10 transition-colors group">
                <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a href="https://twitter.com/knowfounders" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-primary/10 transition-colors group">
                <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a href="mailto:hertofhelp@gmail.com" className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-primary/10 transition-colors group">
                <Mail className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Explore</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/explore" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">
                  All Startups
                </Link>
              </li>
              <li>
                <Link to="/explore?category=food-beverage" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">
                  Food & Beverage
                </Link>
              </li>
              <li>
                <Link to="/explore?category=wellness-health" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">
                  Wellness & Health
                </Link>
              </li>
              <li>
                <Link to="/explore?category=retail-fashion" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">
                  Retail & Fashion
                </Link>
              </li>
              <li>
                <Link to="/explore?category=services" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* For Founders */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">For Founders</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/signup" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">
                  List Your Startup
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">
                  Founder Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Company</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>


        <div className="border-t border-border/50 pt-8 sm:pt-12 mt-8 sm:mt-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <p className="text-muted-foreground text-sm sm:text-base">
                © 2025 KnowFounders. All rights reserved.
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                Made with ❤️ for non-tech entrepreneurs worldwide.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-8 text-xs sm:text-sm">
                <span className="text-muted-foreground">Trusted by 1000+ founders</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-muted-foreground">All systems operational</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <span className="text-muted-foreground text-xs sm:text-sm">Featured on:</span>
                <a href="https://dofollow.tools" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80">
                  <img src="https://dofollow.tools/badge/badge_transparent.svg" alt="Featured on Dofollow.Tools" width="120" height="32" className="sm:w-[150px] sm:h-[40px]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
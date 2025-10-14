import { Link } from "react-router-dom";
import { Heart, MapPin, Mail, Linkedin, Twitter, Github } from "lucide-react";

export function Footer() {
  return (
    <>
      <footer className="border-t border-border/50 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">

          {/* Explore */}
          <div className="space-y-4">
            <div className="relative">
              <h3 className="text-sm font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent uppercase tracking-wide">
                Explore
              </h3>
              <div className="absolute -bottom-1 left-0 w-6 h-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
            </div>
            <ul className="space-y-2">
              <li>
                <Link to="/explore" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200 text-xs font-medium hover:translate-x-1 inline-block">
                  All Startups
                </Link>
              </li>
              <li>
                <Link to="/explore?category=food-beverage" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200 text-xs font-medium hover:translate-x-1 inline-block">
                  Food & Beverage
                </Link>
              </li>
              <li>
                <Link to="/explore?category=wellness-health" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200 text-xs font-medium hover:translate-x-1 inline-block">
                  Wellness & Health
                </Link>
              </li>
              <li>
                <Link to="/explore?category=retail-fashion" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200 text-xs font-medium hover:translate-x-1 inline-block">
                  Retail & Fashion
                </Link>
              </li>
              <li>
                <Link to="/explore?category=services" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200 text-xs font-medium hover:translate-x-1 inline-block">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* For Founders */}
          <div className="space-y-4">
            <div className="relative">
              <h3 className="text-sm font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent uppercase tracking-wide">
                For Founders
              </h3>
              <div className="absolute -bottom-1 left-0 w-6 h-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
            </div>
            <ul className="space-y-2">
              <li>
                <Link to="/signup" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200 text-xs font-medium hover:translate-x-1 inline-block">
                  List Your Startup
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200 text-xs font-medium hover:translate-x-1 inline-block">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200 text-xs font-medium hover:translate-x-1 inline-block">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200 text-xs font-medium hover:translate-x-1 inline-block">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200 text-xs font-medium hover:translate-x-1 inline-block">
                  Founder Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <div className="relative">
              <h3 className="text-sm font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent uppercase tracking-wide">
                Company
              </h3>
              <div className="absolute -bottom-1 left-0 w-6 h-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
            </div>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200 text-xs font-medium hover:translate-x-1 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200 text-xs font-medium hover:translate-x-1 inline-block">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200 text-xs font-medium hover:translate-x-1 inline-block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200 text-xs font-medium hover:translate-x-1 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all duration-200 text-xs font-medium hover:translate-x-1 inline-block">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>


        {/* Bottom Section */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                © 2025 KnowFounders. All rights reserved.
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-xs mt-1 flex items-center justify-center lg:justify-start gap-2">
                <span className="w-1 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full"></span>
                Made with ❤️ for non-tech entrepreneurs worldwide.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs">
                <div className="flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-500 to-green-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-600 dark:text-slate-400 font-medium text-xs">Trusted by 1000+ founders</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-500 to-green-400 rounded-full"></div>
                  <span className="text-slate-600 dark:text-slate-400 font-medium text-xs">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
                </div>
              </div>
    </footer>

    {/* Featured In - Full Width Section */}
    <div className="w-full bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-t border-slate-200 dark:border-slate-700">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2 uppercase tracking-wide">
            Featured In
          </h3>
          <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-full mx-auto"></div>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex gap-6 items-center animate-scroll">
            {/* First set of badges */}
            <a href="https://launchigniter.com/product/knowfounders?ref=badge-knowfounders" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://launchigniter.com/api/badge/knowfounders?theme=neutral" alt="Featured on LaunchIgniter" width="212" height="55" className="h-8 w-auto" />
            </a>
            <a href="https://www.producthunt.com/products/knowfounders?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-knowfounders" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1020985&theme=neutral&t=1759343386759" alt="KnowFounders - Where non-tech founders get discovered. | Product Hunt" width="250" height="54" className="h-8 w-auto" />
            </a>
            <a href="https://launchboard.dev" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://launchboard.dev/launchboard-badge.png" alt="Launched on LaunchBoard - Product Launch Platform" width="240" height="60" className="h-8 w-auto" />
            </a>
            <a href="https://fazier.com" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=neutral" width="250" alt="Fazier badge" className="h-8 w-auto" />
            </a>
            <a href="https://starterbest.com" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80 flex-shrink-0"> 
              <img src="https://starterbest.com/badages-awards.svg" alt="Featured on Starter Best" height="54" width="auto" className="h-8 w-auto" />
            </a>
            <a href="https://similarlabs.com/?ref=embed" target="_blank" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://similarlabs.com/similarlabs-embed-badge-light.svg" alt="SimilarLabs Embed Badge" className="h-8 w-auto" />
            </a>
            <a href="https://turbo0.com/item/know-founders" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://img.turbo0.com/badge-listed-light.svg" alt="Listed on Turbo0" height="54" width="auto" className="h-8 w-auto" />
            </a>
            <a href="https://theindiewall.net" target="_blank" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://theindiewall.net/indiewall.svg" alt="IndieWall" width="120" height="60" className="h-8 w-auto" />
            </a>
            <a href="https://startupfa.me/s/knowfounders?utm_source=knowfounder.online" target="_blank" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://startupfa.me/badges/featured/light.webp" alt="Featured on Startup Fame" width="171" height="54" className="h-8 w-auto" />
            </a>
            <a href="https://dofollow.tools" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://dofollow.tools/badge/badge_transparent.svg" alt="Featured on Dofollow.Tools" width="200" height="54" className="h-8 w-auto" />
            </a>
            <a href="https://yo.directory/" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://cdn.prod.website-files.com/65c1546fa73ea974db789e3d/65e1e171f89ebfa7bd0129ac_yodirectory-featured.png" alt="yo.directory" width="150" height="54" className="h-8 w-auto" />
            </a>
            
            {/* Duplicate set for seamless loop */}
            <a href="https://launchigniter.com/product/knowfounders?ref=badge-knowfounders" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://launchigniter.com/api/badge/knowfounders?theme=neutral" alt="Featured on LaunchIgniter" width="212" height="55" className="h-8 w-auto" />
            </a>
            <a href="https://www.producthunt.com/products/knowfounders?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-knowfounders" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1020985&theme=neutral&t=1759343386759" alt="KnowFounders - Where non-tech founders get discovered. | Product Hunt" width="250" height="54" className="h-8 w-auto" />
            </a>
            <a href="https://launchboard.dev" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://launchboard.dev/launchboard-badge.png" alt="Launched on LaunchBoard - Product Launch Platform" width="240" height="60" className="h-8 w-auto" />
            </a>
            <a href="https://fazier.com" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=neutral" width="250" alt="Fazier badge" className="h-8 w-auto" />
            </a>
            <a href="https://starterbest.com" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80 flex-shrink-0"> 
              <img src="https://starterbest.com/badages-awards.svg" alt="Featured on Starter Best" height="54" width="auto" className="h-8 w-auto" />
            </a>
            <a href="https://similarlabs.com/?ref=embed" target="_blank" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://similarlabs.com/similarlabs-embed-badge-light.svg" alt="SimilarLabs Embed Badge" className="h-8 w-auto" />
            </a>
            <a href="https://turbo0.com/item/know-founders" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://img.turbo0.com/badge-listed-light.svg" alt="Listed on Turbo0" height="54" width="auto" className="h-8 w-auto" />
            </a>
            <a href="https://theindiewall.net" target="_blank" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://theindiewall.net/indiewall.svg" alt="IndieWall" width="120" height="60" className="h-8 w-auto" />
            </a>
            <a href="https://startupfa.me/s/knowfounders?utm_source=knowfounder.online" target="_blank" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://startupfa.me/badges/featured/light.webp" alt="Featured on Startup Fame" width="171" height="54" className="h-8 w-auto" />
            </a>
            <a href="https://dofollow.tools" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://dofollow.tools/badge/badge_transparent.svg" alt="Featured on Dofollow.Tools" width="200" height="54" className="h-8 w-auto" />
            </a>
            <a href="https://yo.directory/" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80 flex-shrink-0">
              <img src="https://cdn.prod.website-files.com/65c1546fa73ea974db789e3d/65e1e171f89ebfa7bd0129ac_yodirectory-featured.png" alt="yo.directory" width="150" height="54" className="h-8 w-auto" />
                </a>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
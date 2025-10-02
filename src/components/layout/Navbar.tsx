import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { StartupSubmissionModal } from "@/components/startup/StartupSubmissionModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOut, getUserProfile } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { User, LogOut, Plus } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { UserProfile } from "@/lib/auth";

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showStartupModal, setShowStartupModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch with setTimeout to avoid deadlock
          setTimeout(() => {
            getUserProfile(session.user.id).then(setProfile);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          getUserProfile(session.user.id).then(setProfile);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setProfile(null);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo + Navigation */}
          <div className="flex items-center gap-12">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 text-xl font-light text-foreground hover:text-primary transition-all duration-300 group"
            >
              <span className="text-primary font-medium">Know</span>
              <span className="font-light">Founders</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link 
                to="/explore" 
                className="text-muted-foreground hover:text-foreground transition-all duration-300 relative group text-sm font-medium"
              >
                Explore
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/blog" 
                className="text-muted-foreground hover:text-foreground transition-all duration-300 relative group text-sm font-medium"
              >
                Resources
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/dashboard" 
                className="text-muted-foreground hover:text-foreground transition-all duration-300 relative group text-sm font-medium"
              >
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Right Section: Auth */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button 
                  onClick={() => setShowStartupModal(true)}
                  className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 hover:border-primary transition-all duration-300 rounded-full px-4 py-2 h-9 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Startup
                </Button>
                
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-muted/50 transition-all duration-300">
                    <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-300">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-md border border-border/50" align="end">
                  <div className="flex items-center justify-start gap-3 p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm text-foreground">{profile?.full_name || "User"}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem asChild className="hover:bg-muted/50 transition-colors duration-200">
                    <Link to="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="hover:bg-muted/50 transition-colors duration-200 text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <AuthModal defaultTab="signin">
                  <Button 
                    variant="ghost" 
                    className="text-muted-foreground hover:text-foreground transition-all duration-300 text-sm font-medium px-4 py-2 h-9"
                  >
                    Sign In
                  </Button>
                </AuthModal>
                <AuthModal defaultTab="signup">
                  <Button className="px-6 py-2 h-9 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 rounded-full text-sm font-medium shadow-sm hover:shadow-primary/25">
                    Join the Movement
                  </Button>
                </AuthModal>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <StartupSubmissionModal 
        open={showStartupModal}
        onOpenChange={setShowStartupModal}
        onSuccess={() => {
          // Optionally refresh user data or navigate somewhere
        }}
      />
    </nav>
  );
}
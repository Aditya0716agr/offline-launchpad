import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { AddStartupModal } from "@/components/startup/AddStartupModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getCurrentUser, signOut, getUserProfile } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { User, LogOut, Settings, Plus } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { UserProfile } from "@/lib/auth";

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showAddStartupModal, setShowAddStartupModal] = useState(false);
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
    <nav className="header-shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-xl font-bold text-foreground hover:text-primary transition-colors">
            <span className="text-primary">Know</span>Founders
            <span className="text-xs bg-primary/15 text-primary px-2 py-1 rounded-full font-medium">Early Access</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-12">
            <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
              Explore
            </Link>
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {profile?.role === 'founder' && (
                  <Button 
                    onClick={() => setShowAddStartupModal(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Startup
                  </Button>
                )}
                
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback className="text-sm">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{profile?.full_name || "User"}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <AuthModal defaultTab="signin">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                </AuthModal>
                <AuthModal defaultTab="signup">
                  <Button className="px-6 bg-gradient-primary hover:opacity-90">
                    Get Early Access
                  </Button>
                </AuthModal>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AddStartupModal 
        open={showAddStartupModal}
        onOpenChange={setShowAddStartupModal}
        onSuccess={() => {
          // Optionally refresh user data or navigate somewhere
        }}
      />
    </nav>
  );
}
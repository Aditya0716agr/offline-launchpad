import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Eye, Heart, MessageSquare, Settings, BarChart3, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddStartupModal } from "@/components/startup/AddStartupModal";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { UserBookmarksTab } from "@/components/startup/UserBookmarksTab";
import { UserVotesTab } from "@/components/startup/UserVotesTab";

interface UserProfile {
  id: string;
  role: string;
  full_name: string | null;
}

interface Startup {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  status: string;
  view_count: number;
  votes?: { id: string }[];
  comments?: { id: string }[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddStartupModal, setShowAddStartupModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    const initUser = async () => {
      console.log('Initializing user...');
      
      // First, try to get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Session check:', { session: !!session, error: sessionError });
      
      if (session?.user) {
        console.log('User found in session:', session.user.email);
        setUser(session.user);
        await checkUser(session.user);
        return;
      }
      
      // If no session, try to get user directly
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('Direct user check:', { user: !!user, error: userError });
      
      if (user) {
        console.log('User found directly:', user.email);
        setUser(user);
        await checkUser(user);
      } else {
        console.log('No user found, redirecting to home');
        setLoading(false);
        // Redirect to home if no user
        navigate('/');
      }
    };
    
    initUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        if (session?.user) {
          setUser(session.user);
          await checkUser(session.user);
        } else {
          setUser(null);
          setProfile(null);
          setStartups([]);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUser = async (userToCheck = user) => {
    try {
      if (!userToCheck) {
        console.log('No user found, setting loading to false');
        setLoading(false);
        return;
      }

      console.log('Checking profile for user:', userToCheck.email);

      // Get user profile with retry logic
      let profileData = null;
      let profileError = null;
      
      // Try multiple times to get the profile
      for (let attempt = 1; attempt <= 3; attempt++) {
        console.log(`Profile check attempt ${attempt}/3`);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userToCheck.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error(`Profile check attempt ${attempt} failed:`, error);
          profileError = error;
          if (attempt < 3) {
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
        } else if (error && error.code === 'PGRST116') {
          console.log(`Profile not found on attempt ${attempt}`);
          profileError = error;
          break;
        } else {
          console.log(`Profile found on attempt ${attempt}:`, data);
          profileData = data;
          profileError = null;
          break;
        }
      }

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }
      
      // If no profile exists, create one automatically
      if (!profileData) {
        console.log('No profile found, creating one automatically...');
        
        try {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              user_id: userToCheck.id,
              full_name: userToCheck.user_metadata?.full_name || userToCheck.email,
              role: 'user'
            })
            .select()
            .single();
          
        if (createError) {
            console.error('Failed to create profile:', createError);
            // Don't throw error, just set loading to false so user can see the message
            setLoading(false);
            return;
          } else {
            setProfile(newProfile);
            console.log('Profile created successfully:', newProfile);
            profileData = newProfile;
          }
        } catch (error) {
          console.error('Profile creation failed:', error);
          setLoading(false);
          return;
        }
      } else {
        setProfile(profileData);
        console.log('Profile loaded successfully:', profileData);
      }

      // Get user's startups
      if (profileData) {
        const { data: startupsData, error: startupsError } = await supabase
          .from('startups')
          .select(`
            *,
            votes (id),
            comments (id)
          `)
          .eq('founder_id', profileData.id)
          .order('created_at', { ascending: false });

        if (startupsError) {
          console.error('Error fetching startups:', startupsError);
        } else {
          setStartups(startupsData || []);
          console.log('Startups loaded:', startupsData?.length || 0);
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-medium text-foreground mb-4">
            Loading dashboard...
          </h1>
            </div>
          </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-medium text-foreground mb-4">
            Please sign in to access your dashboard
          </h1>
          <Button onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-medium text-foreground mb-4">
            Profile Setup Required
          </h1>
          <p className="text-muted-foreground mb-6">
            We need to create your profile to access the dashboard.
          </p>
          <div className="flex flex-col gap-4 items-center max-w-md mx-auto">
            <Button 
              onClick={async () => {
                try {
                  if (!user) return;
                  
                  console.log('Creating profile manually...');
                  const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert({
                      user_id: user.id,
                      full_name: user.email,
                      role: 'user'
                    })
                    .select()
                    .single();

                  if (createError) {
                    console.error('Profile creation failed:', createError);
                    toast({
                      title: "Error",
                      description: "Failed to create profile. Please try the SQL fix.",
                      variant: "destructive",
                    });
                  } else {
                    console.log('Profile created:', newProfile);
                    setProfile(newProfile);
                    toast({
                      title: "Success",
                      description: "Profile created successfully!",
                    });
                  }
                } catch (error) {
                  console.error('Error:', error);
                  toast({
                    title: "Error",
                    description: "An error occurred. Please try the SQL fix.",
                    variant: "destructive",
                  });
                }
              }}
              className="w-full"
            >
              Create My Profile
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Refresh Page
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
            Go Home
          </Button>
            <Button 
              variant="secondary" 
              onClick={() => {
                // Create a temporary profile object to bypass the check
                const tempProfile = {
                  id: user.id,
                  role: 'user',
                  full_name: user.email
                };
                setProfile(tempProfile);
                toast({
                  title: "Temporary Access",
                  description: "Using temporary profile. Some features may be limited.",
                });
              }}
              className="w-full"
            >
              Continue Without Profile (Temporary)
            </Button>
            <div className="mt-6 p-4 bg-muted/50 rounded-lg text-left">
              <h3 className="font-medium mb-2">If nothing works:</h3>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Go to Supabase Dashboard → SQL Editor</li>
                <li>2. Run the complete-dashboard-fix.sql script</li>
                <li>3. Refresh this page</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-start justify-between mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-semibold text-foreground tracking-tight">
                Welcome back{profile.full_name && !profile.full_name.includes('@') ? `, ${profile.full_name}` : ''}
              </h1>
              {(profile as any).is_founding_member && (
                <Badge variant="default" className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 shadow-lg shadow-amber-500/30">
                  <span className="mr-2">🎖</span>
                  Founding Member
                </Badge>
              )}
            </div>
            <p className="text-base text-muted-foreground">
              Your KnowFounders dashboard - manage your startups and connect with the community
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
              onClick={() => setShowEditProfile(true)}
            >
              <User className="w-5 h-5" />
              Update My Details
            </Button>
            <Button 
              size="lg"
              className="flex items-center gap-2 shadow-lg"
              onClick={() => setShowAddStartupModal(true)}
            >
              <Plus className="w-5 h-5" />
              Add Startup
            </Button>
          </div>
        </div>

          <Tabs defaultValue="startups" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="startups">My Startups</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            <TabsTrigger value="votes">Votes</TabsTrigger>
            </TabsList>

            <TabsContent value="startups" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-0 shadow-none bg-accent/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Startups</p>
                        <p className="text-2xl font-medium">{startups.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-none bg-accent/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Eye className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Views</p>
                        <p className="text-2xl font-medium">
                          {startups.reduce((sum, startup) => sum + startup.view_count, 0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-none bg-accent/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Heart className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Approved</p>
                        <p className="text-2xl font-medium">
                          {startups.filter(s => s.status === 'approved').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-none bg-accent/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-2xl font-medium">
                          {startups.filter(s => s.status === 'pending').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Startups List */}
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-foreground">Your Startups</h2>
                
                {startups.length === 0 ? (
                  <Card className="border-0 shadow-none bg-accent/5">
                    <CardContent className="p-8 text-center">
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        No startups yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Ready to showcase your startup to the world?
                      </p>
                      <Button onClick={() => setShowAddStartupModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Startup
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {startups.map((startup) => (
                      <Card key={startup.id} className="border-0 shadow-none">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                              {startup.logo_url ? (
                                <img 
                                  src={startup.logo_url} 
                                  alt={startup.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                  <span className="text-primary font-semibold text-sm">
                                    {startup.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-medium text-foreground">
                                  {startup.name}
                                </h3>
                                <Badge variant={startup.status === 'approved' ? 'default' : 'secondary'}>
                                  {startup.status}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                {startup.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {startup.view_count} views
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="w-4 h-4" />
                                  {startup.votes?.length || 0} votes
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="w-4 h-4" />
                                  {startup.comments?.length || 0} comments
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/startup/${startup.id}`)}
                                >
                                  View
                                </Button>
                          </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

          <TabsContent value="bookmarks">
            <UserBookmarksTab userProfile={profile} />
            </TabsContent>

          <TabsContent value="votes">
            <UserVotesTab userProfile={profile} />
              </TabsContent>
            </Tabs>
      </div>

      <AddStartupModal 
        open={showAddStartupModal}
        onOpenChange={setShowAddStartupModal}
        onSuccess={() => checkUser()}
      />

      {profile && showEditProfile && (
        <EditProfileModal 
          open={showEditProfile}
          onOpenChange={setShowEditProfile}
          profile={profile}
          onSuccess={() => checkUser()}
        />
      )}
    </div>
  );
};

export default Dashboard;
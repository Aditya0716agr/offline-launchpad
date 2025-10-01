import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Eye, Heart, MessageSquare, Settings, BarChart3 } from "lucide-react";
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
  status: string;
  view_count: number;
  created_at: string;
  categories: {
    name: string;
  } | null;
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
  const [roleUpdateLoading, setRoleUpdateLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate('/');
        }
      }
    );

    checkUser();

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      setUser(user);

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile error:', profileError);
        throw profileError;
      }
      
      if (!profileData) {
        // Create profile if it doesn't exist
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
          console.error('Error creating profile:', createError);
          throw createError;
        }
        
        setProfile(newProfile);
      } else {
        setProfile(profileData);
      }

      // If user is a founder, fetch their startups
      if (profileData.role === 'founder') {
        const { data: startupsData, error: startupsError } = await supabase
          .from('startups')
          .select(`
            *,
            categories (name)
          `)
          .eq('founder_id', profileData.id)
          .order('created_at', { ascending: false });

        if (startupsError) {
          console.error('Startups error:', startupsError);
          throw startupsError;
        }
        setStartups(startupsData || []);
      }
    } catch (error: any) {
      console.error('Dashboard error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (newRole: string) => {
    setRoleUpdateLoading(true);
    try {
      if (!profile) return;

      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', (profile as any).user_id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Role updated to ${newRole} successfully!`,
      });

      // Refresh the profile data
      await checkUser();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      });
    } finally {
      setRoleUpdateLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
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
            Unable to load dashboard
          </h1>
          <Button onClick={() => navigate('/')}>
            Go Home
          </Button>
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
              {profile.role === 'founder' ? 'Manage your startup listings and track your performance' : 'Your KnowFounders dashboard'}
            </p>
          </div>
          
          {profile.role === 'founder' && (
            <Button 
              size="lg"
              className="flex items-center gap-2 shadow-lg"
              onClick={() => setShowAddStartupModal(true)}
            >
              <Plus className="w-5 h-5" />
              Add Startup
            </Button>
          )}
        </div>

        {profile.role === 'founder' ? (
          <Tabs defaultValue="startups" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="startups">My Startups</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
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
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-medium text-foreground">
                                  {startup.name}
                                </h3>
                                <Badge variant={getStatusColor(startup.status)}>
                                  {startup.status}
                                </Badge>
                                {startup.categories && (
                                  <Badge variant="outline">
                                    {startup.categories.name}
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-muted-foreground mb-4 line-clamp-2">
                                {startup.description}
                              </p>
                              
                              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {startup.view_count} views
                                </div>
                                <div>
                                  Listed {new Date(startup.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              {startup.status === 'approved' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/startup/${startup.id}`)}
                                >
                                  View
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4" />
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

            <TabsContent value="analytics">
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle>Analytics Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Detailed analytics and insights coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Profile and account management coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          // Regular user dashboard
          <div className="space-y-6">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">My Profile</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
                <TabsTrigger value="voted">Upvoted</TabsTrigger>
                <TabsTrigger value="discover">Discover</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium text-foreground">Profile Information</h2>
                  <Button 
                    variant="outline"
                    onClick={() => setShowEditProfile(true)}
                  >
                    Edit Profile
                  </Button>
                </div>

                <Card className="border-0 shadow-none">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Full Name</h3>
                          <p className="text-foreground">{profile.full_name || 'Not provided'}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                          <p className="text-foreground">{user?.email}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
                          <p className="text-foreground">{(profile as any).location || 'Not provided'}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Designation</h3>
                          <p className="text-foreground">{(profile as any).designation || 'Not provided'}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Company</h3>
                          <p className="text-foreground">{(profile as any).company || 'Not provided'}</p>
                        </div>
                      </div>

                      {/* Links & Social */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Bio</h3>
                          <p className="text-foreground">{(profile as any).bio || 'No bio provided'}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Links</h3>
                          <div className="space-y-2">
                            {(profile as any).website_url && (
                              <div>
                                <span className="text-sm text-muted-foreground">Website: </span>
                                <a 
                                  href={(profile as any).website_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {(profile as any).website_url}
                                </a>
                              </div>
                            )}
                            
                            {(profile as any).linkedin_url && (
                              <div>
                                <span className="text-sm text-muted-foreground">LinkedIn: </span>
                                <a 
                                  href={(profile as any).linkedin_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  View Profile
                                </a>
                              </div>
                            )}
                            
                            {(profile as any).github_url && (
                              <div>
                                <span className="text-sm text-muted-foreground">GitHub: </span>
                                <a 
                                  href={(profile as any).github_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  View Profile
                                </a>
                              </div>
                            )}
                            
                            {(profile as any).twitter_url && (
                              <div>
                                <span className="text-sm text-muted-foreground">Twitter: </span>
                                <a 
                                  href={(profile as any).twitter_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  View Profile
                                </a>
                              </div>
                            )}
                            
                            {!(profile as any).website_url && !(profile as any).linkedin_url && !(profile as any).github_url && !(profile as any).twitter_url && (
                              <p className="text-muted-foreground text-sm">No links added yet</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="saved">
                <UserBookmarksTab userProfile={profile} />
              </TabsContent>

              <TabsContent value="voted">
                <UserVotesTab userProfile={profile} />
              </TabsContent>

              <TabsContent value="discover">
                <div className="space-y-6">
                  <Card className="border-0 shadow-none bg-accent/5">
                    <CardContent className="p-8 text-center">
                      <h2 className="text-xl font-medium text-foreground mb-2">
                        Discover Amazing Startups
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        Explore innovative local businesses and support entrepreneurs in your area
                      </p>
                      <Button onClick={() => navigate('/explore')}>
                        Start Exploring
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-none">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-foreground mb-2">
                            Are you a startup founder?
                          </h3>
                          <p className="text-muted-foreground">
                            Switch to founder mode to list your startup and connect with the community.
                          </p>
                        </div>
                        <Button
                          onClick={() => updateUserRole('founder')}
                          disabled={roleUpdateLoading}
                        >
                          {roleUpdateLoading ? 'Switching...' : 'Become a Founder'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
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
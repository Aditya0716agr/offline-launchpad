import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import { trackStartupSubmission } from "@/lib/analytics";

const quickStartupSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be 50 characters or less"),
  description: z.string().min(1, "Description is required").max(500, "Description must be 500 characters or less"),
  category_id: z.string().min(1, "Category is required"),
  city: z.string().min(1, "City is required"),
  email_contact: z.string().email("Invalid email address"),
});

type QuickStartupData = z.infer<typeof quickStartupSchema>;

interface Category {
  id: string;
  name: string;
}

interface QuickStartupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const QuickStartupModal = ({ open, onOpenChange, onSuccess }: QuickStartupModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<QuickStartupData>({
    resolver: zodResolver(quickStartupSchema),
  });

  // Fetch categories when modal opens
  React.useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }

    setCategories(data || []);
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });

      if (error) {
        if (error.message.includes('Bucket not found')) {
          throw new Error(`Storage bucket '${bucket}' not found. Please contact support to set up storage buckets.`);
        }
        throw error;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error: any) {
      console.error(`Upload error for bucket ${bucket}:`, error);
      throw error;
    }
  };

  const onSubmit = async (data: QuickStartupData) => {
    setLoading(true);

    try {
      // Get current user profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      // Generate unique slug
      const slug = `${data.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')}-${Date.now()}`;

      let logoUrl = null;
      if (logoFile) {
        // Upload logo
        const logoPath = `${profile.id}/${Date.now()}-logo-${logoFile.name}`;
        logoUrl = await uploadFile(logoFile, 'startup-logos', logoPath);
      }

      // Create startup record with minimal required fields
      const { error: insertError } = await supabase
        .from('startups')
        .insert({
          name: data.name,
          description: data.description,
          category_id: data.category_id,
          city: data.city,
          email_contact: data.email_contact,
          logo_url: logoUrl,
          slug,
          founder_id: profile.id,
          status: 'pending',
          // Set default values for required fields
          tagline: data.description.substring(0, 100),
          state_region: 'India',
          location: `${data.city}, India`,
          team_size: '1',
          stage: 'idea',
          looking_for: ['feedback'],
        });

      if (insertError) throw insertError;

      // Track startup submission
      const categoryName = categories.find(cat => cat.id === data.category_id)?.name || 'Unknown';
      trackStartupSubmission(data.name, categoryName);

      toast({
        title: "Startup Submitted!",
        description: "Your startup has been submitted for review. You can complete your profile later.",
      });

      form.reset();
      setLogoFile(null);
      onOpenChange(false);
      onSuccess?.();

    } catch (error: any) {
      console.error('Error submitting startup:', error);
      
      let errorMessage = "Failed to submit startup. Please try again.";
      
      if (error.message.includes('Bucket not found')) {
        errorMessage = "Storage buckets not configured. Please contact support at hertofhelp@gmail.com";
      } else if (error.message.includes('Not authenticated')) {
        errorMessage = "Please sign in to submit a startup.";
      } else if (error.message.includes('Profile not found')) {
        errorMessage = "Please complete your profile first.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setLogoFile(files[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick Startup Submission</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Get started in 2 minutes! Add your startup name, description, and a photo. 
            You can complete your full profile later.
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Startup Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your startup name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about your startup in a few sentences..."
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email_contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Contact *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@yourstartup.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Logo Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-medium">Startup Logo (Optional)</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                {logoFile ? (
                  <div className="space-y-2">
                    <img 
                      src={URL.createObjectURL(logoFile)} 
                      alt="Logo preview" 
                      className="w-20 h-20 object-cover mx-auto rounded"
                    />
                    <p className="text-sm text-muted-foreground">{logoFile.name}</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setLogoFile(null)}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="hidden" 
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <span>Upload Logo</span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Save & Finish Later"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

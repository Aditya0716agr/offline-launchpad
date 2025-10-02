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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Calendar } from "lucide-react";
import { trackStartupSubmission } from "@/lib/analytics";

const startupSchema = z.object({
  // Basic Information
  name: z.string().min(1, "Startup name is required").max(100, "Name must be 100 characters or less"),
  tagline: z.string().min(1, "Tagline is required").max(200, "Tagline must be 200 characters or less"),
  description: z.string().min(1, "Description is required").max(2000, "Description must be 2000 characters or less"),
  category_id: z.string().min(1, "Category is required"),
  
  // Website & Contact
  website_url: z.string().url("Invalid website URL").optional().or(z.literal("")),
  whatsapp_number: z.string().optional(),
  
  // Location & Contact
  city: z.string().min(1, "City is required"),
  state_region: z.string().min(1, "State/Region is required"),
  full_address: z.string().optional(),
  email_contact: z.string().email("Invalid email address"),
  phone_number: z.string().optional(),
  
  // Social Links
  instagram_url: z.string().url("Invalid Instagram URL").optional().or(z.literal("")),
  facebook_url: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
  linkedin_url: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  twitter_url: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
  
  // Business Details
  founded_date: z.string().optional(),
  team_size: z.string().min(1, "Team size is required"),
  stage: z.string().min(1, "Stage is required"),
  looking_for: z.array(z.string()).min(1, "Please select at least one option"),
});

type StartupData = z.infer<typeof startupSchema>;

interface Category {
  id: string;
  name: string;
}

interface StartupSubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const StartupSubmissionModal = ({ open, onOpenChange, onSuccess }: StartupSubmissionModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<StartupData>({
    resolver: zodResolver(startupSchema),
    defaultValues: {
      looking_for: [],
    },
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
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const onSubmit = async (data: StartupData) => {
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

      // Upload files
      let logoUrl = null;
      let coverUrl = null;
      const galleryUrls: string[] = [];

      if (logoFile) {
        const logoPath = `${profile.id}/${Date.now()}-logo-${logoFile.name}`;
        logoUrl = await uploadFile(logoFile, 'startup-logos', logoPath);
      }

      if (coverFile) {
        const coverPath = `${profile.id}/${Date.now()}-cover-${coverFile.name}`;
        coverUrl = await uploadFile(coverFile, 'startup-covers', coverPath);
      }

      // Upload gallery images
      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i];
        const galleryPath = `${profile.id}/${Date.now()}-gallery-${i}-${file.name}`;
        const url = await uploadFile(file, 'startup-gallery', galleryPath);
        galleryUrls.push(url);
      }

      // Create startup record
      const startupData = {
        name: data.name,
        tagline: data.tagline,
        description: data.description,
        category_id: data.category_id,
        website_url: data.website_url || null,
        whatsapp_link: data.whatsapp_number || null,
        city: data.city,
        state_region: data.state_region,
        full_address: data.full_address || null,
        location: `${data.city}, ${data.state_region}`,
        email_contact: data.email_contact,
        phone_number: data.phone_number || null,
        social_instagram: data.instagram_url || null,
        social_facebook: data.facebook_url || null,
        social_linkedin: data.linkedin_url || null,
        social_twitter: data.twitter_url || null,
        launch_date: data.founded_date || null,
        team_size: data.team_size,
        stage: data.stage,
        looking_for: data.looking_for,
        logo_url: logoUrl,
        cover_image_url: coverUrl,
        gallery_images: galleryUrls.length > 0 ? galleryUrls : null,
        slug,
        founder_id: profile.id,
        status: 'pending',
      };

      const { error: insertError } = await supabase
        .from('startups')
        .insert(startupData);

      if (insertError) throw insertError;

      // Track startup submission
      const categoryName = categories.find(cat => cat.id === data.category_id)?.name || 'Unknown';
      trackStartupSubmission(data.name, categoryName);

      toast({
        title: "Startup Submitted Successfully!",
        description: "Your startup has been submitted for review. We'll notify you once it's approved.",
      });

      // Reset form
      form.reset();
      setLogoFile(null);
      setCoverFile(null);
      setGalleryFiles([]);
      onOpenChange(false);
      onSuccess?.();

    } catch (error: any) {
      console.error('Error submitting startup:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit startup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover' | 'gallery') => {
    const files = e.target.files;
    if (!files) return;

    if (type === 'logo') {
      setLogoFile(files[0]);
    } else if (type === 'cover') {
      setCoverFile(files[0]);
    } else if (type === 'gallery') {
      const newFiles = Array.from(files).slice(0, 5); // Limit to 5 files
      setGalleryFiles(prev => [...prev, ...newFiles].slice(0, 5)); // Keep only 5 total
    }
  };

  const removeGalleryFile = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const lookingForOptions = [
    { value: 'customers', label: 'Customers' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'investors', label: 'Investors' },
    { value: 'partners', label: 'Partners' },
    { value: 'team', label: 'Team' },
  ];

  const teamSizeOptions = [
    { value: '1', label: 'Just me' },
    { value: '2-5', label: '2-5 people' },
    { value: '6-10', label: '6-10 people' },
    { value: '11-20', label: '11-20 people' },
    { value: '21-50', label: '21-50 people' },
    { value: '50+', label: '50+ people' },
  ];

  const stageOptions = [
    { value: 'idea', label: 'Idea Stage' },
    { value: 'mvp', label: 'MVP' },
    { value: 'early', label: 'Early Stage' },
    { value: 'growth', label: 'Growth Stage' },
    { value: 'scale', label: 'Scale Stage' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Submit Your Startup</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
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
                name="tagline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagline *</FormLabel>
                    <FormControl>
                      <Input placeholder="One-line description of your startup" {...field} />
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
                    <FormLabel>Full Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about your startup..."
                        rows={4}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="website_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourwebsite.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsapp_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Visual Assets */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Visual Assets</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Logo * (Square format recommended)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {logoFile ? (
                      <div className="space-y-2">
                        <img 
                          src={URL.createObjectURL(logoFile)} 
                          alt="Logo preview" 
                          className="w-16 h-16 object-cover mx-auto rounded"
                        />
                        <p className="text-sm text-gray-600">{logoFile.name}</p>
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
                        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileChange(e, 'logo')}
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

                {/* Cover Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Cover Image * (Banner/Hero image)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {coverFile ? (
                      <div className="space-y-2">
                        <img 
                          src={URL.createObjectURL(coverFile)} 
                          alt="Cover preview" 
                          className="w-full h-20 object-cover mx-auto rounded"
                        />
                        <p className="text-sm text-gray-600">{coverFile.name}</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCoverFile(null)}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileChange(e, 'cover')}
                          className="hidden" 
                          id="cover-upload"
                        />
                        <label htmlFor="cover-upload" className="cursor-pointer">
                          <Button type="button" variant="outline" asChild>
                            <span>Upload Cover</span>
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery Images */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Gallery Images (Up to 5 additional photos)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {galleryFiles.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {galleryFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`Gallery ${index + 1}`} 
                            className="w-full h-20 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => removeGalleryFile(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {galleryFiles.length < 5 && (
                    <div className="text-center">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        onChange={(e) => handleFileChange(e, 'gallery')}
                        className="hidden" 
                        id="gallery-upload"
                      />
                      <label htmlFor="gallery-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild>
                          <span>Add Images</span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location & Contact */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Location & Contact</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  name="state_region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Region *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your state or region" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="full_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Complete address for map display" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="instagram_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input placeholder="https://instagram.com/yourstartup" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facebook_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input placeholder="https://facebook.com/yourstartup" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedin_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/company/yourstartup" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitter_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input placeholder="https://twitter.com/yourstartup" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Business Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Business Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="founded_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Founded Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="team_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Size *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select team size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teamSizeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select current stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {stageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="looking_for"
                render={() => (
                  <FormItem>
                    <FormLabel>Looking For * (Select all that apply)</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {lookingForOptions.map((option) => (
                        <FormField
                          key={option.value}
                          control={form.control}
                          name="looking_for"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, option.value])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.value
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                {loading ? "Submitting..." : "Submit Startup"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

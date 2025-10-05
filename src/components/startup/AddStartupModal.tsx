import { useState, useEffect } from "react";
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const startupFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be 50 characters or less"),
  tagline: z.string().min(1, "Tagline is required").max(100, "Tagline must be 100 characters or less"),
  description: z.string().min(1, "Description is required").max(5000, "Description must be 5000 characters or less"),
  category_id: z.string().min(1, "Category is required"),
  website_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  whatsapp_link: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state_region: z.string().min(1, "State/Region is required"),
  full_address: z.string().optional(),
  email_contact: z.string().email("Invalid email address"),
  phone_number: z.string().optional(),
  social_instagram: z.string().optional(),
  social_facebook: z.string().optional(),
  social_linkedin: z.string().optional(),
  social_twitter: z.string().optional(),
  team_size: z.string().min(1, "Team size is required"),
  stage: z.string().min(1, "Stage is required"),
  looking_for: z.array(z.string()).min(1, "Please select at least one option"),
  launch_date: z.date().optional(),
});

type StartupFormData = z.infer<typeof startupFormSchema>;

interface Category {
  id: string;
  name: string;
}

interface AddStartupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const teamSizeOptions = [
  { value: "1", label: "1" },
  { value: "2-5", label: "2-5" },
  { value: "6-10", label: "6-10" },
  { value: "11-25", label: "11-25" },
  { value: "25+", label: "25+" },
];

const stageOptions = [
  { value: "idea", label: "Idea" },
  { value: "mvp", label: "MVP" },
  { value: "early_revenue", label: "Early Revenue" },
  { value: "growth", label: "Growth" },
  { value: "established", label: "Established" },
];

const lookingForOptions = [
  { value: "customers", label: "Customers" },
  { value: "feedback", label: "Feedback" },
  { value: "investors", label: "Investors" },
  { value: "partners", label: "Partners" },
  { value: "team", label: "Team" },
];

export const AddStartupModal = ({ open, onOpenChange, onSuccess }: AddStartupModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<StartupFormData>({
    resolver: zodResolver(startupFormSchema),
    defaultValues: {
      looking_for: [],
    },
  });

  useEffect(() => {
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

  const onSubmit = async (data: StartupFormData) => {
    if (!logoFile) {
      toast({
        title: "Logo Required",
        description: "Please upload a logo for your startup",
        variant: "destructive",
      });
      return;
    }

    if (!coverFile) {
      toast({
        title: "Cover Image Required", 
        description: "Please upload a cover image for your startup",
        variant: "destructive",
      });
      return;
    }

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

      // Upload logo
      const logoPath = `${profile.id}/${Date.now()}-logo-${logoFile.name}`;
      const logoUrl = await uploadFile(logoFile, 'startup-logos', logoPath);

      // Upload cover image
      const coverPath = `${profile.id}/${Date.now()}-cover-${coverFile.name}`;
      const coverUrl = await uploadFile(coverFile, 'startup-covers', coverPath);

      // Upload gallery images
      const galleryUrls: string[] = [];
      for (const file of galleryFiles) {
        const galleryPath = `${profile.id}/${Date.now()}-gallery-${file.name}`;
        const galleryUrl = await uploadFile(file, 'startup-gallery', galleryPath);
        galleryUrls.push(galleryUrl);
      }

      // Create startup record
      const { error: insertError } = await supabase
        .from('startups')
        .insert({
          name: data.name,
          tagline: data.tagline,
          description: data.description,
          category_id: data.category_id,
          website_url: data.website_url || null,
          whatsapp_link: data.whatsapp_link || null,
          city: data.city,
          state_region: data.state_region,
          full_address: data.full_address || null,
          email_contact: data.email_contact,
          phone_number: data.phone_number || null,
          social_instagram: data.social_instagram || null,
          social_facebook: data.social_facebook || null,
          social_linkedin: data.social_linkedin || null,
          social_twitter: data.social_twitter || null,
          team_size: data.team_size,
          stage: data.stage,
          looking_for: data.looking_for,
          launch_date: data.launch_date ? data.launch_date.toISOString().split('T')[0] : null,
          logo_url: logoUrl,
          cover_image_url: coverUrl,
          gallery_images: galleryUrls,
          slug,
          founder_id: profile.id,
          status: 'pending',
        });

      if (insertError) throw insertError;

      toast({
        title: "Startup Submitted!",
        description: "Your startup has been submitted for review. You'll be notified once it's approved.",
      });

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
        description: error.message || "Failed to submit startup",
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
      const newFiles = Array.from(files);
      setGalleryFiles(prev => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Your Startup</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
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
                        rows={6}
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
                  name="whatsapp_link"
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
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Visual Assets</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Logo * (Square format recommended)</label>
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

                <div>
                  <label className="block text-sm font-medium mb-2">Cover Image * (Banner/Hero image)</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    {coverFile ? (
                      <div className="space-y-2">
                        <img 
                          src={URL.createObjectURL(coverFile)} 
                          alt="Cover preview" 
                          className="w-full h-20 object-cover rounded"
                        />
                        <p className="text-sm text-muted-foreground">{coverFile.name}</p>
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
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
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

              <div>
                <label className="block text-sm font-medium mb-2">Gallery Images (Up to 5 additional photos)</label>
                <div className="space-y-2">
                  {galleryFiles.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                      {galleryFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-16 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 w-6 h-6 p-0"
                            onClick={() => removeGalleryImage(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {galleryFiles.length < 5 && (
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        onChange={(e) => handleFileChange(e, 'gallery')}
                        className="hidden" 
                        id="gallery-upload"
                      />
                      <label htmlFor="gallery-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span>Add Images</span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location & Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Location & Contact</h3>
              
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

              <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Links</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="social_instagram"
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
                  name="social_facebook"
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
                  name="social_linkedin"
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
                  name="social_twitter"
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
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Business Details</h3>
              
              <FormField
                control={form.control}
                name="launch_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Founded Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "MMMM yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <FormField
                control={form.control}
                name="looking_for"
                render={() => (
                  <FormItem>
                    <FormLabel>Looking For * (Select all that apply)</FormLabel>
                    <div className="grid grid-cols-3 gap-4">
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
                                <FormLabel className="font-normal">
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
                {loading ? "Submitting..." : "Submit Startup"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
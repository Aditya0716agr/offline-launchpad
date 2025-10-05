import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact KnowFounders - Get in Touch | Support & Partnerships"
        description="Contact KnowFounders for support, partnerships, or feedback. We're here to help non-tech entrepreneurs succeed. Reach out to us via email or contact form."
        keywords="contact knowfounders, startup support, entrepreneur help, business partnership, startup platform contact, founder support"
        url="https://knowfounders.com/contact"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-background via-muted/10 to-primary/5">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight tracking-tight">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Have questions about KnowFounders? Want to partner with us? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 border-t border-border">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Email Us</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Send us an email and we'll respond within 24 hours
              </p>
              <a 
                href="mailto:hertofhelp@gmail.com" 
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                hertofhelp@gmail.com
              </a>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Location</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Based in India, serving entrepreneurs globally
              </p>
              <p className="text-muted-foreground font-medium">India</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Response Time</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We typically respond within 24 hours during business days
              </p>
              <p className="text-muted-foreground font-medium">24 Hours</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 border-t border-border bg-muted/20">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-foreground mb-4 leading-tight">
              Send us a Message
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Fill out the form below and we'll get back to you as soon as possible
            </p>
          </div>

          <Card className="p-8">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 border-t border-border">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-foreground mb-4 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Quick answers to common questions about KnowFounders
            </p>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-3">How do I list my startup on KnowFounders?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Simply sign up for an account, complete your profile, and use our startup submission form to add your business. 
                Make sure to provide detailed information about your product or service.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-3">Is KnowFounders free to use?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes, KnowFounders is completely free for founders to list their startups and for users to discover new businesses. 
                We may introduce premium features in the future, but basic functionality will always remain free.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-3">What types of startups can be listed?</h3>
              <p className="text-muted-foreground leading-relaxed">
                We focus on non-tech startups including food & beverage, retail & fashion, wellness & health, 
                artisan goods, local services, and physical products. If you're unsure if your startup fits, 
                feel free to contact us.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-3">How can I get featured on the homepage?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Featured startups are selected based on community engagement, quality of content, and overall traction. 
                Founding members get priority placement. Focus on creating compelling content and engaging with the community.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-3">Can I partner with KnowFounders?</h3>
              <p className="text-muted-foreground leading-relaxed">
                We're always interested in partnerships that benefit our community of founders. 
                Whether you're an investor, accelerator, or service provider, reach out to us to discuss potential collaborations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;

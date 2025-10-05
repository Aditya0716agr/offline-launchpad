import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <Card className="border-0 shadow-none">
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using KnowFounders, you agree to be bound by these Terms of Service and all 
                applicable laws and regulations. If you do not agree with any of these terms, you are prohibited 
                from using or accessing this platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Platform Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                KnowFounders is a platform designed to connect local communities with innovative non-tech startups. 
                We provide a space for founders to showcase their businesses and for community members to discover, 
                support, and engage with local entrepreneurs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">User Accounts</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>When you create an account with us, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
                <p className="mt-4">
                  We reserve the right to suspend or terminate accounts that violate these terms or engage in 
                  fraudulent, abusive, or illegal activities.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">User Content</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>By submitting content to KnowFounders, you:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Retain ownership of your content</li>
                  <li>Grant us a non-exclusive, worldwide license to use, display, and distribute your content</li>
                  <li>Warrant that you have the right to post the content</li>
                  <li>Agree that your content does not violate any third-party rights</li>
                  <li>Accept that your public content may be viewed by other users</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Prohibited Activities</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Post false, misleading, or fraudulent information</li>
                  <li>Impersonate any person or entity</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Spam or send unsolicited messages</li>
                  <li>Attempt to gain unauthorized access to the platform</li>
                  <li>Use automated systems to access the platform without permission</li>
                  <li>Interfere with the proper functioning of the platform</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Founding Member Benefits</h2>
              <p className="text-muted-foreground leading-relaxed">
                Founding Members receive special recognition and benefits on the platform. These benefits are 
                provided as a courtesy and may be modified or discontinued at any time. Founding Member status 
                is non-transferable and subject to compliance with these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The KnowFounders platform, including its design, features, and functionality, is owned by 
                KnowFounders and protected by international copyright, trademark, and other intellectual property 
                laws. You may not copy, modify, distribute, or reverse engineer any part of the platform without 
                our explicit permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                The platform is provided "as is" and "as available" without warranties of any kind, either express 
                or implied. We do not guarantee that the platform will be uninterrupted, secure, or error-free. 
                We are not responsible for the accuracy or reliability of user-generated content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, KnowFounders shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages arising from your use of the platform. 
                Our total liability shall not exceed the amount you paid to us, if any, in the past six months.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold harmless KnowFounders and its affiliates from any claims, damages, 
                losses, or expenses arising from your use of the platform, your content, or your violation of these 
                terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Content Moderation</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to review, moderate, or remove any content that violates these terms or is 
                deemed inappropriate. However, we are not obligated to monitor all content and cannot guarantee 
                the accuracy or quality of user-submitted information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our platform may contain links to third-party websites or services. We are not responsible for 
                the content, privacy policies, or practices of these third-party sites. Accessing third-party 
                links is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Modifications to Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any part of the platform at any time 
                without notice. We will not be liable to you or any third party for any modification, suspension, 
                or discontinuance of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may revise these Terms of Service at any time. The most current version will always be posted 
                on this page with the "Last updated" date. By continuing to use the platform after changes are 
                made, you agree to be bound by the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms of Service shall be governed by and construed in accordance with applicable laws, 
                without regard to conflict of law provisions. Any disputes arising from these terms shall be 
                resolved in the appropriate courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your account and access to the platform immediately, without prior 
                notice, for any reason, including violation of these terms. Upon termination, your right to use 
                the platform will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Advertising and Monetization</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>KnowFounders may display advertisements and other promotional content on the platform. By using our service, you acknowledge that:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We may display third-party advertisements and sponsored content</li>
                  <li>Advertisements are clearly marked and distinguished from user content</li>
                  <li>We do not endorse or guarantee the accuracy of advertisements</li>
                  <li>Clicking on advertisements is at your own risk</li>
                  <li>We may use your data to personalize advertisements in accordance with our Privacy Policy</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">User-Generated Content Guidelines</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>When submitting content to KnowFounders, you agree that your content:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Is original and does not infringe on third-party rights</li>
                  <li>Is accurate and not misleading</li>
                  <li>Does not contain spam, malware, or harmful content</li>
                  <li>Complies with all applicable laws and regulations</li>
                  <li>Does not promote illegal activities or harmful products</li>
                  <li>Respects the rights and dignity of others</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-accent/5 rounded-lg">
                <p className="text-foreground font-medium">KnowFounders</p>
                <p className="text-muted-foreground">Email: hertofhelp@gmail.com</p>
                <p className="text-muted-foreground">Website: https://knowfounders.com</p>
                <p className="text-muted-foreground">Address: India</p>
              </div>
            </section>

            <section className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground italic">
                By using KnowFounders, you acknowledge that you have read, understood, and agree to be bound by 
                these Terms of Service.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;

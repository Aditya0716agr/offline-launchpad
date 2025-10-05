import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <Card className="border-0 shadow-none">
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to KnowFounders. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you visit our 
                platform and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We collect and process the following types of information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> Name, email address, and password when you create an account</li>
                  <li><strong>Profile Information:</strong> Location, designation, bio, and other details you choose to share</li>
                  <li><strong>Startup Information:</strong> Business details, descriptions, and content you submit</li>
                  <li><strong>Usage Data:</strong> How you interact with our platform, including views, votes, and comments</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We use your personal data for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To create and manage your account</li>
                  <li>To provide and improve our services</li>
                  <li>To connect founders with their communities</li>
                  <li>To send you important updates and notifications</li>
                  <li>To analyze platform usage and improve user experience</li>
                  <li>To prevent fraud and ensure platform security</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Data Sharing and Disclosure</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We do not sell your personal data. We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Public Profile Information:</strong> Your startup listings and profile information you choose to make public</li>
                  <li><strong>Service Providers:</strong> Third-party companies that help us operate our platform</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with any merger, sale, or acquisition</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data against 
                unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is 
                completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>You have the following rights regarding your personal data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request access to your personal data</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Request transfer of your data</li>
                  <li><strong>Objection:</strong> Object to processing of your data</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to improve your experience on our platform. 
                You can control cookies through your browser settings. Note that disabling cookies may affect 
                the functionality of certain features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in 
                this privacy policy or as required by law. When we no longer need your data, we will securely 
                delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our platform is not intended for children under 13 years of age. We do not knowingly collect 
                personal data from children under 13. If you believe we have collected data from a child, 
                please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any significant 
                changes by posting the new policy on this page and updating the "Last updated" date. We 
                encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Services</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We use third-party services to enhance our platform functionality:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
                  <li><strong>Supabase:</strong> For database and authentication services</li>
                  <li><strong>Vercel:</strong> For hosting and analytics</li>
                  <li><strong>Email Services:</strong> For sending notifications and updates</li>
                </ul>
                <p>These services may collect and process data according to their own privacy policies.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure that such transfers comply with applicable data protection laws and implement 
                appropriate safeguards to protect your personal data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this privacy policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-accent/5 rounded-lg">
                <p className="text-foreground font-medium">KnowFounders</p>
                <p className="text-muted-foreground">Email: hertofhelp@gmail.com</p>
                <p className="text-muted-foreground">Website: https://knowfounders.com</p>
                <p className="text-muted-foreground">Address: India</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

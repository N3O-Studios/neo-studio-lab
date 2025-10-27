import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p className="mb-3">
              We collect information to provide and improve our AI-powered music production tools:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Email address and username when you create an account</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our AI tools</li>
              <li><strong>Content Data:</strong> Audio files, prompts, and other content you upload for processing</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">
              We use collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing and maintaining our AI services</li>
              <li>Processing your audio files and generating outputs</li>
              <li>Improving our AI models and services</li>
              <li>Communicating with you about service updates</li>
              <li>Ensuring security and preventing fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. AI Processing and Data Storage</h2>
            <p>
              Audio files and prompts submitted to our AI tools are processed through secure third-party AI services. We temporarily store your content for processing purposes and may retain anonymized data to improve our models. Generated outputs (cover art, chord progressions) are stored in your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Data Sharing and Disclosure</h2>
            <p className="mb-3">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Third-party AI services and hosting providers</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including encryption, secure authentication, and regular security audits. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Your Rights and Choices</h2>
            <p className="mb-3">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access and download your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of promotional communications</li>
              <li>Object to certain data processing activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to maintain your session, remember preferences, and analyze service usage. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">8. Third-Party Services</h2>
            <p>
              Our services integrate with third-party AI providers and authentication services. These services have their own privacy policies that govern how they handle your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">9. Children's Privacy</h2>
            <p>
              Our services are not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">10. Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">11. Contact Us</h2>
            <p>
              For privacy-related questions or to exercise your rights, please contact us through our social media channels or via email.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-sm">
              Last updated: October 27, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

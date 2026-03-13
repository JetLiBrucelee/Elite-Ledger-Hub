import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: March 2026</p>
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
              <p>We collect information you provide directly, including your name, email address, phone number, country, and financial information necessary to provide our services.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
              <p>We use your information to provide, maintain, and improve our services, process transactions, send you service-related communications, and comply with legal obligations.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Data Security</h2>
              <p>We implement industry-standard security measures to protect your personal information. All passwords are hashed and session tokens are cryptographically generated. We never store payment card information on our servers.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Data Retention</h2>
              <p>We retain your personal information for as long as your account is active or as needed to provide services and comply with legal obligations.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Contact Us</h2>
              <p>For privacy-related questions, contact our Data Protection Officer at privacy@eliteledgercapital.com.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

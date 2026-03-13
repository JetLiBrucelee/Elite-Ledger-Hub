import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: March 2026</p>
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using the Elite Ledger Capital platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Investment Services</h2>
              <p>Elite Ledger Capital provides copy trading and investment management services. All investments are subject to market risk, and past performance does not guarantee future results. You should only invest funds you can afford to lose.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Account Registration</h2>
              <p>You must provide accurate and complete information when creating your account. Account access is subject to administrator approval. We reserve the right to reject or terminate accounts at our discretion.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Limitation of Liability</h2>
              <p>Elite Ledger Capital shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of the platform or any investments made through the platform.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Governing Law</h2>
              <p>These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

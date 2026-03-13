import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function RiskDisclosure() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Risk Disclosure</h1>
          <p className="text-muted-foreground mb-8">Last updated: March 2026</p>
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">General Risk Warning</h2>
              <p>Trading in Forex, cryptocurrencies, and other financial instruments carries a significant risk of loss and may not be suitable for all investors. The high degree of leverage can work both for and against you.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Market Risk</h2>
              <p>Financial markets can be highly volatile. The value of investments can go down as well as up, and you may receive back less than you originally invested. Past performance is not indicative of future results.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Leverage Risk</h2>
              <p>Trading on margin and the use of leverage can amplify both profits and losses. Before deciding to trade, ensure you understand the risks involved and consider seeking independent financial advice.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Copy Trading Risk</h2>
              <p>When copy trading, you replicate the trades of expert traders. While our traders have demonstrated skill, their strategies may not always result in profits. You remain responsible for your investment decisions.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Only Invest What You Can Afford to Lose</h2>
              <p>You should never invest money that you cannot afford to lose. Consider your financial situation carefully before investing. If in doubt, seek independent financial and legal advice.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

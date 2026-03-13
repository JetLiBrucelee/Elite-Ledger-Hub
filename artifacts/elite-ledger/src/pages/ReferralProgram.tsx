import { Link } from "wouter";
import { motion } from "framer-motion";
import { Users2, ArrowRight, Share2, DollarSign, UserPlus, Gift, CheckCircle, Copy } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const tiers = [
  { referrals: "1-5", bonus: "5%", earning: "Up to $250 per referral", highlight: false },
  { referrals: "6-15", bonus: "8%", earning: "Up to $400 per referral", highlight: false },
  { referrals: "16-30", bonus: "10%", earning: "Up to $500 per referral", highlight: true },
  { referrals: "31-50", bonus: "12%", earning: "Up to $600 per referral", highlight: false },
  { referrals: "51+", bonus: "15%", earning: "Up to $750 per referral", highlight: false },
];

const steps = [
  {
    icon: Share2,
    title: "Share Your Link",
    desc: "Get your unique referral link from your dashboard and share it with friends, family, or your network.",
  },
  {
    icon: UserPlus,
    title: "They Register",
    desc: "When someone registers through your link, they're automatically linked to your referral account.",
  },
  {
    icon: DollarSign,
    title: "They Fund & Trade",
    desc: "Once your referral funds their account and begins trading, the bonus is triggered.",
  },
  {
    icon: Gift,
    title: "Both Earn Rewards",
    desc: "You receive your referral bonus and your friend gets a welcome bonus — everyone wins.",
  },
];

const benefits = [
  "No cap on the number of referrals you can make",
  "Bonuses paid instantly when conditions are met",
  "Your referrals also receive a welcome bonus",
  "Track all your referrals in real-time from your dashboard",
  "Lifetime attribution — referrals never expire",
  "Withdraw referral earnings at any time",
];

export default function ReferralProgram() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("https://eliteledgercapital.com/ref/YOUR_ID");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="pt-32 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              <Users2 className="w-4 h-4" /> Refer & Earn
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Referral Program
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Invite friends to Elite Ledger Capital and earn up to 15% referral bonus on their deposits. The more you refer, the higher your tier.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-4xl font-display font-bold text-gradient-gold mb-2">$1.2M+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Referral Bonuses Paid</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="text-4xl font-display font-bold text-gradient-gold mb-2">8,500+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Successful Referrals</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="text-4xl font-display font-bold text-gradient-gold mb-2">15%</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Maximum Bonus Rate</div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-white mb-10 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <Card className="p-6 h-full text-center relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                    {idx + 1}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-white mb-10 text-center">Bonus Tiers</h2>
          <Card className="overflow-hidden max-w-3xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-medium">Referrals</th>
                    <th className="px-6 py-4 font-medium">Bonus Rate</th>
                    <th className="px-6 py-4 font-medium">Potential Earning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tiers.map((t) => (
                    <tr key={t.referrals} className={`transition-colors ${t.highlight ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-white/[0.02]"}`}>
                      <td className="px-6 py-4 font-semibold text-white">{t.referrals}</td>
                      <td className="px-6 py-4 text-primary font-display font-bold text-lg">{t.bonus}</td>
                      <td className="px-6 py-4 text-muted-foreground">{t.earning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-6">Why Refer?</h2>
              <div className="space-y-4">
                {benefits.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{b}</span>
                  </div>
                ))}
              </div>
            </div>
            <Card className="p-8">
              <h3 className="text-xl font-bold text-white mb-4">Your Referral Link</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Sign in to get your personalized referral link. Share it anywhere — social media, email, or messaging apps.
              </p>
              <div className="flex items-center gap-2 p-3 bg-background rounded-lg border border-white/10 mb-4">
                <span className="text-white/60 text-sm flex-1 truncate">https://eliteledgercapital.com/ref/YOUR_ID</span>
                <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10 flex-shrink-0" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-1" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/register">Sign Up to Get Your Link</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-gold opacity-5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Start Earning Through Referrals</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of partners who earn passive income by referring new traders to Elite Ledger Capital.
          </p>
          <Button asChild size="lg" variant="premium" className="px-12 py-6 text-lg">
            <Link href="/register">Join the Program</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

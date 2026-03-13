import { Link } from "wouter";
import { motion } from "framer-motion";
import { Gift, Trophy, Users2, Percent, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Promotion() {
  const promotions = [
    {
      icon: Gift,
      title: "Give Aways",
      desc: "Participate in our exclusive giveaway campaigns and win prizes ranging from bonus trading capital to premium account upgrades. Active traders are automatically entered into monthly draws.",
      highlight: "Up to $10,000 in bonus capital",
    },
    {
      icon: Trophy,
      title: "Trading Contests",
      desc: "Compete against fellow traders in our monthly and quarterly trading contests. Showcase your skills, climb the leaderboard, and earn recognition alongside cash prizes and account tier upgrades.",
      highlight: "Monthly prizes worth $50,000+",
    },
    {
      icon: Users2,
      title: "Referral Program",
      desc: "Invite friends and colleagues to Elite Ledger Capital and earn generous referral bonuses. Both you and your referral receive bonus capital when they fund their account and begin trading.",
      highlight: "Earn up to 15% referral bonus",
    },
    {
      icon: Percent,
      title: "Deposit Bonus",
      desc: "Boost your trading capital with our deposit bonus program. Qualifying deposits receive an instant percentage bonus credited to your trading account, giving you more leverage from day one.",
      highlight: "Up to 50% deposit match",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="pt-32 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              <Gift className="w-4 h-4" /> Promotions & Rewards
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">Exclusive Promotions</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Take advantage of our limited-time offers, trading contests, and referral rewards. More ways to grow your capital with Elite Ledger Capital.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {promotions.map((promo, idx) => {
              const Icon = promo.icon;
              return (
                <motion.div key={promo.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                  <Card className="p-8 h-full hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-bl-lg">
                      {promo.highlight}
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{promo.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">{promo.desc}</p>
                    <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                      <Link href="/register" className="flex items-center gap-2">
                        Get Started <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-4xl font-display font-bold text-gradient-gold mb-2">$2.5M+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Total Prizes Awarded</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="text-4xl font-display font-bold text-gradient-gold mb-2">15,000+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Contest Participants</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="text-4xl font-display font-bold text-gradient-gold mb-2">8,500+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Successful Referrals</div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-gold opacity-5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Ready to Start Earning More?</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Create your account today and take advantage of our exclusive promotions. The sooner you start, the more you can earn.
          </p>
          <Button asChild size="lg" variant="premium" className="px-12 py-6 text-lg">
            <Link href="/register">Create Your Account</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

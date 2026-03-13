import { Link } from "wouter";
import { motion } from "framer-motion";
import { Gift, ArrowRight, Star, Calendar, DollarSign, Users, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const campaigns = [
  {
    title: "Monthly Capital Draw",
    prize: "$10,000",
    desc: "Every active trader is automatically entered into our monthly draw. Trade at least 5 lots in a calendar month and you could win up to $10,000 in bonus trading capital.",
    status: "Active",
    endDate: "Ends March 31, 2026",
  },
  {
    title: "New Account Welcome Bonus",
    prize: "$500",
    desc: "Open and fund a new Elite Ledger Capital account with a minimum of $250. Receive up to $500 in bonus capital credited directly to your trading account.",
    status: "Active",
    endDate: "Ongoing",
  },
  {
    title: "Tier Upgrade Raffle",
    prize: "Free Upgrade",
    desc: "Qualify for a free account tier upgrade — from Silver to Gold, Gold to Platinum, or Platinum to Diamond. One winner selected every quarter among eligible traders.",
    status: "Active",
    endDate: "Ends Q1 2026",
  },
  {
    title: "Holiday Trading Jackpot",
    prize: "$25,000",
    desc: "Our biggest annual giveaway! Complete trading milestones during the holiday season and earn entries into the $25,000 jackpot draw. More trades = more entries.",
    status: "Upcoming",
    endDate: "December 2026",
  },
];

const eligibilityRules = [
  "Maintain a funded account with a minimum balance of $100",
  "Complete at least 5 standard lots of trading volume per month",
  "Account must be verified with valid KYC documentation",
  "Winnings are credited as bonus capital with 1x trading volume requirement",
  "One entry per account per campaign unless stated otherwise",
];

export default function GiveAways() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="pt-32 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              <Gift className="w-4 h-4" /> Giveaway Campaigns
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Give Aways
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Win bonus trading capital, account upgrades, and exclusive rewards through our ongoing giveaway campaigns. Active traders are automatically entered.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-4xl font-display font-bold text-gradient-gold mb-2">$500K+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Given Away This Year</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="text-4xl font-display font-bold text-gradient-gold mb-2">4,200+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Winners Rewarded</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="text-4xl font-display font-bold text-gradient-gold mb-2">12</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Active Campaigns</div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-white mb-10 text-center">Current Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {campaigns.map((c, idx) => (
              <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <Card className="p-8 h-full hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-blue-500/10 text-blue-400 border border-blue-500/30"}`}>
                      {c.status}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {c.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{c.title}</h3>
                      <div className="text-primary font-display font-bold text-lg">{c.prize}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">{c.desc}</p>
                  <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                    <Link href="/register" className="flex items-center gap-2">
                      Enter Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-6">Eligibility Rules</h2>
              <div className="space-y-4">
                {eligibilityRules.map((rule) => (
                  <div key={rule} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
            <Card className="p-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" /> How It Works
              </h3>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Open & Fund", desc: "Create your account and make your first deposit to become eligible." },
                  { step: "2", title: "Trade Actively", desc: "Meet the minimum trading volume requirement for the campaign period." },
                  { step: "3", title: "Win Rewards", desc: "Winners are selected and notified. Prizes are credited automatically." },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center flex-shrink-0 text-sm">
                      {s.step}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{s.title}</div>
                      <div className="text-muted-foreground text-sm">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-gold opacity-5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Don't Miss Out on Free Rewards</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Create your account today and start participating in our giveaway campaigns. The more you trade, the more chances you have to win.
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

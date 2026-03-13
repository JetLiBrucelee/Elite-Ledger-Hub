import { Link } from "wouter";
import { motion } from "framer-motion";
import { Copy, ArrowRight, Shield, TrendingUp, Clock, Users, BarChart3, Zap, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const topMasters = [
  { name: "Michael T.", roi: "+42.8%", followers: 1247, winRate: "78%", strategy: "Forex Scalping" },
  { name: "Elena R.", roi: "+38.5%", followers: 983, winRate: "72%", strategy: "Swing Trading" },
  { name: "James W.", roi: "+35.1%", followers: 856, winRate: "81%", strategy: "Crypto Momentum" },
  { name: "Sophia L.", roi: "+31.7%", followers: 724, winRate: "75%", strategy: "Multi-Asset" },
];

const howItWorks = [
  {
    icon: Users,
    title: "Browse Master Traders",
    desc: "Explore our curated list of verified master traders. Filter by ROI, risk level, trading style, and track record.",
  },
  {
    icon: Copy,
    title: "Choose & Copy",
    desc: "Select the master trader whose strategy aligns with your goals. Set your allocation amount and risk parameters.",
  },
  {
    icon: TrendingUp,
    title: "Auto-Mirror Trades",
    desc: "Every trade the master executes is automatically replicated in your account, proportional to your allocation.",
  },
  {
    icon: BarChart3,
    title: "Monitor & Adjust",
    desc: "Track performance in real-time. Pause, stop, or switch master traders at any time with full control.",
  },
];

const benefits = [
  "No trading experience required — let experts trade for you",
  "Full transparency with real-time trade history and P&L",
  "Customizable risk settings and allocation limits",
  "Copy multiple master traders to diversify your portfolio",
  "Stop copying at any time with no penalties or lock-in periods",
  "Performance-based fees — masters only earn when you profit",
];

export default function JoinCopyTrading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="pt-32 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              <Copy className="w-4 h-4" /> Copy Trading
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Join CopyTrading
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Automatically replicate the trades of elite master traders. No experience needed — just choose a trader, set your budget, and let the system work for you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, value: "3,200+", label: "Active Copiers" },
              { icon: TrendingUp, value: "+28.4%", label: "Avg. Monthly ROI" },
              { icon: Shield, value: "150+", label: "Verified Masters" },
              { icon: Clock, value: "24/7", label: "Automated Trading" },
            ].map((stat, idx) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-display font-bold text-gradient-gold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-white mb-10 text-center">How CopyTrading Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, idx) => (
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
          <h2 className="text-3xl font-display font-bold text-white mb-10 text-center">Top Master Traders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topMasters.map((m, idx) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <Card className="p-6 h-full hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">{m.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white text-center mb-1">{m.name}</h3>
                  <p className="text-xs text-muted-foreground text-center mb-4">{m.strategy}</p>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <div className="text-emerald-400 font-mono font-bold text-lg">{m.roi}</div>
                      <div className="text-xs text-muted-foreground">Monthly ROI</div>
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">{m.winRate}</div>
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                    </div>
                  </div>
                  <div className="text-center mt-3 text-xs text-muted-foreground">
                    <Users className="w-3 h-3 inline-block mr-1" />{m.followers.toLocaleString()} followers
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full mt-4 border-primary/30 text-primary hover:bg-primary/10">
                    <Link href="/register">Copy Trader</Link>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
              <Link href="/masters-rating" className="flex items-center gap-2">
                View All Master Traders <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-6">Why CopyTrading?</h2>
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
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" /> Quick Start Guide
              </h3>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Create Account", desc: "Register and complete verification in under 5 minutes." },
                  { step: "2", title: "Fund Your Account", desc: "Deposit a minimum of $250 to start copy trading." },
                  { step: "3", title: "Select a Master", desc: "Browse rankings and pick a master trader to follow." },
                  { step: "4", title: "Set Parameters", desc: "Define your allocation, risk limits, and start copying." },
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
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Start Copying Top Traders Today</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of investors who grow their portfolios by copying elite master traders. No experience required.
          </p>
          <Button asChild size="lg" variant="premium" className="px-12 py-6 text-lg">
            <Link href="/register">Start CopyTrading</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

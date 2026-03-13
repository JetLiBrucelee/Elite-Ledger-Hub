import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, TrendingUp, Globe2, BarChart3, ChevronRight, Copy, Star, Users2, Award } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const stats = [
    { label: "Total Invested", value: "$4.2B+" },
    { label: "Active Traders", value: "85,000+" },
    { label: "Countries", value: "140+" },
    { label: "Success Rate", value: "94.8%" },
  ];

  const features = [
    { title: "Copy Trading", desc: "Mirror the trades of our top-performing experts automatically.", icon: TrendingUp },
    { title: "Forex Trading", desc: "Access the largest financial market with premium spreads.", icon: Globe2 },
    { title: "Crypto Investment", desc: "Diversify with top-tier digital asset portfolios.", icon: ShieldCheck },
    { title: "Stock Trading", desc: "Invest in global equities with institutional-grade tools.", icon: BarChart3 },
  ];

  const copyTradingSteps = [
    { step: "01", title: "Choose Your Expert", desc: "Browse our verified roster of elite traders with verified track records. Filter by risk profile, asset class, and historical ROI." },
    { step: "02", title: "Set Your Allocation", desc: "Decide how much capital you want to mirror. Our risk management engine automatically scales positions to match your account size." },
    { step: "03", title: "Automate & Earn", desc: "Your account follows every trade in real time. No experience required — your portfolio grows as the expert's does." },
  ];

  const topTraders = [
    { name: "James Whitfield", specialty: "Forex & Derivatives", roi: "+312%", drawdown: "4.2%", followers: "12,400" },
    { name: "Sofia Marchetti", specialty: "Crypto Arbitrage", roi: "+289%", drawdown: "5.8%", followers: "9,870" },
    { name: "Ethan Blackwood", specialty: "Equities & ETFs", roi: "+245%", drawdown: "3.1%", followers: "8,200" },
  ];

  const testimonials = [
    {
      name: "Michael T.",
      country: "United Kingdom",
      avatar: "MT",
      rating: 5,
      text: "In 14 months I turned my £25,000 into £89,000 by following the Gold plan and copying James Whitfield. The dashboard makes it simple to track every move in real time.",
    },
    {
      name: "Amara O.",
      country: "Nigeria",
      avatar: "AO",
      rating: 5,
      text: "I was skeptical at first, but after the admin approved my account I saw my first profits within the week. The transparency of the platform is unmatched — I can see exactly what trades are being made.",
    },
    {
      name: "Lena Bauer",
      country: "Germany",
      avatar: "LB",
      rating: 5,
      text: "The Diamond plan was a big commitment, but the 216% annual ROI has spoken for itself. I especially appreciate the live support chat — they answer within minutes.",
    },
    {
      name: "Carlos R.",
      country: "Mexico",
      avatar: "CR",
      rating: 4,
      text: "Solid platform, professional onboarding, and great customer service. The copy trading feature has removed all the stress of managing my portfolio manually.",
    },
    {
      name: "Sarah K.",
      country: "United States",
      avatar: "SK",
      rating: 5,
      text: "I started with the Bronze plan to test the waters. The compounding returns are real and the ROI targets are met consistently. Upgrading to Platinum next month.",
    },
    {
      name: "Hassan A.",
      country: "UAE",
      avatar: "HA",
      rating: 5,
      text: "Elite Ledger Capital lives up to its name. The institutional-grade tools and expert team make this the only platform serious investors need. My portfolio is up 178% in 9 months.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Premium Wealth Management
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-[1.1] mb-6">
                Master the Markets with <span className="text-gradient-gold">Elite Expertise</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                Experience institutional-grade copy trading and automated portfolio management. We bridge the gap between retail investors and elite market performance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="premium">
                  <Link href="/register" className="flex items-center gap-2">
                    Start Investing <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white hover:bg-white/5 border-white/20">
                  <Link href="/plans">View Plans</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 relative z-10 bg-background/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-5xl font-display font-bold text-gradient-gold mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Our Core Services</h2>
            <p className="text-muted-foreground text-lg">Comprehensive financial solutions engineered for maximum returns and risk mitigation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-8 h-full hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">{feature.desc}</p>
                    <Link href="/plans" className="inline-flex items-center text-primary font-semibold text-sm hover:underline">
                      Learn more <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Copy Trading Section */}
      <section className="py-24 relative z-10 border-t border-white/5 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-4">
              <Copy className="w-4 h-4" /> Copy Trading
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Profit from Expert Precision</h2>
            <p className="text-muted-foreground text-lg">Our copy trading engine mirrors the exact positions of our top performers — automatically and in real time.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {copyTradingSteps.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative"
              >
                <div className="text-6xl font-display font-bold text-primary/10 mb-4 leading-none">{step.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex items-center">
              <div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">Our Top Performing Traders</h3>
                <p className="text-muted-foreground mb-6">Every trader on our platform is verified, risk-assessed, and monitored by our quant team. Performance metrics are updated in real time.</p>
                <Button asChild variant="premium">
                  <Link href="/register">Start Copy Trading</Link>
                </Button>
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              {topTraders.map((trader, idx) => (
                <motion.div
                  key={trader.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-5 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                      {trader.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white">{trader.name}</div>
                      <div className="text-xs text-muted-foreground">{trader.specialty}</div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-emerald-500 font-bold">{trader.roi}</div>
                      <div className="text-xs text-muted-foreground">Annual ROI</div>
                    </div>
                    <div className="text-right hidden md:block">
                      <div className="text-white font-medium">{trader.drawdown}</div>
                      <div className="text-xs text-muted-foreground">Max Drawdown</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <Users2 className="w-3.5 h-3.5" /> {trader.followers}
                      </div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-4">
              <Award className="w-4 h-4" /> Client Testimonials
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Trusted by Thousands of Investors</h2>
            <p className="text-muted-foreground text-lg">Real results from real clients across 140+ countries.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 3) * 0.1 }}
              >
                <Card className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                    {Array.from({ length: 5 - t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-muted-foreground/30" />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed flex-1 mb-6 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.country}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10 border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-gold opacity-5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Ready to Elevate Your Portfolio?</h2>
          <p className="text-xl text-muted-foreground mb-10">Join elite investors who have already discovered the power of automated professional trading.</p>
          <Button asChild size="lg" variant="premium" className="px-12 py-6 text-lg">
            <Link href="/register">Create Your Account Today</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

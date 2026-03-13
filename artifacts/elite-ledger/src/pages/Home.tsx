import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, TrendingUp, Globe2, BarChart3, ChevronRight } from "lucide-react";
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

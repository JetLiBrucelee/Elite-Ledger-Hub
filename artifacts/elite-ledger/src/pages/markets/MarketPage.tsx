import { Link } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Shield, Zap, BarChart3, Globe, Clock } from "lucide-react";

interface MarketStat {
  label: string;
  value: string;
}

interface MarketFeature {
  title: string;
  desc: string;
}

interface MarketPageProps {
  name: string;
  tagline: string;
  description: string;
  stats: MarketStat[];
  features: MarketFeature[];
  instruments: string[];
}

const featureIcons = [TrendingUp, Shield, Zap, BarChart3, Globe, Clock];

export default function MarketPage({ name, tagline, description, stats, features, instruments }: MarketPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" />
              {tagline}
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">{name}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">{description}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <Card className="p-6 text-center bg-[#14161c] border-white/5">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Why Trade {name} with Us</h2>
            <p className="text-muted-foreground text-lg">Industry-leading conditions designed for serious traders.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = featureIcons[idx % featureIcons.length];
              return (
                <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                  <Card className="p-8 h-full bg-[#14161c] border-white/5 hover:border-primary/30 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Available Instruments</h2>
            <p className="text-muted-foreground text-lg">Access a wide range of {name.toLowerCase()} instruments from a single account.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {instruments.map((instrument, idx) => (
              <motion.div key={instrument} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }}>
                <div className="px-4 py-2 rounded-lg bg-[#14161c] border border-white/5 text-white text-sm font-medium hover:border-primary/30 transition-colors">
                  {instrument}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Start Trading {name} Today</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Open an account and get access to world-class {name.toLowerCase()} trading with elite spreads, fast execution, and professional tools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg">
              <Link href="/plans">Start Trading</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/5 px-10 py-6 text-lg">
              <Link href="/register">Open Account</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

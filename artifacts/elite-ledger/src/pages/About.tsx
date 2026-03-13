import { motion } from "framer-motion";
import { Shield, Users, Globe, Award, TrendingUp, Lock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";

export default function About() {
  const values = [
    { icon: Shield, title: "Security First", desc: "Bank-grade encryption and multi-layer security protocols protect every transaction and data point." },
    { icon: Users, title: "Expert Team", desc: "Our team of 200+ certified financial analysts and traders bring decades of combined experience." },
    { icon: Globe, title: "Global Reach", desc: "Operating across 140+ countries with localized support and regulatory compliance." },
    { icon: Award, title: "Award Winning", desc: "Recognized by leading financial authorities for excellence in automated trading solutions." },
    { icon: TrendingUp, title: "Proven Results", desc: "Consistent track record of delivering above-market returns through proprietary algorithms." },
    { icon: Lock, title: "Regulated", desc: "Fully licensed and regulated under international financial authorities." },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="pt-32 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">About Elite Ledger Capital</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Founded with a vision to democratize institutional-grade trading strategies, Elite Ledger Capital bridges the gap between retail investors and professional wealth management.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold text-white mb-6">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                At Elite Ledger Capital, we believe everyone deserves access to the same sophisticated trading tools and strategies used by hedge funds and institutional investors.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our proprietary copy trading technology allows you to automatically mirror the trades of our top-performing experts, ensuring your portfolio benefits from professional-grade market analysis and execution.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With over $4.2 billion in assets under management and a presence in 140+ countries, we continue to set the standard for automated wealth management.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-8 rounded-2xl"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4">
                  <div className="text-4xl font-display font-bold text-gradient-gold mb-2">$4.2B+</div>
                  <div className="text-sm text-muted-foreground">Assets Managed</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-display font-bold text-gradient-gold mb-2">85K+</div>
                  <div className="text-sm text-muted-foreground">Active Traders</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-display font-bold text-gradient-gold mb-2">140+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-display font-bold text-gradient-gold mb-2">94.8%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The principles that drive everything we do at Elite Ledger Capital.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-6 h-full">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

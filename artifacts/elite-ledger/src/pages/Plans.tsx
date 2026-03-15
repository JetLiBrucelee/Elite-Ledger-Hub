import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

// Using the exact calculations provided by the user
const investmentPlans = [
  {
    id: "bronze",
    name: "Bronze Package",
    minInvestment: 40000,
    roiText: "102% ROI After 3 Months",
    duration: 3,
    description: "The straightforward, robust entry-level choice to experience our copy trading efficiency.",
    schedule: [
      { month: 1, text: "40k + 102%", amount: 80800 },
      { month: 2, text: "80.8k + 102%", amount: 163216 },
      { month: 3, text: "163k + 102%", amount: 330000 },
    ],
    features: ["Dedicated Account Manager", "Daily Market Updates", "Standard Support"]
  },
  {
    id: "silver",
    name: "Silver Package",
    minInvestment: 75000,
    roiText: "182% ROI After 3 Months",
    duration: 3,
    description: "Our mid-tier package balancing steady growth with advanced risk mitigation.",
    schedule: [
      { month: 1, text: "75k + 182%", amount: 211500 },
      { month: 2, text: "211.5k + 182%", amount: 596430 },
      { month: 3, text: "596k + 182%", amount: 1680000 },
    ],
    features: ["Senior Account Manager", "Priority Support", "Advanced Copy Trading"]
  },
  {
    id: "gold",
    name: "Gold Package",
    minInvestment: 150000,
    roiText: "220.08% ROI After 3 Months",
    duration: 3,
    description: "Premium investment tier for substantial compounding and superior algorithmic focus.",
    schedule: [
      { month: 1, text: "150k + 220.08%", amount: 480120 },
      { month: 2, text: "480k + 220.08%", amount: 1540000 },
      { month: 3, text: "1.54M + 220.08%", amount: 4930000 },
    ],
    features: ["VIP Account Manager", "24/7 Priority Support", "Institutional Algorithms"]
  },
  {
    id: "platinum",
    name: "Platinum Package",
    minInvestment: 300000,
    roiText: "250.41% ROI After 3 Months",
    duration: 3,
    description: "Elite tier for high-net-worth individuals demanding aggressive top-percentile growth.",
    schedule: [
      { month: 1, text: "300k + 250.41%", amount: 1051230 },
      { month: 2, text: "1.05M + 250.41%", amount: 3680000 },
      { month: 3, text: "3.68M + 250.41%", amount: 12900000 },
    ],
    features: ["Executive Board Access", "Custom Strategy Formulation", "Tax Advisory Setup"]
  },
  {
    id: "diamond",
    name: "Diamond Package",
    minInvestment: 500000,
    roiText: "300% ROI After 3 Months",
    duration: 3,
    description: "The pinnacle of our offerings. Unprecedented 300% monthly compounding power.",
    schedule: [
      { month: 1, text: "500k + 300%", amount: 2000000 },
      { month: 2, text: "2M + 300%", amount: 8000000 },
      { month: 3, text: "8M + 300%", amount: 32000000 },
    ],
    features: ["Direct CEO Access", "Exclusive Events", "Full Asset Management"]
  }
];

export default function Plans() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(investmentPlans[0].id);

  const activePlan = investmentPlans.find(p => p.id === activeTab)!;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">Investment Plans</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select a tier that matches your capital goals. Our transparent compounding structure ensures maximum efficiency.
            </p>
          </div>

          {/* Custom Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {investmentPlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setActiveTab(plan.id)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === plan.id 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                    : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-white"
                }`}
              >
                {plan.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activePlan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border-primary/20">
                <div className="grid grid-cols-1 md:grid-cols-5">
                  {/* Left Column - Details */}
                  <div className="md:col-span-2 bg-gradient-to-br from-card to-background p-8 border-r border-border flex flex-col">
                    <h2 className="text-3xl font-display font-bold text-gradient-gold mb-2">{activePlan.name}</h2>
                    <p className="text-muted-foreground text-sm mb-8">{activePlan.description}</p>
                    
                    <div className="mb-8">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Minimum Investment</div>
                      <div className="text-4xl font-bold text-white">{formatCurrency(activePlan.minInvestment)}</div>
                    </div>
                    
                    <div className="mb-8">
                      <div className="text-sm font-medium text-primary mb-1">Return Profile</div>
                      <div className="text-xl font-bold text-white">{activePlan.roiText}</div>
                    </div>

                    <div className="space-y-3 mb-8 flex-1">
                      {activePlan.features.map(feature => (
                        <div key={feature} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-sm text-white/80">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button asChild size="lg" variant="premium" className="w-full">
                      <Link href={isAuthenticated ? "/dashboard/investments" : `/register?plan=${activePlan.id}`}>
                        {isAuthenticated ? "View My Investments" : "Select Plan"}
                      </Link>
                    </Button>
                  </div>

                  {/* Right Column - Table */}
                  <div className="md:col-span-3 p-8 bg-black/40">
                    <h3 className="text-xl font-display font-semibold text-white mb-6">Return Progression</h3>
                    
                    <div className="space-y-4">
                      {activePlan.schedule.map((sched, idx) => (
                        <div key={idx} className="glass-panel rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="text-sm font-medium text-primary mb-1">Month {sched.month}</div>
                            <div className="text-sm text-muted-foreground">{sched.text}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <ArrowRight className="w-5 h-5 text-muted-foreground hidden sm:block" />
                            <div className="text-2xl font-bold text-white">{formatCurrency(sched.amount)}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 p-6 rounded-xl bg-primary/10 border border-primary/30">
                      <div className="text-sm font-medium text-primary mb-1">Final Payout After {activePlan.duration} Months</div>
                      <div className="text-5xl font-display font-bold text-gradient-gold">
                        {formatCurrency(activePlan.schedule[activePlan.schedule.length - 1].amount)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

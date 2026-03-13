import { Link } from "wouter";
import { motion } from "framer-motion";
import { Crown, ArrowRight, TrendingUp, Users, Shield, Star, BarChart3, Award } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const masters = [
  { rank: 1, name: "Michael T.", roi: "+42.8%", followers: 1247, winRate: "78%", drawdown: "8.2%", strategy: "Forex Scalping", months: 18, totalReturn: "+312%", risk: "Medium" },
  { rank: 2, name: "Elena R.", roi: "+38.5%", followers: 983, winRate: "72%", drawdown: "11.4%", strategy: "Swing Trading", months: 24, totalReturn: "+485%", risk: "Medium" },
  { rank: 3, name: "James W.", roi: "+35.1%", followers: 856, winRate: "81%", drawdown: "6.7%", strategy: "Crypto Momentum", months: 12, totalReturn: "+156%", risk: "High" },
  { rank: 4, name: "Sophia L.", roi: "+31.7%", followers: 724, winRate: "75%", drawdown: "9.1%", strategy: "Multi-Asset", months: 30, totalReturn: "+620%", risk: "Low" },
  { rank: 5, name: "Omar K.", roi: "+29.4%", followers: 612, winRate: "69%", drawdown: "14.3%", strategy: "Indices Trading", months: 15, totalReturn: "+198%", risk: "High" },
  { rank: 6, name: "Yuki M.", roi: "+27.8%", followers: 548, winRate: "74%", drawdown: "7.8%", strategy: "Forex Major Pairs", months: 20, totalReturn: "+289%", risk: "Low" },
  { rank: 7, name: "Lucas P.", roi: "+26.1%", followers: 491, winRate: "71%", drawdown: "10.5%", strategy: "Commodities", months: 16, totalReturn: "+215%", risk: "Medium" },
  { rank: 8, name: "Anna S.", roi: "+24.5%", followers: 437, winRate: "77%", drawdown: "5.9%", strategy: "Conservative FX", months: 22, totalReturn: "+304%", risk: "Low" },
  { rank: 9, name: "Chen W.", roi: "+23.2%", followers: 389, winRate: "68%", drawdown: "12.1%", strategy: "Crypto Diversified", months: 10, totalReturn: "+102%", risk: "High" },
  { rank: 10, name: "David H.", roi: "+21.8%", followers: 342, winRate: "73%", drawdown: "8.8%", strategy: "Algo Trading", months: 14, totalReturn: "+165%", risk: "Medium" },
  { rank: 11, name: "Maria C.", roi: "+20.4%", followers: 298, winRate: "76%", drawdown: "6.2%", strategy: "Bonds & Forex", months: 26, totalReturn: "+380%", risk: "Low" },
  { rank: 12, name: "Alex N.", roi: "+19.1%", followers: 265, winRate: "70%", drawdown: "13.7%", strategy: "Futures Scalping", months: 11, totalReturn: "+94%", risk: "High" },
];

const ratingCriteria = [
  { icon: TrendingUp, title: "Monthly ROI", desc: "Average percentage return over the trailing 6-month period, weighted for consistency." },
  { icon: Shield, title: "Max Drawdown", desc: "The largest peak-to-trough decline, measuring risk management effectiveness." },
  { icon: BarChart3, title: "Win Rate", desc: "Percentage of profitable trades, indicating decision accuracy and strategy reliability." },
  { icon: Users, title: "Follower Growth", desc: "Rate of new copiers joining, reflecting community trust and performance reputation." },
  { icon: Star, title: "Consistency Score", desc: "Month-over-month performance stability — masters with steady returns rank higher." },
  { icon: Award, title: "Track Record Length", desc: "Longer verified trading histories receive a trust multiplier in the overall score." },
];

export default function MastersRating() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="pt-32 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              <Crown className="w-4 h-4" /> Master Trader Rankings
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Master's Rating
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Explore our ranked list of verified master traders. Compare performance, risk levels, and strategies to find the perfect trader to copy.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center mb-16">
            {[
              { value: "150+", label: "Verified Masters" },
              { value: "+28.4%", label: "Avg. Monthly ROI" },
              { value: "74%", label: "Avg. Win Rate" },
              { value: "9.2%", label: "Avg. Max Drawdown" },
            ].map((stat, idx) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <div className="text-3xl font-display font-bold text-gradient-gold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-white mb-10 text-center">Top Master Traders</h2>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-white/5">
                  <tr>
                    <th className="px-4 py-4 font-medium">Rank</th>
                    <th className="px-4 py-4 font-medium">Master Trader</th>
                    <th className="px-4 py-4 font-medium">Strategy</th>
                    <th className="px-4 py-4 font-medium">Monthly ROI</th>
                    <th className="px-4 py-4 font-medium">Win Rate</th>
                    <th className="px-4 py-4 font-medium">Max DD</th>
                    <th className="px-4 py-4 font-medium">Followers</th>
                    <th className="px-4 py-4 font-medium">Risk</th>
                    <th className="px-4 py-4 font-medium">Total Return</th>
                    <th className="px-4 py-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {masters.map((m) => (
                    <tr key={m.rank} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-4">
                        <span className={`font-bold ${m.rank <= 3 ? "text-primary" : "text-white/70"}`}>
                          {m.rank <= 3 ? (
                            <span className="flex items-center gap-1">
                              {m.rank === 1 && <Crown className="w-4 h-4 text-yellow-400" />}
                              {m.rank === 2 && <Crown className="w-4 h-4 text-gray-300" />}
                              {m.rank === 3 && <Crown className="w-4 h-4 text-amber-600" />}
                              #{m.rank}
                            </span>
                          ) : `#${m.rank}`}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-bold text-sm">{m.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-white">{m.name}</div>
                            <div className="text-xs text-muted-foreground">{m.months} months active</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{m.strategy}</td>
                      <td className="px-4 py-4 text-emerald-400 font-mono font-semibold">{m.roi}</td>
                      <td className="px-4 py-4 text-white font-mono">{m.winRate}</td>
                      <td className="px-4 py-4 text-red-400 font-mono">{m.drawdown}</td>
                      <td className="px-4 py-4 text-muted-foreground">{m.followers.toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          m.risk === "Low" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" :
                          m.risk === "Medium" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30" :
                          "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}>
                          {m.risk}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-primary font-mono font-bold">{m.totalReturn}</td>
                      <td className="px-4 py-4">
                        <Button asChild variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                          <Link href="/register">Copy</Link>
                        </Button>
                      </td>
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
          <h2 className="text-3xl font-display font-bold text-white mb-10 text-center">Rating Criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ratingCriteria.map((c, idx) => (
              <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <Card className="p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <c.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{c.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-gold opacity-5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Want to Join the Rankings?</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Become a master trader and earn performance fees from copiers. Share your expertise and grow your following.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" variant="premium" className="px-12 py-6 text-lg">
              <Link href="/register">Become a Master</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-12 py-6 text-lg border-primary/30 text-primary hover:bg-primary/10">
              <Link href="/copytrading" className="flex items-center gap-2">
                Start Copying <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

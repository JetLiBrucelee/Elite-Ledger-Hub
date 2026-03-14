import { Link } from "wouter";
import { motion } from "framer-motion";
import { Trophy, ArrowRight, Calendar, Timer, Medal, Crown, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const contests = [
  {
    title: "Monthly Trading Championship",
    period: "Every Month",
    prizePool: "$50,000",
    desc: "Our flagship monthly contest. Trade any instrument and climb the leaderboard based on percentage return. Top 50 traders win cash prizes and account bonuses.",
    status: "Active",
    entryFee: "Free Entry",
  },
  {
    title: "Quarterly Forex Masters",
    period: "Every Quarter",
    prizePool: "$150,000",
    desc: "An exclusive forex-only contest running each quarter. Demonstrate your mastery of currency pairs over a 3-month period. Higher stakes, bigger rewards.",
    status: "Active",
    entryFee: "Min $1,000 Balance",
  },
  {
    title: "Crypto Trading Sprint",
    period: "Bi-Weekly",
    prizePool: "$15,000",
    desc: "Fast-paced 2-week contest focused exclusively on cryptocurrency trading. Perfect for crypto enthusiasts who thrive in volatile markets.",
    status: "Active",
    entryFee: "Free Entry",
  },
  {
    title: "Annual Grand Prix",
    period: "Yearly",
    prizePool: "$500,000",
    desc: "The ultimate trading competition. A full year of trading with cumulative scoring. The grand champion receives $100,000 and lifetime Diamond account status.",
    status: "Enrolling",
    entryFee: "Min $5,000 Balance",
  },
];

const leaderboard = [
  { rank: 1, name: "Alexander V.", roi: "+187.4%", prize: "$15,000", country: "US" },
  { rank: 2, name: "Sarah K.", roi: "+154.2%", prize: "$10,000", country: "US" },
  { rank: 3, name: "Takeshi M.", roi: "+132.8%", prize: "$7,500", country: "JP" },
  { rank: 4, name: "Maria L.", roi: "+118.5%", prize: "$5,000", country: "DE" },
  { rank: 5, name: "Omar B.", roi: "+105.1%", prize: "$3,000", country: "AE" },
  { rank: 6, name: "Chen W.", roi: "+98.7%", prize: "$2,500", country: "SG" },
  { rank: 7, name: "Lucas P.", roi: "+91.3%", prize: "$2,000", country: "BR" },
  { rank: 8, name: "Anna S.", roi: "+87.6%", prize: "$1,500", country: "AU" },
];

const prizeBreakdown = [
  { place: "1st Place", prize: "$15,000", color: "text-yellow-400" },
  { place: "2nd Place", prize: "$10,000", color: "text-gray-300" },
  { place: "3rd Place", prize: "$7,500", color: "text-amber-600" },
  { place: "4th-10th", prize: "$1,000-$5,000", color: "text-white/70" },
  { place: "11th-50th", prize: "$100-$500", color: "text-white/50" },
];

export default function TradingContests() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="pt-32 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              <Trophy className="w-4 h-4" /> Compete & Win
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Trading Contests
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Showcase your trading skills, compete against elite traders worldwide, and win substantial cash prizes and account upgrades.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center mb-16">
            {[
              { icon: Trophy, value: "$2.5M+", label: "Total Prizes Awarded" },
              { icon: TrendingUp, value: "15,000+", label: "Contest Participants" },
              { icon: Medal, value: "24", label: "Contests Per Year" },
              { icon: Crown, value: "$500K", label: "Largest Prize Pool" },
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
          <h2 className="text-3xl font-display font-bold text-white mb-10 text-center">Active Contests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contests.map((c, idx) => (
              <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <Card className="p-8 h-full hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-bl-lg">
                    {c.prizePool} Prize Pool
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-blue-500/10 text-blue-400 border border-blue-500/30"}`}>
                      {c.status}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {c.period}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{c.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Timer className="w-3 h-3" /> {c.entryFee}
                    </span>
                    <Button asChild variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                      <Link href="/register" className="flex items-center gap-2">
                        Join Now <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-display font-bold text-white mb-6">Monthly Leaderboard</h2>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4 font-medium">Rank</th>
                        <th className="px-6 py-4 font-medium">Trader</th>
                        <th className="px-6 py-4 font-medium">Country</th>
                        <th className="px-6 py-4 font-medium">ROI</th>
                        <th className="px-6 py-4 font-medium">Prize</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leaderboard.map((t) => (
                        <tr key={t.rank} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <span className={`font-bold ${t.rank <= 3 ? "text-primary" : "text-white/70"}`}>
                              #{t.rank}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-white">{t.name}</td>
                          <td className="px-6 py-4 text-muted-foreground">{t.country}</td>
                          <td className="px-6 py-4 text-emerald-400 font-mono font-semibold">{t.roi}</td>
                          <td className="px-6 py-4 text-primary font-semibold">{t.prize}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-6">Prize Breakdown</h2>
              <Card className="p-6">
                <div className="space-y-4">
                  {prizeBreakdown.map((p) => (
                    <div key={p.place} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className={`font-semibold ${p.color}`}>{p.place}</span>
                      <span className="text-primary font-display font-bold">{p.prize}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-gold opacity-5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Ready to Prove Your Skills?</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of traders competing for glory and substantial cash prizes. Registration is free for most contests.
          </p>
          <Button asChild size="lg" variant="premium" className="px-12 py-6 text-lg">
            <Link href="/register">Register & Compete</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

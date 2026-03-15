import { useState } from "react";
import { useGetUserDashboard, useGetUserInvestments } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, Wallet, PieChart, Activity, TrendingUp, Crown, Info, Clock, Mail, X } from "lucide-react";

const TIER_COLORS: Record<string, string> = {
  bronze: "bg-orange-700",
  silver: "bg-slate-400",
  gold: "bg-yellow-500",
  platinum: "bg-cyan-400",
  diamond: "bg-blue-400",
};

const TIER_TEXT_COLORS: Record<string, string> = {
  bronze: "text-orange-500",
  silver: "text-slate-300",
  gold: "text-yellow-400",
  platinum: "text-cyan-300",
  diamond: "text-blue-300",
};

const TIER_BG_COLORS: Record<string, string> = {
  bronze: "bg-orange-500/10 border-orange-500/20",
  silver: "bg-slate-400/10 border-slate-400/20",
  gold: "bg-yellow-500/10 border-yellow-500/20",
  platinum: "bg-cyan-400/10 border-cyan-400/20",
  diamond: "bg-blue-400/10 border-blue-400/20",
};

const TIER_BORDER_ACCENT: Record<string, string> = {
  bronze: "border-l-orange-500",
  silver: "border-l-slate-400",
  gold: "border-l-yellow-500",
  platinum: "border-l-cyan-400",
  diamond: "border-l-blue-400",
};

const TIER_GRADIENT: Record<string, string> = {
  bronze: "from-orange-900/40 via-orange-800/20 to-transparent border-orange-600/30",
  silver: "from-slate-600/40 via-slate-500/20 to-transparent border-slate-400/30",
  gold: "from-yellow-900/40 via-yellow-700/20 to-transparent border-yellow-500/30",
  platinum: "from-cyan-900/40 via-cyan-700/20 to-transparent border-cyan-400/30",
  diamond: "from-blue-900/40 via-indigo-700/20 to-transparent border-blue-400/30",
};

function TrialCountdown({ trialStartedAt }: { trialStartedAt: string }) {
  const trialEnd = new Date(new Date(trialStartedAt).getTime() + 3 * 24 * 60 * 60 * 1000);
  const now = new Date();
  const remaining = trialEnd.getTime() - now.getTime();

  if (remaining <= 0) {
    return (
      <Card className="p-4 border-red-500/30 bg-red-500/10">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-400">Your free trial has expired.</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Contact support at{" "}
              <a href="mailto:eliteledgercapital@gmail.com" className="text-primary hover:underline">eliteledgercapital@gmail.com</a>
              {" "}to continue.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;

  return (
    <Card className="p-4 border-amber-500/30 bg-amber-500/10">
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-amber-400 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-400">Free Trial Active</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {days > 0 ? `${days}d ` : ""}{remHours}h {minutes}m remaining.
            Contact{" "}
            <a href="mailto:eliteledgercapital@gmail.com" className="text-primary hover:underline">eliteledgercapital@gmail.com</a>
            {" "}to upgrade.
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-2xl font-bold text-amber-400 font-mono">
            {days > 0 ? `${days}d` : `${remHours}h`}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default function UserOverview() {
  const { user } = useAuth();
  const { data: dashboard, isLoading } = useGetUserDashboard();
  const { data: investments = [] } = useGetUserInvestments();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showPaymentNote, setShowPaymentNote] = useState(true);

  if (isLoading || !dashboard) {
    return <div className="p-8 text-white">Loading dashboard data...</div>;
  }

  const displayBalance = user?.balance ?? dashboard.accountBalance;

  const stats = [
    { label: "Account Balance", value: displayBalance, icon: Wallet, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Invested", value: dashboard.totalInvested, icon: PieChart, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Returns", value: dashboard.totalReturns, icon: ArrowUpRight, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Plans", value: dashboard.activeInvestments, icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10", isCount: true },
  ];

  const planTier = user?.plan?.toLowerCase() ?? "";
  const hasPlan = !!user?.plan;

  const trialStartedAt = user?.trialStartedAt ?? null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-white">
        Welcome back, {user?.firstName || "Investor"}!
      </h2>

      {showWelcome && (
        <Card className="p-4 border-emerald-500/30 bg-emerald-500/10 relative">
          <button onClick={() => setShowWelcome(false)} className="absolute top-3 right-3 text-white/40 hover:text-white">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3 pr-6">
            <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-emerald-400">Welcome to Elite Ledger Capital!</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Your account has been approved. Explore your dashboard to monitor your portfolio,
                track investments, and view transaction history. If you need any assistance,
                our support team is available 24/7.
              </p>
            </div>
          </div>
        </Card>
      )}

      {showPaymentNote && (
        <Card className="p-4 border-blue-500/30 bg-blue-500/10 relative">
          <button onClick={() => setShowPaymentNote(false)} className="absolute top-3 right-3 text-white/40 hover:text-white">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3 pr-6">
            <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-400">Payment & Funding</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                To fund your account or make payments, please contact our support team at{" "}
                <a href="mailto:eliteledgercapital@gmail.com" className="text-primary hover:underline font-medium">
                  eliteledgercapital@gmail.com
                </a>.
                We will provide you with the necessary payment instructions.
              </p>
            </div>
          </div>
        </Card>
      )}

      {trialStartedAt && <TrialCountdown trialStartedAt={trialStartedAt} />}

      {hasPlan ? (
        <div className={`rounded-2xl border p-6 bg-gradient-to-r ${TIER_GRADIENT[planTier] || "from-primary/20 to-transparent border-primary/20"}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${TIER_BG_COLORS[planTier] || "bg-primary/10"} border`}>
                <Crown className={`w-7 h-7 ${TIER_TEXT_COLORS[planTier] || "text-primary"}`} />
              </div>
              <div>
                <p className="text-sm text-white/60 font-medium">Your Investment Plan</p>
                <h2 className={`text-2xl font-display font-bold capitalize ${TIER_TEXT_COLORS[planTier] || "text-primary"}`}>
                  {user?.plan} Plan
                </h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60">Account Balance</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(displayBalance)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Portfolio Overview</h1>
            <p className="text-muted-foreground">Monitor your investment portfolio and returns.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-white/5 border-white/10">
            <Crown className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-bold text-muted-foreground">No Plan Assigned</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className={`p-6 border-white/5 ${hasPlan ? `border-l-2 ${TIER_BORDER_ACCENT[planTier] || ""}` : ""}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
              </div>
              <div className="text-3xl font-bold text-white">
                {stat.isCount ? stat.value : formatCurrency(stat.value)}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-display font-bold text-white">Active Investments</h3>
          </div>
          {investments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <PieChart className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No active investments yet.</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Visit our Plans page to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {investments.map((inv) => {
                const tier = inv.planName?.toLowerCase() ?? "";
                const colorClass = TIER_COLORS[tier] ?? "bg-primary";
                const roiPct = typeof inv.returnPercentage === "number" ? inv.returnPercentage : 0;
                return (
                  <div key={inv.id} className="flex items-center gap-4 p-4 rounded-xl bg-background/50 border border-white/5">
                    <div className={`w-3 h-10 rounded-full ${colorClass} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white capitalize">{inv.planName} Plan</div>
                      <div className="text-xs text-muted-foreground">
                        Started {new Date(inv.startDate).toLocaleDateString()} · ends {new Date(inv.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">{formatCurrency(inv.investedAmount)}</div>
                      <div className="text-xs text-emerald-500 font-medium">{roiPct}% ROI</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${inv.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                      {inv.status}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-display font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {dashboard.recentTransactions.length > 0 ? (
              dashboard.recentTransactions.slice(0, 5).map(tx => (
                <div key={tx.id} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium text-sm text-white capitalize">{tx.type}</div>
                    <div className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className={`font-bold text-sm ${tx.type === "deposit" || tx.type === "profit" ? "text-emerald-500" : "text-white"}`}>
                    {tx.type === "withdrawal" ? "-" : "+"}{formatCurrency(tx.amount)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">No recent activity</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

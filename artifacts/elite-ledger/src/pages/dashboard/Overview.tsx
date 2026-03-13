import { useGetUserDashboard } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, Wallet, PieChart, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function UserOverview() {
  const { data: dashboard, isLoading } = useGetUserDashboard();

  if (isLoading || !dashboard) {
    return <div className="p-8 text-white">Loading dashboard data...</div>;
  }

  // Mock data for the chart since the API doesn't return historical data points yet
  const chartData = [
    { name: "Jan", value: dashboard.totalInvested * 1.0 },
    { name: "Feb", value: dashboard.totalInvested * 1.2 },
    { name: "Mar", value: dashboard.totalInvested * 1.5 },
    { name: "Apr", value: dashboard.totalInvested * 1.9 },
    { name: "May", value: dashboard.totalInvested * 2.5 },
    { name: "Jun", value: dashboard.accountBalance },
  ];

  const stats = [
    { label: "Account Balance", value: dashboard.accountBalance, icon: Wallet, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Invested", value: dashboard.totalInvested, icon: PieChart, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Returns", value: dashboard.totalReturns, icon: ArrowUpRight, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Plans", value: dashboard.activeInvestments, icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10", isCount: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Portfolio Overview</h1>
          <p className="text-muted-foreground">Monitor your compounding assets and returns.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="p-6 border-white/5">
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

      {/* Chart & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-display font-bold text-white mb-6">Performance History</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `$${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [formatCurrency(value), "Balance"]}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
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
                  <div className={`font-bold text-sm ${tx.type === 'deposit' || tx.type === 'profit' ? 'text-emerald-500' : 'text-white'}`}>
                    {tx.type === 'withdrawal' ? '-' : '+'}{formatCurrency(tx.amount)}
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

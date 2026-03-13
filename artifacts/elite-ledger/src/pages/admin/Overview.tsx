import { useAdminGetStats } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Users, Clock, DollarSign, MessageSquare } from "lucide-react";

export default function AdminOverview() {
  const { data: stats, isLoading } = useAdminGetStats();

  if (isLoading || !stats) {
    return <div className="p-8 text-white">Loading system statistics...</div>;
  }

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Pending Approvals", value: stats.pendingUsers, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Total AUM", value: formatCurrency(stats.totalInvestments), icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Chats", value: stats.activeChatSessions, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">System Overview</h1>
        <p className="text-muted-foreground">Administrator dashboard for Elite Ledger Capital.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
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
                {stat.value}
              </div>
            </Card>
          );
        })}
      </div>
      
      <Card className="p-6 mt-8">
        <h3 className="text-lg font-display font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/admin/users" className="p-4 rounded-xl bg-background border border-white/10 hover:border-primary/50 transition-colors group">
            <h4 className="font-bold text-white group-hover:text-primary mb-1">Review Pending Users</h4>
            <p className="text-xs text-muted-foreground">Approve or reject new registrations</p>
          </a>
          <a href="/admin/chat" className="p-4 rounded-xl bg-background border border-white/10 hover:border-primary/50 transition-colors group">
            <h4 className="font-bold text-white group-hover:text-primary mb-1">Live Chat Inbox</h4>
            <p className="text-xs text-muted-foreground">Respond to incoming inquiries</p>
          </a>
        </div>
      </Card>
    </div>
  );
}

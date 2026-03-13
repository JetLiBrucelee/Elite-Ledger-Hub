import { useGetUserInvestments } from "@workspace/api-client-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Investments() {
  const { data: investments = [], isLoading } = useGetUserInvestments();

  if (isLoading) return <div className="text-white p-8">Loading investments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">My Investments</h1>
          <p className="text-muted-foreground">Track your active plans and compounded returns.</p>
        </div>
        <Button variant="premium">New Investment</Button>
      </div>

      {investments.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-white/10 bg-transparent">
          <h3 className="text-xl font-bold text-white mb-2">No Active Plans</h3>
          <p className="text-muted-foreground mb-6">You haven't allocated capital to any investment plans yet.</p>
          <Button variant="outline">Browse Plans</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {investments.map((inv) => (
            <Card key={inv.id} className="p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                {/* Abstract decorative element based on tier */}
                <div className="w-32 h-32 rounded-full border-4 border-primary blur-md" />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-gradient-gold">{inv.planName}</h3>
                    <div className="text-sm text-muted-foreground mt-1">Tier: {inv.planTier.toUpperCase()}</div>
                  </div>
                  <Badge variant={inv.status === 'active' ? 'success' : 'secondary'}>
                    {inv.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-background/50 border border-white/5">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Invested Amount</div>
                    <div className="text-lg font-bold text-white">{formatCurrency(inv.investedAmount)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Current Value</div>
                    <div className="text-lg font-bold text-emerald-500">{formatCurrency(inv.currentValue)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Return Target</div>
                    <div className="text-sm font-medium text-white">{inv.returnPercentage}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Maturity Date</div>
                    <div className="text-sm font-medium text-white">{formatDate(inv.endDate)}</div>
                  </div>
                </div>

                {/* Progress Bar Mock */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-gold" style={{ width: '45%' }} />
                </div>
                <div className="text-right text-xs text-muted-foreground">45% to maturity</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

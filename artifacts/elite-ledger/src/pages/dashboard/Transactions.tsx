import { useGetUserTransactions, useGetUserWithdrawalRequests } from "@workspace/api-client-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownToLine } from "lucide-react";

export default function Transactions() {
  const { data: transactions = [], isLoading } = useGetUserTransactions();
  const { data: withdrawals = [] } = useGetUserWithdrawalRequests();

  if (isLoading) return <div className="text-white p-8">Loading transactions...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Transaction History</h1>
          <p className="text-muted-foreground">Comprehensive ledger of all account activities.</p>
        </div>
      </div>

      <Card className="p-6 border-primary/20 bg-primary/5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <ArrowDownToLine className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Withdrawals</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Withdrawal requests are currently processed manually by our support team. To request a withdrawal, please contact us at{" "}
              <a href="mailto:eliteledgercapital@gmail.com" className="text-primary hover:underline font-medium">
                eliteledgercapital@gmail.com
              </a>{" "}
              with your account details and desired amount.
            </p>
          </div>
        </div>
      </Card>

      {withdrawals.length > 0 && (
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="text-lg font-bold text-white">Withdrawal Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-medium">ID / Date</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Method</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">#{w.id.toString().padStart(6, '0')}</div>
                      <div className="text-xs text-muted-foreground mt-1">{formatDate(w.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-white">{formatCurrency(w.amount)}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground capitalize">
                      {w.method?.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        w.status === 'approved' ? 'success' :
                        w.status === 'pending' ? 'warning' : 'destructive'
                      }>
                        {w.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs max-w-[200px] truncate">
                      {w.adminNote || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">ID / Date</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">#{tx.id.toString().padStart(6, '0')}</div>
                      <div className="text-xs text-muted-foreground mt-1">{formatDate(tx.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize font-medium text-white">{tx.type}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {tx.description}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${tx.type === 'withdrawal' ? 'text-white' : 'text-emerald-500'}`}>
                        {tx.type === 'withdrawal' ? '-' : '+'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        tx.status === 'completed' ? 'success' : 
                        tx.status === 'pending' ? 'warning' : 'destructive'
                      }>
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}

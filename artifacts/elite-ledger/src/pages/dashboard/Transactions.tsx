import { useGetUserTransactions } from "@workspace/api-client-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Transactions() {
  const { data: transactions = [], isLoading } = useGetUserTransactions();

  if (isLoading) return <div className="text-white p-8">Loading transactions...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Transaction History</h1>
        <p className="text-muted-foreground">Comprehensive ledger of all account activities.</p>
      </div>

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

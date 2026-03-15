import { useState } from "react";
import { useGetUserTransactions, useGetUserWithdrawalRequests } from "@workspace/api-client-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, X } from "lucide-react";

function WithdrawalBlockedOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-[#14161c] border border-white/10 rounded-2xl p-8 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ArrowDownToLine className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-white">Withdrawal Request</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Withdrawal requests are currently processed manually by our support team for your security and compliance.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To request a withdrawal, please contact us at{" "}
            <a href="mailto:eliteledgercapital@gmail.com" className="text-primary hover:underline font-medium">
              eliteledgercapital@gmail.com
            </a>{" "}
            with your account details and desired amount. Our team will process your request within 24–48 hours.
          </p>
          <Button variant="premium" className="w-full mt-2" onClick={onClose}>
            Understood
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Transactions() {
  const { data: transactions = [], isLoading } = useGetUserTransactions();
  const { data: withdrawals = [] } = useGetUserWithdrawalRequests();
  const [showWithdrawalOverlay, setShowWithdrawalOverlay] = useState(false);

  if (isLoading) return <div className="text-white p-8">Loading transactions...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Transaction History</h1>
          <p className="text-muted-foreground">Comprehensive ledger of all account activities.</p>
        </div>
        <Button variant="premium" onClick={() => setShowWithdrawalOverlay(true)}>
          <ArrowDownToLine className="w-4 h-4 mr-2" /> Request Withdrawal
        </Button>
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

      {showWithdrawalOverlay && <WithdrawalBlockedOverlay onClose={() => setShowWithdrawalOverlay(false)} />}
    </div>
  );
}

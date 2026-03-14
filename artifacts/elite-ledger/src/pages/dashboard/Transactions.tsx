import { useState } from "react";
import { useGetUserTransactions, useGetUserWithdrawalRequests, useCreateWithdrawalRequest, getGetUserTransactionsQueryKey, getGetUserWithdrawalRequestsQueryKey, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function WithdrawalModal({ onClose, userBalance }: { onClose: () => void; userBalance: number }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank_transfer");
  const [walletAddress, setWalletAddress] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const createMutation = useCreateWithdrawalRequest();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast({ title: "Enter a valid positive amount", variant: "destructive" });
      return;
    }
    if (numAmount > userBalance) {
      toast({ title: "Amount exceeds your available balance", variant: "destructive" });
      return;
    }
    try {
      await createMutation.mutateAsync({
        data: {
          amount: numAmount,
          method,
          walletAddress: walletAddress || undefined,
          bankDetails: bankDetails || undefined,
        },
      });
      toast({ title: "Withdrawal request submitted successfully" });
      queryClient.invalidateQueries({ queryKey: getGetUserWithdrawalRequestsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetUserTransactionsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit withdrawal request";
      toast({ title: msg, variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-[#14161c] border border-white/10 rounded-2xl p-8 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-bold text-white mb-2">Request Withdrawal</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Available balance: <span className="text-white font-mono">{formatCurrency(userBalance)}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Amount ($)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors font-mono text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Withdrawal Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="crypto">Cryptocurrency</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          {method === "crypto" && (
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Wallet Address</label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter your wallet address"
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          )}

          {(method === "bank_transfer" || method === "paypal") && (
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                {method === "bank_transfer" ? "Bank Details" : "PayPal Email"}
              </label>
              <input
                type="text"
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                placeholder={method === "bank_transfer" ? "Account number, routing, etc." : "your@email.com"}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base mt-2"
          >
            {createMutation.isPending ? "Submitting..." : "Submit Withdrawal Request"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function Transactions() {
  const { user } = useAuth();
  const { data: transactions = [], isLoading } = useGetUserTransactions();
  const { data: withdrawals = [] } = useGetUserWithdrawalRequests();
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  if (isLoading) return <div className="text-white p-8">Loading transactions...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Transaction History</h1>
          <p className="text-muted-foreground">Comprehensive ledger of all account activities.</p>
        </div>
        <Button
          onClick={() => setShowWithdrawalModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <ArrowDownToLine className="w-4 h-4" />
          Request Withdrawal
        </Button>
      </div>

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

      {showWithdrawalModal && (
        <WithdrawalModal
          onClose={() => setShowWithdrawalModal(false)}
          userBalance={user?.balance ?? 0}
        />
      )}
    </div>
  );
}

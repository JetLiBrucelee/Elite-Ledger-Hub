import { useState } from "react";
import {
  useAdminGetWithdrawals,
  useAdminApproveWithdrawal,
  useAdminRejectWithdrawal,
  getAdminGetWithdrawalsQueryKey,
  getAdminGetUsersQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminWithdrawals() {
  const { data: withdrawals = [], isLoading } = useAdminGetWithdrawals();
  const approveMutation = useAdminApproveWithdrawal();
  const rejectMutation = useAdminRejectWithdrawal();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const filtered = filter === "all" ? withdrawals : withdrawals.filter((w) => w.status === filter);
  const pendingCount = withdrawals.filter((w) => w.status === "pending").length;

  const handleApprove = async (id: number) => {
    try {
      await approveMutation.mutateAsync({ id, data: {} });
      toast({ title: "Withdrawal approved and balance deducted" });
      queryClient.invalidateQueries({ queryKey: getAdminGetWithdrawalsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getAdminGetUsersQueryKey({}) });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to approve withdrawal";
      toast({ title: msg, variant: "destructive" });
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectMutation.mutateAsync({ id, data: {} });
      toast({ title: "Withdrawal rejected" });
      queryClient.invalidateQueries({ queryKey: getAdminGetWithdrawalsQueryKey() });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to reject withdrawal";
      toast({ title: msg, variant: "destructive" });
    }
  };

  if (isLoading) return <div className="text-white p-8">Loading withdrawal requests...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Withdrawal Requests</h1>
          <p className="text-muted-foreground">
            Review and process user withdrawal requests.
            {pendingCount > 0 && (
              <span className="text-amber-500 ml-2">({pendingCount} pending)</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === f
                ? "bg-primary/20 text-primary border border-primary/40"
                : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">ID / Date</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No withdrawal requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((w) => (
                  <tr key={w.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">#{w.id.toString().padStart(6, '0')}</div>
                      <div className="text-xs text-muted-foreground mt-1">{formatDate(w.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{w.userName}</div>
                      <div className="text-xs text-muted-foreground">{w.userEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-white">{formatCurrency(w.amount)}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground capitalize">
                      {w.method?.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs max-w-[200px] truncate">
                      {w.walletAddress || w.bankDetails || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        w.status === 'approved' ? 'success' :
                        w.status === 'pending' ? 'warning' : 'destructive'
                      }>
                        {w.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {w.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleApprove(w.id)}
                            disabled={approveMutation.isPending}
                            className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReject(w.id)}
                            disabled={rejectMutation.isPending}
                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Processed</span>
                      )}
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

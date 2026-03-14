import { useState } from "react";
import {
  useAdminGetUsers,
  useAdminApproveUser,
  useAdminRejectUser,
  useAdminBlockUser,
  useAdminUnblockUser,
  useAdminEditUser,
  useAdminCreateUser,
  useAdminSuspendUser,
  useAdminCreditUser,
  useAdminDebitUser,
  getAdminGetUsersQueryKey,
} from "@workspace/api-client-react";
import type { User, AdminCreateUserRequest, AdminEditUserRequest } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Ban, Unlock, Pencil, Plus, DollarSign, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function CreateUserDialog({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState<AdminCreateUserRequest>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    country: "",
    role: "user",
    status: "approved",
    balance: 0,
    plan: "",
  });
  const createMutation = useAdminCreateUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({ data: formData });
      toast({ title: "User created successfully" });
      queryClient.invalidateQueries({ queryKey: getAdminGetUsersQueryKey({}) });
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create user";
      toast({ title: msg, variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-[#14161c] border border-white/10 rounded-2xl p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-bold text-white mb-6">Create New User</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">First Name</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Phone</label>
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Country</label>
              <input
                type="text"
                value={formData.country || ""}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Role</label>
              <select
                value={formData.role || "user"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as "user" | "admin" })}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Status</label>
              <select
                value={formData.status || "approved"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "pending" | "approved" | "rejected" | "blocked" })}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Balance ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.balance ?? 0}
                onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Plan / Tier</label>
              <select
                value={formData.plan || ""}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="">None</option>
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
                <option value="Diamond">Diamond</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base mt-4"
          >
            {createMutation.isPending ? "Creating..." : "Create User"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function EditUserDialog({ user, onClose }: { user: User; onClose: () => void }) {
  const [formData, setFormData] = useState<AdminEditUserRequest>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || "",
    country: user.country || "",
    role: user.role as "user" | "admin",
    status: user.status as "pending" | "approved" | "rejected" | "blocked",
    balance: user.balance ?? 0,
    plan: user.plan || "",
  });
  const editMutation = useAdminEditUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editMutation.mutateAsync({ id: user.id, data: formData });
      toast({ title: "User updated successfully" });
      queryClient.invalidateQueries({ queryKey: getAdminGetUsersQueryKey({}) });
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update user";
      toast({ title: msg, variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-[#14161c] border border-white/10 rounded-2xl p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-bold text-white mb-6">Edit User</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">First Name</label>
              <input
                type="text"
                value={formData.firstName || ""}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Last Name</label>
              <input
                type="text"
                value={formData.lastName || ""}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Email</label>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Phone</label>
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Country</label>
              <input
                type="text"
                value={formData.country || ""}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Role</label>
              <select
                value={formData.role || "user"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as "user" | "admin" })}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Status</label>
              <select
                value={formData.status || "approved"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "pending" | "approved" | "rejected" | "blocked" })}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Balance ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.balance ?? 0}
                onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Plan / Tier</label>
              <select
                value={formData.plan || ""}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="">None</option>
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
                <option value="Diamond">Diamond</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={editMutation.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base mt-4"
          >
            {editMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function AdjustBalanceDialog({ user, onClose }: { user: User; onClose: () => void }) {
  const [mode, setMode] = useState<"credit" | "debit">("credit");
  const [amount, setAmount] = useState("");
  const creditMutation = useAdminCreditUser();
  const debitMutation = useAdminDebitUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast({ title: "Enter a valid positive amount", variant: "destructive" });
      return;
    }
    try {
      if (mode === "credit") {
        await creditMutation.mutateAsync({ id: user.id, data: { amount: numAmount } });
        toast({ title: `$${numAmount.toLocaleString()} credited to ${user.firstName}` });
      } else {
        await debitMutation.mutateAsync({ id: user.id, data: { amount: numAmount } });
        toast({ title: `$${numAmount.toLocaleString()} debited from ${user.firstName}` });
      }
      queryClient.invalidateQueries({ queryKey: getAdminGetUsersQueryKey({}) });
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Balance adjustment failed";
      toast({ title: msg, variant: "destructive" });
    }
  };

  const isPending = creditMutation.isPending || debitMutation.isPending;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-[#14161c] border border-white/10 rounded-2xl p-8 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-bold text-white mb-2">Adjust Balance</h3>
        <p className="text-muted-foreground mb-1">{user.firstName} {user.lastName}</p>
        <p className="text-sm text-muted-foreground mb-6">
          Current balance: <span className="text-white font-mono">${(user.balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("credit")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                mode === "credit"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
              }`}
            >
              Credit (Add)
            </button>
            <button
              type="button"
              onClick={() => setMode("debit")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                mode === "debit"
                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                  : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
              }`}
            >
              Debit (Remove)
            </button>
          </div>

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

          <Button
            type="submit"
            disabled={isPending}
            className={`w-full py-6 text-base mt-2 ${
              mode === "credit"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {isPending ? "Processing..." : mode === "credit" ? "Credit Balance" : "Debit Balance"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [adjustingUser, setAdjustingUser] = useState<User | null>(null);
  const { data: users = [], isLoading } = useAdminGetUsers({});
  const approveMutation = useAdminApproveUser();
  const rejectMutation = useAdminRejectUser();
  const blockMutation = useAdminBlockUser();
  const unblockMutation = useAdminUnblockUser();
  const suspendMutation = useAdminSuspendUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  if (isLoading) return <div className="text-white p-8">Loading users...</div>;

  const handleAction = async (id: number, action: "approve" | "reject" | "block" | "unblock" | "suspend") => {
    try {
      if (action === "approve") {
        await approveMutation.mutateAsync({ id });
        toast({ title: "User Approved" });
      } else if (action === "reject") {
        await rejectMutation.mutateAsync({ id });
        toast({ title: "User Rejected", variant: "destructive" });
      } else if (action === "block") {
        await blockMutation.mutateAsync({ id });
        toast({ title: "User Blocked", variant: "destructive" });
      } else if (action === "unblock") {
        await unblockMutation.mutateAsync({ id });
        toast({ title: "User Unblocked" });
      } else if (action === "suspend") {
        await suspendMutation.mutateAsync({ id });
        toast({ title: "User Suspended (set to pending)" });
      }
      queryClient.invalidateQueries({ queryKey: getAdminGetUsersQueryKey({}) });
    } catch {
      toast({ title: "Action failed", variant: "destructive" });
    }
  };

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved": return "success" as const;
      case "pending": return "warning" as const;
      case "blocked": return "destructive" as const;
      default: return "destructive" as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">User Management</h1>
          <p className="text-muted-foreground">Review and manage platform access.</p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" /> Create User
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Balance</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{u.firstName} {u.lastName}</div>
                    <div className="text-xs text-muted-foreground mt-1">Joined {formatDate(u.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">{u.email}</div>
                    {u.phone && <div className="text-xs text-muted-foreground mt-1">{u.phone}</div>}
                    {u.country && <div className="text-xs text-muted-foreground">{u.country}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">{u.plan || "—"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-mono">${(u.balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{u.role}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusBadgeVariant(u.status)}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {u.status === "pending" && u.role !== "admin" && (
                        <>
                          <Button size="sm" variant="outline" className="h-8 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                                  onClick={() => handleAction(u.id, "approve")}
                                  disabled={approveMutation.isPending}>
                            <Unlock className="w-4 h-4 mr-1" /> Unsuspend
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 border-destructive/30 text-destructive hover:bg-destructive/10"
                                  onClick={() => handleAction(u.id, "reject")}
                                  disabled={rejectMutation.isPending}>
                            <X className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                      {u.status === "approved" && u.role !== "admin" && (
                        <>
                          <Button size="sm" variant="outline" className="h-8 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                                  onClick={() => handleAction(u.id, "suspend")}
                                  disabled={suspendMutation.isPending}>
                            <Pause className="w-4 h-4 mr-1" /> Suspend
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 border-orange-500/30 text-orange-500 hover:bg-orange-500/10"
                                  onClick={() => handleAction(u.id, "block")}
                                  disabled={blockMutation.isPending}>
                            <Ban className="w-4 h-4 mr-1" /> Block
                          </Button>
                        </>
                      )}
                      {u.status === "blocked" && u.role !== "admin" && (
                        <Button size="sm" variant="outline" className="h-8 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                                onClick={() => handleAction(u.id, "unblock")}
                                disabled={unblockMutation.isPending}>
                          <Unlock className="w-4 h-4 mr-1" /> Unblock
                        </Button>
                      )}
                      {u.role !== "admin" && (
                        <Button size="sm" variant="outline" className="h-8 border-primary/30 text-primary hover:bg-primary/10"
                                onClick={() => setAdjustingUser(u)}>
                          <DollarSign className="w-4 h-4 mr-1" /> Adjust Balance
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="h-8 border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
                              onClick={() => setEditingUser(u)}>
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showCreateDialog && <CreateUserDialog onClose={() => setShowCreateDialog(false)} />}
      {editingUser && <EditUserDialog user={editingUser} onClose={() => setEditingUser(null)} />}
      {adjustingUser && <AdjustBalanceDialog user={adjustingUser} onClose={() => setAdjustingUser(null)} />}
    </div>
  );
}

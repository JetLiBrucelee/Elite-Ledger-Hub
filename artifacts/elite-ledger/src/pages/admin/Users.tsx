import { useAdminGetUsers, useAdminApproveUser, useAdminRejectUser, getAdminGetUsersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsers() {
  const { data: users = [], isLoading } = useAdminGetUsers({});
  const approveMutation = useAdminApproveUser();
  const rejectMutation = useAdminRejectUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  if (isLoading) return <div className="text-white p-8">Loading users...</div>;

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await approveMutation.mutateAsync({ id });
        toast({ title: "User Approved" });
      } else {
        await rejectMutation.mutateAsync({ id });
        toast({ title: "User Rejected", variant: "destructive" });
      }
      queryClient.invalidateQueries({ queryKey: getAdminGetUsersQueryKey({}) });
    } catch (e) {
      toast({ title: "Action failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">User Management</h1>
        <p className="text-muted-foreground">Review and manage platform access.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Contact</th>
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
                    <Badge variant="outline">{u.role}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      u.status === 'approved' ? 'success' : 
                      u.status === 'pending' ? 'warning' : 'destructive'
                    }>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {u.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                                onClick={() => handleAction(u.id, 'approve')}
                                disabled={approveMutation.isPending}>
                          <Check className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 border-destructive/30 text-destructive hover:bg-destructive/10"
                                onClick={() => handleAction(u.id, 'reject')}
                                disabled={rejectMutation.isPending}>
                          <X className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

import { useState } from "react";
import {
  useAdminGetApplications,
  useAdminUpdateApplicationStatus,
  getAdminGetApplicationsQueryKey,
} from "@workspace/api-client-react";
import type { JobApplication } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function ApplicationDetailModal({ application, onClose }: { application: JobApplication; onClose: () => void }) {
  const updateMutation = useAdminUpdateApplicationStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusUpdate = async (status: "reviewed" | "rejected") => {
    try {
      await updateMutation.mutateAsync({ id: application.id, data: { status } });
      toast({ title: `Application marked as ${status}` });
      queryClient.invalidateQueries({ queryKey: getAdminGetApplicationsQueryKey() });
      onClose();
    } catch {
      toast({ title: "Failed to update status", variant: "destructive" });
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

        <h3 className="text-2xl font-bold text-white mb-1">Application Details</h3>
        <p className="text-muted-foreground mb-6">Submitted {formatDate(application.createdAt)}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Applicant Name</label>
            <p className="text-white font-medium">{application.name}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Email</label>
            <p className="text-white">{application.email}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Position</label>
            <p className="text-primary font-medium">{application.position}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Cover Message</label>
            <p className="text-white/80 leading-relaxed bg-background/50 rounded-lg p-4 border border-white/5">{application.message}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Status</label>
            <Badge variant={
              application.status === "reviewed" ? "success" :
              application.status === "pending" ? "warning" : "destructive"
            }>
              {application.status}
            </Badge>
          </div>
        </div>

        {application.status === "pending" && (
          <div className="flex items-center gap-3 mt-8">
            <Button
              onClick={() => handleStatusUpdate("reviewed")}
              disabled={updateMutation.isPending}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Mark Reviewed
            </Button>
            <Button
              onClick={() => handleStatusUpdate("rejected")}
              disabled={updateMutation.isPending}
              variant="outline"
              className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <XCircle className="w-4 h-4 mr-2" /> Reject
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminApplications() {
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const { data: applications = [], isLoading } = useAdminGetApplications();
  const updateMutation = useAdminUpdateApplicationStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  if (isLoading) return <div className="text-white p-8">Loading applications...</div>;

  const handleQuickAction = async (id: number, status: "reviewed" | "rejected") => {
    try {
      await updateMutation.mutateAsync({ id, data: { status } });
      toast({ title: `Application marked as ${status}` });
      queryClient.invalidateQueries({ queryKey: getAdminGetApplicationsQueryKey() });
    } catch {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const reviewedCount = applications.filter((a) => a.status === "reviewed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Job Applications</h1>
        <p className="text-muted-foreground">Review applications submitted from the Careers page.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold text-white">{applications.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Reviewed</p>
          <p className="text-2xl font-bold text-emerald-500">{reviewedCount}</p>
        </Card>
      </div>

      {applications.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg">No job applications yet.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-medium">Applicant</th>
                  <th className="px-6 py-4 font-medium">Position</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{app.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{app.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-primary font-medium">{app.position}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/70">{formatDate(app.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        app.status === "reviewed" ? "success" :
                        app.status === "pending" ? "warning" : "destructive"
                      }>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button size="sm" variant="outline" className="h-8 border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
                                onClick={() => setSelectedApplication(app)}>
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                        {app.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline" className="h-8 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                                    onClick={() => handleQuickAction(app.id, "reviewed")}
                                    disabled={updateMutation.isPending}>
                              <CheckCircle className="w-4 h-4 mr-1" /> Review
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 border-destructive/30 text-destructive hover:bg-destructive/10"
                                    onClick={() => handleQuickAction(app.id, "rejected")}
                                    disabled={updateMutation.isPending}>
                              <XCircle className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}

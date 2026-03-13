import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Globe, Shield, CheckCircle2 } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile and security settings</p>
      </div>

      <Card className="p-6 border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-white">Profile Information</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">First Name</label>
              <Input defaultValue={user.firstName} readOnly className="bg-background/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Last Name</label>
              <Input defaultValue={user.lastName} readOnly className="bg-background/50" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5 flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" /> Email Address
            </label>
            <Input defaultValue={user.email} readOnly className="bg-background/50" />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5 flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" /> Phone Number
            </label>
            <Input defaultValue={user.phone ?? ""} placeholder="Not provided" readOnly className="bg-background/50" />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5 flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" /> Country
            </label>
            <Input defaultValue={user.country ?? ""} placeholder="Not provided" readOnly className="bg-background/50" />
          </div>

          {saved && (
            <div className="flex items-center gap-2 text-emerald-500 text-sm">
              <CheckCircle2 className="w-4 h-4" /> Profile information noted.
            </div>
          )}
        </form>
      </Card>

      <Card className="p-6 border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-white">Account Status</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div>
              <div className="font-medium text-white">Account Role</div>
              <div className="text-sm text-muted-foreground">Your permission level on the platform</div>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold capitalize">
              {user.role}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div>
              <div className="font-medium text-white">Verification Status</div>
              <div className="text-sm text-muted-foreground">KYC and account approval status</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
              user.status === "approved"
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-amber-500/10 text-amber-500"
            }`}>
              {user.status}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-white">Member Since</div>
              <div className="text-sm text-muted-foreground">Account creation date</div>
            </div>
            <span className="text-white text-sm">
              {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-white/5 border-amber-500/10 bg-amber-500/5">
        <p className="text-sm text-amber-500/80">
          To update your personal information or change your password, please contact our support team via live chat or email at support@eliteledgercapital.com.
        </p>
      </Card>
    </div>
  );
}

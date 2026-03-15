import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateUserProfile, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Globe, Shield, MapPin, Building, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const updateProfileMutation = useUpdateUserProfile();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [country, setCountry] = useState(user?.country ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [stateProvince, setStateProvince] = useState(user?.stateProvince ?? "");
  const [zipCode, setZipCode] = useState(user?.zipCode ?? "");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhone(user.phone ?? "");
      setCountry(user.country ?? "");
      setAddress(user.address ?? "");
      setCity(user.city ?? "");
      setStateProvince(user.stateProvince ?? "");
      setZipCode(user.zipCode ?? "");
    }
  }, [user?.firstName, user?.lastName, user?.phone, user?.country, user?.address, user?.city, user?.stateProvince, user?.zipCode]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast({ title: "First and last name are required", variant: "destructive" });
      return;
    }
    try {
      await updateProfileMutation.mutateAsync({
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          country: country.trim(),
          address: address.trim(),
          city: city.trim(),
          stateProvince: stateProvince.trim(),
          zipCode: zipCode.trim(),
        },
      });
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      toast({ title: "Profile updated successfully" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      toast({ title: msg, variant: "destructive" });
    }
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
              {isAdmin ? (
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-background/50"
                />
              ) : (
                <Input defaultValue={user.firstName} readOnly className="bg-background/50" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Last Name</label>
              {isAdmin ? (
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-background/50"
                />
              ) : (
                <Input defaultValue={user.lastName} readOnly className="bg-background/50" />
              )}
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
            {isAdmin ? (
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="bg-background/50"
              />
            ) : (
              <Input defaultValue={user.phone ?? ""} placeholder="Not provided" readOnly className="bg-background/50" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5 flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" /> Country
            </label>
            {isAdmin ? (
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter country"
                className="bg-background/50"
              />
            ) : (
              <Input defaultValue={user.country ?? ""} placeholder="Not provided" readOnly className="bg-background/50" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" /> Address
            </label>
            {isAdmin ? (
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
                className="bg-background/50"
              />
            ) : (
              <Input defaultValue={user.address ?? ""} placeholder="Not provided" readOnly className="bg-background/50" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5 flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground" /> City
              </label>
              {isAdmin ? (
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                  className="bg-background/50"
                />
              ) : (
                <Input defaultValue={user.city ?? ""} placeholder="Not provided" readOnly className="bg-background/50" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5 flex items-center gap-2">
                State / Province
              </label>
              {isAdmin ? (
                <Input
                  value={stateProvince}
                  onChange={(e) => setStateProvince(e.target.value)}
                  placeholder="Enter state/province"
                  className="bg-background/50"
                />
              ) : (
                <Input defaultValue={user.stateProvince ?? ""} placeholder="Not provided" readOnly className="bg-background/50" />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5 flex items-center gap-2">
              <Hash className="w-4 h-4 text-muted-foreground" /> Zip Code
            </label>
            {isAdmin ? (
              <Input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter zip code"
                className="bg-background/50"
              />
            ) : (
              <Input defaultValue={user.zipCode ?? ""} placeholder="Not provided" readOnly className="bg-background/50" />
            )}
          </div>

          {isAdmin && (
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 text-base mt-2"
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
            </Button>
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

          {user.plan && (
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <div className="font-medium text-white">Current Plan</div>
                <div className="text-sm text-muted-foreground">Your active investment tier</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold capitalize">
                {user.plan}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-white">Member Since</div>
              <div className="text-sm text-muted-foreground">Account creation date</div>
            </div>
            <span className="text-white text-sm">
              {new Date(user.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "America/New_York" })}
            </span>
          </div>
        </div>
      </Card>

      {!isAdmin && (
        <Card className="p-6 border-white/5 border-amber-500/10 bg-amber-500/5">
          <p className="text-sm text-amber-500/80">
            To update your personal information or change your password, please contact our support team via live chat or email at support@eliteledgercapital.com.
          </p>
        </Card>
      )}
    </div>
  );
}

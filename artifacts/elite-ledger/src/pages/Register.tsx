import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useRegister } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  country: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const registerMutation = useRegister();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", phone: "", country: "" },
  });

  const onSubmit = async (values: RegisterForm) => {
    try {
      setApiError(null);
      await registerMutation.mutateAsync({ data: values });
      setSuccess(true);
    } catch (err: unknown) {
      const apiErr = err as { data?: { error?: string } };
      setApiError(apiErr?.data?.error ?? "Registration failed. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white">Registration Complete</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your account has been created successfully. For security reasons, all new accounts require administrator approval before accessing the platform.
          </p>
          <div className="pt-4 border-t border-white/10">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Return to Homepage</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}images/pattern-bg.png`}
          className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          alt="Background"
        />
      </div>

      <div className="w-full max-w-xl relative z-10">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join Elite Ledger Capital</p>
        </div>

        <Card className="p-8">
          {apiError && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
              {apiError}
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">First Name</label>
                <Input {...form.register("firstName")} placeholder="John" autoComplete="given-name" />
                {form.formState.errors.firstName && <p className="text-xs text-destructive mt-1">{form.formState.errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Last Name</label>
                <Input {...form.register("lastName")} placeholder="Doe" autoComplete="family-name" />
                {form.formState.errors.lastName && <p className="text-xs text-destructive mt-1">{form.formState.errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Email Address</label>
              <Input type="email" {...form.register("email")} placeholder="name@example.com" autoComplete="email" />
              {form.formState.errors.email && <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Password</label>
              <Input type="password" {...form.register("password")} placeholder="••••••••" autoComplete="new-password" />
              {form.formState.errors.password && <p className="text-xs text-destructive mt-1">{form.formState.errors.password.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Phone (Optional)</label>
                <Input {...form.register("phone")} placeholder="+1 234 567 890" autoComplete="tel" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Country (Optional)</label>
                <Input {...form.register("country")} placeholder="United Kingdom" autoComplete="country-name" />
              </div>
            </div>

            <Button type="submit" variant="premium" className="w-full mt-6" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

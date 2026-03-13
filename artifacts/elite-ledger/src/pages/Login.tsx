import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, AlertCircle, Clock } from "lucide-react";
import { useLogin, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

type AlertState = { type: "error" | "pending"; message: string } | null;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const loginMutation = useLogin();
  const [alert, setAlert] = useState<AlertState>(null);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      setAlert(null);
      const res = await loginMutation.mutateAsync({ data: values });
      await queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      toast({ title: "Welcome back", description: "Successfully logged in." });
      setLocation(res.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err: unknown) {
      const apiErr = err as { data?: { error?: string; code?: string } };
      const code = apiErr?.data?.code;
      const message = apiErr?.data?.error ?? "Invalid credentials. Please try again.";

      if (code === "PENDING_APPROVAL") {
        setAlert({ type: "pending", message });
      } else {
        setAlert({ type: "error", message });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}images/pattern-bg.png`}
          className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          alt="Background"
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <div className="text-center mb-8">
          <img src={`${import.meta.env.BASE_URL}images/logo-mark.png`} alt="Logo" className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to manage your portfolio</p>
        </div>

        <Card className="p-8">
          {alert && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              alert.type === "pending"
                ? "bg-amber-500/10 border border-amber-500/30"
                : "bg-destructive/10 border border-destructive/30"
            }`}>
              {alert.type === "pending"
                ? <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                : <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />}
              <p className={`text-sm ${alert.type === "pending" ? "text-amber-500" : "text-destructive"}`}>
                {alert.message}
              </p>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Email Address</label>
              <Input {...form.register("email")} placeholder="name@example.com" autoComplete="email" />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Password</label>
              <Input type="password" {...form.register("password")} placeholder="••••••••" autoComplete="current-password" />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button type="submit" variant="premium" className="w-full mt-6" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Register now
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

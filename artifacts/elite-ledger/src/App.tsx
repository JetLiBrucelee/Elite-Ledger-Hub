import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { CustomCursor } from "@/components/CustomCursor";
import { ChatWidget } from "@/components/ChatWidget";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Plans from "@/pages/Plans";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import UserOverview from "@/pages/dashboard/Overview";
import Investments from "@/pages/dashboard/Investments";
import Transactions from "@/pages/dashboard/Transactions";
import AdminOverview from "@/pages/admin/Overview";
import AdminUsers from "@/pages/admin/Users";
import AdminChat from "@/pages/admin/Chat";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return <Redirect to="/login" />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return <Redirect to="/login" />;
  if (!isAdmin) return <Redirect to="/dashboard" />;
  return <>{children}</>;
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/plans" component={Plans} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />

      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardLayout><UserOverview /></DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/investments">
        <ProtectedRoute>
          <DashboardLayout><Investments /></DashboardLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/transactions">
        <ProtectedRoute>
          <DashboardLayout><Transactions /></DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/admin">
        <AdminRoute>
          <DashboardLayout><AdminOverview /></DashboardLayout>
        </AdminRoute>
      </Route>
      <Route path="/admin/users">
        <AdminRoute>
          <DashboardLayout><AdminUsers /></DashboardLayout>
        </AdminRoute>
      </Route>
      <Route path="/admin/chat">
        <AdminRoute>
          <DashboardLayout><AdminChat /></DashboardLayout>
        </AdminRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <CustomCursor />
            <AppRouter />
            <ChatWidget />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

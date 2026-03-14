import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
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
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import RiskDisclosure from "@/pages/RiskDisclosure";
import Careers from "@/pages/Careers";
import Promotion from "@/pages/Promotion";
import GiveAways from "@/pages/GiveAways";
import TradingContests from "@/pages/TradingContests";
import ReferralProgram from "@/pages/ReferralProgram";
import JoinCopyTrading from "@/pages/JoinCopyTrading";
import MastersRating from "@/pages/MastersRating";
import Forex from "@/pages/markets/Forex";
import CommoditiesPage from "@/pages/markets/Commodities";
import Indices from "@/pages/markets/Indices";
import Stocks from "@/pages/markets/Stocks";
import Futures from "@/pages/markets/Futures";
import CryptocurrenciesPage from "@/pages/markets/Cryptocurrencies";
import UserOverview from "@/pages/dashboard/Overview";
import Investments from "@/pages/dashboard/Investments";
import Transactions from "@/pages/dashboard/Transactions";
import DashboardSettings from "@/pages/dashboard/Settings";
import AdminOverview from "@/pages/admin/Overview";
import AdminUsers from "@/pages/admin/Users";
import AdminChat from "@/pages/admin/Chat";
import AdminApplications from "@/pages/admin/Applications";

const queryClient = new QueryClient();

function PendingWall() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 text-center">
        <img
          src={`${import.meta.env.BASE_URL}images/logo-mark.png`}
          alt="Elite Ledger Capital"
          className="w-24 h-24 mx-auto mb-6 object-contain"
        />
        <h1 className="text-2xl font-bold text-primary mb-4">Account Under Review</h1>
        <p className="text-muted-foreground mb-6">
          Your account is currently under review or has been suspended.
          An administrator will review your account shortly. You will gain access once approved.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Checking status automatically...</span>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, isPendingApproval } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return <Redirect to="/login" />;
  if (isPendingApproval) return <PendingWall />;
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
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/risk-disclosure" component={RiskDisclosure} />
      <Route path="/careers" component={Careers} />
      <Route path="/promotion" component={Promotion} />
      <Route path="/giveaways" component={GiveAways} />
      <Route path="/trading-contests" component={TradingContests} />
      <Route path="/referral-program" component={ReferralProgram} />
      <Route path="/copytrading" component={JoinCopyTrading} />
      <Route path="/masters-rating" component={MastersRating} />
      <Route path="/markets/forex" component={Forex} />
      <Route path="/markets/commodities" component={CommoditiesPage} />
      <Route path="/markets/indices" component={Indices} />
      <Route path="/markets/stocks" component={Stocks} />
      <Route path="/markets/futures" component={Futures} />
      <Route path="/markets/cryptocurrencies" component={CryptocurrenciesPage} />

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
      <Route path="/dashboard/settings">
        <ProtectedRoute>
          <DashboardLayout><DashboardSettings /></DashboardLayout>
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
      <Route path="/admin/applications">
        <AdminRoute>
          <DashboardLayout><AdminApplications /></DashboardLayout>
        </AdminRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function PublicChatWidget() {
  const [location] = useLocation();
  const isPrivateRoute = location.startsWith("/dashboard") || location.startsWith("/admin");
  if (isPrivateRoute) return null;
  return <ChatWidget />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <CustomCursor />
            <AppRouter />
            <PublicChatWidget />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

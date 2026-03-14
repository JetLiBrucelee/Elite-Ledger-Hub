import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLogout, useUserHeartbeat } from "@workspace/api-client-react";
import { 
  LayoutDashboard, 
  TrendingUp, 
  History, 
  Settings, 
  LogOut, 
  Users, 
  MessageSquare,
  AlertCircle,
  FileText,
  ArrowDownToLine
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TIER_ACCENT_COLORS: Record<string, string> = {
  bronze: "border-orange-500",
  silver: "border-slate-400",
  gold: "border-yellow-500",
  platinum: "border-cyan-400",
  diamond: "border-blue-400",
};

const TIER_ACCENT_BG: Record<string, string> = {
  bronze: "bg-orange-500",
  silver: "bg-slate-400",
  gold: "bg-yellow-500",
  platinum: "bg-cyan-400",
  diamond: "bg-blue-400",
};

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user, isAdmin, isPendingApproval } = useAuth();
  const logoutMutation = useLogout();
  const heartbeatMutation = useUserHeartbeat();

  useEffect(() => {
    heartbeatMutation.mutate();
    const interval = setInterval(() => {
      heartbeatMutation.mutate();
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    window.location.href = "/";
  };

  if (isPendingApproval) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-bold">Account Pending</h2>
          <p className="text-muted-foreground">
            Your account is currently under review by our administration team. 
            You will gain access to the dashboard once approved.
          </p>
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  const userLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Investments", href: "/dashboard/investments", icon: TrendingUp },
    { name: "Transactions", href: "/dashboard/transactions", icon: History },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const adminLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Withdrawals", href: "/admin/withdrawals", icon: ArrowDownToLine },
    { name: "Applications", href: "/admin/applications", icon: FileText },
    { name: "Live Chat", href: "/admin/chat", icon: MessageSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const links = isAdmin ? adminLinks : userLinks;
  const planTier = user?.plan?.toLowerCase() ?? "";
  const sidebarAccent = !isAdmin && planTier ? TIER_ACCENT_COLORS[planTier] : "";
  const sidebarAccentBg = !isAdmin && planTier ? TIER_ACCENT_BG[planTier] : "";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`w-64 border-r border-border bg-card hidden md:flex flex-col ${sidebarAccent ? `border-t-2 ${sidebarAccent}` : ""}`}>
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <img src={`${import.meta.env.BASE_URL}images/logo-mark.png`} alt="Logo" className="w-6 h-6" />
            <span className="font-display font-bold text-sm tracking-tight text-white">
              ELITE LEDGER <span className="text-primary">CAPITAL</span>
            </span>
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-border">
          {!isAdmin && planTier && (
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl mb-3 bg-white/[0.03] border border-white/5`}>
              <div className={`w-2.5 h-2.5 rounded-full ${sidebarAccentBg}`} />
              <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">{user?.plan} Plan</span>
            </div>
          )}
          <div className="px-4 py-3 rounded-xl bg-background border border-border flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-xs">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-full overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <img src={`${import.meta.env.BASE_URL}images/logo-mark.png`} alt="Logo" className="w-6 h-6" />
          </Link>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </header>

        {/* Mobile Nav Scroll */}
        <div className="md:hidden flex overflow-x-auto p-4 gap-2 border-b border-border hide-scrollbar">
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                location === link.href ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8 relative">
          <div className="absolute inset-0 z-0">
            <img 
              src={`${import.meta.env.BASE_URL}images/pattern-bg.png`} 
              className="w-full h-full object-cover opacity-20 mix-blend-overlay"
              alt="Background pattern" 
            />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

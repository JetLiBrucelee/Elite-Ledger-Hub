import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface DropdownItem {
  name: string;
  href: string;
}

interface NavGroup {
  label: string;
  items?: DropdownItem[];
  href?: string;
}

const navGroups: NavGroup[] = [
  { label: "Home", href: "/" },
  {
    label: "Company",
    items: [
      { name: "About Us", href: "/about" },
      { name: "Why Elite Ledger Capital", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Affiliate", href: "/contact" },
      { name: "Insurance", href: "/risk-disclosure" },
      { name: "Trading Services", href: "/plans" },
      { name: "Trading Signal", href: "/plans" },
    ],
  },
  {
    label: "Copytrading",
    items: [
      { name: "Join CopyTrading", href: "/plans" },
      { name: "Become A Master", href: "/register" },
      { name: "Master's Rating", href: "/plans" },
    ],
  },
  {
    label: "TopMarkets",
    items: [
      { name: "Forex", href: "/plans" },
      { name: "Commodities", href: "/plans" },
      { name: "Indices", href: "/plans" },
      { name: "Stocks", href: "/plans" },
      { name: "Futures", href: "/plans" },
      { name: "Cryptocurrencies", href: "/plans" },
    ],
  },
  { label: "Promotion", href: "/promotion" },
  {
    label: "Account",
    items: [
      { name: "Sign In", href: "/login" },
      { name: "Register", href: "/register" },
      { name: "Dashboard", href: "/dashboard" },
    ],
  },
];

function DropdownMenu({ group, location: loc }: { group: NavGroup; location: string }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  if (!group.items) {
    return (
      <Link
        href={group.href || "/"}
        className={`text-sm font-medium transition-colors hover:text-primary ${loc === group.href ? "text-white" : "text-white/80"}`}
      >
        {group.label}
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button className="text-sm font-medium text-white/80 hover:text-primary transition-colors flex items-center gap-1">
        {group.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="bg-[#1a1d25] border border-white/10 rounded-lg shadow-2xl py-2 min-w-[200px]">
            {group.items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#111318]/95 backdrop-blur-md border-b border-white/10 py-3" : "bg-[#111318]/80 backdrop-blur-sm py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src={`${import.meta.env.BASE_URL}images/logo-mark.png`}
              alt="Logo"
              className="w-8 h-8 group-hover:rotate-12 transition-transform duration-500"
            />
            <span className="font-display font-bold text-xl tracking-tight text-white">
              ELITE LEDGER <span className="text-primary">CAPITAL</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {navGroups.map((g) => (
              <DropdownMenu key={g.label} group={g} location={location} />
            ))}
          </nav>

          <div className="hidden lg:flex items-center">
            {isAuthenticated ? (
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6">
                <Link href={isAdmin ? "/admin" : "/dashboard"}>Dashboard</Link>
              </Button>
            ) : (
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#111318] border-b border-white/10 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="p-4 space-y-1">
            {navGroups.map((g) => (
              <div key={g.label}>
                {g.items ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === g.label ? null : g.label)}
                      className="w-full flex items-center justify-between p-3 text-white/80 hover:bg-white/5 rounded-md text-base font-medium"
                    >
                      {g.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === g.label ? "rotate-180" : ""}`} />
                    </button>
                    {mobileExpanded === g.label && (
                      <div className="pl-4 space-y-1">
                        {g.items.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block p-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-md"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={g.href || "/"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-3 text-base font-medium text-white/80 hover:bg-white/5 rounded-md"
                  >
                    {g.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-white/10">
              {isAuthenticated ? (
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href={isAdmin ? "/admin" : "/dashboard"}>Dashboard</Link>
                </Button>
              ) : (
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

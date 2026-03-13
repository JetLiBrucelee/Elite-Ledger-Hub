import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Investment Plans", href: "/plans" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img src={`${import.meta.env.BASE_URL}images/logo-mark.png`} alt="Logo" className="w-8 h-8 group-hover:rotate-12 transition-transform duration-500" />
            <span className="font-display font-bold text-xl tracking-tight text-white">
              ELITE LEDGER <span className="text-primary">CAPITAL</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-white/70"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Button asChild variant="premium">
                <Link href={isAdmin ? "/admin" : "/dashboard"}>Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-white hover:text-primary hover:bg-white/5">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild variant="premium">
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-white/10 p-4 flex flex-col gap-4 shadow-xl">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-base font-medium p-2 rounded-md ${
                location === link.href ? "bg-primary/10 text-primary" : "text-white/70 hover:bg-white/5"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
            {isAuthenticated ? (
              <Button asChild variant="premium" className="w-full">
                <Link href={isAdmin ? "/admin" : "/dashboard"}>Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full border-white/10 text-white">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild variant="premium" className="w-full">
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

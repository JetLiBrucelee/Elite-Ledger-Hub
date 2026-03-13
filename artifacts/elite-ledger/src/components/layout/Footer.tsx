import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <img src={`${import.meta.env.BASE_URL}images/logo-mark.png`} alt="Logo" className="w-8 h-8" />
              <span className="font-display font-bold text-xl tracking-tight text-white">
                ELITE <span className="text-primary">LEDGER</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
              Premium wealth management and professional copy trading platform. We provide exclusive access to top-tier algorithmic and manual trading strategies.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/plans" className="text-muted-foreground hover:text-primary transition-colors">Investment Plans</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">Client Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-white mb-6">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Risk Disclosure</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Elite Ledger Capital. All rights reserved.
          </p>
          <div className="text-muted-foreground text-xs max-w-2xl text-center md:text-right">
            Trading Forex, Cryptocurrencies, and Commodities carries a high level of risk and may not be suitable for all investors.
          </div>
        </div>
      </div>
    </footer>
  );
}

import MarketPage from "./MarketPage";

export default function Stocks() {
  return (
    <MarketPage
      name="Stocks"
      tagline="Global Equity Markets"
      description="Trade shares of the world's biggest companies — from tech giants to blue-chip industrials. Access US, European, and Asian equities with competitive conditions and fractional share trading."
      stats={[
        { label: "Stocks Available", value: "500+" },
        { label: "Markets Covered", value: "12" },
        { label: "Commission From", value: "$0.02/share" },
        { label: "Leverage Up To", value: "1:20" },
      ]}
      features={[
        { title: "Global Stock Access", desc: "Trade shares from the NYSE, NASDAQ, LSE, Euronext, and other major exchanges — all from a single account with unified margin." },
        { title: "Fractional Shares", desc: "Invest in expensive stocks like Amazon, Tesla, or Berkshire Hathaway with fractional share trading. Start from as little as $1." },
        { title: "Earnings Season Trading", desc: "Capitalize on quarterly earnings releases with real-time news feeds, consensus estimates, and volatility alerts integrated into your dashboard." },
        { title: "Dividend Adjustments", desc: "Receive dividend adjustments on long positions. Our transparent policy ensures you benefit from corporate actions automatically." },
        { title: "Sector Analysis", desc: "Filter and analyze stocks by sector — Technology, Healthcare, Finance, Energy, Consumer, and more. Build targeted sector strategies." },
        { title: "Corporate Actions", desc: "Full transparency on stock splits, mergers, and other corporate events. Your positions are adjusted automatically with clear notifications." },
      ]}
      instruments={[
        "Apple (AAPL)", "Microsoft (MSFT)", "Amazon (AMZN)", "Google (GOOGL)",
        "Tesla (TSLA)", "NVIDIA (NVDA)", "Meta (META)", "Netflix (NFLX)",
        "AMD (AMD)", "Intel (INTC)", "JPMorgan (JPM)", "Goldman Sachs (GS)",
        "Visa (V)", "Mastercard (MA)", "Johnson & Johnson (JNJ)", "Pfizer (PFE)",
        "Coca-Cola (KO)", "McDonald's (MCD)", "Nike (NKE)", "Disney (DIS)",
        "Boeing (BA)", "Airbus (AIR)", "Shell (SHEL)", "BP (BP)",
      ]}
    />
  );
}

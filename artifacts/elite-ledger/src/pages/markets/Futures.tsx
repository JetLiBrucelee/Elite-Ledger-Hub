import MarketPage from "./MarketPage";

export default function Futures() {
  return (
    <MarketPage
      name="Futures"
      tagline="Futures & Derivatives Markets"
      description="Trade futures contracts on commodities, indices, bonds, and currencies. Access standardized contracts with transparent pricing, deep liquidity, and professional-grade tools for hedging and speculation."
      stats={[
        { label: "Futures Contracts", value: "40+" },
        { label: "Margin From", value: "2%" },
        { label: "Leverage Up To", value: "1:100" },
        { label: "Execution Speed", value: "<25ms" },
      ]}
      features={[
        { title: "Diverse Asset Classes", desc: "Trade futures across commodities (Gold, Oil, Grain), equity indices (S&P 500, DAX), bonds (US T-Notes, Bunds), and currency futures." },
        { title: "Transparent Pricing", desc: "Futures are exchange-traded with full order book transparency. See real bid/ask depth and trade at the best available price." },
        { title: "Hedging Solutions", desc: "Protect your portfolio from adverse price movements. Use futures to hedge your equity, commodity, or currency exposure efficiently." },
        { title: "Low Margin Requirements", desc: "Trade with margin as low as 2% of contract value. Our tiered margin system rewards larger accounts with preferential rates." },
        { title: "Roll-Over Management", desc: "Seamless contract roll-over with transparent pricing. Automatic notifications before expiry so you can manage your positions proactively." },
        { title: "Institutional Infrastructure", desc: "Direct market access with co-located servers. Benefit from the same execution quality that institutional traders demand." },
      ]}
      instruments={[
        "E-mini S&P 500", "E-mini NASDAQ 100", "E-mini Dow Jones",
        "Euro Stoxx 50 Futures", "DAX Futures", "FTSE 100 Futures",
        "Gold Futures", "Silver Futures", "Crude Oil Futures",
        "Natural Gas Futures", "Wheat Futures", "Corn Futures",
        "US 10-Year T-Note", "Euro Bund", "UK Gilt",
        "EUR/USD Futures", "GBP/USD Futures", "JPY Futures",
        "Copper Futures", "Platinum Futures",
      ]}
    />
  );
}

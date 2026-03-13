import MarketPage from "./MarketPage";

export default function Forex() {
  return (
    <MarketPage
      name="Forex"
      tagline="Foreign Exchange Markets"
      description="Trade the world's largest and most liquid financial market with over $6.6 trillion in daily volume. Access major, minor, and exotic currency pairs with institutional-grade spreads."
      stats={[
        { label: "Daily Volume", value: "$6.6T" },
        { label: "Currency Pairs", value: "60+" },
        { label: "Spreads From", value: "0.0 pips" },
        { label: "Leverage Up To", value: "1:500" },
      ]}
      features={[
        { title: "Ultra-Tight Spreads", desc: "Access raw spreads starting from 0.0 pips on major pairs like EUR/USD, GBP/USD, and USD/JPY with no hidden markups." },
        { title: "24/5 Market Access", desc: "Trade forex around the clock from the Sydney open to the New York close, with seamless execution during all major trading sessions." },
        { title: "Deep Liquidity", desc: "Benefit from institutional-grade liquidity sourced from top-tier banks and ECN providers, ensuring minimal slippage on your orders." },
        { title: "Advanced Charting", desc: "Utilize professional charting tools with 50+ technical indicators, multiple timeframes, and drawing tools to refine your strategy." },
        { title: "Risk Management Tools", desc: "Set stop-loss, take-profit, and trailing stop orders to protect your capital. Negative balance protection included for all accounts." },
        { title: "Lightning Execution", desc: "Average execution speed under 30ms with no requotes. Your orders are filled at the best available price, every time." },
      ]}
      instruments={[
        "EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "NZD/USD",
        "EUR/GBP", "EUR/JPY", "GBP/JPY", "AUD/JPY", "USD/CHF", "EUR/CHF",
        "GBP/AUD", "EUR/AUD", "NZD/JPY", "CAD/JPY", "EUR/NZD", "GBP/NZD",
        "USD/ZAR", "USD/MXN", "EUR/TRY", "USD/SGD", "USD/HKD", "USD/NOK",
      ]}
    />
  );
}

import MarketPage from "./MarketPage";

export default function Commodities() {
  return (
    <MarketPage
      name="Commodities"
      tagline="Precious Metals & Raw Materials"
      description="Diversify your portfolio with global commodities — from precious metals like Gold and Silver to energy products and agricultural goods. Hedge against inflation and capitalize on supply-demand dynamics."
      stats={[
        { label: "Instruments", value: "30+" },
        { label: "Gold Spread From", value: "$0.20" },
        { label: "Leverage Up To", value: "1:200" },
        { label: "Trading Hours", value: "23/5" },
      ]}
      features={[
        { title: "Precious Metals Trading", desc: "Trade Gold, Silver, Platinum, and Palladium against major currencies with competitive spreads and deep liquidity pools." },
        { title: "Energy Markets", desc: "Access Crude Oil (WTI & Brent), Natural Gas, and other energy commodities with tight spreads and fast execution." },
        { title: "Agricultural Products", desc: "Trade Wheat, Corn, Soybeans, Coffee, and other agricultural commodities to diversify your strategy across asset classes." },
        { title: "Inflation Hedge", desc: "Commodities are a proven hedge against inflation. Protect your wealth and capitalize on macroeconomic trends." },
        { title: "No Delivery Obligations", desc: "Trade commodity CFDs without physical delivery. Open and close positions with ease, focusing on price movements." },
        { title: "Expert Analysis", desc: "Receive daily market analysis and trade ideas from our commodities research team, covering fundamentals and technical levels." },
      ]}
      instruments={[
        "XAU/USD (Gold)", "XAG/USD (Silver)", "Platinum", "Palladium",
        "WTI Crude Oil", "Brent Crude Oil", "Natural Gas", "Heating Oil",
        "Wheat", "Corn", "Soybeans", "Coffee", "Sugar", "Cotton", "Cocoa",
        "Copper", "Aluminium", "Zinc", "Nickel", "Lead",
      ]}
    />
  );
}

import MarketPage from "./MarketPage";

export default function Indices() {
  return (
    <MarketPage
      name="Indices"
      tagline="Global Stock Market Indices"
      description="Trade the world's leading stock market indices and gain exposure to entire economies in a single position. From the S&P 500 to the Nikkei 225, trade top indices with tight spreads."
      stats={[
        { label: "Global Indices", value: "20+" },
        { label: "S&P 500 Spread", value: "0.4 pts" },
        { label: "Leverage Up To", value: "1:200" },
        { label: "Commission", value: "$0" },
      ]}
      features={[
        { title: "Major Index Coverage", desc: "Trade US, European, Asian, and Australian indices including S&P 500, NASDAQ 100, FTSE 100, DAX 40, Nikkei 225, and more." },
        { title: "Zero Commission", desc: "Pay no commissions on index trades. Our revenue comes from competitive spreads, keeping your costs transparent and predictable." },
        { title: "Extended Trading Hours", desc: "Access pre-market and after-hours sessions on select indices. React to earnings reports and economic data releases in real time." },
        { title: "Portfolio Diversification", desc: "Trade an entire market basket with a single position. Indices provide instant diversification across sectors and companies." },
        { title: "Economic Barometer", desc: "Indices reflect overall economic health. Use our economic calendar integration to trade around key macro events and data releases." },
        { title: "Flexible Position Sizes", desc: "Trade micro-lots on indices for precise risk management. Scale into positions with the exact size that fits your strategy." },
      ]}
      instruments={[
        "S&P 500 (US500)", "NASDAQ 100 (US100)", "Dow Jones (US30)",
        "FTSE 100 (UK100)", "DAX 40 (DE40)", "CAC 40 (FR40)",
        "Euro Stoxx 50 (EU50)", "Nikkei 225 (JP225)", "Hang Seng (HK50)",
        "ASX 200 (AU200)", "Swiss Market Index (CH20)", "IBEX 35 (ES35)",
        "AEX Index (NL25)", "Russell 2000 (US2000)", "S&P/TSX (CA60)",
        "India 50 (IN50)", "China A50 (CN50)", "Singapore Index (SG30)",
      ]}
    />
  );
}

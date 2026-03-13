import MarketPage from "./MarketPage";

export default function Cryptocurrencies() {
  return (
    <MarketPage
      name="Cryptocurrencies"
      tagline="Digital Asset Markets"
      description="Trade Bitcoin, Ethereum, and 30+ leading cryptocurrencies with competitive spreads and 24/7 market access. Go long or short on the most dynamic asset class of the decade."
      stats={[
        { label: "Crypto Pairs", value: "35+" },
        { label: "BTC Spread From", value: "$15" },
        { label: "Leverage Up To", value: "1:50" },
        { label: "Trading Hours", value: "24/7" },
      ]}
      features={[
        { title: "24/7 Trading", desc: "Crypto markets never sleep. Trade Bitcoin, Ethereum, and altcoins around the clock, including weekends and holidays." },
        { title: "Go Long or Short", desc: "Profit from both rising and falling markets. Trade crypto CFDs without needing a wallet or managing private keys." },
        { title: "Major & Altcoins", desc: "Access Bitcoin, Ethereum, Solana, Cardano, Polygon, Avalanche, Chainlink, and many more top-ranked cryptocurrencies." },
        { title: "Secure Trading", desc: "Trade crypto with the security of a regulated platform. No wallet hacks, no exchange breaches — your funds are protected." },
        { title: "Real-Time Analytics", desc: "Track on-chain metrics, whale movements, and market sentiment alongside traditional technical analysis for better trading decisions." },
        { title: "Competitive Leverage", desc: "Access up to 1:50 leverage on major crypto pairs. Precise position sizing with micro-lots for controlled risk exposure." },
      ]}
      instruments={[
        "Bitcoin (BTC/USD)", "Ethereum (ETH/USD)", "Solana (SOL/USD)",
        "Ripple (XRP/USD)", "Cardano (ADA/USD)", "Polygon (MATIC/USD)",
        "Avalanche (AVAX/USD)", "Chainlink (LINK/USD)", "Polkadot (DOT/USD)",
        "Litecoin (LTC/USD)", "Dogecoin (DOGE/USD)", "Shiba Inu (SHIB/USD)",
        "Uniswap (UNI/USD)", "Aave (AAVE/USD)", "Stellar (XLM/USD)",
        "BTC/EUR", "ETH/EUR", "BTC/GBP", "ETH/BTC", "SOL/BTC",
      ]}
    />
  );
}

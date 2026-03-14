const coins = [
  { name: "Bitcoin", symbol: "BTC", id: 1 },
  { name: "Ethereum", symbol: "ETH", id: 1027 },
  { name: "BNB", symbol: "BNB", id: 1839 },
  { name: "Solana", symbol: "SOL", id: 5426 },
  { name: "XRP", symbol: "XRP", id: 52 },
  { name: "Tether", symbol: "USDT", id: 825 },
  { name: "USD Coin", symbol: "USDC", id: 3408 },
  { name: "Cardano", symbol: "ADA", id: 2010 },
  { name: "Avalanche", symbol: "AVAX", id: 5805 },
  { name: "Dogecoin", symbol: "DOGE", id: 74 },
  { name: "Polygon", symbol: "MATIC", id: 3890 },
  { name: "Shiba Inu", symbol: "SHIB", id: 5994 },
  { name: "Lite Coin", symbol: "LTC", id: 2 },
  { name: "Stacks", symbol: "STX", id: 4847 },
  { name: "Chainlink", symbol: "LINK", id: 1975 },
  { name: "Polkadot", symbol: "DOT", id: 6636 },
];

function CoinItem({ coin }: { coin: typeof coins[0] }) {
  return (
    <span className="inline-flex items-center gap-2 px-5">
      <img
        src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
        alt={coin.name}
        width={24}
        height={24}
        className="rounded-full w-6 h-6 object-cover flex-shrink-0"
        loading="lazy"
      />
      <span className="text-white/80 text-sm font-medium whitespace-nowrap tracking-wide">
        {coin.name}
      </span>
    </span>
  );
}

export function CryptoTicker() {
  return (
    <div className="w-full bg-[#0a0c10] border-t border-white/5 overflow-hidden">
      <div className="crypto-ticker-track flex items-center py-2.5">
        {coins.map((coin) => (
          <CoinItem key={`a-${coin.id}`} coin={coin} />
        ))}
        {coins.map((coin) => (
          <CoinItem key={`b-${coin.id}`} coin={coin} />
        ))}
        {coins.map((coin) => (
          <CoinItem key={`c-${coin.id}`} coin={coin} />
        ))}
      </div>
    </div>
  );
}

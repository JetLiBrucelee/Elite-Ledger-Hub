import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FIRST_NAMES = [
  "James", "Sofia", "Ethan", "Isabella", "Liam", "Olivia", "Noah", "Ava",
  "Lucas", "Mia", "Mason", "Charlotte", "Logan", "Amelia", "Alexander",
  "Harper", "Daniel", "Evelyn", "Henry", "Abigail", "Sebastian", "Emily",
  "Jack", "Ella", "Owen", "Scarlett", "Gabriel", "Grace", "Samuel", "Chloe",
  "Benjamin", "Victoria", "Elijah", "Riley", "Julian", "Aria", "Leo", "Lily",
  "David", "Layla", "Carlos", "Zoe", "Wei", "Sakura", "Raj", "Yuki",
  "Connor", "Elena", "Mateo", "Ingrid", "Hiroshi", "Priya", "Andres", "Mei"
];

const CRYPTO_CONFIG: Record<string, { color: string }> = {
  BTC: { color: "text-orange-400" },
  ETH: { color: "text-indigo-400" },
  BNB: { color: "text-yellow-400" },
  SOL: { color: "text-purple-400" },
  ADA: { color: "text-blue-400" },
  XRP: { color: "text-cyan-400" },
  MATIC: { color: "text-violet-400" },
  DOT: { color: "text-pink-400" },
  AVAX: { color: "text-red-400" },
  LINK: { color: "text-blue-300" },
};

const CRYPTOS = Object.keys(CRYPTO_CONFIG);

const ACTIONS = ["Earned", "Invested", "Withdrew"];

const COUNTRIES = [
  "United States", "Canada", "Mexico", "Brazil", "Argentina", "Chile", "Colombia", "Peru",
  "United Kingdom", "Germany", "France", "Netherlands", "Switzerland", "Sweden", "Norway",
  "Denmark", "Ireland", "Portugal", "Spain", "Italy", "Austria", "Belgium", "Poland",
  "Greece", "Czech Republic", "Finland",
  "Japan", "South Korea", "Singapore", "Hong Kong", "Taiwan", "Australia", "New Zealand",
  "Thailand", "Malaysia", "Philippines", "Vietnam", "Indonesia",
  "UAE", "Qatar", "Saudi Arabia", "Kuwait", "Bahrain",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateAmount(action: string): number {
  const isWithdrawal = action === "Withdrew";
  const ranges = isWithdrawal
    ? [
        { min: 20_000_000,  max: 50_000_000,  weight: 20 },
        { min: 50_000_000,  max: 120_000_000, weight: 35 },
        { min: 120_000_000, max: 250_000_000, weight: 30 },
        { min: 250_000_000, max: 500_000_000, weight: 15 },
      ]
    : [
        { min: 1_000_000,  max: 3_000_000,  weight: 30 },
        { min: 3_000_000,  max: 8_000_000,  weight: 35 },
        { min: 8_000_000,  max: 15_000_000, weight: 25 },
        { min: 15_000_000, max: 25_000_000, weight: 10 },
      ];
  const roundTo = isWithdrawal ? 1_000_000 : 100_000;
  const totalWeight = ranges.reduce((s, r) => s + r.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const range of ranges) {
    rand -= range.weight;
    if (rand <= 0) {
      return Math.round((range.min + Math.random() * (range.max - range.min)) / roundTo) * roundTo;
    }
  }
  return isWithdrawal ? 50_000_000 : 2_000_000;
}

function generateTimeAgo(): string {
  const roll = Math.random();
  if (roll < 0.15) {
    const hours = Math.floor(Math.random() * 23) + 1;
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (roll < 0.60) {
    const days = Math.floor(Math.random() * 29) + 1;
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else {
    const months = Math.floor(Math.random() * 11) + 1;
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }
}

function formatAmount(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}

function generateEntry() {
  const firstName = randomFrom(FIRST_NAMES);
  const action = randomFrom(ACTIONS);
  const crypto = randomFrom(CRYPTOS);
  const amount = generateAmount(action);
  const country = randomFrom(COUNTRIES);
  const timeAgo = generateTimeAgo();
  return { firstName, action, crypto, amount, country, timeAgo };
}

const pregenerated = Array.from({ length: 25 }, () => generateEntry());

export function ActivityPopup() {
  const [current, setCurrent] = useState<ReturnType<typeof generateEntry> | null>(null);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  const showNext = useCallback(() => {
    const entry = index < pregenerated.length ? pregenerated[index] : generateEntry();
    setCurrent(entry);
    setVisible(true);
    setIndex((i) => i + 1);

    setTimeout(() => {
      setVisible(false);
    }, 4000);
  }, [index]);

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      showNext();
    }, 3000);

    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    if (!visible && index > 0) {
      const nextTimeout = setTimeout(() => {
        showNext();
      }, 6000);
      return () => clearTimeout(nextTimeout);
    }
    return undefined;
  }, [visible, index, showNext]);

  const cryptoColor = current ? CRYPTO_CONFIG[current.crypto]?.color || "text-blue-400" : "text-blue-400";

  return (
    <AnimatePresence>
      {visible && current && (
        <motion.div
          initial={{ opacity: 0, y: 80, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-6 z-[90] max-w-sm"
        >
          <div className="bg-[#14161c]/95 border border-white/10 backdrop-blur-xl rounded-xl p-4 shadow-2xl shadow-black/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-yellow-600 flex items-center justify-center text-sm font-bold text-black shrink-0">
                {current.firstName[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-white font-medium truncate">
                  {current.firstName}{" "}
                  <span className="text-emerald-400 font-semibold">{current.action}</span>{" "}
                  <span className="text-primary font-bold">
                    {formatAmount(current.amount)}
                  </span>{" "}
                  <span className="text-white/60">in</span>{" "}
                  <span className={`${cryptoColor} font-semibold`}>{current.crypto}</span>
                </p>
                <p className="text-xs text-white/40 mt-0.5">
                  {current.country} · {current.timeAgo}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

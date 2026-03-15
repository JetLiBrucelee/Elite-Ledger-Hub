import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FIRST_NAMES = [
  "James", "Sofia", "Ethan", "Isabella", "Liam", "Olivia", "Noah", "Ava",
  "Lucas", "Mia", "Mason", "Charlotte", "Logan", "Amelia", "Alexander",
  "Harper", "Daniel", "Evelyn", "Henry", "Abigail", "Sebastian", "Emily",
  "Jack", "Ella", "Owen", "Scarlett", "Gabriel", "Grace", "Samuel", "Chloe",
  "Benjamin", "Victoria", "Elijah", "Riley", "Julian", "Aria", "Leo", "Lily",
  "David", "Layla", "Carlos", "Zoe", "Hassan", "Nora", "Wei", "Sakura",
  "Raj", "Fatima", "Andre", "Yuki"
];

const LAST_INITIALS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const CRYPTOS = ["BTC", "ETH", "BNB", "SOL", "ADA", "XRP", "MATIC", "DOT", "AVAX", "LINK"];

const ACTIONS = ["Earned", "Invested", "Withdrew"];

const COUNTRIES = [
  "United States", "United Kingdom", "Germany", "Canada", "Australia",
  "France", "Japan", "Singapore", "UAE", "Switzerland", "Netherlands",
  "Sweden", "Norway", "South Korea", "Hong Kong", "Brazil", "Mexico",
  "Spain", "Italy", "India"
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateAmount(): number {
  const ranges = [
    { min: 200000, max: 500000, weight: 40 },
    { min: 500000, max: 1000000, weight: 30 },
    { min: 1000000, max: 5000000, weight: 20 },
    { min: 5000000, max: 15000000, weight: 10 },
  ];
  const totalWeight = ranges.reduce((s, r) => s + r.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const range of ranges) {
    rand -= range.weight;
    if (rand <= 0) {
      return Math.round((range.min + Math.random() * (range.max - range.min)) / 1000) * 1000;
    }
  }
  return 250000;
}

function generateEntry() {
  const firstName = randomFrom(FIRST_NAMES);
  const lastInit = LAST_INITIALS[Math.floor(Math.random() * LAST_INITIALS.length)];
  const action = randomFrom(ACTIONS);
  const crypto = randomFrom(CRYPTOS);
  const amount = generateAmount();
  const country = randomFrom(COUNTRIES);
  const minutesAgo = Math.floor(Math.random() * 45) + 1;
  return { firstName, lastInit, action, crypto, amount, country, minutesAgo };
}

const pregenerated = Array.from({ length: 30 }, () => generateEntry());

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
                {current.firstName[0]}{current.lastInit}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-white font-medium truncate">
                  {current.firstName} {current.lastInit}.{" "}
                  <span className="text-emerald-400 font-semibold">{current.action}</span>{" "}
                  <span className="text-primary font-bold">
                    ${current.amount >= 1000000
                      ? `${(current.amount / 1000000).toFixed(1)}M`
                      : `${(current.amount / 1000).toFixed(0)}K`}
                  </span>{" "}
                  <span className="text-white/60">in</span>{" "}
                  <span className="text-blue-400 font-semibold">{current.crypto}</span>
                </p>
                <p className="text-xs text-white/40 mt-0.5">
                  {current.country} · {current.minutesAgo}m ago
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

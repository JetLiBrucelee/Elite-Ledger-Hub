import { motion } from "framer-motion";
import { useCursor } from "@/hooks/use-cursor";
import { cn } from "@/lib/utils";

export function CustomCursor() {
  const { position, hidden, clicked, linkHovered } = useCursor();

  if (hidden) return null;

  return (
    <>
      <motion.div
        className={cn(
          "fixed top-0 left-0 w-4 h-4 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-screen transition-transform duration-100",
          clicked ? "scale-75" : "scale-100"
        )}
        animate={{
          x: position.x - 8,
          y: position.y - 8,
          scale: linkHovered ? 0 : 1,
          opacity: linkHovered ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 50, mass: 2 }}
      />
      <motion.div
        className={cn(
          "fixed top-0 left-0 w-10 h-10 border border-primary/50 rounded-full pointer-events-none z-[9998] transition-transform duration-100",
          linkHovered ? "bg-primary/20 scale-[1.5] border-primary" : "bg-transparent scale-100"
        )}
        animate={{
          x: position.x - 20,
          y: position.y - 20,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 40, mass: 1 }}
      />
    </>
  );
}

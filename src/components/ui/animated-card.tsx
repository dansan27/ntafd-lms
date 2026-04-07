import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function AnimatedCard({ children, className = "", delay = 0, hover = true }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={hover ? { y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" } : {}}
      className={`rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-md hover:border-white/20 transition-colors ${className}`}
    >
      {children}
    </motion.div>
  );
}

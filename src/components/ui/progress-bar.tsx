import { motion } from "framer-motion";

interface ProgressBarProps {
  percentage: number;
  showPercentage?: boolean;
  label?: string;
  animated?: boolean;
}

export function ProgressBar({ percentage, showPercentage = true, label, animated = true }: ProgressBarProps) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="w-full space-y-2">
      {label && <p className="text-sm font-medium text-white/80">{label}</p>}
      <div className="relative w-full h-3 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/10 overflow-hidden backdrop-blur-sm">
        <motion.div
          initial={animated ? { width: 0 } : { width: `${clampedPercentage}%` }}
          animate={{ width: `${clampedPercentage}%` }}
          transition={animated ? { delay: 0.3, duration: 1, ease: "easeOut" } : {}}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative shadow-lg"
        >
          {/* Shimmer effect */}
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </motion.div>
      </div>
      {showPercentage && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-white/60">Progreso</span>
          <motion.span
            key={clampedPercentage}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
          >
            {clampedPercentage}%
          </motion.span>
        </div>
      )}
    </div>
  );
}

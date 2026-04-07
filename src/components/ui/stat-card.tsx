import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  color: "blue" | "green" | "purple" | "orange";
  delay?: number;
}

const colorMap = {
  blue: "from-blue-500/20 to-blue-600/10 text-blue-500",
  green: "from-green-500/20 to-green-600/10 text-green-500",
  purple: "from-purple-500/20 to-purple-600/10 text-purple-500",
  orange: "from-orange-500/20 to-orange-600/10 text-orange-500",
};

export function StatCard({ icon: Icon, label, value, description, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/40 to-slate-800/20 backdrop-blur-xl p-6 hover:border-white/20 transition-colors group"
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorMap[color]} backdrop-blur-sm`}>
            <Icon className="w-5 h-5" />
          </div>
          <motion.div
            initial={{ rotate: 0, scale: 1 }}
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="text-white/40"
          >
            →
          </motion.div>
        </div>

        <p className="text-sm text-white/60 font-medium mb-1">{label}</p>
        <p className="text-3xl font-bold text-white mb-2">{value}</p>
        {description && <p className="text-xs text-white/40">{description}</p>}
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "./button";
import type { LucideIcon } from "lucide-react";
import { Lock, PlayCircle } from "lucide-react";

interface ClassCardProps {
  weekId: number;
  classId: number;
  title: string;
  description: string;
  available: boolean;
  icon?: LucideIcon;
  delay?: number;
}

export function ClassCard({ weekId, classId, title, description, available, icon: Icon, delay = 0 }: ClassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={available ? { y: -8, scale: 1.02 } : {}}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/40 to-slate-800/20 backdrop-blur-xl hover:border-white/20 transition-all duration-300"
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${available ? "bg-blue-500/20" : "bg-slate-500/20"} backdrop-blur-sm`}>
            {Icon ? (
              <Icon className="w-5 h-5 text-blue-400" />
            ) : available ? (
              <PlayCircle className="w-5 h-5 text-blue-400" />
            ) : (
              <Lock className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <motion.div
            animate={available ? { y: [0, -3, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className={available ? "text-blue-400" : "text-slate-400"}
          >
            {available ? "→" : "🔒"}
          </motion.div>
        </div>

        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/60 mb-6">{description}</p>

        {available ? (
          <Link href={`/week/${weekId}/class/${classId}`}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0">
                Comenzar Clase
              </Button>
            </motion.div>
          </Link>
        ) : (
          <div className="w-full py-2 px-4 rounded-lg bg-slate-500/10 text-center text-sm text-slate-400 font-medium border border-slate-500/20">
            Próximamente
          </div>
        )}
      </div>
    </motion.div>
  );
}

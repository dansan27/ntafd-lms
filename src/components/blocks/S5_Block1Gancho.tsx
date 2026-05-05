import { Card, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { BorderBeam } from "border-beam";

const QUESTIONS = [
  { q: "¿Tu smartwatch mide SpO₂?", emoji: "⌚", color: "text-blue-400" },
  { q: "¿Es tan preciso como uno clínico?", emoji: "🏥", color: "text-rose-400" },
  { q: "¿Por qué el LED es verde y no rojo?", emoji: "💚", color: "text-green-400" },
];

const STATS = [
  { value: "660 nm", unit: "LED rojo — pulsioxímetro", color: "text-red-400" },
  { value: "940 nm", unit: "LED infrarrojo — SpO₂", color: "text-purple-400" },
  { value: "520 nm", unit: "LED verde — smartwatch FC", color: "text-green-400" },
];

export default function S5_Block1Gancho() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Eye size={14} /> Bloque 1 — El Gancho
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
          ¿Tu smartwatch{" "}
          <span className="text-primary">te miente?</span>
        </h1>
        <p className="text-muted-foreground text-base max-w-md mx-auto">
          La luz que mide tu oxígeno no es la misma que mide tu pulso. Hoy descubres por qué.
        </p>
      </motion.div>

      {/* Hero card */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <BorderBeam colorVariant="colorful" strength={0.8}>
          <Card className="bg-sidebar text-sidebar-foreground overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <motion.div className="w-2.5 h-2.5 rounded-full bg-red-400"
                  animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                <span className="text-red-400 text-sm font-medium">SpO₂ 98% — pulsioxímetro activo</span>
              </div>

              {/* LED spectrum visualization */}
              <div className="rounded-2xl bg-black/40 p-6 space-y-4">
                <p className="text-xs text-white/50 uppercase tracking-widest text-center">Espectro de luz visible</p>
                <div className="relative h-10 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-blue-400 via-green-400 via-yellow-300 via-orange-400 to-red-600 opacity-80" />
                  {/* Markers */}
                  <div className="absolute inset-0 flex items-end pb-1 px-2 justify-between text-[10px] font-bold text-white/80">
                    <span>400</span>
                    <span className="text-green-300">↑ 520</span>
                    <span className="text-red-300">↑ 660</span>
                    <span>700</span>
                    <span className="text-purple-300">→ 940</span>
                    <span>1000 nm</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {STATS.map((s, i) => (
                    <div key={i} className="text-center bg-white/5 rounded-xl py-3">
                      <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                      <p className="text-white/40 text-[10px] mt-0.5">{s.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </BorderBeam>
      </motion.div>

      {/* 3 questions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {QUESTIONS.map((q, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.1 }} whileHover={{ y: -4 }}>
            <Card className="border-border text-center h-full">
              <CardContent className="p-5 space-y-2">
                <span className="text-3xl">{q.emoji}</span>
                <p className={`font-bold text-sm ${q.color}`}>{q.q}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

    </div>
  );
}

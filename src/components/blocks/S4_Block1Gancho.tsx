import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";
import { BorderBeam } from "border-beam";

const ECG_PATH =
  "M 0,40 L 15,40 L 18,44 L 22,10 L 26,48 L 30,40 L 48,40 C 52,40 55,32 58,30 C 61,34 64,40 70,40 L 90,40 L 93,44 L 97,10 L 101,48 L 105,40 L 123,40 C 127,40 130,32 133,30 C 136,34 139,40 145,40 L 165,40";

const STATS = [
  { value: "100,000", unit: "latidos/día", color: "text-rose-400" },
  { value: "0.1–2", unit: "mV por latido", color: "text-green-400" },
  { value: "3", unit: "tecnologías hoy", color: "text-blue-400" },
];

const TECHS = [
  { emoji: "⚡", name: "EKG / ECG", desc: "Señal eléctrica del corazón", color: "bg-green-500/10 border-green-500/20" },
  { emoji: "🫀", name: "Polar H10", desc: "FC con precisión clínica", color: "bg-blue-500/10 border-blue-500/20" },
  { emoji: "💡", name: "Pulsioxímetro", desc: "SpO₂ y FC con luz", color: "bg-purple-500/10 border-purple-500/20" },
];

export default function S4_Block1Gancho() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Activity size={14} /> Bloque 1 — El Gancho
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
          Tu corazón <span className="text-primary">no miente</span>
        </h1>
        <p className="text-muted-foreground text-base max-w-md mx-auto">
          Cada latido genera una señal eléctrica única. Hoy aprendes a leerla.
        </p>
      </motion.div>

      {/* ECG Hero */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <BorderBeam colorVariant="colorful" strength={0.8}>
        <Card className="bg-sidebar text-sidebar-foreground overflow-hidden">
          <CardContent className="p-8">
            {/* Live indicator */}
            <div className="flex items-center gap-2 mb-4">
              <motion.div className="w-2.5 h-2.5 rounded-full bg-green-400"
                animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.9, repeat: Infinity }} />
              <span className="text-green-400 text-sm font-medium">72 bpm — Ritmo sinusal</span>
            </div>

            {/* ECG trace */}
            <div className="bg-black/40 rounded-2xl p-4 relative overflow-hidden">
              <svg viewBox="0 0 165 55" className="w-full h-20 absolute inset-0 opacity-10">
                {Array.from({ length: 9 }, (_, i) => <line key={i} x1={i * 20} y1="0" x2={i * 20} y2="55" stroke="#22c55e" strokeWidth="0.5" />)}
                {Array.from({ length: 3 }, (_, i) => <line key={i} x1="0" y1={i * 27} x2="165" y2={i * 27} stroke="#22c55e" strokeWidth="0.5" />)}
              </svg>
              <svg viewBox="0 0 165 55" className="w-full h-20 relative z-10">
                <motion.path d={ECG_PATH} fill="none" stroke="#4ade80" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }} />
              </svg>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              {STATS.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.1 }}
                  className="text-center bg-white/5 rounded-2xl py-3">
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-white/40 text-[10px] mt-0.5">{s.unit}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
        </BorderBeam>
      </motion.div>

      {/* 3 technologies */}
      <div className="grid grid-cols-3 gap-4">
        {TECHS.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }} whileHover={{ y: -4 }}>
            <Card className={`border ${t.color} text-center`}>
              <CardContent className="p-5 space-y-2">
                <span className="text-4xl">{t.emoji}</span>
                <p className="font-bold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

    </div>
  );
}

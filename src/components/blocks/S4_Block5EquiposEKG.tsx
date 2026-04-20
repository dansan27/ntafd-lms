import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio } from "lucide-react";
import { motion } from "framer-motion";

const FILTERS = [
  { id: "hp",    label: "Paso Alto",  hz: "0.5 Hz",     emoji: "📈", color: "bg-blue-500/20 text-blue-400 border-blue-500/30",   removes: "Movimiento / deriva de respiración", keeps: "Señal EKG completa" },
  { id: "lp",    label: "Paso Bajo",  hz: "40–100 Hz",  emoji: "📉", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", removes: "Ruido muscular (EMG) / interferencia EM", keeps: "EKG clínicamente útil" },
  { id: "notch", label: "Notch",      hz: "50 / 60 Hz", emoji: "🎯", color: "bg-orange-500/20 text-orange-400 border-orange-500/30", removes: "Red eléctrica (corriente alterna)", keeps: "Todo lo demás" },
];

const BANDS = [
  { label: "< 0.5 Hz",   good: false, text: "Deriva de línea base"          },
  { label: "0.5–40 Hz",  good: true,  text: "EKG útil ✓"                   },
  { label: "50 / 60 Hz", good: false, text: "Interferencia red eléctrica"   },
  { label: "40–100 Hz",  good: true,  text: "Alta fidelidad (opcional) ✓"   },
  { label: "> 100 Hz",   good: false, text: "Ruido EMG"                     },
];

export default function S4_Block5EquiposEKG() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Radio size={14} /> Bloque 5 — Filtrado de Señales
        </div>
        <h1 className="text-4xl md:text-5xl font-black">Señal <span className="text-primary">limpia</span></h1>
        <p className="text-muted-foreground text-sm">Los filtros eliminan el ruido y revelan el EKG real</p>
      </motion.div>

      {/* Before / After */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"/>
                  <span className="text-red-400 text-xs font-medium uppercase tracking-wide">Sin filtrar</span>
                </div>
                <div className="bg-black/40 rounded-xl p-3">
                  <svg viewBox="0 0 200 50" className="w-full h-14">
                    <motion.path
                      d="M0,25 C3,22 5,29 8,25 C11,21 13,28 16,25 L18,27 L20,8 L22,34 L24,25 C27,22 30,28 33,23 C36,18 39,29 42,25 L44,27 L46,8 L48,34 L50,25 C53,21 56,29 59,23 C62,17 65,30 68,25 L70,27 L72,8 L74,34 L76,25 C79,22 82,28 85,23 C88,18 91,28 94,25 L96,27 L98,8 L100,34 L102,25 C105,22 108,29 111,23 C114,17 117,29 120,25 L122,27 L124,8 L126,34 L128,25 C131,21 134,28 137,23 C140,18 143,28 146,25 L148,27 L150,8 L152,34 L154,25 C157,22 160,28 163,25 C166,22 169,28 172,25 L174,27 L176,8 L178,34 L180,25 L200,25"
                      fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }}
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"/>
                  <span className="text-green-400 text-xs font-medium uppercase tracking-wide">Filtrada</span>
                </div>
                <div className="bg-black/40 rounded-xl p-3">
                  <svg viewBox="0 0 200 50" className="w-full h-14">
                    <motion.path
                      d="M 0,25 L 18,25 L 21,29 L 25,5 L 29,33 L 33,25 L 48,25 C 53,25 57,16 61,14 C 65,18 69,25 74,25 L 100,25 L 103,29 L 107,5 L 111,33 L 115,25 L 130,25 C 135,25 139,16 143,14 C 147,18 151,25 156,25 L 180,25 L 183,29 L 187,5 L 191,33 L 195,25 L 200,25"
                      fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.4 }}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter cards — interactive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FILTERS.map((f, i) => (
          <motion.button key={f.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }} whileHover={{ y: -3 }}
            onClick={() => setActive(active === f.id ? null : f.id)}
            className={`text-left rounded-2xl border p-5 space-y-3 transition-all ${
              active === f.id ? f.color : "border-border hover:border-muted-foreground/30"
            }`}>
            <div className="flex items-center justify-between">
              <span className="text-3xl">{f.emoji}</span>
              <Badge variant="outline" className="text-xs font-mono">{f.hz}</Badge>
            </div>
            <p className="font-bold">{f.label}</p>
            {active === f.id && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1 text-xs">
                <p><span className="text-red-400">✗</span> {f.removes}</p>
                <p><span className="text-green-400">✓</span> {f.keeps}</p>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Frequency bands */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card>
          <CardContent className="p-5 space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">Bandas de frecuencia</p>
            {BANDS.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.06 }}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl ${b.good ? "bg-green-500/10" : "bg-red-500/10"}`}>
                <span className={`text-base ${b.good ? "text-green-500" : "text-red-500"}`}>{b.good ? "✓" : "✗"}</span>
                <span className="font-mono text-sm font-bold w-24 flex-shrink-0">{b.label}</span>
                <span className="text-xs text-muted-foreground">{b.text}</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
}

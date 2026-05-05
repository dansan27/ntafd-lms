import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Lock, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import S5_Dynamic1LuzSpO2 from "../dynamics/S5_Dynamic1LuzSpO2";

const LEDS = [
  {
    nm: "660 nm",
    name: "LED Rojo",
    emoji: "🔴",
    absorb: "Desoxihemoglobina (HHb)",
    note: "Absorbe más cuando la sangre lleva menos O₂",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    bar: "bg-red-400",
  },
  {
    nm: "940 nm",
    name: "LED Infrarrojo",
    emoji: "🟣",
    absorb: "Oxihemoglobina (HbO₂)",
    note: "Absorbe más cuando la sangre lleva O₂",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/30",
    bar: "bg-purple-400",
  },
];

const PRINCIPLE = [
  { step: "1", text: "LED emite luz a través del tejido (dedo, lóbulo)", icon: "💡" },
  { step: "2", text: "Fotodetector mide la luz que logró pasar", icon: "📡" },
  { step: "3", text: "Oxihemoglobina y desoxihemoglobina absorben diferente", icon: "🩸" },
  { step: "4", text: "El ratio R/IR calcula el % de SpO₂", icon: "📊" },
];

const [SEL_DEFAULT] = ["660"];

export default function S5_Block2Pulsioximetro() {
  const [sel, setSel] = useState<string>(SEL_DEFAULT);

  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 5, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic1Active = statuses?.find(s => s.dynamicId === 1)?.isActive ?? false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Eye size={14} /> Bloque 2 — Pulsioxímetro: Principio Óptico
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
          Dos luces, <span className="text-primary">un dato</span>
        </h2>
        <p className="text-muted-foreground text-base max-w-lg mx-auto">
          La oximetría de pulso usa la absorción diferencial de luz roja e infrarroja para calcular SpO₂.
        </p>
      </motion.div>

      {/* LED cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LEDS.map((led, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }} whileHover={{ y: -4 }}
            onClick={() => setSel(led.nm.split(" ")[0])}
            className="cursor-pointer">
            <Card className={`border ${led.bg} h-full transition-all ${sel === led.nm.split(" ")[0] ? "ring-2 ring-primary" : ""}`}>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{led.emoji}</span>
                  <Badge className={`${led.bg} ${led.color} font-black text-base`}>{led.nm}</Badge>
                </div>
                <p className={`text-xl font-black ${led.color}`}>{led.name}</p>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Absorbe principalmente:</p>
                  <p className="text-sm font-bold">{led.absorb}</p>
                  <p className="text-xs text-muted-foreground">{led.note}</p>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div className={`h-full rounded-full ${led.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: i === 0 ? "70%" : "90%" }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.7 }} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Principle steps */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Cómo funciona</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRINCIPLE.map((p, i) => (
                <div key={i} className="text-center space-y-2 bg-muted/30 rounded-xl p-3">
                  <span className="text-2xl">{p.icon}</span>
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-black flex items-center justify-center mx-auto">{p.step}</div>
                  <p className="text-xs text-muted-foreground leading-tight">{p.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dynamic 1 gate */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            {isDynamic1Active ? (
              <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
                <Gamepad2 size={14} /> Dinámica Activa
              </Badge>
            ) : (
              <Button variant="outline" disabled className="gap-2 opacity-60">
                <Lock size={14} /> El profesor activará esta dinámica
              </Button>
            )}
          </div>
        </div>
        <AnimatePresence>
          {isDynamic1Active && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
              <S5_Dynamic1LuzSpO2 />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Lock, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import S5_Dynamic4EligeDispositivo from "../dynamics/S5_Dynamic4EligeDispositivo";

const TAKEAWAYS = [
  { emoji: "💡", text: "El pulsioxímetro usa LED rojo (660 nm) e infrarrojo (940 nm) para calcular SpO₂" },
  { emoji: "📉", text: "8 factores alteran su precisión: movimiento, pigmentación, frío, anemia y más" },
  { emoji: "⌚", text: "El smartwatch usa LED verde (520 nm) para FC y LED IR para SpO₂ de muñeca" },
  { emoji: "🚴", text: "En ciclismo indoor el brazal reduce artefactos vs muñeca; outdoor el GPS y la vibración añaden ruido" },
  { emoji: "🏋️", text: "En levantamiento, la banda pectoral es el gold standard — el smartwatch falla con grip fuerte" },
];

export default function S5_Block8Cierre() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 5, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic4Active = statuses?.find(s => s.dynamicId === 4)?.isActive ?? false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <GraduationCap size={14} /> Bloque 8 — Cierre
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
          Lo que aprendiste <span className="text-primary">hoy</span>
        </h2>
        <p className="text-muted-foreground text-base max-w-lg mx-auto">
          De la luz al dato. Del sensor al deporte. De la precisión a la decisión.
        </p>
      </motion.div>

      <div className="space-y-3">
        {TAKEAWAYS.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}>
            <Card className="border-border">
              <CardContent className="p-4 flex items-start gap-3">
                <span className="text-2xl">{t.emoji}</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.text}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <Card className="border-primary/20 bg-primary/5 text-center">
          <CardContent className="p-6 space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Próxima semana</p>
            <p className="text-2xl font-black text-primary">Biomecánica & Acelerómetros</p>
            <p className="text-sm text-muted-foreground">Sensores inerciales, IMU, análisis de movimiento deportivo</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dynamic 4 gate */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            {isDynamic4Active ? (
              <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
                <Gamepad2 size={14} /> Dinámica Final Activa
              </Badge>
            ) : (
              <Button variant="outline" disabled className="gap-2 opacity-60">
                <Lock size={14} /> El profesor activará esta dinámica
              </Button>
            )}
          </div>
        </div>
        <AnimatePresence>
          {isDynamic4Active && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
              <S5_Dynamic4EligeDispositivo />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}

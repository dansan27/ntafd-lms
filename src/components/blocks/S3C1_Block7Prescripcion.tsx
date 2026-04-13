import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeartPulse, Lock, Gamepad2, Zap, Calculator } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import S3C1_Dynamic4ZonasTren from "../dynamics/S3C1_Dynamic4ZonasTren";

const ZONES = [
  {
    zone: 1,
    name: "Recuperación",
    pct: "50–60%",
    lo: 50, hi: 60,
    color: "bg-blue-400",
    textColor: "text-blue-600",
    border: "border-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    benefit: "Recuperación activa · quema de grasa",
    example: "Caminata suave, rodaje regenerativo",
    emoji: "🧘",
    hrExample: "95–114 bpm (FC máx 190)",
  },
  {
    zone: 2,
    name: "Base aeróbica",
    pct: "60–70%",
    lo: 60, hi: 70,
    color: "bg-emerald-400",
    textColor: "text-emerald-600",
    border: "border-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    benefit: "Resistencia aeróbica · ritmo conversacional",
    example: "Trote largo, ciclismo de distancia",
    emoji: "🏃",
    hrExample: "114–133 bpm",
  },
  {
    zone: 3,
    name: "Potencia aeróbica",
    pct: "70–80%",
    lo: 70, hi: 80,
    color: "bg-yellow-400",
    textColor: "text-yellow-600",
    border: "border-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    benefit: "Umbral aeróbico · tempo",
    example: "Tempo run, fartlek moderado",
    emoji: "⚡",
    hrExample: "133–152 bpm",
  },
  {
    zone: 4,
    name: "Umbral láctico",
    pct: "80–90%",
    lo: 80, hi: 90,
    color: "bg-orange-500",
    textColor: "text-orange-600",
    border: "border-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    benefit: "Tolerancia al lactato · umbral anaeróbico",
    example: "Intervalos 6×800 m, crucero en bici",
    emoji: "🔥",
    hrExample: "152–171 bpm",
  },
  {
    zone: 5,
    name: "VO₂ Máx",
    pct: "90–100%",
    lo: 90, hi: 100,
    color: "bg-red-500",
    textColor: "text-red-600",
    border: "border-red-500",
    bg: "bg-red-50 dark:bg-red-950/30",
    benefit: "Esfuerzo máximo · intervalos VO₂",
    example: "HIIT 4×4 min, series al límite",
    emoji: "💥",
    hrExample: "171–190 bpm",
  },
];

const WEEKLY_PLAN = [
  { day: "Lun", zone: 2, label: "Base aeróbica 45 min", color: "bg-emerald-400" },
  { day: "Mar", zone: 5, label: "HIIT 4×4 min Z5", color: "bg-red-500" },
  { day: "Mié", zone: 1, label: "Recuperación 30 min", color: "bg-blue-400" },
  { day: "Jue", zone: 3, label: "Tempo run 30 min", color: "bg-yellow-400" },
  { day: "Vie", zone: 4, label: "Umbral 3×10 min", color: "bg-orange-500" },
  { day: "Sáb", zone: 2, label: "Larga distancia 60 min", color: "bg-emerald-400" },
  { day: "Dom", zone: 1, label: "Descanso / movilidad", color: "bg-blue-400" },
];

function HeartbeatIcon({ zone }: { zone: number }) {
  const bpm = 0.4 + (zone - 1) * 0.15;
  return (
    <motion.div
      className="flex items-center justify-center w-14 h-14 rounded-full bg-red-500/10"
      animate={{ scale: [1, 1 + bpm * 0.25, 1] }}
      transition={{ duration: 60 / (60 + zone * 18), repeat: Infinity, ease: "easeInOut" }}
    >
      <HeartPulse size={28} className="text-red-500" />
    </motion.div>
  );
}

export default function S3C1_Block7Prescripcion() {
  const [selectedZone, setSelectedZone] = useState<number>(2);

  const [, params] = useRoute("/week/:week/class/:class");
  const classId = params ? parseInt(params.class, 10) : 1;
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 3, classId },
    { refetchInterval: 3000 }
  );
  const isDynamic4Active = statuses?.find((s) => s.dynamicId === 4)?.isActive ?? false;

  const active = ZONES[selectedZone - 1];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <HeartPulse size={14} />
          Bloque 7 — Prescripción del Ejercicio
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Zonas de <span className="text-primary">entrenamiento</span> con VO₂ Máx
        </h1>
      </motion.div>

      <AnimatePresence mode="wait">
        {!isDynamic4Active && (
          <motion.div
            key="prescripcion-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            {/* Zone selector + detail */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-[auto_1fr] gap-6 items-start"
            >
              {/* Vertical zone bars */}
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                {ZONES.map((z, i) => (
                  <motion.button
                    key={z.zone}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedZone(z.zone)}
                    className={`flex md:flex-row flex-col items-center gap-2 p-2.5 rounded-xl border-2 transition-all cursor-pointer min-w-[4.5rem] md:min-w-0 ${selectedZone === z.zone ? `${z.border} shadow-md` : "border-transparent hover:border-muted"}`}
                  >
                    <div className={`w-8 h-8 md:w-6 md:h-6 rounded-full ${z.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {z.zone}
                    </div>
                    <span className="text-[10px] font-medium text-center leading-tight">{z.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Zone detail card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedZone}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                >
                  <Card className={`border-l-4 ${active.border} ${active.bg}`}>
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start gap-4">
                        <HeartbeatIcon zone={selectedZone} />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`${active.color} text-white`}>Zona {active.zone}</Badge>
                            <span className="font-bold text-lg">{active.name}</span>
                          </div>
                          <p className={`text-2xl font-bold ${active.textColor}`}>{active.pct} VO₂ Máx</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <Zap size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p><strong>Beneficio:</strong> {active.benefit}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-base flex-shrink-0">{active.emoji}</span>
                          <p><strong>Ejemplo:</strong> {active.example}</p>
                        </div>
                        <div className="bg-background/60 rounded-lg px-3 py-2 text-xs text-muted-foreground">
                          {active.hrExample}
                        </div>
                      </div>
                      {/* Intensity bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0%</span><span>100% VO₂ Máx</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${active.color} rounded-full`}
                            initial={{ width: `${active.lo}%` }}
                            animate={{ width: `${active.hi}%` }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Karvonen formula */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="bg-sidebar text-sidebar-foreground">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Calculator size={18} className="text-primary" />
                    <h3 className="font-semibold text-white">Fórmula de Karvonen</h3>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 text-center">
                    <p className="text-white font-mono text-sm md:text-base leading-relaxed">
                      FC objetivo = (FC máx − FC reposo) × % intensidad + FC reposo
                    </p>
                  </div>
                  <p className="text-white/60 text-xs">
                    Considera la frecuencia cardíaca de reserva, dando zonas más precisas que el simple % de FC máx.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* HIIT callout */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Card className="border-red-500/40 bg-red-50/50 dark:bg-red-950/20">
                <CardContent className="p-5 flex gap-4 items-start">
                  <span className="text-3xl">💥</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold">Protocolo HIIT 4×4</span>
                      <Badge variant="outline" className="text-xs border-red-400 text-red-600">Zona 5 · 90–95% FC máx</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      4 series de 4 minutos al 90–95% de la FC máx, con 3 minutos de recuperación activa entre series.
                    </p>
                    <p className="text-sm font-medium text-red-600">Resultado: +10% VO₂ Máx en 8 semanas (evidencia fuerte)</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly plan */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="space-y-3"
            >
              <h3 className="font-semibold text-center">Ejemplo de semana de entrenamiento</h3>
              <div className="grid grid-cols-7 gap-1.5">
                {WEEKLY_PLAN.map((day, i) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + i * 0.07 }}
                    whileHover={{ y: -3 }}
                  >
                    <Card className="text-center h-full">
                      <CardContent className="p-2 space-y-1.5">
                        <p className="text-xs font-bold text-muted-foreground">{day.day}</p>
                        <div className={`w-5 h-5 rounded-full ${day.color} text-white text-[10px] font-bold flex items-center justify-center mx-auto`}>
                          {day.zone}
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-tight">{day.label}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic divider */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0 }}
      >
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            {isDynamic4Active ? (
              <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
                <Gamepad2 size={14} /> Dinámica Activa
              </Badge>
            ) : (
              <Button variant="outline" disabled className="gap-2 opacity-60">
                <Lock size={14} />
                El profesor activará esta dinámica
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isDynamic4Active && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <S3C1_Dynamic4ZonasTren />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

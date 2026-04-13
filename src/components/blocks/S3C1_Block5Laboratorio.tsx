import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlaskConical, Wind, Lock, Gamepad2, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import S3C1_Dynamic2EquipoLab from "../dynamics/S3C1_Dynamic2EquipoLab";

const EQUIPMENT = [
  {
    id: "vyntus",
    name: "Vyntus CPX / Cosmed K5",
    role: "Carro metabólico principal",
    desc: "Sistema portátil o estacionario de calorimetría indirecta. Analiza en tiempo real el O₂ consumido y el CO₂ producido respiración a respiración (breath-by-breath).",
    emoji: "🔬",
    color: "border-primary",
    badgeColor: "bg-primary/10 text-primary border-primary/30",
  },
  {
    id: "mask",
    name: "Mascarilla + Noseclip",
    role: "Interfaz respiratoria",
    desc: "La mascarilla facial o boquilla sella herméticamente la vía aérea del sujeto. El noseclip asegura que todo el flujo pase por el circuito de análisis, eliminando fugas.",
    emoji: "😷",
    color: "border-cyan-500",
    badgeColor: "bg-cyan-500/10 text-cyan-700 border-cyan-500/30",
  },
  {
    id: "chamber",
    name: "Cámara de Mezcla",
    role: "Homogenización de gases",
    desc: "Volumen de mezcla que promedia las concentraciones de gases de múltiples respiraciones. Reduce la variabilidad y mejora la estabilidad de la señal en protocolos incrementales.",
    emoji: "⚗️",
    color: "border-violet-500",
    badgeColor: "bg-violet-500/10 text-violet-700 border-violet-500/30",
  },
  {
    id: "analyzers",
    name: "Analizadores O₂ / CO₂",
    role: "Sensores electroquímicos",
    desc: "Célula de fuel (O₂) y sensor infrarrojo (CO₂). Calibrados antes de cada test con mezclas certificadas. Precisión típica: ±0.02% para O₂ y ±0.03% para CO₂.",
    emoji: "📡",
    color: "border-emerald-500",
    badgeColor: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  },
];

const BRUCE_STAGES = [
  { stage: 1, speed: 2.7, incline: 10, time: "0–3 min", intensity: 30 },
  { stage: 2, speed: 4.0, incline: 12, time: "3–6 min", intensity: 45 },
  { stage: 3, speed: 5.5, incline: 14, time: "6–9 min", intensity: 60 },
  { stage: 4, speed: 6.8, incline: 16, time: "9–12 min", intensity: 72 },
  { stage: 5, speed: 8.0, incline: 18, time: "12–15 min", intensity: 83 },
  { stage: 6, speed: 8.9, incline: 20, time: "15–18 min", intensity: 92 },
  { stage: 7, speed: 9.7, incline: 22, time: "18–21 min", intensity: 100 },
];

// Single continuous breathing waveform: slow inhale peak → brief plateau → passive exhale → pause
// viewBox 0 0 400 80, baseline y=55, 4 cycles across the full width
const BREATH_PATH =
  "M 0,55 C 8,55 12,55 18,30 C 24,8 30,8 36,30 C 42,52 46,55 56,55 C 64,55 68,65 74,65 C 80,65 84,55 100,55 " +
  "C 108,55 112,55 118,30 C 124,8 130,8 136,30 C 142,52 146,55 156,55 C 164,55 168,65 174,65 C 180,65 184,55 200,55 " +
  "C 208,55 212,55 218,30 C 224,8 230,8 236,30 C 242,52 246,55 256,55 C 264,55 268,65 274,65 C 280,65 284,55 300,55 " +
  "C 308,55 312,55 318,30 C 324,8 330,8 336,30 C 342,52 346,55 356,55 C 364,55 368,65 374,65 C 380,65 384,55 400,55";

function BreathingWaveform() {
  return (
    <div className="space-y-1">
      <svg viewBox="0 0 400 80" className="w-full h-20" fill="none">
        {/* Grid lines */}
        {[20, 40, 55, 65].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y}
            stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" strokeDasharray={y === 55 ? "none" : "3 4"} />
        ))}
        {/* Animated waveform */}
        <motion.path
          d={BREATH_PATH}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.8, repeatType: "loop" }}
        />
        {/* Labels */}
        <text x="4" y="26" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="monospace">Inspiración</text>
        <text x="4" y="72" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="monospace">Espiración</text>
        <text x="4" y="53" fill="rgba(255,255,255,0.2)" fontSize="5.5" fontFamily="monospace">Línea base</text>
      </svg>
      <div className="flex justify-between text-[10px] text-white/25 font-mono px-1">
        <span>0 s</span><span>4 s</span><span>8 s</span><span>12 s</span><span>16 s</span>
      </div>
    </div>
  );
}

export default function S3C1_Block5Laboratorio() {
  const [expandedEquip, setExpandedEquip] = useState<string | null>(null);

  const [, params] = useRoute("/week/:week/class/:class");
  const classId = params ? parseInt(params.class, 10) : 1;
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 3, classId },
    { refetchInterval: 3000 }
  );
  const isDynamic2Active = statuses?.find((s) => s.dynamicId === 2)?.isActive ?? false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <FlaskConical size={14} />
          Bloque 5 — Laboratorio de Gases
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Medición <span className="text-primary">directa</span> del VO₂ Máx
        </h1>

      </motion.div>

      {/* Hero dark card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, type: "spring", stiffness: 80 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground overflow-hidden">
          <CardContent className="p-8 md:p-10 space-y-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-white/50 text-xs uppercase tracking-widest font-medium">
                  Gold Standard · Análisis de Gases
                </p>
                <h2 className="text-3xl font-bold text-white">LABORATORIO<br />DE GASES</h2>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary">±1–3%</p>
                    <p className="text-white/50 text-xs">Precisión</p>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <p className="text-4xl font-bold text-emerald-400">B×B</p>
                    <p className="text-white/50 text-xs">Breath-by-breath</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  La única forma de medir el VO₂ Máx real: captura cada respiración
                  y analiza las concentraciones de O₂ y CO₂ en tiempo real.
                </p>
              </div>
              <div className="space-y-3">
                {/* Real lab photo */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: "spring" }}>
                  <ImageLightbox
                    src="/images/analisis-gases-vo2max.png"
                    alt="Análisis de gases VO₂ Máx en laboratorio"
                    caption="Análisis de gases — Medición directa. Clic para ampliar"
                    className="ring-white/10"
                  />
                </motion.div>
                <p className="text-white/40 text-xs font-medium uppercase tracking-wide">Señal respiratoria en tiempo real</p>
                <div className="bg-black/40 rounded-xl p-4">
                  <BreathingWaveform />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: "VO₂", val: "58.4 ml/kg/min", color: "text-primary" },
                    { label: "VCO₂", val: "61.2 ml/kg/min", color: "text-cyan-400" },
                    { label: "RQ", val: "1.05", color: "text-emerald-400" },
                    { label: "VE", val: "142 L/min", color: "text-orange-400" },
                  ].map((m) => (
                    <div key={m.label} className="bg-white/5 rounded-lg p-2">
                      <p className="text-white/40">{m.label}</p>
                      <p className={`font-bold ${m.color}`}>{m.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Equipment cards */}
      <AnimatePresence mode="wait">
        {!isDynamic2Active && (
          <motion.div
            key="equip-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg font-semibold text-center"
            >
              Equipamiento del laboratorio
            </motion.h3>
            <div className="space-y-3">
              {EQUIPMENT.map((equip, i) => (
                <motion.div
                  key={equip.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <Card className={`overflow-hidden border-l-4 ${equip.color} hover:shadow-md transition-shadow`}>
                    <CardContent className="p-0">
                      <button
                        onClick={() => setExpandedEquip(expandedEquip === equip.id ? null : equip.id)}
                        className="w-full p-4 flex items-center gap-3 text-left hover:bg-muted/30 transition-colors"
                      >
                        <span className="text-2xl flex-shrink-0">{equip.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold">{equip.name}</p>
                            <Badge variant="outline" className={`text-xs ${equip.badgeColor}`}>{equip.role}</Badge>
                          </div>
                        </div>
                        {expandedEquip === equip.id
                          ? <ChevronUp size={16} className="text-muted-foreground flex-shrink-0" />
                          : <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />}
                      </button>
                      <AnimatePresence>
                        {expandedEquip === equip.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                          >
                            <div className="px-5 pb-4 pt-2 border-t border-border">
                              <p className="text-sm text-muted-foreground leading-relaxed">{equip.desc}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Bruce Protocol table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <Wind size={18} className="text-primary" />
                <h3 className="font-semibold">Protocolo de Bruce — 7 etapas</h3>
                <Badge variant="outline" className="text-xs">3 min c/etapa</Badge>
              </div>
              <Card>
                <CardContent className="p-4 space-y-2">
                  {BRUCE_STAGES.map((s, i) => (
                    <motion.div
                      key={s.stage}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 + i * 0.08 }}
                      className="grid grid-cols-[2rem_1fr_auto] items-center gap-3"
                    >
                      <span className="text-xs font-mono font-bold text-muted-foreground text-center">E{s.stage}</span>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{s.speed} km/h</span>
                          <span>·</span>
                          <span>{s.incline}% incl.</span>
                          <span>·</span>
                          <span>{s.time}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${s.intensity >= 90 ? "bg-red-500" : s.intensity >= 70 ? "bg-orange-400" : s.intensity >= 50 ? "bg-yellow-400" : "bg-emerald-400"}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${s.intensity}%` }}
                            transition={{ duration: 1.0, delay: 1.1 + i * 0.08, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-bold text-muted-foreground w-10 text-right">{s.intensity}%</span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Protocol steps */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
            >
              <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
                <CardContent className="p-5 space-y-3">
                  <h4 className="font-semibold text-sm">Pasos del protocolo</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Calentamiento 5 min", "Etapas incrementales", "Esfuerzo máximo (RQ >1.10)", "Recuperación activa 5 min"].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.7 + i * 0.1 }}
                      >
                        <Badge variant="outline" className="text-xs gap-1">
                          <span className="font-mono text-primary">{i + 1}</span>
                          {step}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
            {isDynamic2Active ? (
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
          {isDynamic2Active && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <S3C1_Dynamic2EquipoLab />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

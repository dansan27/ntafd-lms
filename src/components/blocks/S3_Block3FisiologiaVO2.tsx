import { Card, CardContent } from "@/components/ui/card";
import { Layers, Zap, ArrowRight, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const FACTORS = [
  { title: "Gasto Cardíaco (CO)", formula: "CO = FC × VS", desc: "Frecuencia cardíaca × volumen sistólico. Aumenta con el entrenamiento.", color: "text-red-500", bg: "bg-red-500/10", emoji: "❤️" },
  { title: "Diferencia a-vO₂", formula: "CaO₂ − CvO₂", desc: "Diferencia entre O₂ arterial y venoso. Refleja la extracción muscular.", color: "text-blue-500", bg: "bg-blue-500/10", emoji: "🩸" },
  { title: "Hemoglobina", formula: "Hb × SaO₂ × 1.34", desc: "A mayor hemoglobina, mayor capacidad de transporte de oxígeno.", color: "text-amber-500", bg: "bg-amber-500/10", emoji: "🔴" },
  { title: "Densidad Mitocondrial", formula: "↑ Mitocondrias = ↑ VO₂", desc: "El entrenamiento aeróbico aumenta la cantidad y eficiencia mitocondrial.", color: "text-emerald-500", bg: "bg-emerald-500/10", emoji: "⚡" },
];

const ATP_STEPS = [
  { label: "Glucosa / Glucógeno", icon: "🍬", desc: "Sustrato energético principal", color: "bg-yellow-500/10 border-yellow-500/30" },
  { label: "Glucólisis (citoplasma)", icon: "⚙️", desc: "2 ATP + Piruvato", color: "bg-orange-500/10 border-orange-500/30" },
  { label: "Acetil-CoA", icon: "🔗", desc: "Entrada a la mitocondria", color: "bg-amber-500/10 border-amber-500/30" },
  { label: "Ciclo de Krebs", icon: "🔄", desc: "2 ATP + NADH + FADH₂", color: "bg-green-500/10 border-green-500/30" },
  { label: "Cadena Respiratoria", icon: "⚡", desc: "34 ATP (con O₂)", color: "bg-primary/10 border-primary/30" },
  { label: "ATP Total", icon: "🏆", desc: "36-38 ATP por glucosa", color: "bg-emerald-500/10 border-emerald-500/30" },
];

export default function S3_Block3FisiologiaVO2() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Layers size={14} />
          Bloque 3 — Fisiología del VO₂ Máx
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          ¿Cómo produce energía <span className="text-primary">tu cuerpo</span>?
        </h1>
      </motion.div>

      {/* Fick Equation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-6 md:p-8 space-y-4 text-center">
            <p className="text-white/50 text-xs uppercase tracking-widest">Ecuación de Fick — Principio fundamental</p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-2xl md:text-3xl font-bold">
              <motion.span
                className="text-primary"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                VO₂
              </motion.span>
              <span className="text-white/40">=</span>
              <span className="text-red-400">CO</span>
              <span className="text-white/40">×</span>
              <span className="text-blue-400">(a-vO₂)</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm mt-4">
              <div className="bg-white/5 rounded-2xl p-4 space-y-1">
                <p className="text-red-400 font-semibold">CO = Gasto Cardíaco</p>
                <p className="text-white/50">FC (bpm) × VS (ml/lat)</p>
                <p className="text-white/30 text-xs">Litros de sangre bombeados/min</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 space-y-1">
                <p className="text-blue-400 font-semibold">(a-vO₂) = Diferencia Arterio-venosa</p>
                <p className="text-white/50">O₂ arterial − O₂ venoso</p>
                <p className="text-white/30 text-xs">Cuánto O₂ extraen los músculos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ATP Production flow */}
      <div className="space-y-4">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg font-semibold text-center"
        >
          Producción de ATP: de glucosa a energía
        </motion.h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {ATP_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              onClick={() => setActiveStep(activeStep === i ? null : i)}
              className="cursor-pointer"
            >
              <Card className={`border ${step.color} hover:shadow-md transition-all ${activeStep === i ? "ring-2 ring-primary" : ""}`}>
                <CardContent className="p-4 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    {i > 0 && (
                      <span className="text-muted-foreground text-xs font-mono">
                        {i < 3 ? <ArrowRight size={12} /> : <ArrowDown size={12} />}
                      </span>
                    )}
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <p className="text-sm font-semibold">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">Toca cada paso para destacarlo</p>
      </div>

      {/* Fick factors */}
      <div className="space-y-4">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-lg font-semibold text-center"
        >
          Factores que determinan el VO₂ Máx
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FACTORS.map((factor, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + i * 0.12 }}
              whileHover={{ y: -3 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl ${factor.bg}`}>
                      <span className="text-xl">{factor.emoji}</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{factor.title}</p>
                      <code className={`text-xs font-mono ${factor.color}`}>{factor.formula}</code>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{factor.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Training adaptations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-primary/20">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="text-primary" size={20} />
              <h3 className="font-bold">Adaptaciones al entrenamiento aeróbico</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {[
                "↑ Volumen sistólico (corazón más potente)",
                "↑ Densidad capilar en músculo",
                "↑ Concentración de mioglobina",
                "↑ Número y tamaño de mitocondrias",
                "↑ Enzimas oxidativas (SDH, citrato sintasa)",
                "↑ Diferencia arteriovenosa de O₂",
              ].map((adapt, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 + i * 0.07 }}
                  className="text-sm flex items-start gap-2"
                >
                  <span className="text-primary font-bold flex-shrink-0">→</span>
                  {adapt}
                </motion.p>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

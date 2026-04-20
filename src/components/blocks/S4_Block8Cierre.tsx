import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, AlertTriangle, Flag, Lock, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ZoomableImage from "@/components/ui/ZoomableImage";
import { BorderBeam } from "border-beam";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import S4_Dynamic4TestPulsioximetro from "../dynamics/S4_Dynamic4TestPulsioximetro";

const SPO2 = [
  { range: "≥ 95%",  label: "Normal",          color: "bg-green-500",  bar: 100 },
  { range: "91–94%", label: "Hipoxia leve",     color: "bg-yellow-500", bar: 72  },
  { range: "86–90%", label: "Hipoxia moderada", color: "bg-orange-500", bar: 44  },
  { range: "< 85%",  label: "Emergencia",       color: "bg-red-600",    bar: 20  },
];

const STEPS = [
  { emoji: "💡", title: "Emisión de luz",    sub: "660 nm (roja) + 940 nm (infrarroja)" },
  { emoji: "🩸", title: "Absorción",         sub: "HbO₂ absorbe más IR; Hb absorbe más roja" },
  { emoji: "🧮", title: "Ratio R/IR",        sub: "Microcontrolador calcula % saturación" },
  { emoji: "💓", title: "Pulso detectado",   sub: "Variaciones cíclicas → FC simultánea" },
];

const COLOR_TEST = [
  { type: "Dicromático",    matices: "< 20",  desc: "Daltonismo probable",             color: "border-red-500/30",    textColor: "text-red-400"    },
  { type: "Tricromático",   matices: "20–32", desc: "Visión de color normal",          color: "border-green-500/30",  textColor: "text-green-400"  },
  { type: "Tetracromático", matices: "33–39", desc: "Visión superior (~12% mujeres)",  color: "border-purple-500/30", textColor: "text-purple-400" },
];

const SUMMARY = [
  { emoji: "⚡", title: "EKG",            points: ["Ondas P · QRS · T", "Módulo AD8232", "FC = 300 ÷ cuadros R-R"] },
  { emoji: "🫀", title: "Polar H10",      points: ["2 electrodos / 1000 Hz", "HRV en milisegundos", "Gold standard deportivo"] },
  { emoji: "💡", title: "Pulsioxímetro",  points: ["Luz 660 nm + 940 nm", "SpO₂ normal ≥ 95%", "FC sin electrodos"] },
];

export default function S4_Block8Cierre() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 4, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic4Active = statuses?.find(s => s.dynamicId === 4)?.isActive ?? false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Eye size={14} /> Bloque 8 — Pulsioxímetro
        </div>
        <h1 className="text-4xl md:text-5xl font-black">SpO₂ con <span className="text-primary">luz</span></h1>
        <p className="text-muted-foreground text-sm">Saturación de oxígeno y FC sin agujas ni electrodos</p>
      </motion.div>

      {/* Hero: device image + SpO2 gauge */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="flex justify-center">
                <ZoomableImage
                  src="/images/semana%204/Captura%20de%20pantalla%202026-04-20%20153157.png"
                  alt="Pulsioxímetro en el dedo — SpO₂ 96%"
                  className="rounded-xl max-h-48 object-contain"
                />
              </div>
              <div className="space-y-3">
                <p className="text-white/40 text-[10px] uppercase tracking-widest">Valores de SpO₂</p>
                {SPO2.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-white w-16 flex-shrink-0">{s.range}</span>
                    <div className="flex-1 bg-white/10 rounded-full h-5 overflow-hidden">
                      <motion.div className={`h-full rounded-full flex items-center px-2 ${s.color}`}
                        initial={{ width: 0 }} animate={{ width: `${s.bar}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}>
                        <span className="text-white text-[10px] font-bold whitespace-nowrap">{s.label}</span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* How it works — 4 steps */}
      <div>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">¿Cómo funciona? Toca cada paso</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STEPS.map((s, i) => (
            <motion.button key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }} whileHover={{ scale: 1.03 }}
              onClick={() => setActiveStep(activeStep === i ? null : i)}
              className={`rounded-2xl border p-4 text-center space-y-2 transition-all ${
                activeStep === i ? "border-primary/50 bg-primary/10" : "border-border"
              }`}>
              <span className="text-3xl block">{s.emoji}</span>
              <p className="font-bold text-sm">{s.title}</p>
              <AnimatePresence>
                {activeStep === i && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} className="text-xs text-muted-foreground overflow-hidden">
                    {s.sub}
                  </motion.p>
                )}
              </AnimatePresence>
              {activeStep !== i && <p className="text-xs text-muted-foreground">{s.sub}</p>}
            </motion.button>
          ))}
        </div>
      </div>

      {/* EM spectrum */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Espectro electromagnético</h2>
        <div className="space-y-3">
          <Card>
            <CardContent className="p-4 bg-white rounded-xl">
              <ZoomableImage
                src="/images/semana%204/Captura%20de%20pantalla%202026-04-20%20155241.png"
                alt="Espectro visible — longitudes de onda en nanómetros"
                className="rounded-lg max-h-44 object-contain w-full"
              />
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3 bg-white rounded-xl">
                <ZoomableImage
                  src="/images/semana%204/Captura%20de%20pantalla%202026-04-20%20161159.png"
                  alt="Espectro electromagnético — IR, visible y UV con nanómetros"
                  className="rounded-lg max-h-36 object-contain w-full"
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 bg-white rounded-xl">
                <ZoomableImage
                  src="/images/semana%204/Captura%20de%20pantalla%202026-04-20%20161347.png"
                  alt="Espectro completo — frecuencia, longitud de onda y temperatura"
                  className="rounded-lg max-h-36 object-contain w-full"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Color vision test */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Test de visión de color</h2>
        <p className="text-xs text-muted-foreground mb-3">¿Cuántos matices distingues en la imagen? Toca para ampliarla.</p>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }} className="mb-4">
          <ZoomableImage
            src="/images/semana%204/Captura%20de%20pantalla%202026-04-20%20155445.png"
            alt="Test de colores — ¿cuántos matices ves?"
            className="rounded-xl w-full max-h-32 object-cover"
          />
        </motion.div>
        <div className="grid grid-cols-3 gap-3">
          {COLOR_TEST.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }} whileHover={{ y: -3 }}>
              <Card className={`border text-center ${t.color}`}>
                <CardContent className="p-4 space-y-1">
                  <p className={`text-2xl font-black ${t.textColor}`}>{t.matices}</p>
                  <p className="text-xs text-muted-foreground">matices</p>
                  <p className={`font-bold text-sm ${t.textColor}`}>{t.type}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Limitation warning */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardContent className="p-5 flex gap-3 items-start">
            <AlertTriangle className="text-orange-500 flex-shrink-0" size={20} />
            <div className="text-sm space-y-0.5">
              <p className="font-bold">Limitaciones a recordar</p>
              <p className="text-muted-foreground text-xs">Uñas pintadas · Frío (vasoconstricción) · Movimiento intenso · No detecta intoxicación por CO</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Flag size={14} className="text-muted-foreground" />
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Resumen de la clase</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {SUMMARY.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + i * 0.1 }} whileHover={{ y: -4 }}>
              <Card className="h-full">
                <CardContent className="p-5 space-y-3">
                  <span className="text-4xl">{s.emoji}</span>
                  <p className="font-black text-base">{s.title}</p>
                  <ul className="space-y-1">
                    {s.points.map((p, j) => (
                      <li key={j} className="text-xs text-muted-foreground flex gap-1.5">
                        <span className="text-primary mt-0.5">·</span>{p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dynamic 4 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }}>
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
                <Lock size={14} /> El profesor activará esta dinámica
              </Button>
            )}
          </div>
        </div>
        <AnimatePresence>
          {isDynamic4Active && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
              <S4_Dynamic4TestPulsioximetro />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Completion */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9 }}>
        <BorderBeam colorVariant="colorful">
        <Card className="border-primary/30 bg-primary/5 text-center">
          <CardContent className="p-8 space-y-3">
            <p className="text-4xl">🏆</p>
            <p className="text-2xl font-black">¡Clase completada!</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["EKG Digital", "AD8232", "Filtrado", "Polar H10", "SpO₂"].map((tag) => (
                <Badge key={tag} className="bg-primary/20 text-primary border-0">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        </BorderBeam>
      </motion.div>

    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cpu, Lock, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import S3_Dynamic3QuizVO2 from "../dynamics/S3_Dynamic3QuizVO2";

// Filter SVG paths — each shows the frequency response of a filter
const FILTERS = [
  {
    id: "lowpass",
    name: "Pasa-bajos",
    subtitle: "Low-pass filter",
    desc: "Permite pasar las frecuencias bajas y atenúa las altas. En ECG: elimina ruido eléctrico de alta frecuencia (movimiento muscular).",
    use: "Elimina artefactos de movimiento (>100 Hz)",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    emoji: "〰️",
    // SVG path for low-pass response (flat then drops)
    path: "M 0,20 L 60,20 Q 80,20 90,50 L 120,70",
    passZone: "M 0,20 L 60,20 L 60,80 L 0,80 Z",
  },
  {
    id: "highpass",
    name: "Pasa-altos",
    subtitle: "High-pass filter",
    desc: "Permite pasar las frecuencias altas y atenúa las bajas. En ECG: elimina deriva de la línea base (movimiento respiratorio).",
    use: "Elimina deriva de línea base (<0.5 Hz)",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    emoji: "📈",
    path: "M 0,70 L 30,70 Q 40,70 50,40 L 60,20 L 120,20",
    passZone: "M 60,20 L 120,20 L 120,80 L 60,80 Z",
  },
  {
    id: "bandpass",
    name: "Pasa-banda",
    subtitle: "Band-pass filter",
    desc: "Permite pasar solo un rango de frecuencias. El ECG clínico usa 0.05-150 Hz. Para deporte: 0.5-100 Hz.",
    use: "ECG estándar: 0.5-100 Hz",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    emoji: "🎚️",
    path: "M 0,70 L 20,70 Q 30,70 40,20 L 80,20 Q 90,20 100,70 L 120,70",
    passZone: "M 40,20 L 80,20 L 80,80 L 40,80 Z",
  },
  {
    id: "notch",
    name: "Filtro Notch",
    subtitle: "Band-stop / Notch filter",
    desc: "Elimina una frecuencia específica. Imprescindible para eliminar la interferencia de la red eléctrica (50 Hz en Perú/Europa, 60 Hz en USA).",
    use: "Elimina interferencia de red: 50/60 Hz",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    emoji: "🚫",
    path: "M 0,20 L 50,20 Q 55,20 58,70 L 62,70 Q 65,20 70,20 L 120,20",
    passZone: null,
  },
];

const AD8232_FEATURES = [
  { label: "Amplificador de Instrumentación", desc: "Amplifica la diferencia de potencial entre electrodos eliminando ruido de modo común" },
  { label: "Filtro pasa-bajos integrado", desc: "Elimina ruido de alta frecuencia (músculo esquelético, interferencia eléctrica)" },
  { label: "Drive de pierna derecha (RLD)", desc: "Retroalimentación activa que mejora la relación señal/ruido" },
  { label: "Detección de electrodo suelto", desc: "Notifica cuando un electrodo no hace buen contacto con la piel" },
  { label: "Salida VOUT analógica", desc: "Señal filtrada lista para ser digitalizada por un ADC (ej. Arduino, STM32)" },
];

export default function S3_Block6Procesamiento() {
  const [activeFilter, setActiveFilter] = useState<string>("bandpass");

  const [, params] = useRoute("/week/:week/class/:class");
  const classId = params ? parseInt(params.class, 10) : 2;

  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 3, classId },
    { refetchInterval: 3000 }
  );
  const isDynamic2Active = statuses?.find(s => s.dynamicId === 2)?.isActive ?? false;

  const active = FILTERS.find(f => f.id === activeFilter)!;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Cpu size={14} />
          Bloque 6 — Procesamiento de Señal
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          De electrodos a <span className="text-primary">datos limpios</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          La señal ECG es diminuta (mV) y llena de ruido. El procesamiento es lo que la hace legible.
        </p>
      </motion.div>

      {/* Signal problem */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-6 space-y-4">
            <p className="text-white/50 text-xs uppercase tracking-widest text-center">El problema de la señal ECG</p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              {[
                { val: "0.1–5 mV", label: "Amplitud de la señal", icon: "📉", sub: "Señal muy débil" },
                { val: "0.5–150 Hz", label: "Rango de frecuencias útil", icon: "📊", sub: "Banda del ECG clínico" },
                { val: "50/60 Hz", label: "Interferencia de red eléctrica", icon: "⚡", sub: "Fuente de ruido principal" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="space-y-1"
                >
                  <div className="text-2xl">{item.icon}</div>
                  <p className="text-2xl font-bold text-white">{item.val}</p>
                  <p className="text-white/60 text-xs">{item.label}</p>
                  <p className="text-white/30 text-xs">{item.sub}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter visualizer */}
      <div className="space-y-4">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg font-semibold text-center"
        >
          Tipos de filtros en señal ECG
        </motion.h3>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {FILTERS.map((filter) => (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                activeFilter === filter.id
                  ? `${filter.bg} ${filter.color} ${filter.border} shadow-sm`
                  : "border-border text-muted-foreground hover:bg-muted/40"
              }`}
            >
              <span>{filter.emoji}</span>
              {filter.name}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className={`border-2 ${active.border}`}>
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-2xl">{active.emoji}</span>
                  <div>
                    <h3 className={`font-bold ${active.color}`}>{active.name}</h3>
                    <p className="text-xs text-muted-foreground">{active.subtitle}</p>
                  </div>
                  <Badge variant="outline" className={`ml-auto text-xs ${active.color} ${active.border}`}>
                    {active.use}
                  </Badge>
                </div>

                {/* Filter frequency response graph */}
                <div className={`rounded-2xl p-4 ${active.bg}`}>
                  <p className="text-xs text-muted-foreground mb-2 text-center">Respuesta en frecuencia</p>
                  <svg viewBox="0 0 120 90" className="w-full max-w-xs mx-auto h-24">
                    {/* Axes */}
                    <line x1="0" y1="80" x2="120" y2="80" stroke="currentColor" strokeWidth="1" className="text-border" />
                    <line x1="0" y1="0" x2="0" y2="80" stroke="currentColor" strokeWidth="1" className="text-border" />
                    {/* Labels */}
                    <text x="60" y="89" textAnchor="middle" fontSize="5" className="fill-muted-foreground">Frecuencia →</text>
                    <text x="-8" y="40" textAnchor="middle" fontSize="5" className="fill-muted-foreground" transform="rotate(-90,-8,40)">Ganancia</text>
                    {/* Pass zone */}
                    {active.passZone && (
                      <path d={active.passZone} fill="currentColor" opacity="0.15" className={active.color} />
                    )}
                    {/* Frequency response curve */}
                    <motion.path
                      d={active.path}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className={active.color}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                    {/* Notch mark for notch filter */}
                    {active.id === "notch" && (
                      <motion.text
                        x="60" y="75"
                        textAnchor="middle"
                        fontSize="5"
                        className="fill-red-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        50/60 Hz
                      </motion.text>
                    )}
                  </svg>
                </div>

                <p className="text-sm text-muted-foreground">{active.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* AD8232 Module */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-primary/10">
                <Cpu className="text-primary" size={22} />
              </div>
              <div>
                <h3 className="font-bold">Módulo AD8232</h3>
                <p className="text-xs text-muted-foreground">Circuito integrado de acondicionamiento de señal ECG</p>
              </div>
              <Badge variant="outline" className="ml-auto text-xs">Analog Devices</Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              El AD8232 extrae, amplifica y filtra señales de biopotencial en condiciones ruidosas.
              Diseñado para extraer señales de solo <strong>milisegundos de duración</strong> en presencia de ruido electromagnético.
            </p>

            <div className="grid md:grid-cols-2 gap-2">
              {AD8232_FEATURES.map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.08 }}
                  className="flex items-start gap-2 p-3 rounded-xl bg-muted/30"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-[10px] font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{feat.label}</p>
                    <p className="text-xs text-muted-foreground">{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dynamic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
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
              <S3_Dynamic3QuizVO2 />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

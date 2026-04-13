import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Lock, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import S3_Dynamic2IdentificaOnda from "../dynamics/S3_Dynamic2IdentificaOnda";

// ECG path — two beats in viewBox 0 0 400 100, baseline y=60
const ECG_PATH = "M 0,60 L 25,60 C 35,60 37,45 42,43 C 47,45 49,60 55,60 L 72,60 L 76,65 L 82,10 L 86,68 L 92,60 L 110,60 C 118,60 124,44 130,42 C 136,46 140,60 148,60 L 180,60 L 184,65 L 190,10 L 194,68 L 200,60 L 218,60 C 226,60 232,44 238,42 C 244,46 248,60 256,60 L 290,60 L 294,65 L 300,10 L 304,68 L 310,60 L 330,60 C 338,60 344,44 350,42 C 356,46 360,60 368,60 L 400,60";

const WAVES = [
  { id: "P", label: "Onda P", cx: 42, cy: 43, color: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/30", desc: "Despolarización auricular. El impulso eléctrico se origina en el nodo SA y recorre ambas aurículas." },
  { id: "PR", label: "Intervalo PR", cx: 72, cy: 60, color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/30", desc: "Tiempo de conducción del impulso desde las aurículas hasta los ventrículos (nodo AV). Normal: 120-200 ms." },
  { id: "QRS", label: "Complejo QRS", cx: 82, cy: 10, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", desc: "Despolarización ventricular. Q: septo interventricular. R: pared ventricular principal. S: base ventricular. Normal: <120 ms." },
  { id: "ST", label: "Segmento ST", cx: 110, cy: 60, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30", desc: "Período entre la despolarización y repolarización ventricular. Su elevación o depresión indica isquemia." },
  { id: "T", label: "Onda T", cx: 130, cy: 42, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30", desc: "Repolarización ventricular. Los ventrículos se recuperan para el siguiente latido. Invertida puede indicar isquemia." },
];

const ELECTRODES = [
  { label: "RA (Rojo)", placement: "Bajo clavícula derecha", desc: "Referencia positiva derecha", color: "bg-red-500" },
  { label: "LA (Amarillo)", placement: "Bajo clavícula izquierda", desc: "Referencia positiva izquierda", color: "bg-yellow-500" },
  { label: "LL (Verde)", placement: "Lado izquierdo, bajo pectoral", desc: "Electrodo de tierra/referencia", color: "bg-green-500" },
];

export default function S3_Block5ECG() {
  const [selectedWave, setSelectedWave] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const [, params] = useRoute("/week/:week/class/:class");
  const classId = params ? parseInt(params.class, 10) : 2;

  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 3, classId },
    { refetchInterval: 3000 }
  );
  const isDynamic1Active = statuses?.find(s => s.dynamicId === 1)?.isActive ?? false;

  const selected = WAVES.find(w => w.id === selectedWave);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Activity size={14} />
          Bloque 5 — El ECG / EKG
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          El <span className="text-primary">corazón eléctrico</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          El electrocardiograma (ECG/EKG) registra la actividad eléctrica del corazón latido a latido.
        </p>

      </motion.div>

      {/* Animated ECG Waveform — MAIN VISUAL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/50 text-xs uppercase tracking-widest">Electrocardiograma en tiempo real</p>
                <div className="flex items-center gap-2 mt-1">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-400"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-green-400 text-sm font-medium">72 bpm — Ritmo sinusal normal</span>
                </div>
              </div>
              <button
                onClick={() => setAnimKey(k => k + 1)}
                className="text-xs text-white/40 hover:text-white/70 underline"
              >
                Repetir
              </button>
            </div>

            {/* ECG SVG */}
            <div className="bg-black/30 rounded-2xl p-4 relative">
              {/* Grid lines */}
              <svg viewBox="0 0 400 100" className="w-full h-28 absolute inset-0 opacity-10">
                {Array.from({ length: 20 }, (_, i) => (
                  <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="100" stroke="#22c55e" strokeWidth="0.5" />
                ))}
                {Array.from({ length: 5 }, (_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 25} x2="400" y2={i * 25} stroke="#22c55e" strokeWidth="0.5" />
                ))}
              </svg>

              {/* Main ECG path */}
              <svg key={animKey} viewBox="0 0 400 100" className="w-full h-28 relative z-10">
                <motion.path
                  d={ECG_PATH}
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0.8 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />

                {/* Wave labels on the SVG */}
                {WAVES.map((wave, i) => (
                  <motion.g
                    key={wave.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.5 }}
                    onClick={() => setSelectedWave(selectedWave === wave.id ? null : wave.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle
                      cx={wave.cx}
                      cy={wave.cy}
                      r="6"
                      fill={selectedWave === wave.id ? "#4ade80" : "rgba(74,222,128,0.2)"}
                      stroke="#4ade80"
                      strokeWidth="1.5"
                    />
                    <text
                      x={wave.cx}
                      y={wave.id === "QRS" ? wave.cy - 10 : wave.cy + 18}
                      textAnchor="middle"
                      fill="#4ade80"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      {wave.id}
                    </text>
                  </motion.g>
                ))}
              </svg>
            </div>

            <p className="text-white/40 text-xs text-center">Toca las letras del ECG para explorar cada componente</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Wave detail panel */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className={`border-2 ${selected.border}`}>
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${selected.bg} ${selected.color}`}>
                    {selected.id}
                  </div>
                  <h3 className={`font-bold ${selected.color}`}>{selected.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{selected.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wave components grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {WAVES.map((wave, i) => (
          <motion.div
            key={wave.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            whileHover={{ y: -3 }}
            onClick={() => setSelectedWave(selectedWave === wave.id ? null : wave.id)}
            className="cursor-pointer"
          >
            <Card className={`hover:shadow-md transition-all border ${wave.border} ${selectedWave === wave.id ? "ring-2 ring-primary" : ""}`}>
              <CardContent className="p-4 space-y-2">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${wave.bg} ${wave.color}`}>
                  {wave.id}
                </div>
                <p className="font-semibold text-sm">{wave.label}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{wave.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Electrode placement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-bold text-center">Colocación de Electrodos (Sistema de 3 derivaciones)</h3>

            {/* Real electrode photo */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="mx-auto max-w-md">
              <ImageLightbox
                src="/images/electrodos-ekg.png"
                alt="Electrodos ECG colocados en el pecho"
                caption="Colocación real de electrodos ECG — clic para ampliar"
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {ELECTRODES.map((el, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-muted/30"
                >
                  <div className={`w-4 h-4 rounded-full ${el.color} flex-shrink-0 mt-0.5 shadow-sm`} />
                  <div>
                    <p className="font-semibold text-sm">{el.label}</p>
                    <p className="text-xs text-muted-foreground">{el.placement}</p>
                    <p className="text-xs text-muted-foreground italic">{el.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-center text-muted-foreground">
              El ECG estándar usa 12 derivaciones (10 electrodos). En monitoreo deportivo se usan configuraciones simplificadas de 3 o 5 electrodos.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dynamic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
      >
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
                <Lock size={14} />
                El profesor activará esta dinámica
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isDynamic1Active && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <S3_Dynamic2IdentificaOnda />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

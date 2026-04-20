import { Card, CardContent } from "@/components/ui/card";
import { Cpu } from "lucide-react";
import { motion } from "framer-motion";
import ZoomableImage from "@/components/ui/ZoomableImage";

const PINS = [
  { pin: "GND",    desc: "Tierra / referencia",            color: "border-gray-500/40 text-gray-300" },
  { pin: "3.3v",   desc: "Alimentación del módulo",        color: "border-red-500/40 text-red-400" },
  { pin: "OUTPUT", desc: "Señal analógica filtrada",       color: "border-green-500/40 text-green-400" },
  { pin: "LO−",   desc: "Lead-Off detección negativo",    color: "border-yellow-500/40 text-yellow-400" },
  { pin: "LO+",   desc: "Lead-Off detección positivo",    color: "border-yellow-500/40 text-yellow-400" },
  { pin: "SDN",    desc: "Shutdown (apagado por software)","color": "border-purple-500/40 text-purple-400" },
];

const FLOW = [
  { n: "1", label: "Electrodos",       sub: "RA · LA · LL capturan el potencial eléctrico del corazón" },
  { n: "2", label: "Amplificación",    sub: "INA amplifica la señal débil (~1 mV) sin saturar" },
  { n: "3", label: "Filtros internos", sub: "Paso alto 0.5 Hz elimina deriva + paso bajo 40 Hz elimina EMG" },
  { n: "4", label: "Salida analógica", sub: "Pin OUTPUT → ADC del Arduino / microcontrolador" },
];

export default function S4_Block4FiltradoEKG() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Cpu size={14} /> Bloque 4 — Módulo AD8232
        </div>
        <h1 className="text-4xl md:text-5xl font-black">El chip <span className="text-primary">AD8232</span></h1>
        <p className="text-muted-foreground text-sm">Amplificación + filtrado integrados para capturar EKG con Arduino</p>
      </motion.div>

      {/* Board image + pins */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-sidebar text-sidebar-foreground overflow-hidden">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="flex justify-center">
                <ZoomableImage
                  src="/images/semana%204/Captura%20de%20pantalla%202026-04-20%20152231.png"
                  alt="Módulo AD8232 SparkFun — pines etiquetados"
                  className="rounded-xl max-h-56 object-contain"
                />
              </div>
              <div className="space-y-3">
                <p className="text-white/40 text-[10px] uppercase tracking-widest">Pines del módulo</p>
                <div className="grid grid-cols-2 gap-2">
                  {PINS.map((p, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      className={`rounded-xl border px-3 py-2 bg-white/5 ${p.color}`}>
                      <p className="font-mono font-black text-sm">{p.pin}</p>
                      <p className="text-[10px] text-white/50 leading-snug mt-0.5">{p.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Signal flow */}
      <div>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Cadena de señal</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FLOW.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}>
              <Card className="h-full">
                <CardContent className="p-4 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-black text-sm">{f.n}</div>
                  <p className="font-bold text-sm">{f.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.sub}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Circuit diagram */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Diagrama interno del circuito</h2>
        <Card>
          <CardContent className="p-4 flex justify-center bg-white rounded-xl">
            <ZoomableImage
              src="/images/semana%204/Captura%20de%20pantalla%202026-04-20%20152244.png"
              alt="Diagrama interno AD8232 — amplificadores y filtros"
              className="rounded-lg max-h-64 object-contain"
            />
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "Absorción diferencial",
    desc: "El sensor mide cuánta luz roja (660 nm) e infrarroja (940 nm) llega al fotodetector tras atravesar el tejido.",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
  },
  {
    num: "02",
    title: "Ratio R/IR",
    desc: "Calcula el cociente entre la absorción de luz roja e infrarroja. La oxihemoglobina absorbe más IR; la desoxihemoglobina absorbe más roja.",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    num: "03",
    title: "Cálculo SpO₂",
    desc: "Convierte el ratio en porcentaje de saturación. SpO₂ normal: 95–100%. Rango deportivo de alerta: < 92%.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    num: "04",
    title: "Medición del pulso",
    desc: "Con cada latido, la sangre expande los capilares. La variación periódica de absorción de luz da la frecuencia cardíaca.",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
];

const SPO2_ZONES = [
  { range: "98–100%", label: "Óptimo", color: "bg-green-500", w: "w-full" },
  { range: "95–97%", label: "Normal", color: "bg-lime-500", w: "w-4/5" },
  { range: "90–94%", label: "Hipoxia leve", color: "bg-yellow-500", w: "w-3/5" },
  { range: "< 90%", label: "Emergencia", color: "bg-red-500", w: "w-2/5" },
];

export default function S5_Block3SpO2Pulso() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Activity size={14} /> Bloque 3 — SpO₂ y Pulso
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
          Del fotón al <span className="text-primary">porcentaje</span>
        </h2>
        <p className="text-muted-foreground text-base max-w-lg mx-auto">
          4 pasos que convierten luz en el número que ves en la pantalla.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {STEPS.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.12 }}>
            <Card className={`border ${s.bg} h-full`}>
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <span className={`text-3xl font-black ${s.color}`}>{s.num}</span>
                  <p className="font-bold text-sm">{s.title}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* SpO2 zones */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Zonas de SpO₂</p>
            <div className="space-y-3">
              {SPO2_ZONES.map((z, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{z.range}</span>
                    <span className="text-muted-foreground">{z.label}</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <motion.div className={`h-full rounded-full ${z.color} ${z.w}`}
                      initial={{ width: 0 }} animate={{ width: undefined }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              ⚠️ En altitudes &gt; 3000 m, SpO₂ puede caer a 85–90% en personas no aclimatadas — no siempre es patológico.
            </p>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart2 } from "lucide-react";
import { motion } from "framer-motion";

const WATCHES = [
  {
    name: "Apple Watch Ultra 2",
    icon: "🍎",
    spo2: true, ecg: true, hrv: true, gps: true,
    precision: 95,
    best: "Running, triatlón, montaña",
    color: "border-slate-500/30 bg-slate-500/5",
    badge: "bg-slate-500/20 text-slate-300",
  },
  {
    name: "Garmin Fenix 8",
    icon: "🟠",
    spo2: true, ecg: false, hrv: true, gps: true,
    precision: 97,
    best: "Multideporte, expediciones",
    color: "border-orange-500/30 bg-orange-500/5",
    badge: "bg-orange-500/20 text-orange-300",
  },
  {
    name: "Polar Vantage V3",
    icon: "🔵",
    spo2: true, ecg: false, hrv: true, gps: true,
    precision: 98,
    best: "Ciclismo, triatlón de alto rendimiento",
    color: "border-blue-500/30 bg-blue-500/5",
    badge: "bg-blue-500/20 text-blue-300",
  },
  {
    name: "Samsung Galaxy Watch 7",
    icon: "🟣",
    spo2: true, ecg: true, hrv: true, gps: true,
    precision: 91,
    best: "Uso diario, fitness general",
    color: "border-purple-500/30 bg-purple-500/5",
    badge: "bg-purple-500/20 text-purple-300",
  },
  {
    name: "Fitbit Charge 6",
    icon: "🟢",
    spo2: true, ecg: false, hrv: false, gps: false,
    precision: 87,
    best: "Monitoreo cotidiano, sueño",
    color: "border-green-500/30 bg-green-500/5",
    badge: "bg-green-500/20 text-green-300",
  },
];

const FEATURES = ["SpO₂", "ECG", "HRV", "GPS"];

export default function S5_Block6ComparativaSmartwatch() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <BarChart2 size={14} /> Bloque 6 — ¿Cuál Smartwatch?
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
          No todos los relojes son <span className="text-primary">iguales</span>
        </h2>
        <p className="text-muted-foreground text-base max-w-lg mx-auto">
          Precisión, sensores y uso ideal. Elige el correcto para cada atleta.
        </p>
      </motion.div>

      {/* Feature header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-2 items-center px-4 mb-2">
          <span className="text-xs text-muted-foreground font-medium">Dispositivo</span>
          {FEATURES.map(f => (
            <span key={f} className="text-xs text-muted-foreground font-medium text-center w-10">{f}</span>
          ))}
          <span className="text-xs text-muted-foreground font-medium text-center w-14">FC %</span>
        </div>

        {/* Watch rows */}
        <div className="space-y-3">
          {WATCHES.map((w, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}>
              <Card className={`border ${w.color}`}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-2 items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{w.icon}</span>
                        <div>
                          <p className="font-bold text-sm">{w.name}</p>
                          <p className="text-xs text-muted-foreground">{w.best}</p>
                        </div>
                      </div>
                    </div>
                    {[w.spo2, w.ecg, w.hrv, w.gps].map((has, j) => (
                      <div key={j} className="flex justify-center w-10">
                        <span className={`text-base ${has ? "text-green-400" : "text-muted-foreground/30"}`}>
                          {has ? "✓" : "✗"}
                        </span>
                      </div>
                    ))}
                    <div className="w-14 text-center">
                      <Badge className={`text-xs ${w.badge}`}>{w.precision}%</Badge>
                    </div>
                  </div>
                  {/* Precision bar */}
                  <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div className="h-full rounded-full bg-primary"
                      style={{ width: `${w.precision}%` }}
                      initial={{ width: 0 }} animate={{ width: `${w.precision}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-4">
            <p className="text-xs text-yellow-300 font-bold mb-1">⚠️ Limitación compartida</p>
            <p className="text-xs text-muted-foreground">
              Todos usan LED verde para FC en reposo — preciso. En ejercicio intenso (&gt;85% FC máx) el movimiento genera artefactos que reducen precisión hasta un 15%. Para deporte de alto rendimiento, combinar con banda pectoral (Polar H10).
            </p>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
}

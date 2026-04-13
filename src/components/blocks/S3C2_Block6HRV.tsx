import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Heart, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

// Realistic-looking RR intervals — elite athlete (variable spacing = high HRV)
const ELITE_PEAKS = [
  { x: 18, rr: null },
  { x: 78, rr: "860ms" },
  { x: 145, rr: "780ms" },
  { x: 205, rr: "900ms" },
  { x: 278, rr: "820ms" },
  { x: 340, rr: "750ms" },
  { x: 410, rr: "870ms" },
];

// Stressed — uniform spacing = low HRV
const STRESSED_PEAKS = [
  { x: 18, rr: null },
  { x: 68, rr: "550ms" },
  { x: 118, rr: "545ms" },
  { x: 168, rr: "560ms" },
  { x: 218, rr: "552ms" },
  { x: 268, rr: "548ms" },
  { x: 318, rr: "555ms" },
  { x: 368, rr: "550ms" },
  { x: 418, rr: "548ms" },
];

function buildECGPath(peaks: { x: number }[], baseline: number): string {
  let d = `M 0,${baseline}`;
  peaks.forEach((p) => {
    d += ` L ${p.x - 8},${baseline} L ${p.x - 3},${baseline + 5} L ${p.x},${baseline - 32} L ${p.x + 3},${baseline + 8} L ${p.x + 8},${baseline}`;
  });
  d += ` L 440,${baseline}`;
  return d;
}

const ELITE_PATH = buildECGPath(ELITE_PEAKS, 42);
const STRESSED_PATH = buildECGPath(STRESSED_PEAKS, 42);

const HRV_METRICS = [
  { id: "RMSSD", name: "RMSSD", desc: "Raíz cuadrada de la media de diferencias sucesivas al cuadrado. El más usado para HRV en deporte.", elite: "60–100 ms", sedentary: "20–30 ms", color: "text-primary", bg: "bg-primary/10" },
  { id: "SDNN", name: "SDNN", desc: "Desviación estándar de todos los intervalos NN. Refleja actividad simpática y parasimpática total.", elite: "80–120 ms", sedentary: "30–50 ms", color: "text-emerald-600", bg: "bg-emerald-500/10" },
  { id: "pNN50", name: "pNN50", desc: "Porcentaje de intervalos NN consecutivos que difieren >50 ms. Marcador parasimpático puro.", elite: ">25%", sedentary: "<10%", color: "text-violet-600", bg: "bg-violet-500/10" },
];

const APPS = [
  { name: "HRV4Training", emoji: "📊", note: "Medición con cámara frontal" },
  { name: "Elite HRV", emoji: "💚", note: "Gold standard en investigación" },
  { name: "WHOOP", emoji: "⌚", note: "HRV continua durante el sueño" },
  { name: "Garmin Body Battery", emoji: "🔋", note: "Score basado en HRV + sueño" },
];

export default function S3C2_Block6HRV() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Heart size={14} />
          Bloque 6 — Variabilidad de la Frecuencia Cardíaca
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          HRV: el pulso de tu{" "}
          <span className="text-primary">recuperación</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          No todos los latidos son iguales. La variación entre ellos revela el estado real del sistema nervioso autónomo.
        </p>
      </motion.div>

      {/* HRV meter gauge */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 80 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Gauge SVG */}
              <div className="flex flex-col items-center gap-3">
                <p className="text-white/50 text-xs uppercase tracking-widest">RMSSD — Atleta élite</p>
                <div className="relative w-44 h-24">
                  <svg viewBox="0 0 200 110" className="w-full">
                    {/* Track arc */}
                    <path
                      d="M 15,100 A 85,85 0 0 1 185,100"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />
                    {/* Red zone */}
                    <path
                      d="M 15,100 A 85,85 0 0 1 65,30"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="14"
                      strokeLinecap="round"
                      opacity={0.7}
                    />
                    {/* Amber zone */}
                    <path
                      d="M 65,30 A 85,85 0 0 1 135,30"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="14"
                      strokeLinecap="round"
                      opacity={0.7}
                    />
                    {/* Green zone */}
                    <path
                      d="M 135,30 A 85,85 0 0 1 185,100"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="14"
                      strokeLinecap="round"
                      opacity={0.7}
                    />
                    {/* Needle — animates to ~78ms (elite zone) */}
                    <motion.line
                      x1="100"
                      y1="100"
                      x2="100"
                      y2="25"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ rotate: -80 }}
                      animate={{ rotate: 45 }}
                      style={{ originX: "100px", originY: "100px" }}
                      transition={{ delay: 0.6, duration: 1.4, type: "spring", stiffness: 60 }}
                    />
                    <circle cx="100" cy="100" r="6" fill="white" />
                    {/* Labels */}
                    <text x="18" y="118" fill="rgba(255,255,255,0.4)" fontSize="9">Bajo</text>
                    <text x="88" y="14" fill="rgba(255,255,255,0.4)" fontSize="9">Medio</text>
                    <text x="158" y="118" fill="rgba(255,255,255,0.4)" fontSize="9">Alto</text>
                  </svg>
                  <motion.p
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 text-2xl font-bold text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    78 ms
                  </motion.p>
                </div>
              </div>

              {/* ANS states */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 space-y-1">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-400" />
                    <span className="text-emerald-400 font-bold text-sm">HRV Alto → Parasimpático</span>
                  </div>
                  <p className="text-white/60 text-xs">Buena recuperación · Listo para entrenar · Bajo estrés</p>
                </div>
                <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/20 space-y-1">
                  <div className="flex items-center gap-2">
                    <TrendingDown size={16} className="text-red-400" />
                    <span className="text-red-400 font-bold text-sm">HRV Bajo → Simpático</span>
                  </div>
                  <p className="text-white/60 text-xs">Estrés · Fatiga · Sobreentrenamiento · Enfermedad</p>
                </div>
                <p className="text-white/40 text-xs text-center">
                  Medición ideal: 5 min en reposo o 60 seg al despertar
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Two ECG traces comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Atleta entrenado — HRV alto", path: ELITE_PATH, color: "#4ade80", bpm: "~68 bpm", rmssd: "RMSSD ≈ 78 ms", textColor: "text-emerald-400", borderColor: "border-emerald-500/20" },
          { label: "Estado de estrés — HRV bajo", path: STRESSED_PATH, color: "#f87171", bpm: "~109 bpm", rmssd: "RMSSD ≈ 18 ms", textColor: "text-red-400", borderColor: "border-red-500/20" },
        ].map((trace, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 + idx * 0.15 }}
          >
            <Card className={`border ${trace.borderColor}`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium">{trace.label}</p>
                  <Badge variant="outline" className="text-xs">{trace.bpm}</Badge>
                </div>
                <div className="bg-muted/30 rounded-xl overflow-hidden px-2">
                  <svg viewBox="0 0 440 75" className="w-full h-16">
                    <motion.path
                      d={trace.path}
                      fill="none"
                      stroke={trace.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: "easeInOut", delay: 0.6 + idx * 0.2 }}
                    />
                  </svg>
                </div>
                <p className={`text-xs font-bold ${trace.textColor}`}>{trace.rmssd}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* HRV metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {HRV_METRICS.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 + i * 0.12 }}
            whileHover={{ y: -3 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${m.bg} ${m.color}`}>
                  {m.id}
                </div>
                <p className="text-sm font-semibold">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
                <div className="space-y-1 pt-1 border-t">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Atleta élite:</span>
                    <span className={`font-bold ${m.color}`}>{m.elite}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Sedentario:</span>
                    <span className="font-medium text-muted-foreground">{m.sedentary}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Apps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-primary/20">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Smartphone className="text-primary" size={18} />
              <h3 className="font-bold">Apps para medir HRV</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {APPS.map((app, i) => (
                <motion.div
                  key={app.name}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 + i * 0.08 }}
                  whileHover={{ y: -2 }}
                  className="p-3 rounded-2xl bg-background border text-center space-y-1 cursor-default"
                >
                  <span className="text-2xl">{app.emoji}</span>
                  <p className="text-xs font-bold">{app.name}</p>
                  <p className="text-xs text-muted-foreground">{app.note}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

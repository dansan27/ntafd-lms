import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Wifi, Cloud, Users } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = [
  {
    id: "professional",
    label: "Profesional / Investigación",
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
    borderColor: "border-primary/20",
    apps: [
      { name: "Polar Flow", note: "Ecosistema completo: FC, HRV, sueño, carga", badge: "Polar H10" },
      { name: "Garmin Connect", note: "Body Battery, HRV Status, Training Readiness", badge: "Garmin" },
      { name: "WHOOP", note: "HRV nocturna continua, Recovery Score 0-100", badge: "Wearable" },
      { name: "TrainingPeaks", note: "TSS, CTL, ATL — carga de entrenamiento", badge: "Coach" },
    ],
  },
  {
    id: "clinical",
    label: "Clínico / Médico",
    icon: Wifi,
    color: "text-red-600",
    bg: "bg-red-500/10",
    borderColor: "border-red-400/20",
    apps: [
      { name: "AliveCor KardiaMobile", note: "ECG de 1 derivación aprobado por la FDA. Detección de FA.", badge: "FDA-cleared" },
      { name: "Apple Health ECG", note: "ECG en muñeca via Apple Watch S4+. Exporta PDF.", badge: "CE / FDA" },
      { name: "Samsung ECG", note: "Galaxy Watch 4+ con sensor óptico + eléctrico", badge: "Galaxy" },
    ],
  },
  {
    id: "diy",
    label: "DIY / Educación",
    icon: Smartphone,
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    borderColor: "border-amber-400/20",
    apps: [
      { name: "Arduino + AD8232", note: "Módulo ECG de bajo costo. 3 electrodos → Serial/Bluetooth", badge: "Hardware" },
      { name: "BITalino", note: "Plataforma modular para biosignals: ECG, EMG, EDA, EEG", badge: "Research" },
      { name: "OpenBCI", note: "Código abierto para ECG y señales cerebrales", badge: "Open Source" },
    ],
  },
  {
    id: "consumer",
    label: "Consumidor",
    icon: Cloud,
    color: "text-violet-600",
    bg: "bg-violet-500/10",
    borderColor: "border-violet-400/20",
    apps: [
      { name: "Apple Watch Series 9", note: "ECG app + notificaciones de FA en tiempo real", badge: "iOS" },
      { name: "Fitbit Sense 2", note: "AFC continua + EDA (respuesta galvánica de la piel)", badge: "Google" },
      { name: "Xiaomi Smart Band 8 Pro", note: "FC óptica continua + SpO2 a precio accesible", badge: "Budget" },
    ],
  },
];

// Connection flow nodes
const FLOW_NODES = [
  { id: "sensor", label: "Sensor", icon: "❤️", x: 30 },
  { id: "phone", label: "App", icon: "📱", x: 175 },
  { id: "cloud", label: "Cloud", icon: "☁️", x: 320 },
  { id: "coach", label: "Coach", icon: "👨‍💼", x: 465 },
];

// Phone/watch mockup colors per category
const MOCKUP_COLORS: Record<string, string> = {
  professional: "bg-primary/20 border-primary/30",
  clinical: "bg-red-500/15 border-red-400/30",
  diy: "bg-amber-500/15 border-amber-400/30",
  consumer: "bg-violet-500/15 border-violet-400/30",
};

export default function S3C2_Block7Apps() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Smartphone size={14} />
          Bloque 7 — Apps y Plataformas
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          El ecosistema de{" "}
          <span className="text-primary">monitoreo cardíaco</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Desde el sensor en tu pecho hasta el dashboard del entrenador — todo conectado.
        </p>
      </motion.div>

      {/* Animated connection flow */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 80 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground overflow-hidden">
          <CardContent className="p-6 md:p-8 space-y-4">
            <p className="text-white/50 text-xs uppercase tracking-widest text-center">Flujo de datos en tiempo real</p>
            <div className="relative h-28">
              <svg viewBox="0 0 540 80" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                {/* Connection lines */}
                {[0, 1, 2].map((i) => (
                  <motion.line
                    key={i}
                    x1={FLOW_NODES[i].x + 28}
                    y1="40"
                    x2={FLOW_NODES[i + 1].x - 10}
                    y2="40"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="2"
                    strokeDasharray="5 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.25, duration: 0.6 }}
                  />
                ))}

                {/* Animated data dots flowing */}
                {[0, 1, 2].map((lineIdx) => (
                  [0, 1].map((dotIdx) => (
                    <motion.circle
                      key={`dot-${lineIdx}-${dotIdx}`}
                      r="4"
                      fill="#3b82f6"
                      opacity={0.8}
                      animate={{
                        cx: [FLOW_NODES[lineIdx].x + 30, FLOW_NODES[lineIdx + 1].x - 12],
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        delay: 1.2 + lineIdx * 0.5 + dotIdx * 0.7,
                        ease: "easeInOut",
                      }}
                      style={{ cy: 40 }}
                    />
                  ))
                ))}

                {/* Nodes */}
                {FLOW_NODES.map((node, i) => (
                  <motion.g
                    key={node.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 200 }}
                  >
                    <circle cx={node.x} cy="40" r="22" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                    <text x={node.x} y="37" textAnchor="middle" fontSize="14">{node.icon}</text>
                    <text x={node.x} y="52" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8" fontWeight="600">
                      {node.label}
                    </text>
                  </motion.g>
                ))}

                {/* Protocol labels */}
                {["Bluetooth/ANT+", "API REST", "Dashboard"].map((label, i) => (
                  <motion.text
                    key={label}
                    x={FLOW_NODES[i].x + 75}
                    y="72"
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.3)"
                    fontSize="7"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 + i * 0.15 }}
                  >
                    {label}
                  </motion.text>
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 4 category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CATEGORIES.map((cat, catIdx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 + catIdx * 0.14 }}
            whileHover={{ y: -3 }}
          >
            <Card className={`h-full hover:shadow-md transition-shadow border ${cat.borderColor}`}>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  {/* Phone/watch mockup */}
                  <div className={`w-10 h-14 rounded-lg border-2 ${MOCKUP_COLORS[cat.id]} flex items-center justify-center flex-shrink-0`}>
                    <div className="space-y-1 w-6">
                      {[1, 0.6, 0.8].map((opacity, i) => (
                        <div
                          key={i}
                          className={`h-1 rounded-full ${cat.bg}`}
                          style={{ opacity, width: `${[100, 70, 85][i]}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cat.bg} ${cat.color} mb-1`}>
                      <cat.icon size={11} />
                      {cat.label}
                    </div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {cat.apps.map((app, i) => (
                    <motion.div
                      key={app.name}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + catIdx * 0.14 + i * 0.07 }}
                      className="flex items-start justify-between gap-2"
                    >
                      <div>
                        <p className="text-sm font-semibold">{app.name}</p>
                        <p className="text-xs text-muted-foreground">{app.note}</p>
                      </div>
                      <Badge variant="outline" className={`text-xs flex-shrink-0 ${cat.color} border-current/30`}>
                        {app.badge}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Feature comparison matrix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-bold text-center">Comparativa de características</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-muted-foreground">Característica</th>
                    <th className="text-center py-2 px-2 text-primary">Profesional</th>
                    <th className="text-center py-2 px-2 text-red-600">Clínico</th>
                    <th className="text-center py-2 px-2 text-amber-600">DIY</th>
                    <th className="text-center py-2 px-2 text-violet-600">Consumidor</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "ECG morfológico", vals: ["❌", "✅", "✅", "⚠️"] },
                    { feature: "HRV (RMSSD)", vals: ["✅", "⚠️", "⚠️", "✅"] },
                    { feature: "Tiempo real", vals: ["✅", "✅", "✅", "✅"] },
                    { feature: "API abierta", vals: ["✅", "⚠️", "✅", "❌"] },
                    { feature: "Precio aprox.", vals: ["$50–300", "$100–200", "$10–50", "$30–400"] },
                  ].map((row, i) => (
                    <motion.tr
                      key={row.feature}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 + i * 0.06 }}
                      className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-2 px-3 font-medium text-muted-foreground">{row.feature}</td>
                      {row.vals.map((v, vi) => (
                        <td key={vi} className="py-2 px-2 text-center">{v}</td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-center text-muted-foreground">✅ Sí · ⚠️ Limitado · ❌ No</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

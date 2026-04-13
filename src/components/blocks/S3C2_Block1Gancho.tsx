import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const ECG_PATH =
  "M 0,55 L 20,55 L 24,60 L 30,15 L 34,63 L 40,55 L 58,55 C 64,55 67,44 72,42 C 77,46 80,55 88,55 L 110,55 L 114,60 L 120,15 L 124,63 L 130,55 L 148,55 C 154,55 157,44 162,42 C 167,46 170,55 178,55 L 200,55";

const STATS = [
  { value: "100,000", unit: "latidos/día", label: "El corazón late sin parar" },
  { value: "0.1–2 mV", unit: "señal eléctrica", label: "Potencial generado por latido" },
  { value: "~1,500M", unit: "latidos en vida", label: "Latidos en una vida completa" },
];

const QUESTIONS = [
  { icon: HelpCircle, color: "text-primary", bg: "bg-primary/10", q: "¿Qué es el ECG?", a: "Registro gráfico de la actividad eléctrica del corazón latido a latido" },
  { icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10", q: "¿Por qué es importante en el deporte?", a: "Detecta anomalías cardíacas antes de que se manifiesten en el esfuerzo" },
  { icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-500/10", q: "¿Qué podemos detectar?", a: "Arritmias, hipertrofia, canalopatías, síndrome de Brugada y más" },
];

export default function S3C2_Block1Gancho() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Activity size={14} />
          Bloque 1 — El Gancho
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Tu corazón habla en{" "}
          <span className="text-primary">eléctrico</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-base">
          Cada latido genera una señal eléctrica única. El ECG es el idioma en el que tu corazón te cuenta su historia.
        </p>

      </motion.div>

      {/* Hero dark card — animated heart + ECG */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 80 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Pulsing heart */}
              <div className="flex justify-center">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full border border-red-400/30"
                      style={{ inset: `-${i * 14}px` }}
                      animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.35 }}
                    />
                  ))}
                  {/* Geometric heart — two overlapping squares rotated */}
                  <motion.div
                    className="relative w-20 h-20"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg viewBox="0 0 80 80" className="w-full h-full">
                      <motion.path
                        d="M40,70 C40,70 10,52 10,32 C10,20 20,14 30,14 C35,14 39,17 40,20 C41,17 45,14 50,14 C60,14 70,20 70,32 C70,52 40,70 40,70 Z"
                        fill="none"
                        stroke="#f87171"
                        strokeWidth="2.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                      <motion.path
                        d="M40,70 C40,70 10,52 10,32 C10,20 20,14 30,14 C35,14 39,17 40,20 C41,17 45,14 50,14 C60,14 70,20 70,32 C70,52 40,70 40,70 Z"
                        fill="rgba(248,113,113,0.15)"
                        animate={{ opacity: [0.15, 0.35, 0.15] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    </svg>
                  </motion.div>
                </div>
              </div>

              {/* Animated ECG trace */}
              <div className="space-y-3">
                <p className="text-white/50 text-xs uppercase tracking-widest">Señal ECG en tiempo real</p>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-400"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                  />
                  <span className="text-green-400 text-sm font-medium">68 bpm — Ritmo sinusal</span>
                </div>
                <div className="bg-black/30 rounded-2xl p-4 relative overflow-hidden">
                  {/* Grid */}
                  <svg viewBox="0 0 200 75" className="w-full h-20 absolute inset-0 opacity-10">
                    {Array.from({ length: 10 }, (_, i) => (
                      <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="75" stroke="#22c55e" strokeWidth="0.5" />
                    ))}
                    {Array.from({ length: 4 }, (_, i) => (
                      <line key={`h${i}`} x1="0" y1={i * 25} x2="200" y2={i * 25} stroke="#22c55e" strokeWidth="0.5" />
                    ))}
                  </svg>
                  <svg viewBox="0 0 200 75" className="w-full h-20 relative z-10">
                    <motion.path
                      d={ECG_PATH}
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                    />
                  </svg>
                </div>
                <p className="text-white/40 text-xs">
                  Cada pico QRS = 1 contracción ventricular = 1 latido
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 3 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.13 }}
            whileHover={{ y: -3 }}
          >
            <Card className="text-center hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-1">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-mono">{stat.unit}</p>
                <p className="text-sm font-medium">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 3 question cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {QUESTIONS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95 + i * 0.13 }}
            whileHover={{ y: -3 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3 text-center">
                <div className={`p-3 rounded-2xl ${item.bg} w-fit mx-auto`}>
                  <item.icon className={item.color} size={22} />
                </div>
                <h4 className="font-bold text-sm">{item.q}</h4>
                <p className="text-xs text-muted-foreground">{item.a}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Risk fact banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        <Card className="border-red-400/30 bg-red-500/5">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
              <h3 className="font-bold text-red-700 dark:text-red-400">Dato real: Muerte súbita cardíaca en atletas</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ocurre en{" "}
              <span className="font-bold text-foreground">1 de cada 50,000–80,000 atletas</span> por año. El
              tamizaje con ECG puede detectar el{" "}
              <span className="font-bold text-foreground">60–70% de las condiciones de riesgo</span> antes de
              que ocurra un evento fatal — incluyendo miocardiopatía hipertrófica, síndrome de QT largo y
              síndrome de Brugada.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Miocardiopatía hipertrófica", "Síndrome QT largo", "Brugada", "WPW"].map((c) => (
                <Badge key={c} variant="outline" className="text-xs border-red-300 text-red-600">
                  {c}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

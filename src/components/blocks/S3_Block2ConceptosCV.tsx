import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Wind, Zap, Activity, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const DELIVERY_CHAIN = [
  {
    icon: Wind,
    title: "Pulmones",
    subtitle: "Captación de O₂",
    desc: "El O₂ del aire difunde a los alvéolos y pasa a la sangre.",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    stat: "500 ml / resp.",
  },
  {
    icon: Heart,
    title: "Corazón",
    subtitle: "Transporte de O₂",
    desc: "Bombea la sangre oxigenada hacia los músculos activos.",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    stat: "5–25 L/min",
  },
  {
    icon: Zap,
    title: "Sangre",
    subtitle: "Portador de O₂",
    desc: "La hemoglobina transporta el oxígeno en los glóbulos rojos.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    stat: "Hb: 12–17 g/dL",
  },
  {
    icon: Activity,
    title: "Músculos",
    subtitle: "Consumo de O₂",
    desc: "Las mitocondrias convierten el O₂ en ATP (energía utilizable).",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    stat: "VO₂ = CO × a-vO₂",
  },
];

const KEY_FACTS = [
  { value: "3.5", unit: "ml/kg/min", desc: "1 MET (metabolismo basal)", color: "text-slate-500" },
  { value: "35-40", unit: "ml/kg/min", desc: "VO₂ Máx persona sedentaria", color: "text-blue-500" },
  { value: "60-75", unit: "ml/kg/min", desc: "VO₂ Máx atleta entrenado", color: "text-emerald-500" },
  { value: ">80", unit: "ml/kg/min", desc: "VO₂ Máx élite mundial", color: "text-primary" },
];

export default function S3_Block2ConceptosCV() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Heart size={14} />
          Bloque 2 — Conceptos Clave
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Capacidad <span className="text-primary">Cardiovascular</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          La capacidad del sistema cardiorrespiratorio para captar, transportar y utilizar oxígeno durante el ejercicio.
        </p>
      </motion.div>

      {/* Definition card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-6 md:p-8 space-y-4">
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-2">Definición Oficial</Badge>
            <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
              "El VO₂ Máx es el volumen máximo de oxígeno que el organismo puede captar,
              transportar y utilizar por unidad de tiempo durante un ejercicio máximo."
            </p>
            <div className="grid grid-cols-3 gap-4 pt-2">
              {["Captar (Pulmones)", "Transportar (Corazón + Sangre)", "Utilizar (Músculos)"].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-2 h-2 rounded-full bg-primary mx-auto mb-1" />
                  <p className="text-white/60 text-xs">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* O2 delivery chain */}
      <div className="space-y-4">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-semibold text-center"
        >
          La cadena de entrega de oxígeno
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {DELIVERY_CHAIN.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.12 }}
              className="flex md:flex-col items-center md:items-stretch gap-3"
            >
              <Card className={`h-full border-l-4 md:border-l-0 md:border-t-4 ${step.border} hover:shadow-md transition-shadow flex-1`}>
                <CardContent className="p-4 space-y-2">
                  <div className={`p-2 rounded-xl ${step.bg} w-fit`}>
                    <step.icon className={step.color} size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.subtitle}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  <Badge variant="outline" className={`text-xs ${step.color} border-current/30`}>
                    {step.stat}
                  </Badge>
                </CardContent>
              </Card>
              {i < DELIVERY_CHAIN.length - 1 && (
                <motion.div
                  className="flex-shrink-0 text-muted-foreground md:hidden"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={16} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
        {/* Arrow flow for desktop */}
        <div className="hidden md:flex justify-between px-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="text-muted-foreground"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            >
              <ArrowRight size={18} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* VO2 reference values */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-center">Valores de referencia del VO₂ Máx</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {KEY_FACTS.map((fact, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 + i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-1">
                  <p className={`text-2xl font-bold ${fact.color}`}>{fact.value}</p>
                  <p className="text-xs text-muted-foreground font-mono">{fact.unit}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{fact.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Importance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-primary/20">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-center">¿Por qué importa en el deporte y la clínica?</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { emoji: "🏋️", title: "Rendimiento Deportivo", desc: "Predice el desempeño en deportes de resistencia con alta precisión." },
                { emoji: "❤️", title: "Salud Cardiovascular", desc: "Bajo VO₂ Máx es factor de riesgo independiente de mortalidad cardiovascular." },
                { emoji: "📊", title: "Prescripción de Ejercicio", desc: "Permite calcular zonas de entrenamiento personalizadas y seguras." },
                { emoji: "🩺", title: "Evaluación Clínica", desc: "Usado en cardiología para valorar tolerancia al ejercicio y disfunción cardíaca." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, Wind } from "lucide-react";
import { motion } from "framer-motion";
import { ImageLightbox } from "@/components/ui/ImageLightbox";

const PROFILES = [
  { label: "Sedentario", vo2: 32, color: "bg-slate-400", textColor: "text-slate-600", emoji: "🛋️", desc: "Sin actividad regular" },
  { label: "Activo Recreativo", vo2: 48, color: "bg-blue-400", textColor: "text-blue-600", emoji: "🚶", desc: "Ejercicio 3x semana" },
  { label: "Atleta Amateur", vo2: 58, color: "bg-emerald-500", textColor: "text-emerald-600", emoji: "🏃", desc: "Entrenamiento sistemático" },
  { label: "Deportista de Alto Rendimiento", vo2: 75, color: "bg-orange-500", textColor: "text-orange-600", emoji: "🏅", desc: "Deporte competitivo" },
  { label: "Ciclista Élite (Tour de France)", vo2: 88, color: "bg-primary", textColor: "text-primary", emoji: "🚴", desc: "Élite mundial" },
];

export default function S3_Block1Gancho() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Zap size={14} />
          Bloque 1 — El Gancho
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          ¿Cuánto <span className="text-primary">oxígeno</span> puede usar tu cuerpo?
        </h1>

      </motion.div>

      {/* Hero stat */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 80 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left space-y-4">
                <p className="text-white/50 text-sm uppercase tracking-widest font-medium">VO₂ Máx — Record Mundial</p>
                <div className="flex items-end gap-2 justify-center md:justify-start">
                  <motion.span
                    className="text-7xl md:text-8xl font-bold text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    97.5
                  </motion.span>
                  <span className="text-white/50 text-lg pb-3">ml/kg/min</span>
                </div>
                <p className="text-white/60 text-sm">Oskar Svendsen — Ciclista noruego (2012)</p>
              </div>

              {/* Real athlete photo */}
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                <ImageLightbox
                  src="/images/vo2max-atleta.png"
                  alt="Atleta realizando prueba de VO₂ Máx"
                  caption="Prueba de VO₂ Máx en laboratorio — clic para ampliar"
                  className="max-w-xs ring-2 ring-primary/20 shadow-xl"
                />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* VO2 comparison bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-center">VO₂ Máx según nivel de actividad</h3>
        <div className="space-y-3">
          {PROFILES.map((profile, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.12 }}
              className="flex items-center gap-3"
            >
              <span className="text-xl w-8 text-center flex-shrink-0">{profile.emoji}</span>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{profile.label}</span>
                  <span className={`text-sm font-bold ${profile.textColor}`}>{profile.vo2} ml/kg/min</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${profile.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(profile.vo2 / 97) * 100}%` }}
                    transition={{ duration: 1.2, delay: 0.7 + i * 0.12, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{profile.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Key questions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: TrendingUp, color: "text-primary", bg: "bg-primary/10", q: "¿Qué lo determina?", a: "Genética (50%) + entrenamiento (50%)" },
          { icon: Wind, color: "text-emerald-500", bg: "bg-emerald-500/10", q: "¿Cómo se mide?", a: "Análisis de gases, tests de campo, wearables" },
          { icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10", q: "¿Se puede mejorar?", a: "Sí, hasta un 25% con entrenamiento aeróbico" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + i * 0.12 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className="h-full hover:shadow-md">
              <CardContent className="p-5 text-center space-y-3">
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

      {/* Bottom quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-primary/20">
          <CardContent className="p-6 text-center space-y-2">
            <Badge variant="outline" className="border-primary/30 text-primary mb-2">Reflexión inicial</Badge>
            <p className="text-base md:text-lg font-medium italic leading-relaxed">
              "El VO₂ Máx es el motor del atleta. No importa cuánto entrenes — sin oxígeno, no hay energía."
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

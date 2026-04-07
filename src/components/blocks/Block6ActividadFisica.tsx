import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Dumbbell, Heart, Gamepad2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import Dynamic3ClassifyAction from "../dynamics/Dynamic3ClassifyAction";

const FITNESS_COMPONENTS = [
  { name: "Composición corporal", tech: "Báscula bioimpedancia, DEXA", icon: "⚖️" },
  { name: "Resistencia cardio", tech: "Pulsómetro, VO2max", icon: "❤️" },
  { name: "Fuerza muscular", tech: "Dinamómetro, encoder", icon: "💪" },
  { name: "Resistencia muscular", tech: "Sensor de fuerza + timer", icon: "🔄" },
  { name: "Flexibilidad", tech: "Goniómetro digital", icon: "🤸" },
];

export default function Block6ActividadFisica() {
  // Poll dynamic status every 3 seconds
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery({ weekId: 1, classId: 1 }, {
    refetchInterval: 3000,
  });
  const isDynamic3Active = statuses?.find(s => s.dynamicId === 3)?.isActive ?? false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Activity size={14} />
          Bloque 6 — Actividad Física y Ejercicio
        </div>
        <h1 className="text-3xl md:text-5xl font-bold">
          Movimiento, <span className="text-primary">plan</span> y capacidad
        </h1>
      </motion.div>

      {/* Hide content when dynamic is active */}
      <AnimatePresence mode="wait">
        {!isDynamic3Active ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-10"
          >
            {/* Harari - visual question only */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <Card className="bg-sidebar text-sidebar-foreground">
                <CardContent className="p-8 md:p-10 text-center">
                  <p className="text-sm text-white/40 mb-3">Yuval Noah Harari — Sapiens</p>
                  <p className="text-xl md:text-2xl font-bold text-white leading-snug">
                    "¿En qué aspecto el ser humano es
                    <br />
                    <span className="text-primary">el mejor</span> en la naturaleza?"
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* 3 Definitions - visual cards */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  icon: Activity, title: "Actividad Física", color: "border-t-green-500",
                  key: "CUALQUIER movimiento",
                  example: "Caminar, subir escaleras",
                  emoji: "🚶"
                },
                {
                  icon: Dumbbell, title: "Ejercicio Físico", color: "border-t-blue-500",
                  key: "PLAN + ESTRUCTURA + OBJETIVO",
                  example: "Gimnasio 3x/semana",
                  emoji: "🏋️"
                },
                {
                  icon: Heart, title: "Capacidad Física", color: "border-t-primary",
                  key: "5 COMPONENTES MEDIBLES",
                  example: "Fuerza, resistencia, flexibilidad",
                  emoji: "📊"
                },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15 }}>
                  <Card className={`h-full border-t-4 ${item.color} text-center`}>
                    <CardContent className="p-5">
                      <p className="text-4xl mb-3">{item.emoji}</p>
                      <h4 className="font-bold text-sm mb-2">{item.title}</h4>
                      <Badge className="bg-primary/10 text-primary text-[10px] mb-2">{item.key}</Badge>
                      <p className="text-xs text-muted-foreground italic">{item.example}</p>
                      <p className="text-[10px] text-muted-foreground/50 mt-2">ACSM</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Fitness Components + Tech */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground text-center">
                5 Componentes + Tecnología
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {FITNESS_COMPONENTS.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                  >
                    <Card className="text-center h-full hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <p className="text-3xl mb-2">{c.icon}</p>
                        <p className="text-xs font-bold mb-1">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground">{c.tech}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* DYNAMIC 3 - Classify Action */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center">
          {isDynamic3Active ? (
            <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
              <Gamepad2 size={14} /> Reto Clasificación Activo
            </Badge>
          ) : (
            <Button variant="outline" disabled className="gap-2 opacity-60">
              <Lock size={14} />
              Reto Clasificación — El profesor lo activará
            </Button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {isDynamic3Active && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Dynamic3ClassifyAction />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

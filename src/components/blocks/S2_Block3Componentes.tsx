import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Flame,
  Dumbbell,
  Bone,
  Droplets,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Thermometer,
  Battery,
  HeartPulse,
  Move,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ComponentData {
  id: string;
  title: string;
  icon: typeof Flame;
  color: string;
  bgColor: string;
  barColor: string;
  barWidth: string;
  percentage: string;
  shortDesc: string;
  details: { icon: typeof Flame; text: string }[];
  subComponents?: {
    name: string;
    icon: typeof Flame;
    color: string;
    facts: string[];
  }[];
}

const COMPONENTES: ComponentData[] = [
  {
    id: "grasa",
    title: "Masa Grasa",
    icon: Flame,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    barColor: "bg-yellow-500",
    barWidth: "20%",
    percentage: "10-25%",
    shortDesc: "Tejido adiposo esencial y de almacenamiento",
    details: [
      { icon: Battery, text: "Reserva principal de energía del cuerpo — 1 kg de grasa = 7,700 kcal" },
      { icon: ShieldCheck, text: "Protege órganos vitales actuando como amortiguador" },
      { icon: Thermometer, text: "Regula la temperatura corporal como aislante térmico" },
    ],
  },
  {
    id: "musculo",
    title: "Masa Muscular",
    icon: Dumbbell,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    barColor: "bg-red-500",
    barWidth: "40%",
    percentage: "35-45%",
    shortDesc: "Motor del movimiento humano",
    details: [
      { icon: Move, text: "Genera fuerza y movimiento — base de todo rendimiento deportivo" },
      { icon: HeartPulse, text: "Tejido metabólicamente activo — a más músculo, mayor gasto calórico en reposo" },
      { icon: Dumbbell, text: "Se adapta al entrenamiento: hipertrofia, resistencia, potencia" },
    ],
  },
  {
    id: "hueso",
    title: "Masa Ósea",
    icon: Bone,
    color: "text-stone-500",
    bgColor: "bg-stone-500/10",
    barColor: "bg-stone-400",
    barWidth: "15%",
    percentage: "12-15%",
    shortDesc: "Estructura y soporte del cuerpo",
    details: [
      { icon: Bone, text: "Proporciona la estructura rígida que sostiene todo el cuerpo" },
      { icon: ShieldCheck, text: "El ejercicio de impacto aumenta la densidad ósea y previene osteoporosis" },
      { icon: Battery, text: "Reserva de minerales esenciales: calcio, fósforo, magnesio" },
    ],
  },
  {
    id: "agua",
    title: "Agua Corporal",
    icon: Droplets,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    barColor: "bg-blue-500",
    barWidth: "60%",
    percentage: "50-70%",
    shortDesc: "El componente más abundante del cuerpo",
    details: [
      { icon: Droplets, text: "Representa entre el 50-70% del peso corporal total" },
      { icon: HeartPulse, text: "Esencial para todos los procesos fisiológicos: digestión, circulación, excreción" },
      { icon: Thermometer, text: "Regula la temperatura mediante la sudoración durante el ejercicio" },
    ],
  },
];

export default function S2_Block3Componentes() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Layers size={14} />
          Bloque 3 — Componentes del Cuerpo Humano
        </div>
        <h1 className="text-3xl md:text-5xl font-bold">
          ¿De qué está <span className="text-primary">hecho</span> tu cuerpo?
        </h1>
      </motion.div>

      {/* Visual proportions bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-6 md:p-8 space-y-4">
            <h3 className="text-center text-white font-bold mb-2">
              Distribución Aproximada del Peso Corporal
            </h3>
            <div className="space-y-3">
              {COMPONENTES.map((comp, i) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  className="space-y-1"
                >
                  <div className="flex justify-between text-xs text-white/70">
                    <span className="flex items-center gap-1.5">
                      <comp.icon size={12} className={comp.color} />
                      {comp.title}
                    </span>
                    <span className="font-bold text-white">{comp.percentage}</span>
                  </div>
                  <div className="h-5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: comp.barWidth }}
                      transition={{ duration: 1, delay: 0.6 + i * 0.15 }}
                      className={`h-full ${comp.barColor} rounded-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-white/40 text-center mt-2">
              * Los porcentajes varían según sexo, edad, nivel de actividad física y estado de hidratación
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Expandable detail cards */}
      <div className="space-y-3">
        {COMPONENTES.map((comp, i) => (
          <motion.div
            key={comp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            <Card
              className={`transition-all hover:shadow-md ${
                expanded === comp.id ? "ring-2 ring-primary/30" : ""
              }`}
            >
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="w-full p-5 h-auto justify-between"
                  onClick={() => toggleExpand(comp.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${comp.bgColor}`}>
                      <comp.icon className={comp.color} size={22} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-base">{comp.title}</h4>
                      <p className="text-xs text-muted-foreground font-normal">
                        {comp.shortDesc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{comp.percentage}</Badge>
                    {expanded === comp.id ? (
                      <ChevronUp size={18} className="text-muted-foreground" />
                    ) : (
                      <ChevronDown size={18} className="text-muted-foreground" />
                    )}
                  </div>
                </Button>

                <AnimatePresence>
                  {expanded === comp.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-3 border-t pt-4">
                        <h5 className="text-sm font-semibold">Funciones principales:</h5>
                        {comp.details.map((detail, j) => (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.1 }}
                            className={`flex items-start gap-3 p-3 rounded-lg ${comp.bgColor}`}
                          >
                            <detail.icon className={`${comp.color} shrink-0 mt-0.5`} size={16} />
                            <p className="text-sm">{detail.text}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Two-model comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Card className="bg-gradient-to-r from-yellow-500/5 via-transparent to-blue-500/5 border-primary/20">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-center font-bold text-lg">Modelo de 2 Componentes</h3>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center space-y-1">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center">
                  <Flame className="text-yellow-500" size={32} />
                </div>
                <p className="text-sm font-bold">Masa Grasa</p>
                <p className="text-xs text-muted-foreground">Tejido adiposo</p>
              </div>
              <div className="text-2xl font-bold text-muted-foreground">+</div>
              <div className="text-center space-y-1">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
                  <Dumbbell className="text-blue-500" size={32} />
                </div>
                <p className="text-sm font-bold">Masa Libre de Grasa</p>
                <p className="text-xs text-muted-foreground">Músculo + Hueso + Agua</p>
              </div>
              <div className="text-2xl font-bold text-muted-foreground">=</div>
              <div className="text-center space-y-1">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                  <Layers className="text-primary" size={32} />
                </div>
                <p className="text-sm font-bold">Peso Total</p>
                <p className="text-xs text-muted-foreground">Composición corporal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

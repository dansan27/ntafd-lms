import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, HelpCircle, Cog, Activity } from "lucide-react";
import { motion } from "framer-motion";

const BODY_PARTS = [
  { label: "Agua", pct: "60-70%", color: "bg-blue-500", icon: Droplets },
  { label: "Proteínas", pct: "15-20%", color: "bg-red-500", icon: Activity },
  { label: "Grasa", pct: "10-25%", color: "bg-yellow-500", icon: Cog },
  { label: "Minerales y otros", pct: "5-7%", color: "bg-emerald-500", icon: Cog },
];

export default function S2_Block1Gancho() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <HelpCircle size={14} />
          Bloque 1 — El Gancho
        </div>
        <h1 className="text-3xl md:text-5xl font-bold">
          ¿Cuánto realmente <span className="text-primary">conoces tu cuerpo</span>?
        </h1>
      </motion.div>

      {/* Provocative question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-6 md:p-8 text-center space-y-4">
            <Droplets className="mx-auto text-blue-400" size={48} />
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              El 60-70% de tu cuerpo es agua
            </h3>
            <p className="text-white/70 text-sm md:text-base max-w-lg mx-auto">
              Un atleta de 70 kg lleva consigo entre 42 y 49 litros de agua.
              Pero el agua es solo uno de los componentes que determinan tu rendimiento deportivo.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Visual bar - body composition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-semibold text-center">Tu cuerpo: una máquina con componentes medibles</h3>
        <div className="relative h-14 rounded-full overflow-hidden flex">
          {BODY_PARTS.map((part, i) => {
            const widths = [65, 17, 13, 5];
            return (
              <motion.div
                key={part.label}
                initial={{ width: 0 }}
                animate={{ width: `${widths[i]}%` }}
                transition={{ duration: 1, delay: 0.7 + i * 0.2 }}
                className={`${part.color} flex items-center justify-center`}
              >
                <span className="text-[10px] md:text-xs font-bold text-white whitespace-nowrap px-1">
                  {part.label} {part.pct}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Machine analogy cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Cog,
            title: "Motor",
            desc: "Los músculos generan fuerza y movimiento, como el motor de una máquina.",
            color: "text-orange-500",
            delay: 0.9,
          },
          {
            icon: Droplets,
            title: "Sistema de Enfriamiento",
            desc: "El agua regula tu temperatura corporal, como el refrigerante de un motor.",
            color: "text-blue-500",
            delay: 1.0,
          },
          {
            icon: Activity,
            title: "Combustible",
            desc: "La grasa almacena energía de reserva, como el tanque de combustible.",
            color: "text-yellow-500",
            delay: 1.1,
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item.delay }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-5 text-center space-y-2">
                <item.icon className={`mx-auto ${item.color}`} size={32} />
                <h4 className="font-bold">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bottom insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
          <CardContent className="p-6 text-center space-y-2">
            <Badge variant="outline" className="mb-2">Reflexión</Badge>
            <p className="text-base md:text-lg font-medium italic">
              "No puedes mejorar lo que no puedes medir. Conocer la composición de tu cuerpo es el primer paso para optimizar tu rendimiento."
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

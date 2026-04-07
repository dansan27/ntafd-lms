import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Heart, Target, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const PILARES = [
  {
    icon: Zap,
    title: "Rendimiento",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    points: [
      "La proporción de músculo afecta directamente la fuerza y potencia",
      "Menor masa grasa puede mejorar velocidad y agilidad",
      "Una composición óptima mejora la resistencia aeróbica y anaeróbica",
    ],
    example: "Un velocista necesita alta masa muscular en piernas y baja grasa corporal para maximizar su relación potencia/peso.",
  },
  {
    icon: Heart,
    title: "Salud",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    points: [
      "Exceso de grasa corporal se asocia con enfermedades cardiovasculares",
      "La densidad ósea adecuada previene fracturas y osteoporosis",
      "El equilibrio hídrico es esencial para funciones fisiológicas",
    ],
    example: "Monitorear la grasa visceral ayuda a prevenir diabetes tipo 2 y síndrome metabólico.",
  },
  {
    icon: Target,
    title: "Optimización del Entrenamiento",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    points: [
      "Permite personalizar programas de nutrición y ejercicio",
      "Identifica áreas específicas de mejora para cada deportista",
      "Facilita el seguimiento objetivo del progreso a lo largo del tiempo",
    ],
    example: "Un nadador puede ajustar su dieta y entrenamiento según cambios en masa muscular y porcentaje de grasa.",
  },
];

export default function S2_Block2Conceptos() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <BookOpen size={14} />
          Bloque 2 — Conceptos Fundamentales
        </div>
        <h1 className="text-3xl md:text-5xl font-bold">
          ¿Qué es la <span className="text-primary">Composición Corporal</span>?
        </h1>
      </motion.div>

      {/* Definition Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-6 md:p-8 text-center space-y-4">
            <Badge className="bg-primary/20 text-primary border-0 text-sm px-4 py-1">
              Definición Clave
            </Badge>
            <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
              La composición corporal es la{" "}
              <span className="text-primary">proporción relativa</span> de{" "}
              <span className="text-yellow-400">masa grasa</span> y{" "}
              <span className="text-blue-400">masa libre de grasa</span> en el cuerpo humano.
            </p>
            <p className="text-white/60 text-sm max-w-xl mx-auto">
              A diferencia del peso total, la composición corporal nos dice{" "}
              <strong className="text-white/80">de qué está hecho</strong> el cuerpo:
              cuánto es músculo, cuánto es grasa, cuánto es hueso y cuánto es agua.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <h2 className="text-xl md:text-2xl font-bold">
          Los 3 Pilares de Importancia en el Deporte
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          ¿Por qué todo deportista debería conocer su composición corporal?
        </p>
      </motion.div>

      {/* Pillar Cards */}
      <div className="space-y-4">
        {PILARES.map((pilar, i) => (
          <motion.div
            key={pilar.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.2 }}
          >
            <Card className={`${pilar.borderColor} border-l-4 hover:shadow-lg transition-shadow`}>
              <CardContent className="p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${pilar.bgColor} shrink-0`}>
                    <pilar.icon className={pilar.color} size={28} />
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold">{pilar.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        Pilar {i + 1}
                      </Badge>
                    </div>
                    <ul className="space-y-1.5">
                      {pilar.points.map((point, j) => (
                        <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className={`${pilar.color} mt-1 shrink-0`}>•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                    <div className={`${pilar.bgColor} rounded-lg p-3`}>
                      <p className="text-xs font-medium">
                        <span className="font-bold">Ejemplo: </span>
                        {pilar.example}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bottom insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
          <CardContent className="p-6 text-center space-y-2">
            <p className="text-base md:text-lg font-medium italic">
              "El peso en la báscula no distingue entre músculo y grasa. Dos atletas pueden pesar lo mismo y tener composiciones corporales completamente diferentes."
            </p>
            <p className="text-xs text-muted-foreground">— Principio fundamental de la composición corporal</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

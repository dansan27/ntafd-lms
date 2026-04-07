import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DEFINITIONS = [
  { source: "Oxford", text: "Conocimiento científico aplicado de forma práctica." },
  { source: "Cambridge", text: "Uso práctico de descubrimientos científicos." },
  { source: "RAE", text: "Técnicas para el aprovechamiento del conocimiento." },
  { source: "Wikipedia", text: "Técnicas, métodos y procesos para producir bienes o servicios." },
];

export default function Block3Tecnologia() {
  const [activeDef, setActiveDef] = useState(0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Lightbulb size={14} />
          Bloque 3 — ¿Qué es Tecnología?
        </div>
        <h1 className="text-3xl md:text-5xl font-bold">Tecnología</h1>
        <p className="text-muted-foreground text-sm">
          <strong>τέχνη</strong> (arte, oficio) + <strong>λογία</strong> (estudio)
        </p>
      </motion.div>

      {/* Definitions - clickable tabs, minimal */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex justify-center gap-2 mb-4">
          {DEFINITIONS.map((d, i) => (
            <button
              key={i}
              onClick={() => setActiveDef(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeDef === i ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {d.source}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="text-center">
              <CardContent className="p-6 md:p-8">
                <p className="text-lg md:text-xl font-medium leading-relaxed">
                  "{DEFINITIONS[activeDef].text}"
                </p>
                <p className="text-xs text-muted-foreground mt-2">{DEFINITIONS[activeDef].source}</p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Brian Arthur - visual, key quote only */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-6 md:p-8 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary">Brian Arthur, 2009</Badge>
            <p className="text-lg md:text-xl font-bold leading-snug">
              Transforma <span className="text-primary">materia</span>, <span className="text-primary">energía</span> o <span className="text-primary">información</span>
              <br />para lograr un objetivo.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* 3 Principles - visual numbers, short labels */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { num: "01", title: "Combinación", icon: "🧩" },
          { num: "02", title: "Recursividad", icon: "🔄" },
          { num: "03", title: "Fenómenos naturales", icon: "⚡" },
        ].map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.15 }}>
            <Card className="text-center h-full border-t-4 border-t-primary hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <p className="text-3xl mb-2">{p.icon}</p>
                <p className="text-xs text-muted-foreground font-mono">{p.num}</p>
                <p className="font-bold text-sm mt-1">{p.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Cooking Analogy - visual diagram */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card className="bg-sidebar text-sidebar-foreground overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <ChefHat className="text-primary" size={24} />
              <h3 className="text-lg font-bold text-white">Analogía: Receta de Cocina</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { emoji: "🍳", label: "Hardware", sub: "Horno, ollas, utensilios" },
                { emoji: "📝", label: "Software", sub: "La receta, instrucciones" },
                { emoji: "🍽️", label: "Tecnología", sub: "Todo junto + objetivo" },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-5">
                  <p className="text-5xl mb-3">{item.emoji}</p>
                  <p className="font-bold text-white text-sm">{item.label}</p>
                  <p className="text-white/50 text-xs mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-5">
              <Badge variant="outline" className="text-white/60 border-white/20 text-xs">
                Si falta uno → no hay tecnología
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

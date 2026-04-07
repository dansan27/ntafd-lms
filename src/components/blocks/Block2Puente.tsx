import { Card, CardContent } from "@/components/ui/card";
import { Rocket, TrendingUp, BarChart3, Wifi } from "lucide-react";
import { motion } from "framer-motion";

export default function Block2Puente() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Rocket size={14} />
          Bloque 2 — El Puente
        </div>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          ¿Por qué debería <span className="text-primary">importarte</span>?
        </h1>
      </motion.div>

      {/* Big quote - visual only */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-8 md:p-12 text-center">
            <p className="text-xl md:text-3xl font-bold text-white leading-snug">
              "El deporte ya no se decide solo en la cancha.
              <br />
              <span className="text-primary">Se decide en los datos.</span>"
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* 3 visual icons - no descriptions */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: TrendingUp, label: "Datos en tiempo real", emoji: "📊" },
          { icon: BarChart3, label: "Análisis biomecánico", emoji: "🦿" },
          { icon: Wifi, label: "Wearables conectados", emoji: "⌚" },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.15 }}>
            <Card className="text-center hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-5">
                <p className="text-4xl mb-3">{item.emoji}</p>
                <p className="text-sm font-semibold">{item.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Survey - visual, clean */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-lg font-bold mb-5 text-center">Levanten la mano...</h3>
            <div className="space-y-4">
              {[
                { emoji: "⌚", text: "¿Quién usa smartwatch o banda deportiva?" },
                { emoji: "📱", text: "¿Quién ha usado una app para entrenar?" },
                { emoji: "🤔", text: "¿Quién sabe qué sensores tiene su celular?" },
              ].map((q, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-background rounded-lg">
                  <span className="text-3xl">{q.emoji}</span>
                  <p className="font-medium text-sm md:text-base">{q.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

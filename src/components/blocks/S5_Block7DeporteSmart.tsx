import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Lock, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import S5_Dynamic4EligeDispositivo from "../dynamics/S5_Dynamic4EligeDispositivo";

const SPORTS = [
  {
    sport: "Ciclismo Indoor",
    emoji: "🚴",
    color: "border-blue-500/30 bg-blue-500/5",
    badge: "bg-blue-500/20 text-blue-300",
    pros: [
      "Temperatura controlada → buena perfusión",
      "Menos vibración que outdoor → mejor señal",
      "Postura estable → reducción de artefactos",
    ],
    cons: [
      "Sudoración intensa puede afectar el contacto del sensor",
      "Manillar vibra levemente con la cadencia",
    ],
    recommendation: "Smartwatch en muñeca izquierda — funciona bien. Banda pectoral para intervalos de alta intensidad (>85% FC máx).",
    rec_color: "text-green-400",
  },
  {
    sport: "Ciclismo Outdoor",
    emoji: "🌄",
    color: "border-orange-500/30 bg-orange-500/5",
    badge: "bg-orange-500/20 text-orange-300",
    pros: [
      "GPS integrado → datos de potencia y ritmo",
      "Cómodo — no requiere banda pectoral",
    ],
    cons: [
      "Vibración del camino → artefactos frecuentes",
      "Cambios de temperatura (descensos) → vasoconstricción",
      "Sol directo interfiere con el sensor óptico",
    ],
    recommendation: "Complementar con banda pectoral Polar H10 en tramos de alta intensidad. El smartwatch para contexto general.",
    rec_color: "text-yellow-400",
  },
  {
    sport: "Levantamiento de Pesas",
    emoji: "🏋️",
    color: "border-red-500/30 bg-red-500/5",
    badge: "bg-red-500/20 text-red-300",
    pros: [
      "Series cortas — la FC baja rápido → útil para recuperación",
      "Monitoreo de FC en calentamiento",
    ],
    cons: [
      "Grip fuerte comprime la muñeca → señal bloqueada",
      "Valsalva maniobra → picos de presión distorsionan SpO₂",
      "El reloj puede dañarse con la barra o pesas",
    ],
    recommendation: "Usar banda pectoral. El smartwatch no es confiable durante series de fuerza máxima — moverlo al antebrazo si se usa.",
    rec_color: "text-red-400",
  },
];

export default function S5_Block7DeporteSmart() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 5, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic4Active = statuses?.find(s => s.dynamicId === 4)?.isActive ?? false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <TrendingUp size={14} /> Bloque 7 — Smartwatch en el Deporte
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
          ¿Cuándo confiar <span className="text-primary">en el reloj?</span>
        </h2>
        <p className="text-muted-foreground text-base max-w-lg mx-auto">
          El contexto deportivo determina si el smartwatch es suficiente o necesitas refuerzo con banda pectoral.
        </p>
      </motion.div>

      <div className="space-y-5">
        {SPORTS.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}>
            <Card className={`border ${s.color}`}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{s.emoji}</span>
                  <div>
                    <p className="font-black text-lg">{s.sport}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-green-400 uppercase tracking-wider">✓ Ventajas</p>
                    <ul className="space-y-1">
                      {s.pros.map((p, j) => (
                        <li key={j} className="text-xs text-muted-foreground flex gap-2">
                          <span className="text-green-400 shrink-0">+</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-red-400 uppercase tracking-wider">✗ Limitaciones</p>
                    <ul className="space-y-1">
                      {s.cons.map((c, j) => (
                        <li key={j} className="text-xs text-muted-foreground flex gap-2">
                          <span className="text-red-400 shrink-0">−</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl bg-muted/30 p-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Recomendación</p>
                  <p className={`text-xs font-medium ${s.rec_color}`}>{s.recommendation}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Dynamic 4 gate */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            {isDynamic4Active ? (
              <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
                <Gamepad2 size={14} /> Dinámica Activa
              </Badge>
            ) : (
              <Button variant="outline" disabled className="gap-2 opacity-60">
                <Lock size={14} /> El profesor activará esta dinámica
              </Button>
            )}
          </div>
        </div>
        <AnimatePresence>
          {isDynamic4Active && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
              <S5_Dynamic4EligeDispositivo />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}

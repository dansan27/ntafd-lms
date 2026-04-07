import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Gamepad2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import Dynamic1Chronological from "../dynamics/Dynamic1Chronological";

const ERAS = [
  { name: "Piedra", period: "2.5M - 3000 a.C.", emoji: "🪨", highlight: "Fuego, herramientas, agricultura", detail: "El dominio del fuego marcó el primer gran salto tecnológico de la humanidad.", color: "bg-amber-500" },
  { name: "Metales", period: "3000 - 500 a.C.", emoji: "⚔️", highlight: "Cobre, bronce, hierro", detail: "La metalurgia permitió crear herramientas más resistentes y armas más efectivas.", color: "bg-orange-500" },
  { name: "Edad Media", period: "500 - 1500", emoji: "🏰", highlight: "Arado, molino, brújula, imprenta", detail: "La imprenta de Gutenberg (1440) democratizó el acceso al conocimiento.", color: "bg-stone-500" },
  { name: "Renacimiento", period: "1450 - 1700", emoji: "🎨", highlight: "Ciencia + tecnología, método científico", detail: "La unión entre ciencia y tecnología aceleró exponencialmente la innovación.", color: "bg-violet-500" },
  { name: "Rev. Industrial", period: "1760 - 1840", emoji: "🏭", highlight: "Máquina de vapor, electricidad", detail: "La máquina de vapor transformó la producción, el transporte y la sociedad.", color: "bg-slate-500" },
  { name: "Era Moderna", period: "Siglo XX", emoji: "🚀", highlight: "Avión, TV, computadoras, internet", detail: "En un solo siglo, más avances que en los 10,000 años anteriores combinados.", color: "bg-blue-500" },
  { name: "Era Digital", period: "Siglo XXI", emoji: "💻", highlight: "Web, redes sociales, smartphones", detail: "La información se volvió instantánea, global y accesible para todos.", color: "bg-cyan-500" },
  { name: "Era IA", period: "Ahora", emoji: "🤖", highlight: "ChatGPT, IoT, blockchain", detail: "La inteligencia artificial está redefiniendo lo que es posible en cada campo.", color: "bg-purple-500" },
];

export default function Block4Evolucion() {
  const [activeEra, setActiveEra] = useState<number | null>(null);
  // Poll dynamic status every 3 seconds
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery({}, {
    refetchInterval: 3000,
  });
  const isDynamic1Active = statuses?.find(s => s.dynamicId === 1)?.isActive ?? false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Clock size={14} />
          Bloque 4 — Evolución Tecnológica
        </div>
        <h1 className="text-3xl md:text-5xl font-bold">
          De la piedra a la <span className="text-primary">IA</span>
        </h1>
      </motion.div>

      {/* Hide content when dynamic is active (professor activated) */}
      <AnimatePresence mode="wait">
        {!isDynamic1Active ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-10"
          >
            {/* 100m Race - visual bar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-sidebar text-sidebar-foreground">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-center text-white font-bold mb-4">La Carrera de 100 Metros</h3>
                  <div className="relative h-12 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "99.5%" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="absolute inset-y-0 left-0 bg-amber-500/40 rounded-l-full flex items-center justify-end pr-3"
                    >
                      <span className="text-xs font-bold text-white whitespace-nowrap">Era de Piedra → 99.5m</span>
                    </motion.div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "0.5%" }}
                      transition={{ duration: 0.5, delay: 2 }}
                      className="absolute inset-y-0 right-0 bg-primary rounded-r-full"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-white/40">Inicio</span>
                    <span className="text-primary font-bold">Todo lo demás: 0.5m</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Interactive Timeline Grid */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {ERAS.map((era, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  onClick={() => setActiveEra(activeEra === i ? null : i)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    activeEra === i
                      ? "bg-primary text-white shadow-lg scale-105 ring-2 ring-primary ring-offset-2"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <p className="text-2xl md:text-3xl mb-1">{era.emoji}</p>
                  <p className="text-[10px] font-medium leading-tight">{era.name}</p>
                </motion.button>
              ))}
            </div>

            {/* Detail card */}
            <AnimatePresence mode="wait">
              {activeEra !== null && (
                <motion.div
                  key={activeEra}
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-primary/30">
                    <CardContent className="p-5 flex items-center gap-4">
                      <span className="text-5xl">{ERAS[activeEra].emoji}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold">{ERAS[activeEra].name}</h4>
                          <Badge variant="outline" className="text-xs">{ERAS[activeEra].period}</Badge>
                        </div>
                        <p className="text-sm font-medium">{ERAS[activeEra].highlight}</p>
                        <p className="text-sm text-muted-foreground mt-1">{ERAS[activeEra].detail}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom insight - Arthur quote */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
                <CardContent className="p-6 text-center space-y-2">
                  <p className="text-base md:text-lg font-medium italic">
                    "Más que cualquier otra cosa, la tecnología crea nuestro mundo. Crea nuestra riqueza, nuestra economía, nuestra forma de ser."
                  </p>
                  <p className="text-xs text-muted-foreground">— W. Brian Arthur</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Dynamic 1 Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center">
            {isDynamic1Active ? (
              <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
                <Gamepad2 size={14} /> Reto Activo
              </Badge>
            ) : (
              <Button
                variant="outline"
                disabled
                className="gap-2 opacity-60"
              >
                <Lock size={14} />
                Reto bloqueado — El profesor lo activará
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isDynamic1Active && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Dynamic1Chronological />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

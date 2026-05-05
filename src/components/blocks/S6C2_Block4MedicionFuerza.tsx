import { AnimatePresence, motion } from "framer-motion";
import { Activity, Gamepad2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import DashboardBlock from "@/components/layout/DashboardBlock";
import S6C2_Dynamic1ClasificaFibra from "../dynamics/S6C2_Dynamic1ClasificaFibra";

export default function S6C2_Block4MedicionFuerza() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 6, classId: 2 },
    { refetchInterval: 3000 }
  );
  const isDynamic1Active = statuses?.find(s => s.dynamicId === 1)?.isActive ?? false;

  return (
    <div>
      <DashboardBlock
        title="¿Cómo medimos la fuerza muscular?"
        subtitle="Cuatro grandes aproximaciones — de la clínica al laboratorio deportivo de alto rendimiento."
        accentColor="from-red-500 to-purple-500"
        headerIcon={<Activity size={22} className="text-red-300" />}
        sections={[
          {
            id: "metodos",
            title: "Los 4 métodos principales",
            icon: <Activity size={14} className="text-red-400" />,
            content: (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: "🦾",
                    title: "Dinamometría",
                    color: "border-red-500/30 bg-red-500/8",
                    accent: "text-red-300",
                    desc: "Dinamómetros de mano, isométricos e isocinéticos (Jamar, Biodex). Medición directa de fuerza o torque.",
                    ejemplos: ["Fuerza de prensión (Jamar)", "Torque isocinético (Biodex)", "Test de 1RM isotónico"],
                  },
                  {
                    icon: "🟦",
                    title: "Plataformas de fuerza",
                    color: "border-blue-500/30 bg-blue-500/8",
                    accent: "text-blue-300",
                    desc: "Análisis biomecánico y deportivo. Miden las fuerzas de reacción del suelo en 3 ejes (Kistler).",
                    ejemplos: ["CMJ y SJ (salto vertical)", "Análisis de carrera", "Control postural (CoP)"],
                  },
                  {
                    icon: "🤚",
                    title: "Medición manual (MMT)",
                    color: "border-green-500/30 bg-green-500/8",
                    accent: "text-green-300",
                    desc: "Evaluación clínica con escalas estandarizadas. Rápida y sin equipamiento — usada en fisioterapia.",
                    ejemplos: ["Escala Medical Research Council (0–5)", "Test muscular de Kendall", "Escala Daniels"],
                  },
                  {
                    icon: "🏋️",
                    title: "Evaluación funcional",
                    color: "border-amber-500/30 bg-amber-500/8",
                    accent: "text-amber-300",
                    desc: "Pruebas prácticas que replican patrones de movimiento real. Fácil de implementar en campo.",
                    ejemplos: ["Sentadilla 1RM", "Salto de longitud sin impulso", "Push-up test / Yo-Yo"],
                  },
                ].map((m) => (
                  <div key={m.title} className={`rounded-xl border p-4 ${m.color}`}>
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl shrink-0">{m.icon}</span>
                      <div>
                        <p className={`text-sm font-bold ${m.accent}`}>{m.title}</p>
                        <p className="text-xs text-white/50 mt-0.5 leading-snug">{m.desc}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {m.ejemplos.map((e) => (
                        <p key={e} className="text-xs text-white/40 flex items-start gap-1.5">
                          <span className="shrink-0 mt-0.5">→</span>{e}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ),
            callout: {
              type: "tip",
              text: "Elegir el método correcto depende del objetivo: screening clínico (MMT), investigación biomecánica (plataforma), rendimiento deportivo (dinamometría isocinética) o evaluación en campo (funcional).",
            },
          },
        ]}
      />

      {/* Dynamic gate */}
      <div className="bg-[#030712] px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                {isDynamic1Active ? (
                  <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
                    <Gamepad2 size={14} /> Dinámica 1 Activa
                  </Badge>
                ) : (
                  <Button variant="outline" disabled className="gap-2 opacity-50 border-white/20 text-white/40">
                    <Lock size={14} /> El profesor activará esta dinámica
                  </Button>
                )}
              </div>
            </div>
            <AnimatePresence>
              {isDynamic1Active && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
                  <S6C2_Dynamic1ClasificaFibra weekId={6} classId={2} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

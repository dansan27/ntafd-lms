import { AnimatePresence, motion } from "framer-motion";
import { Layers, Gamepad2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import DashboardBlock from "@/components/layout/DashboardBlock";
import S6C2_Dynamic2QuizFibras from "../dynamics/S6C2_Dynamic2QuizFibras";

export default function S6C2_Block5QuizFibras() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 6, classId: 2 },
    { refetchInterval: 3000 }
  );
  const isDynamic2Active = statuses?.find(s => s.dynamicId === 2)?.isActive ?? false;

  return (
    <div>
      <DashboardBlock
        title="Fibras Musculares y Rendimiento Deportivo"
        subtitle="¿Puedes entrenar para cambiar tu tipo de fibra? ¿Cuánto depende de la genética?"
        accentColor="from-indigo-500 to-blue-500"
        headerIcon={<Layers size={22} className="text-indigo-300" />}
        sections={[
          {
            id: "genetica-entrenamiento",
            title: "Genética vs. Entrenamiento",
            icon: <Layers size={14} className="text-indigo-400" />,
            callout: {
              type: "info",
              text: "La proporción de fibras Type I y Type II está determinada genéticamente en un ~80%. Sin embargo, las fibras Type IIa son las más plásticas — pueden adaptarse hacia un perfil más lento o más rápido según el estímulo de entrenamiento.",
            },
            table: {
              headers: ["Condición", "Fibra Type I", "Fibra Type IIa", "Fibra Type IIx"],
              rows: [
                ["Entrenamiento de fuerza", "Sin cambio", "↑ Hipertrofia", "↑ Conversión → IIa"],
                ["Entrenamiento aeróbico", "↑ Capilarización", "↑ Mitocondrias", "↓ Activación"],
                ["Inactividad", "↓ Atrofia", "↓ Atrofia", "Predominio relativo"],
                ["HIIT (alta intensidad)", "Estable", "Optimización mixta", "Reclutamiento máximo"],
                ["Electroestimulación (EMS)", "Estimulada", "Estimulada", "Estimulación directa"],
              ],
              highlight: 2,
            },
          },
          {
            id: "z-score",
            title: "Distribución poblacional de fibras (Z-score)",
            icon: <Layers size={14} className="text-indigo-400" />,
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      z: "Z = -2",
                      label: "Más fibras lentas (Type I)",
                      pct: "97.7% de la población tiene más fibras rápidas",
                      color: "border-blue-500/30 bg-blue-500/8",
                      accent: "text-blue-300",
                      icon: "🏃",
                    },
                    {
                      z: "Z = 0",
                      label: "Proporción equilibrada",
                      pct: "Mayoría de personas — ~50% de cada tipo",
                      color: "border-purple-500/30 bg-purple-500/8",
                      accent: "text-purple-300",
                      icon: "⚖️",
                    },
                    {
                      z: "Z = +2",
                      label: "Más fibras rápidas (Type IIx)",
                      pct: "84.1% de la población tiene más fibras lentas",
                      color: "border-red-500/30 bg-red-500/8",
                      accent: "text-red-300",
                      icon: "⚡",
                    },
                  ].map((item) => (
                    <div key={item.z} className={`rounded-xl border p-4 ${item.color}`}>
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <p className={`text-lg font-black ${item.accent}`}>{item.z}</p>
                      <p className="text-sm font-semibold text-white mt-1">{item.label}</p>
                      <p className="text-xs text-white/40 mt-1.5 leading-snug">{item.pct}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/8 px-4 py-3">
                  <p className="text-sm text-indigo-300">
                    💡 Los atletas de élite en deportes de resistencia pura (maratón) suelen tener Z-scores de -1.5 a -2. Los sprinters de élite pueden llegar a +1.5 a +2. Esto no es solo entrenamiento — es selección genética natural.
                  </p>
                </div>
              </div>
            ),
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
                {isDynamic2Active ? (
                  <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
                    <Gamepad2 size={14} /> Dinámica 2 Activa
                  </Badge>
                ) : (
                  <Button variant="outline" disabled className="gap-2 opacity-50 border-white/20 text-white/40">
                    <Lock size={14} /> El profesor activará esta dinámica
                  </Button>
                )}
              </div>
            </div>
            <AnimatePresence>
              {isDynamic2Active && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
                  <S6C2_Dynamic2QuizFibras weekId={6} classId={2} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

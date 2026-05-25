import { AnimatePresence, motion } from "framer-motion";
import { Activity, Gamepad2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import DashboardBlock from "@/components/layout/DashboardBlock";
import S9C2_Dynamic1QuizMCG from "../dynamics/S9C2_Dynamic1QuizMCG";

export default function S9C2_Block2Diabetes() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 9, classId: 2 },
    { refetchInterval: 3000 }
  );
  const isDynamic1Active = statuses?.find(s => s.dynamicId === 1)?.isActive ?? false;

  return (
    <div>
      <DashboardBlock
        title="Diabetes y Glucemia"
        subtitle="La diabetes afecta a 537 millones de adultos. El ejercicio es una de las herramientas terapéuticas más poderosas."
        accentColor="from-teal-500 to-cyan-500"
        headerIcon={<Activity size={22} className="text-teal-300" />}
        sections={[
          {
            id: "tipos",
            title: "Tipos de Diabetes",
            icon: <Activity size={14} className="text-teal-400" />,
            metrics: [
              {
                label: "Tipo 1 (DM1)",
                value: "Autoinmune",
                icon: <Activity size={16} />,
                color: "from-red-500/20 to-rose-500/10 border-red-500/30",
                textColor: "text-red-400",
                description: "Destrucción de células β pancreáticas. Dependiente de insulina. Inicio en infancia/juventud.",
              },
              {
                label: "Tipo 2 (DM2)",
                value: "Resistencia insulina",
                icon: <Activity size={16} />,
                color: "from-teal-500/20 to-cyan-500/10 border-teal-500/30",
                textColor: "text-teal-400",
                description: "Resistencia periférica a la insulina. Fuertemente asociada a obesidad y sedentarismo. 90% de los casos.",
              },
              {
                label: "Gestacional",
                value: "Durante embarazo",
                icon: <Activity size={16} />,
                color: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
                textColor: "text-purple-400",
                description: "Intolerancia a la glucosa que aparece durante el embarazo. Riesgo de DM2 futuro para madre e hijo.",
              },
            ],
          },
          {
            id: "ejercicio-glucosa",
            title: "Ejercicio y control glucémico",
            icon: <Activity size={14} className="text-teal-400" />,
            table: {
              headers: ["Tipo de ejercicio", "Efecto sobre glucosa", "Mecanismo"],
              rows: [
                ["Aeróbico moderado (caminar, ciclismo)", "↓ Glucemia 20–30 mg/dL", "Captación muscular de glucosa GLUT-4 independiente de insulina"],
                ["Resistencia (pesas)", "↓ Glucemia post-ejercicio", "Aumento de masa muscular → mayor depósito glucógeno"],
                ["HIIT", "Variable: ↓ o ↑ transitorio", "Activación simpática puede elevar glucosa transientemente"],
                ["Ejercicio prolongado (>60 min)", "Riesgo hipoglucemia tardía", "Sensibilidad insulínica elevada 12–48 h post-ejercicio"],
              ],
              highlight: 0,
            },
            callout: {
              type: "clinical",
              text: "El ejercicio aeróbico de intensidad moderada mejora la sensibilidad a la insulina hasta 48 horas después de una sola sesión. Es la intervención farmacológica no farmacológica más potente en DM2.",
            },
          },
        ]}
      />

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
                  <S9C2_Dynamic1QuizMCG weekId={9} classId={2} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

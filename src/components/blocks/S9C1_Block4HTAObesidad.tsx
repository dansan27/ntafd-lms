import { AnimatePresence, motion } from "framer-motion";
import { Activity, Gamepad2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import DashboardBlock from "@/components/layout/DashboardBlock";
import S9C1_Dynamic2EligeDispositivo from "../dynamics/S9C1_Dynamic2EligeDispositivo";

export default function S9C1_Block4HTAObesidad() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 9, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic2Active = statuses?.find(s => s.dynamicId === 2)?.isActive ?? false;

  return (
    <div>
      <DashboardBlock
        title="Hipertensión Arterial y Obesidad"
        subtitle="Las dos ECNT más prevalentes y directamente influenciadas por el ejercicio físico y la tecnología wearable."
        accentColor="from-teal-500 to-cyan-500"
        headerIcon={<Activity size={22} className="text-teal-300" />}
        sections={[
          {
            id: "hta",
            title: "Hipertensión Arterial (HTA)",
            icon: <Activity size={14} className="text-teal-400" />,
            metrics: [
              {
                label: "Definición",
                value: "PA ≥ 130/80 mmHg",
                icon: <Activity size={16} />,
                color: "from-red-500/20 to-rose-500/10 border-red-500/30",
                textColor: "text-red-400",
                description: "Elevación persistente de la presión sanguínea (AHA 2017). Afecta 1 de cada 3 adultos.",
              },
              {
                label: "Reducción con ejercicio",
                value: "5–8 mmHg PA sistólica",
                icon: <Activity size={16} />,
                color: "from-teal-500/20 to-cyan-500/10 border-teal-500/30",
                textColor: "text-teal-400",
                description: "Ejercicio aeróbico moderado ≥150 min/semana reduce la PA sistólica significativamente.",
              },
              {
                label: "Prevalencia global",
                value: "1.28 billones",
                icon: <Activity size={16} />,
                color: "from-orange-500/20 to-amber-500/10 border-orange-500/30",
                textColor: "text-orange-400",
                description: "OMS 2021: la HTA es la causa prevenible más importante de muerte cardiovascular.",
              },
            ],
          },
          {
            id: "obesidad",
            title: "Obesidad",
            icon: <Activity size={14} className="text-teal-400" />,
            table: {
              headers: ["Clasificación IMC", "Grado", "Riesgo cardiovascular"],
              rows: [
                ["18.5 – 24.9 kg/m²", "Normopeso", "Bajo"],
                ["25 – 29.9 kg/m²", "Sobrepeso", "Moderado"],
                ["30 – 34.9 kg/m²", "Obesidad Grado I", "Alto"],
                ["35 – 39.9 kg/m²", "Obesidad Grado II", "Muy alto"],
                ["≥ 40 kg/m²", "Obesidad Grado III (mórbida)", "Extremo"],
              ],
              highlight: 1,
            },
            callout: {
              type: "tip",
              text: "Causas comunes de HTA y obesidad: sedentarismo, dieta hipercalórica y alta en sodio. El ejercicio regular mejora el perfil lipídico, reduce el peso y baja la presión arterial — efecto dual.",
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
                  <S9C1_Dynamic2EligeDispositivo weekId={9} classId={1} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

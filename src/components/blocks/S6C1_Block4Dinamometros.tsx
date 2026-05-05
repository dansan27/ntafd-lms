import { AnimatePresence, motion } from "framer-motion";
import { Activity, Zap, BarChart2, Gamepad2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import DashboardBlock from "@/components/layout/DashboardBlock";
import S6C1_Dynamic2ClasificaDinamometro from "../dynamics/S6C1_Dynamic2ClasificaDinamometro";

export default function S6C1_Block4Dinamometros() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 6, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic2Active = statuses?.find(s => s.dynamicId === 2)?.isActive ?? false;

  return (
    <div>
      <DashboardBlock
        title="Dinamómetros"
        subtitle="Instrumentos portátiles para medir fuerza muscular máxima en contexto clínico y deportivo."
        accentColor="from-red-500 to-orange-500"
        headerIcon={<Activity size={22} className="text-red-300" />}
        sections={[
          {
            id: "tipos-dinamometro",
            title: "Los 3 tipos fundamentales",
            icon: <Zap size={14} className="text-red-400" />,
            metrics: [
              {
                label: "Isométrico",
                value: "Jamar",
                unit: "modelo ref.",
                icon: <Activity size={16} />,
                color: "from-red-500/20 to-orange-500/10 border-red-500/30",
                textColor: "text-red-400",
                description: "Mide fuerza sin movimiento articular. Gold standard para fuerza de prensión.",
              },
              {
                label: "Isotónico",
                value: "1 RM",
                unit: "medición",
                icon: <Zap size={16} />,
                color: "from-orange-500/20 to-red-500/10 border-orange-500/30",
                textColor: "text-orange-400",
                description: "Carga constante, velocidad variable. Test de 1 repetición máxima.",
              },
              {
                label: "Isocinético",
                value: "Biodex",
                unit: "sistema ref.",
                icon: <BarChart2 size={16} />,
                color: "from-amber-500/20 to-red-500/10 border-amber-500/30",
                textColor: "text-amber-400",
                description: "Velocidad constante, fuerza variable. Perfil de torque completo.",
              },
            ],
          },
          {
            id: "isometrico",
            title: "Dinamómetro isométrico — Jamar",
            icon: <Activity size={14} className="text-red-400" />,
            callout: {
              type: "clinical",
              text: "El dinamómetro de prensión Jamar es el gold standard clínico para evaluar fuerza de agarre. Valores normativos por edad y sexo según la ASHT. Un valor <26 kg en hombres adultos se asocia a sarcopenia.",
            },
            content: (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {[
                  { label: "Principio", value: "Célula de carga isométrica — sin movimiento articular" },
                  { label: "Rango", value: "0 – 90 kg (típico Jamar hidráulico)" },
                  { label: "Posición estándar", value: "Codo 90°, muñeca neutra, sentado" },
                  { label: "Usos", value: "Sarcopenia, rehab. lesión, screening deportivo" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/10 bg-white/4 p-3">
                    <p className="text-[11px] text-white/40 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm text-white/80 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            ),
          },
          {
            id: "isocinetico",
            title: "Dinamómetro isocinético — Biodex System",
            icon: <BarChart2 size={14} className="text-amber-400" />,
            table: {
              headers: ["Parámetro", "Descripción", "Aplicación"],
              rows: [
                ["Pico de torque", "Máxima fuerza rotacional (N·m)", "Comparar extremidades"],
                ["Ratio AG/ANT", "Isquiotibiales / cuádriceps (%)", "Riesgo lesión LCA"],
                ["Trabajo total", "Área bajo la curva (J)", "Capacidad de resistencia muscular"],
                ["Potencia media", "Trabajo / tiempo (W)", "Perfil de fatiga muscular"],
                ["Velocidad angular", "30–300 °/s (programable)", "Especificidad de deporte"],
              ],
              highlight: 1,
            },
            callout: {
              type: "warning",
              text: "Un ratio isquiotibiales/cuádriceps inferior al 60% en futbolistas se asocia a mayor riesgo de rotura del LCA. El Biodex permite detectar y monitorear este desequilibrio.",
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
                  <S6C1_Dynamic2ClasificaDinamometro weekId={6} classId={1} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

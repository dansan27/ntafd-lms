import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import DashboardBlock from "@/components/layout/DashboardBlock";
import ZoomableImage from "@/components/ui/ZoomableImage";
import S12C1_Dynamic3TecnologiaAgilidad from "../dynamics/S12C1_Dynamic3TecnologiaAgilidad";

export default function S12C1_Block6EvaluacionAgilidadII() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 12, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic3Active = statuses?.find(s => s.dynamicId === 3)?.isActive ?? false;

  return (
    <div>
      <DashboardBlock
        title="Evaluación de la Agilidad II — Indicadores Avanzados y Tecnologías"
        subtitle="Índices de fatiga, desaceleración y fuerza lateral, más las tecnologías para medirlos en campo y laboratorio."
        accentColor="from-orange-500 to-amber-500"
        headerIcon={<Eye size={22} className="text-orange-300" />}
        sections={[
          {
            id: "indicadores-avanzados",
            title: "Indicadores Avanzados de Agilidad",
            table: {
              headers: ["Indicador", "Fórmula", "Interpretación"],
              rows: [
                [
                  "Índice de Fatiga en Agilidad (AFI)",
                  "AFI = (t_último − t_primero) / t_primero × 100 %",
                  "Bajo = mantiene rendimiento de agilidad bajo fatiga",
                ],
                [
                  "Índice de Desaceleración",
                  "ID = v_máx / t_frenado",
                  "Alto = mejor control para frenar rápidamente antes de girar",
                ],
                [
                  "Fuerza Lateral",
                  "F_lat = m × a_lat",
                  "Alta = buen control en movimientos laterales y diagonales",
                ],
              ],
            },
          },
          {
            id: "tecnologias-visual",
            title: "Tecnologías en el Lab y Campo",
            content: (
              <div className="flex justify-center mt-4">
                <div className="max-w-xl w-full">
                  <ZoomableImage
                    src="/images/semana_12/tecnologias_agilidad.png"
                    alt="Tecnologías de Evaluación de Velocidad y Agilidad"
                    className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                  />
                </div>
              </div>
            ),
          },
          {
            id: "tecnologias",
            title: "Tecnologías de Evaluación",
            metrics: [
              {
                label: "Cámaras 3D (Qualisys/Vicon)",
                value: "Cinemática 3D",
                unit: "laboratorio",
                color: "from-orange-500/20 to-orange-600/10",
                textColor: "text-orange-300",
                description: "Análisis cinemático completo en atletismo y saltos · Alta precisión · Requiere marcadores reflectivos y laboratorio controlado",
              },
              {
                label: "Plataformas de Fuerza",
                value: "GRF + COD",
                unit: "N, N/s",
                color: "from-amber-500/20 to-amber-600/10",
                textColor: "text-amber-300",
                description: "Evalúan fuerzas de reacción durante cambios de dirección · Calculan fuerza lateral y RFD en giros bruscos",
              },
              {
                label: "IMUs y Acelerómetros",
                value: "Tiempo real",
                unit: "campo / portable",
                color: "from-yellow-500/20 to-yellow-600/10",
                textColor: "text-yellow-300",
                description: "Medición de movimientos y análisis en tiempo real · Bajo costo y portables · Ideales para monitoreo en campo",
              },
              {
                label: "Fotocélulas y GPS",
                value: "Sprint + aceleración",
                unit: "m/s, m/s²",
                color: "from-red-500/20 to-red-600/10",
                textColor: "text-red-300",
                description: "Evaluación de velocidad y aceleración en sprints de campo · GPS: velocidad metabólica y distancia recorrida en partido",
              },
            ],
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
                {isDynamic3Active ? (
                  <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
                    <Gamepad2 size={14} /> Dinámica 3 Activa
                  </Badge>
                ) : (
                  <Button variant="outline" disabled className="gap-2 opacity-50 border-white/20 text-white/40">
                    <Lock size={14} /> El profesor activará esta dinámica
                  </Button>
                )}
              </div>
            </div>
            <AnimatePresence>
              {isDynamic3Active && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <S12C1_Dynamic3TecnologiaAgilidad weekId={12} classId={1} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

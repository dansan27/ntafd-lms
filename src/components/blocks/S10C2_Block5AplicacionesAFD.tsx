import { AnimatePresence, motion } from "framer-motion";
import { TrendingUp, Gamepad2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import DashboardBlock from "@/components/layout/DashboardBlock";
import S10C2_Dynamic2QuizClustering from "../dynamics/S10C2_Dynamic2QuizClustering";

export default function S10C2_Block5AplicacionesAFD() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 10, classId: 2 },
    { refetchInterval: 3000 }
  );
  const isDynamic2Active = statuses?.find(s => s.dynamicId === 2)?.isActive ?? false;

  return (
    <div>
      <DashboardBlock
        title="Aplicaciones del Clustering en AFD"
        subtitle="Del laboratorio al vestuario: casos reales de Machine Learning en deporte."
        accentColor="from-violet-500 to-purple-500"
        headerIcon={<TrendingUp size={22} className="text-violet-300" />}
        sections={[
          {
            id: "casos-uso",
            title: "Casos de Uso",
            metrics: [
              {
                label: "Perfil de atleta",
                value: "K-Means",
                unit: "VO₂/Potencia/FC",
                color: "from-violet-500/20 to-violet-600/10",
                textColor: "text-violet-300",
                description: "Asigna rol táctico automáticamente según datos fisiológicos",
              },
              {
                label: "Riesgo de lesión",
                value: "DBSCAN",
                unit: "outlier",
                color: "from-purple-500/20 to-purple-600/10",
                textColor: "text-purple-300",
                description: "Detecta atletas con carga anómala que podrían lesionarse",
              },
              {
                label: "Zonas de entrenamiento",
                value: "Jerárquico",
                unit: "FC + lactato",
                color: "from-fuchsia-500/20 to-fuchsia-600/10",
                textColor: "text-fuchsia-300",
                description: "Agrupa esfuerzos en zonas de intensidad personalizadas",
              },
              {
                label: "Análisis táctico",
                value: "K-Means",
                unit: "GPS fútbol",
                color: "from-pink-500/20 to-pink-600/10",
                textColor: "text-pink-300",
                description: "Clustering de posicionamiento GPS en campo de fútbol",
              },
            ],
          },
          {
            id: "herramientas",
            title: "Herramientas",
            table: {
              headers: ["Herramienta", "Tipo", "Facilidad", "Uso AFD"],
              rows: [
                ["Python scikit-learn", "Open source", "Media", "Investigación y análisis"],
                ["R cluster/factoextra", "Open source", "Alta", "Visualización dendrogram"],
                ["MATLAB Statistics", "Licencia", "Alta", "Laboratorio deportivo"],
                ["Tableau / Power BI", "Licencia", "Muy alta", "Dashboards entrenadores"],
              ],
            },
          },
        ]}
      />

      <div className="bg-[#0d0718] px-6 pb-16">
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
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <S10C2_Dynamic2QuizClustering weekId={10} classId={2} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

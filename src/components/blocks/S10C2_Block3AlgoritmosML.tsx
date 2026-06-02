import DashboardBlock from "@/components/layout/DashboardBlock";
import { BarChart2 } from "lucide-react";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S10C2_Block3AlgoritmosML() {
  return (
    <DashboardBlock
      title="Algoritmos de Clustering"
      subtitle="Tres enfoques para encontrar patrones en datos deportivos."
      accentColor="from-violet-500 to-purple-500"
      headerIcon={<BarChart2 size={22} className="text-violet-300" />}
      sections={[
        {
          id: "algoritmos-principales",
          title: "Algoritmos Principales",
          metrics: [
            {
              label: "K-Means",
              value: "Centroides",
              unit: "iterativos",
              color: "from-violet-500/20 to-violet-600/10",
              textColor: "text-violet-300",
              description: "Requiere K predefinido · Rápido y escalable · Asume clusters esféricos",
            },
            {
              label: "DBSCAN",
              value: "Densidad",
              unit: "espacial",
              color: "from-purple-500/20 to-purple-600/10",
              textColor: "text-purple-300",
              description: "Detecta outliers automáticamente · Formas arbitrarias · Sin K fijo",
            },
            {
              label: "Jerárquico",
              value: "Dendrograma",
              unit: "sin K fijo",
              color: "from-fuchsia-500/20 to-fuchsia-600/10",
              textColor: "text-fuchsia-300",
              description: "Árbol de agrupamiento · Interpretable · Sin necesidad de especificar K",
            },
          ],
          content: (
            <div className="flex justify-center mt-4">
              <div className="max-w-xl w-full">
                <ZoomableImage
                  src="/images/semana_10/kmeans_vs_dbscan.png"
                  alt="K-Means vs DBSCAN"
                  className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                />
              </div>
            </div>
          ),
        },
        {
          id: "seleccion-k",
          title: "Selección del K en K-Means",
          table: {
            headers: ["Método", "Criterio", "Cuándo usarlo"],
            rows: [
              ["Elbow Method", "Minimizar inercia / WCSS", "Primera inspección del K"],
              ["Silhouette Score", "Cohesión vs separación", "Validar K elegido"],
              ["Gap Statistic", "vs distribución aleatoria", "Datos sin estructura obvia"],
              ["Calinski-Harabasz", "Ratio de varianza", "Clusters bien separados"],
            ],
          },
          callout: {
            type: "tip",
            text: "En AFD, K=3–5 suele ser el rango más interpretable: ej. sprint / mixto / resistencia.",
          },
        },
      ]}
    />
  );
}

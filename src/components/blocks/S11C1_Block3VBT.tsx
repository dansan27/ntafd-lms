import DashboardBlock from "@/components/layout/DashboardBlock";
import { Zap } from "lucide-react";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S11C1_Block3VBT() {
  return (
    <DashboardBlock
      title="VBT — Entrenamiento Basado en Velocidad"
      subtitle="La velocidad de la barra como indicador objetivo de intensidad y fatiga en tiempo real."
      accentColor="from-purple-500 to-fuchsia-500"
      headerIcon={<Zap size={22} className="text-purple-300" />}
      sections={[
        {
          id: "zonas-velocidad",
          title: "Zonas de Velocidad en Press de Banca / Sentadilla",
          metrics: [
            {
              label: "Fuerza Máx.",
              value: "< 0.35",
              unit: "m/s",
              color: "from-red-500/20 to-red-600/10",
              textColor: "text-red-300",
              description: "Cargas >85% 1RM · reclutamiento máximo de unidades motoras · pocas repeticiones",
            },
            {
              label: "Fuerza-Potencia",
              value: "0.35–0.55",
              unit: "m/s",
              color: "from-orange-500/20 to-orange-600/10",
              textColor: "text-orange-300",
              description: "Cargas 60–85% 1RM · zona de transferencia · alta activación neuromuscular",
            },
            {
              label: "Potencia-Vel.",
              value: "0.55–0.75",
              unit: "m/s",
              color: "from-violet-500/20 to-violet-600/10",
              textColor: "text-violet-300",
              description: "Cargas 40–60% 1RM · potencia media-alta · aceleración máxima a la barra",
            },
            {
              label: "Velocidad",
              value: "> 0.75",
              unit: "m/s",
              color: "from-fuchsia-500/20 to-fuchsia-600/10",
              textColor: "text-fuchsia-300",
              description: "Cargas <40% 1RM · velocidad máxima · balísticos y pliometría",
            },
          ],
          content: (
            <div className="flex justify-center mt-4">
              <div className="max-w-xl w-full">
                <ZoomableImage
                  src="/images/semana_11/vbt_load_velocity_profile.png"
                  alt="Perfil Carga-Velocidad VBT"
                  className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                />
              </div>
            </div>
          ),
        },
        {
          id: "ventajas-vbt",
          title: "VBT vs Método Tradicional de % 1RM",
          table: {
            headers: ["Aspecto", "% 1RM Tradicional", "VBT"],
            rows: [
              ["Prescripción de carga", "Porcentaje fijo (ej. 80%)", "Zona de velocidad objetivo"],
              ["Control de fatiga", "Subjetivo o RPE", "% pérdida velocidad en set"],
              ["Variabilidad diaria", "No contemplada", "Autorregulación automática"],
              ["Test 1RM", "Necesario periódicamente", "Estimado con 2–3 cargas submáximas"],
            ],
          },
          callout: {
            type: "info",
            text: "Una pérdida de velocidad >20% en el set indica fatiga neuromuscular significativa. El VBT permite detener el set en ese umbral para preservar la calidad del estímulo.",
          },
        },
      ]}
    />
  );
}

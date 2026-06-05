import DashboardBlock from "@/components/layout/DashboardBlock";
import { Activity } from "lucide-react";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S11C2_Block5Tensiomiografia() {
  return (
    <DashboardBlock
      title="Tensiomiografía (TMG)"
      subtitle="Evaluación no invasiva de las propiedades contractiles musculares mediante impulso eléctrico."
      accentColor="from-fuchsia-500 to-emerald-500"
      headerIcon={<Activity size={22} className="text-fuchsia-300" />}
      sections={[
        {
          id: "parametros-tmg",
          title: "Parámetros TMG y su Significado",
          metrics: [
            {
              label: "Dm — Desplazamiento máx.",
              value: "mm",
              unit: "deformación máx.",
              color: "from-fuchsia-500/20 to-fuchsia-600/10",
              textColor: "text-fuchsia-300",
              description: "Amplitud máxima de la contracción · indica masa activa y rigidez. >8 mm = fibras tipo II dominantes",
            },
            {
              label: "Tc — Tiempo contracción",
              value: "ms",
              unit: "10–90% Dm",
              color: "from-violet-500/20 to-violet-600/10",
              textColor: "text-violet-300",
              description: "Velocidad de contracción · Tc < 22 ms sugiere fibras rápidas · Tc > 35 ms fibras lentas",
            },
            {
              label: "Td — Tiempo demora",
              value: "ms",
              unit: "onset → 10% Dm",
              color: "from-purple-500/20 to-purple-600/10",
              textColor: "text-purple-300",
              description: "Latencia neuro-mecánica · refleja velocidad de conducción y eficiencia de la unión neuromuscular",
            },
          ],
          content: (
            <div className="flex justify-center mt-4">
              <div className="max-w-xl w-full">
                <ZoomableImage
                  src="/images/semana_11/tmg_sensor_waveform.png"
                  alt="Sensor TMG con Señal de Tensiomiografía"
                  className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                />
              </div>
            </div>
          ),
        },
        {
          id: "aplicaciones-tmg",
          title: "Aplicaciones de la TMG en Deporte",
          table: {
            headers: ["Aplicación", "Músculos típicos", "Indicador monitoreado", "Decisión clínica"],
            rows: [
              ["Control de fatiga acumulada", "Cuádriceps, isquio.", "Aumento Dm > 15%", "Reducir volumen de sesión"],
              ["Asimetría bilateral", "RF vs BF bilateral", "Índice de simetría", "Intervención preventiva <90%"],
              ["Composición de fibras (indirecta)", "VL, GM, Sol", "Tc relativo entre músculos", "Orientación del entrenamiento"],
              ["Readiness post-lesión", "Músculo lesionado vs sano", "Dm y Tc normalizados", "Decisión de retorno al juego"],
            ],
          },
          callout: {
            type: "warning",
            text: "La TMG mide la deformación del vientre muscular, no la fuerza directamente. Sus valores son relativos al atleta y requieren mediciones seriadas para ser interpretados correctamente. No compara perfiles musculares entre atletas distintos.",
          },
        },
      ]}
    />
  );
}

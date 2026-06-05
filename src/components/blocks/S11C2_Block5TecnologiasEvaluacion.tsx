import DashboardBlock from "@/components/layout/DashboardBlock";
import { BarChart2 } from "lucide-react";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S11C2_Block5TecnologiasEvaluacion() {
  return (
    <DashboardBlock
      title="Tecnologías de Evaluación de la Potencia Muscular"
      subtitle="Sistemas de captura de movimiento, plataformas de fuerza, IMUs y dinamómetros isocinéticos."
      accentColor="from-teal-500 to-cyan-500"
      headerIcon={<BarChart2 size={22} className="text-teal-300" />}
      sections={[
        {
          id: "tecnologias-principales",
          title: "Principales Tecnologías",
          metrics: [
            {
              label: "Cámaras 3D (MoCap)",
              value: "Qualisys",
              unit: "/ Vicon",
              color: "from-teal-500/20 to-teal-600/10",
              textColor: "text-teal-300",
              description: "Análisis cinemático 3D completo · marcadores reflectantes · gold standard en biomecánica de saltos y atletismo",
            },
            {
              label: "Plataformas de fuerza",
              value: "CMJ",
              unit: "/ SJ / Drop",
              color: "from-cyan-500/20 to-cyan-600/10",
              textColor: "text-cyan-300",
              description: "Evalúan saltos verticales y fase de despegue · métricas: altura, potencia máxima, RFD · ForceDecks, Kistler, AMTI",
            },
            {
              label: "IMUs y acelerómetros",
              value: "Tiempo",
              unit: "real en campo",
              color: "from-emerald-500/20 to-emerald-600/10",
              textColor: "text-emerald-300",
              description: "Medición de movimientos explosivos · portátiles y sin cables · análisis en tiempo real durante el entrenamiento",
            },
            {
              label: "Dinamómetro isocinético",
              value: "Biodex",
              unit: "/ Kin-Com",
              color: "from-violet-500/20 to-violet-600/10",
              textColor: "text-violet-300",
              description: "Evalúa potencia en movimientos específicos (extensión rodilla y codo) · velocidad angular controlada · permite movimientos rotacionales",
            },
          ],
          content: (
            <div className="flex justify-center mt-4">
              <div className="max-w-xl w-full">
                <ZoomableImage
                  src="/images/semana_11/laboratorio_captura_movimiento.png"
                  alt="Laboratorio con Captura de Movimiento, Plataforma de Fuerza y Dinamómetro"
                  className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                />
              </div>
            </div>
          ),
        },
        {
          id: "comparativa-tecnologias",
          title: "Comparativa por Contexto de Uso",
          table: {
            headers: ["Tecnología", "Portabilidad", "Costo relativo", "Mejor para"],
            rows: [
              ["Cámaras 3D MoCap", "Laboratorio fijo", "Muy alto", "Biomecánica de gesto técnico complejo"],
              ["Plataforma de fuerza", "Semi-portable", "Alto", "Test de salto, RFD, asimetría bilateral"],
              ["IMU / acelerómetro", "Alta (wearable)", "Bajo-medio", "Monitoreo en campo, entrenamiento diario"],
              ["Dinamómetro isocinético", "Laboratorio fijo", "Alto", "Evaluación muscular específica, rehabilitación"],
            ],
          },
        },
      ]}
    />
  );
}

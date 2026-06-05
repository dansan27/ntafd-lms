import DashboardBlock from "@/components/layout/DashboardBlock";
import { TrendingUp } from "lucide-react";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S11C2_Block6MetodologiasEvaluacion() {
  return (
    <DashboardBlock
      title="Metodologías para Evaluar la Potencia Muscular"
      subtitle="Test de saltos, sprint con fotocélulas, evaluaciones isocinéticas y resultados interpretables."
      accentColor="from-emerald-500 to-teal-500"
      headerIcon={<TrendingUp size={22} className="text-emerald-300" />}
      sections={[
        {
          id: "metodologias-principales",
          title: "Protocolos de Evaluación",
          metrics: [
            {
              label: "Test de Saltos",
              value: "CMJ · SJ",
              unit: "Drop Jump",
              color: "from-emerald-500/20 to-emerald-600/10",
              textColor: "text-emerald-300",
              description: "Con plataforma de fuerza o tapete de contacto · interpretación directa de altura, potencia y RFD · fácil aplicación clínica",
            },
            {
              label: "Sprint Explosivo",
              value: "Fotocélulas",
              unit: "/ GPS",
              color: "from-teal-500/20 to-teal-600/10",
              textColor: "text-teal-300",
              description: "Fotocélulas para medir T10m, T30m, T40m · sistemas GPS para potencia metabólica en campo · velocidad y aceleración",
            },
            {
              label: "Isocinético",
              value: "Biodex",
              unit: "60-300 °/s",
              color: "from-cyan-500/20 to-cyan-600/10",
              textColor: "text-cyan-300",
              description: "Dinamómetro a velocidad angular constante · potencia pico concéntrica/excéntrica · ratio agonista:antagonista",
            },
          ],
          content: (
            <div className="flex justify-center mt-4">
              <div className="max-w-xl w-full">
                <ZoomableImage
                  src="/images/semana_11/force_velocity_power_curve.png"
                  alt="Curva Fuerza-Velocidad y Potencia Muscular"
                  className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                />
              </div>
            </div>
          ),
        },
        {
          id: "interpretacion-resultados",
          title: "Interpretación de Resultados por Protocolo",
          table: {
            headers: ["Test", "Dispositivo", "Métrica principal", "Referencia élite"],
            rows: [
              ["CMJ", "Plataforma fuerza / tapete", "Altura de salto (cm)", "> 40 cm hombres, > 30 cm mujeres"],
              ["Wingate 30s", "Cicloergómetro (encoder)", "Potencia pico (W/kg)", "> 14 W/kg hombres, > 11 W/kg mujeres"],
              ["Sprint 30m", "Fotocélulas láser", "T30m (s) / velocidad pico", "< 3.8 s velocistas senior"],
              ["Isocinético rodilla", "Biodex / Kin-Com", "Torque pico (Nm/kg) a 60°/s", "Ratio Q:H ≥ 0.60 prevención lesión"],
            ],
          },
          callout: {
            type: "warning",
            text: "Los valores de referencia varían según edad, sexo y especialidad deportiva. Siempre interpreta en contexto de la historia del atleta y compara contra su propio baseline, no solo con tablas normativas externas.",
          },
        },
      ]}
    />
  );
}

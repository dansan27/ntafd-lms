import DashboardBlock from "@/components/layout/DashboardBlock";
import { Zap } from "lucide-react";

export default function S11C2_Block2PotenciaFundamentos() {
  return (
    <DashboardBlock
      title="Potencia Muscular — Fundamentos"
      subtitle="P = F × v: la relación entre fuerza y velocidad que define el rendimiento explosivo."
      accentColor="from-emerald-500 to-cyan-500"
      headerIcon={<Zap size={22} className="text-emerald-300" />}
      sections={[
        {
          id: "tipos-potencia",
          title: "Tipos y Variables de Potencia",
          metrics: [
            {
              label: "Potencia Pico",
              value: "Pp",
              unit: "W máx instantánea",
              color: "from-emerald-500/20 to-emerald-600/10",
              textColor: "text-emerald-300",
              description: "Máxima potencia desarrollada en un instante · relevante en salto, sprint, lanzamiento",
            },
            {
              label: "Potencia Media",
              value: "Pm",
              unit: "W promedio gesto",
              color: "from-cyan-500/20 to-cyan-600/10",
              textColor: "text-cyan-300",
              description: "Trabajo total / tiempo total del gesto · indicadora de capacidad de trabajo explosivo",
            },
            {
              label: "RFD",
              value: "dF/dt",
              unit: "N/s",
              color: "from-teal-500/20 to-teal-600/10",
              textColor: "text-teal-300",
              description: "Rate of Force Development · velocidad de producción de fuerza · predictor de rendimiento en acciones rápidas",
            },
          ],
        },
        {
          id: "relevancia-deportiva",
          title: "Importancia de la Potencia por Deporte",
          table: {
            headers: ["Deporte", "Variable clave", "Rango de referencia élite"],
            rows: [
              ["Halterofilia", "Potencia pico en arranque", "4000–6000 W (relativa >60 W/kg)"],
              ["Salto vertical (atletismo)", "Potencia explosiva CMJ", "3500–5500 W en fase impulso"],
              ["Sprint 100 m", "RFD en apoyo inicial", "3000–5000 N/s"],
              ["Fútbol / Rugby", "Potencia media en aceleraciones", "1500–2500 W"],
              ["Ciclismo (sprint)", "Potencia pico (Wingate)", "1200–1800 W (relativa >18 W/kg)"],
            ],
          },
          callout: {
            type: "info",
            text: "La potencia relativa (W/kg de masa corporal) es el indicador más útil para comparar atletas de distintas categorías de peso, ya que normaliza la ventaja de masa.",
          },
        },
      ]}
    />
  );
}

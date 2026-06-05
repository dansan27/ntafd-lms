import DashboardBlock from "@/components/layout/DashboardBlock";
import { Cpu } from "lucide-react";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S11C2_Block4FisiologiaPotencia() {
  return (
    <DashboardBlock
      title="Fisiología del Ejercicio y Potencia Muscular"
      subtitle="Fibras musculares, metabolismo energético, activación neuromuscular y la relación fuerza-velocidad."
      accentColor="from-fuchsia-500 to-emerald-500"
      headerIcon={<Cpu size={22} className="text-fuchsia-300" />}
      sections={[
        {
          id: "fibras-musculares",
          title: "Tipos de Fibras Musculares",
          metrics: [
            {
              label: "Tipo I (lentas)",
              value: "MHC I",
              unit: "resistencia",
              color: "from-red-500/20 to-red-600/10",
              textColor: "text-red-300",
              description: "Fibras de contracción lenta · alta densidad mitocondrial · metabolismo aeróbico · menor capacidad de potencia rápida",
            },
            {
              label: "Tipo IIa (rápidas)",
              value: "MHC IIa",
              unit: "fuerza-resistencia",
              color: "from-fuchsia-500/20 to-fuchsia-600/10",
              textColor: "text-fuchsia-300",
              description: "Contracción rápida moderada · tanto aeróbico como anaeróbico · importantes en deportes de potencia sostenida",
            },
            {
              label: "Tipo IIx (rápidas puras)",
              value: "MHC IIx",
              unit: "potencia máxima",
              color: "from-violet-500/20 to-violet-600/10",
              textColor: "text-violet-300",
              description: "Mayor velocidad de contracción · glucolítico anaeróbico · cruciales para salto, sprint y levantamiento explosivo",
            },
          ],
          content: (
            <div className="flex justify-center mt-4">
              <div className="max-w-xl w-full">
                <ZoomableImage
                  src="/images/semana_11/fibras_musculares_tipos.png"
                  alt="Tipos de Fibras Musculares — Tipo I, IIa, IIx"
                  className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                />
              </div>
            </div>
          ),
        },
        {
          id: "metabolismo-fv",
          title: "Metabolismo Energético y Relación Fuerza-Velocidad",
          table: {
            headers: ["Sistema energético", "Duración", "Actividad tipo", "Relación con potencia"],
            rows: [
              ["ATP-PC (anaeróbico aláctico)", "0–10 s", "Sprint, salto explosivo, arranque", "Máxima potencia instantánea · sin producción de lactato"],
              ["Glucolítico (anaeróbico láctico)", "10–60 s", "400 m, series de fuerza", "Alta potencia sostenida · acumulación de lactato"],
              ["Oxidativo (aeróbico)", "> 2 min", "Resistencia continua", "Baja potencia relativa · mantenimiento metabólico"],
            ],
          },
          callout: {
            type: "tip",
            text: "La relación fuerza-velocidad (Ecuación de Hill) muestra que la potencia se maximiza a velocidades intermedias (~30% de V0 y ~30% de F0). Entrenar a alta velocidad con cargas moderadas optimiza el pico de potencia muscular.",
          },
        },
      ]}
    />
  );
}

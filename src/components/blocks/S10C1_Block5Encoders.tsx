import DashboardBlock from "@/components/layout/DashboardBlock";
import { Activity } from "lucide-react";

export default function S10C1_Block5Encoders() {
  return (
    <DashboardBlock
      title="Encoders — Precisión Rotacional Digital"
      subtitle="De los pulsos a la velocidad: cómo los encoders cuantifican la rotación."
      accentColor="from-cyan-500 to-blue-500"
      headerIcon={<Activity size={22} className="text-cyan-300" />}
      sections={[
        {
          id: "tipos-encoder",
          title: "Tipos de Encoders",
          metrics: [
            {
              label: "Óptico",
              value: "Alta",
              unit: "precisión",
              color: "from-cyan-500/20 to-cyan-600/10",
              textColor: "text-cyan-300",
              description: "Disco perforado + fotodetector · Alta resolución · Sensible a suciedad",
            },
            {
              label: "Magnético",
              value: "Robusto",
              unit: "en campo",
              color: "from-blue-500/20 to-blue-600/10",
              textColor: "text-blue-300",
              description: "Efecto Hall · Robusto en campo · Menor resolución",
            },
            {
              label: "Cuadratura",
              value: "2 canales",
              unit: "A+B",
              color: "from-indigo-500/20 to-indigo-600/10",
              textColor: "text-indigo-300",
              description: "Detecta dirección · Estándar industrial · Canales A y B desfasados 90°",
            },
          ],
        },
        {
          id: "aplicaciones-deporte",
          title: "Aplicaciones en Deporte",
          table: {
            headers: ["Aplicación", "Dispositivo", "Encoder tipo", "Variable medida"],
            rows: [
              ["Cicloergómetro", "Bicicleta estática", "Óptico cuadratura", "RPM y potencia"],
              ["Máquina isocinética", "Biodex / Kin-Com", "Óptico absoluto", "Velocidad angular"],
              ["Análisis de sprint", "Ergo de remo", "Magnético", "Cadencia de brazada"],
              ["Exoesqueleto", "Prótesis activa", "Absoluto", "Posición articular"],
            ],
          },
        },
      ]}
    />
  );
}

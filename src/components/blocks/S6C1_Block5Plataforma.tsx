import DashboardBlock from "@/components/layout/DashboardBlock";
import { Layers, BarChart2, Zap, Cpu } from "lucide-react";

export default function S6C1_Block5Plataforma() {
  return (
    <DashboardBlock
      title="Plataforma de Fuerza"
      subtitle="El laboratorio portátil para medir las fuerzas de reacción del suelo en 3 ejes simultáneos."
      accentColor="from-blue-500 to-cyan-500"
      headerIcon={<Layers size={22} className="text-blue-300" />}
      sections={[
        {
          id: "specs",
          title: "Especificaciones técnicas — Kistler",
          icon: <Cpu size={14} className="text-blue-400" />,
          metrics: [
            {
              label: "Dimensiones",
              value: "400 × 600",
              unit: "mm",
              color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
              textColor: "text-blue-400",
              description: "Estándar laboratorio deportivo",
            },
            {
              label: "Canales",
              value: "6",
              unit: "ejes",
              color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30",
              textColor: "text-cyan-400",
              description: "Fx · Fy · Fz · Mx · My · Mz",
            },
            {
              label: "Histéresis",
              value: "±0.2%",
              unit: "FS",
              color: "from-sky-500/20 to-blue-500/10 border-sky-500/30",
              textColor: "text-sky-400",
              description: "Alta repetibilidad de medición",
            },
            {
              label: "Frecuencia muestreo",
              value: "1000",
              unit: "Hz",
              color: "from-indigo-500/20 to-blue-500/10 border-indigo-500/30",
              textColor: "text-indigo-400",
              description: "Capta fases de contacto rápidas",
            },
          ],
          columns: 4,
        },
        {
          id: "canales",
          title: "6 canales de medición",
          icon: <BarChart2 size={14} className="text-blue-400" />,
          table: {
            headers: ["Canal", "Componente", "Descripción", "Ejemplo deportivo"],
            rows: [
              ["Fx", "Fuerza lateral (X)", "Empuje medio-lateral", "Cambio de dirección"],
              ["Fy", "Fuerza antero-posterior (Y)", "Frenada y propulsión", "Sprint, salida"],
              ["Fz", "Fuerza vertical (Z)", "Reacción contra el suelo", "Salto, carrera"],
              ["Mx", "Momento eje X", "Rotación sagital", "Equilibrio en salto"],
              ["My", "Momento eje Y", "Rotación frontal", "Giro de cadera"],
              ["Mz", "Momento eje Z", "Rotación transversal", "Pivote, tenis"],
            ],
            highlight: 1,
          },
        },
        {
          id: "usos",
          title: "Aplicaciones en el deporte",
          icon: <Zap size={14} className="text-blue-400" />,
          content: (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: "🦘",
                  title: "Análisis de salto (CMJ / SJ)",
                  desc: "Altura de salto, fase de vuelo, ratio fuerza-tiempo, índice de reactividad.",
                },
                {
                  icon: "🏃",
                  title: "Biomecánica de carrera",
                  desc: "Fuerzas de impacto, tiempo de contacto, asimetrías L/D.",
                },
                {
                  icon: "⚖️",
                  title: "Control postural",
                  desc: "Centro de presión (CoP) y oscilaciones para deportes de equilibrio.",
                },
                {
                  icon: "🔄",
                  title: "Rehabilitación funcional",
                  desc: "Detección de asimetrías entre extremidades durante la recuperación.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-white/4 p-4 flex gap-3">
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white/90">{item.title}</p>
                    <p className="text-xs text-white/45 mt-1 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ),
          callout: {
            type: "info",
            text: "La plataforma Kistler tiene una altura de solo 82.5 mm y puede embeberse en el suelo para análisis en condiciones reales de entrenamiento sin alterar la mecánica del atleta.",
          },
        },
      ]}
    />
  );
}

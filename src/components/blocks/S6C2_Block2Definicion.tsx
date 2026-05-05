import DashboardBlock from "@/components/layout/DashboardBlock";
import { Dumbbell, Heart, Zap, Activity } from "lucide-react";

export default function S6C2_Block2Definicion() {
  return (
    <DashboardBlock
      title="Fuerza Muscular"
      subtitle="Capacidad de un músculo o grupo muscular para generar tensión y superar o contrarrestar una resistencia a través de la contracción muscular."
      accentColor="from-purple-500 to-red-500"
      headerIcon={<Dumbbell size={22} className="text-purple-300" />}
      sections={[
        {
          id: "definicion",
          title: "¿Qué es la fuerza muscular?",
          icon: <Dumbbell size={14} className="text-purple-400" />,
          callout: {
            type: "info",
            text: "La fuerza muscular no es solo «cuánto puedo levantar». Es la capacidad neuromuscular de generar tensión contra una resistencia — ya sea externa (una barra) o interna (el propio peso corporal).",
          },
          metrics: [
            {
              label: "Definición clave",
              value: "Tensión",
              unit: "generada",
              icon: <Dumbbell size={16} />,
              color: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
              textColor: "text-purple-400",
              description: "El músculo genera fuerza al contraerse — siempre contra una resistencia",
            },
            {
              label: "Unidad de medida",
              value: "Newton",
              unit: "(N)",
              icon: <Zap size={16} />,
              color: "from-red-500/20 to-purple-500/10 border-red-500/30",
              textColor: "text-red-400",
              description: "Fuerza = Masa × Aceleración (2ª Ley de Newton)",
            },
            {
              label: "Tipos de contracción",
              value: "3",
              unit: "tipos",
              icon: <Activity size={16} />,
              color: "from-pink-500/20 to-purple-500/10 border-pink-500/30",
              textColor: "text-pink-400",
              description: "Concéntrica, excéntrica e isométrica",
            },
          ],
        },
        {
          id: "sistemas",
          title: "¿Quiénes participan en la contracción muscular?",
          icon: <Heart size={14} className="text-red-400" />,
          content: (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: "🦴",
                  title: "Sistema musculoesquelético",
                  color: "border-purple-500/30 bg-purple-500/8",
                  accent: "text-purple-300",
                  items: [
                    "Fibras musculares (acto + miosina)",
                    "Tendones (transmisión de fuerza)",
                    "Huesos (palancas mecánicas)",
                    "Fascias y tejido conectivo",
                  ],
                },
                {
                  icon: "⚡",
                  title: "Sistema nervioso",
                  color: "border-yellow-500/30 bg-yellow-500/8",
                  accent: "text-yellow-300",
                  items: [
                    "Motoneurona alfa (orden motora)",
                    "Placa neuromuscular (sinapsis)",
                    "Unidades motoras (reclutamiento)",
                    "Frecuencia de disparo (gradación)",
                  ],
                },
                {
                  icon: "❤️",
                  title: "Sistema cardiovascular",
                  color: "border-red-500/30 bg-red-500/8",
                  accent: "text-red-300",
                  items: [
                    "Suministro de O₂ y glucosa",
                    "Eliminación de CO₂ y lactato",
                    "Regulación de temperatura",
                    "Perfusión muscular local",
                  ],
                },
              ].map((sys) => (
                <div key={sys.title} className={`rounded-xl border p-4 ${sys.color}`}>
                  <div className="text-2xl mb-2">{sys.icon}</div>
                  <p className={`text-sm font-bold mb-2 ${sys.accent}`}>{sys.title}</p>
                  <ul className="space-y-1">
                    {sys.items.map((item) => (
                      <li key={item} className="text-xs text-white/50 flex items-start gap-1.5">
                        <span className="mt-0.5 shrink-0 text-white/30">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ),
        },
      ]}
    />
  );
}

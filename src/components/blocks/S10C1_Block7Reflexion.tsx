import FullscreenBlock from "@/components/layout/FullscreenBlock";

const options = [
  {
    name: "IMU",
    pros: "Inalámbrico, tiempo real, 9 DOF",
    cons: "Calibración, drift",
    color: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
  },
  {
    name: "Encoder",
    pros: "Alta precisión en cicloergómetro",
    cons: "Solo en equipo fijo",
    color: "text-cyan-400",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/5",
  },
  {
    name: "Potenciómetro",
    pros: "Directo en articulación",
    cons: "Cables, rango limitado",
    color: "text-indigo-400",
    border: "border-indigo-500/20",
    bg: "bg-indigo-500/5",
  },
  {
    name: "MoCap",
    pros: "Gold standard, 3D completo",
    cons: "Costoso, solo laboratorio",
    color: "text-violet-400",
    border: "border-violet-500/20",
    bg: "bg-violet-500/5",
  },
];

export default function S10C1_Block7Reflexion() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "reflexion-sensor",
          bg: "from-[#070718] to-[#0a0a2e]",
          badge: "Semana 10 · Reflexión",
          badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
          eyebrow: "Pausa de Reflexión",
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Si tuvieras que monitorear la técnica de{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                lanzamiento
              </span>{" "}
              de un atleta de élite...
            </h2>
          ),
          subtitle: (
            <p>
              ¿Qué sensor — o combinación de sensores — usarías y por qué?
              Considera los <strong className="text-blue-300">trade-offs</strong>{" "}
              entre precisión y practicidad, laboratorio y campo.
            </p>
          ),
          body: (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {options.map((o) => (
                  <div
                    key={o.name}
                    className={`rounded-xl border ${o.border} ${o.bg} p-3 space-y-1`}
                  >
                    <p className={`font-bold text-sm ${o.color}`}>{o.name}</p>
                    <p className="text-xs text-white/60">
                      <span className="text-green-400">+ </span>
                      {o.pros}
                    </p>
                    <p className="text-xs text-white/40">
                      <span className="text-red-400">− </span>
                      {o.cons}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-white/40 text-xs text-center italic">
                No hay respuesta única — el contexto (campo vs laboratorio,
                presupuesto, deporte) define la elección óptima.
              </p>
            </div>
          ),
          accentColor: "text-blue-400",
        },
      ]}
    />
  );
}

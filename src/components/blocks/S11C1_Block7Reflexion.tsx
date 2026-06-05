import FullscreenBlock from "@/components/layout/FullscreenBlock";

const opciones = [
  {
    name: "GymAware (encoder cable)",
    pros: "Máxima precisión, validado clínicamente",
    cons: "Costo elevado, requiere instalación fija",
    color: "text-violet-400",
    border: "border-violet-500/20",
    bg: "bg-violet-500/5",
  },
  {
    name: "PUSH Band (IMU wearable)",
    pros: "Portátil, sin cables, fácil adopción",
    cons: "Menor precisión, sensible a posición",
    color: "text-cyan-400",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/5",
  },
  {
    name: "App de video",
    pros: "Sin costo de hardware, inmediata",
    cons: "Requiere alineación, FPS limitado",
    color: "text-purple-400",
    border: "border-purple-500/20",
    bg: "bg-purple-500/5",
  },
  {
    name: "Sin tecnología (RPE)",
    pros: "Accesible siempre, subjetivo inmediato",
    cons: "No cuantifica velocidad, alta variabilidad",
    color: "text-fuchsia-400",
    border: "border-fuchsia-500/20",
    bg: "bg-fuchsia-500/5",
  },
];

export default function S11C1_Block7Reflexion() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "reflexion-vbt",
          bg: "from-[#070718] to-[#0d0a2e]",
          badge: "Semana 11 · Reflexión",
          badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
          eyebrow: "Pausa de Reflexión",
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Tienes un equipo de{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                rugby semiprofesional
              </span>{" "}
              con presupuesto limitado...
            </h2>
          ),
          subtitle: (
            <p>
              ¿Qué solución VBT implementarías para monitorear la fatiga y ajustar
              las cargas en el bloque de potencia de pretemporada?
              Considera <strong className="text-violet-300">costo, precisión y practicidad</strong>.
            </p>
          ),
          body: (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {opciones.map((o) => (
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
                No hay solución universal — el presupuesto, el deporte y el contexto
                de campo definen la herramienta óptima.
              </p>
            </div>
          ),
          accentColor: "text-violet-400",
        },
      ]}
    />
  );
}

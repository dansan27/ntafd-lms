import FullscreenBlock from "@/components/layout/FullscreenBlock";

const opciones = [
  {
    name: "Plataforma de fuerza",
    pros: "Curva F-t completa, RFD, potencia real",
    cons: "Costo elevado, solo en laboratorio/gym fijo",
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
  },
  {
    name: "Tapete de contacto",
    pros: "Económico, portable, fácil en campo",
    cons: "Solo tiempo vuelo → no da curva fuerza",
    color: "text-cyan-400",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/5",
  },
  {
    name: "Tensiomiografía (TMG)",
    pros: "Propiedades contractiles, asimetría bilateral",
    cons: "Relativa al sujeto, requiere experienza",
    color: "text-fuchsia-400",
    border: "border-fuchsia-500/20",
    bg: "bg-fuchsia-500/5",
  },
  {
    name: "VBT (encoder/LPT)",
    pros: "Valoración funcional en movimiento real",
    cons: "No mide potencia muscular directa",
    color: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
  },
];

export default function S11C2_Block7Reflexion() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "reflexion-potencia",
          bg: "from-[#070718] to-[#0a1a18]",
          badge: "Semana 11 · Reflexión",
          badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          eyebrow: "Pausa de Reflexión",
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Trabajas con un equipo de{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                voleibol
              </span>{" "}
              que compite cada semana...
            </h2>
          ),
          subtitle: (
            <p>
              ¿Qué herramienta de valoración de potencia implementarías para monitorear
              el estado neuromuscular de tus atletas antes de cada partido?
              Considera <strong className="text-emerald-300">frecuencia, tiempo disponible y recursos</strong>.
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
                La elección ideal suele combinar más de una herramienta: CMJ como readiness diario + TMG semanal como control de asimetrías.
              </p>
            </div>
          ),
          accentColor: "text-emerald-400",
        },
      ]}
    />
  );
}

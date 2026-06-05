import FullscreenBlock from "@/components/layout/FullscreenBlock";

const opciones = [
  {
    name: "Encoder óptico incremental",
    pros: "Alta resolución, rápida respuesta",
    cons: "Sensible a suciedad, requiere home",
    color: "text-violet-400",
    border: "border-violet-500/20",
    bg: "bg-violet-500/5",
  },
  {
    name: "Encoder magnético absoluto",
    pros: "Robusto en campo, recuerda posición",
    cons: "Menor resolución, interferencias metálicas",
    color: "text-cyan-400",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/5",
  },
  {
    name: "Encoder lineal (hilo/cable)",
    pros: "Mide desplazamiento real de carga",
    cons: "Requiere montaje fijo, cable frágil",
    color: "text-indigo-400",
    border: "border-indigo-500/20",
    bg: "bg-indigo-500/5",
  },
  {
    name: "Potenciómetro rotatorio",
    pros: "Simple, económico, analógico",
    cons: "Resolución limitada, ruido, desgaste",
    color: "text-purple-400",
    border: "border-purple-500/20",
    bg: "bg-purple-500/5",
  },
];

export default function S11C1_Block7Reflexion() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "reflexion-encoder",
          bg: "from-[#070718] to-[#0d0a2e]",
          badge: "Semana 11 · Reflexión",
          badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
          eyebrow: "Pausa de Reflexión",
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Necesitas medir la{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">
                velocidad angular
              </span>{" "}
              de la rodilla durante una zancada en campo de fútbol...
            </h2>
          ),
          subtitle: (
            <p>
              ¿Qué tipo de encoder elegirías y por qué? Considera la{" "}
              <strong className="text-violet-300">robustez en campo</strong>, la resolución
              necesaria y la facilidad de montaje sobre el deportista en movimiento.
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
                En campo, la robustez suele superar a la resolución. La IMU + magnetómetro
                también compite con el encoder en este escenario.
              </p>
            </div>
          ),
          accentColor: "text-violet-400",
        },
      ]}
    />
  );
}

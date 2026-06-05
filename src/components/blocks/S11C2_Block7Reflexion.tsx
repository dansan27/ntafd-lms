import FullscreenBlock from "@/components/layout/FullscreenBlock";

const opciones = [
  {
    name: "Plataforma de fuerza",
    pros: "Potencia real, RFD, asimetría bilateral",
    cons: "Costo alto, necesita instalación fija",
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
  },
  {
    name: "Dinamómetro isocinético",
    pros: "Potencia angular segmentaria, ratio agonista/antagonista",
    cons: "Laboratorio, no funcional, lento por atleta",
    color: "text-cyan-400",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/5",
  },
  {
    name: "IMU + acelerómetro",
    pros: "Portable, bajo costo, campo en tiempo real",
    cons: "Estimación de potencia, menor precisión",
    color: "text-teal-400",
    border: "border-teal-500/20",
    bg: "bg-teal-500/5",
  },
  {
    name: "Fotocélulas + GPS",
    pros: "Velocidad y potencia metabólica en campo",
    cons: "No mide potencia muscular directamente",
    color: "text-fuchsia-400",
    border: "border-fuchsia-500/20",
    bg: "bg-fuchsia-500/5",
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
                atletismo de saltos
              </span>{" "}
              con acceso a laboratorio universitario...
            </h2>
          ),
          subtitle: (
            <p>
              ¿Qué combinación de tecnologías usarías para evaluar la potencia muscular
              de 8 saltadores en altura antes de la temporada? Considera{" "}
              <strong className="text-emerald-300">tiempo disponible, presupuesto y qué datos necesitas</strong>.
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
                Un protocolo ideal podría combinar plataforma de fuerza (CMJ) +
                dinamómetro isocinético (rodilla) para un perfil completo de potencia.
              </p>
            </div>
          ),
          accentColor: "text-emerald-400",
        },
      ]}
    />
  );
}

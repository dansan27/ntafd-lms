import FullscreenBlock from "@/components/layout/FullscreenBlock";

const opciones = [
  {
    name: "Fotocélulas",
    pros: "Precisas en sprints lineales, rápidas de instalar, bajo costo",
    cons: "No capturan la dinámica de cambio de dirección",
    color: "text-orange-400",
    border: "border-orange-500/20",
    bg: "bg-orange-500/5",
  },
  {
    name: "IMUs / Acelerómetros",
    pros: "Portables, tiempo real, bajo costo, campo completo",
    cons: "Estimación de fuerzas con menor precisión que laboratorio",
    color: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
  },
  {
    name: "Cámaras 3D (Qualisys/Vicon)",
    pros: "Análisis cinemático completo, muy preciso",
    cons: "Requiere laboratorio, caro, tiempo de procesado alto",
    color: "text-yellow-400",
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
  },
  {
    name: "Plataformas de Fuerza",
    pros: "Fuerzas reales durante cambio de dirección, RFD",
    cons: "Fija en laboratorio, área de captura limitada",
    color: "text-red-400",
    border: "border-red-500/20",
    bg: "bg-red-500/5",
  },
];

export default function S12C1_Block7Reflexion() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "reflexion-agilidad",
          bg: "from-[#070718] to-[#1a0e00]",
          badge: "Semana 12 · Reflexión",
          badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
          eyebrow: "Pausa de Reflexión",
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Eres preparador físico de un equipo de{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400">
                fútbol sala
              </span>{" "}
              y quieres evaluar velocidad y agilidad antes de la temporada...
            </h2>
          ),
          subtitle: (
            <p>
              Tienes acceso a una pista cubierta y un presupuesto moderado. ¿Qué protocolo
              y tecnología combinarías para obtener datos{" "}
              <strong className="text-orange-300">útiles, rápidos y aplicables</strong> a
              tu planificación del entrenamiento?
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
                Una batería ideal podría combinar fotocélulas (sprint 10-30 m) + IMUs
                (COD en T-test) para un perfil eficiente de velocidad y agilidad en campo.
              </p>
            </div>
          ),
          accentColor: "text-orange-400",
        },
      ]}
    />
  );
}

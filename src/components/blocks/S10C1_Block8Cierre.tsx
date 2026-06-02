import FullscreenBlock from "@/components/layout/FullscreenBlock";

const puntos = [
  {
    n: "1",
    titulo: "Cinemática",
    texto: "Estudio del movimiento sin considerar fuerzas — posición, velocidad, aceleración y ángulos articulares.",
  },
  {
    n: "2",
    titulo: "IMU",
    texto: "Fusión de acelerómetro + giroscopio + magnetómetro para orientación 3D completa (9 DOF).",
  },
  {
    n: "3",
    titulo: "Potenciómetro",
    texto: "Convierte el ángulo articular en voltaje proporcional — base de la goniometría electrónica.",
  },
  {
    n: "4",
    titulo: "Encoder",
    texto: "Cuantifica velocidad y posición rotacional en pulsos digitales — esencial en cicloergómetros e isocineticos.",
  },
];

export default function S10C1_Block8Cierre() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "cierre-s10c1",
          bg: "from-[#070718] to-[#0a0a2e]",
          badge: "Semana 10 · Clase 1",
          badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
          eyebrow: "Resumen de Clase",
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Sensores{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                Cinemáticos
              </span>{" "}
              en el Deporte
            </h2>
          ),
          subtitle: (
            <p>
              Cuatro conceptos clave que transforman el movimiento humano en
              datos cuantificables para el análisis biomecánico deportivo.
            </p>
          ),
          body: (
            <div className="space-y-3">
              {puntos.map((p) => (
                <div
                  key={p.n}
                  className="flex gap-3 rounded-xl border border-blue-500/15 bg-blue-500/5 p-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300">
                    {p.n}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-blue-300">{p.titulo}</p>
                    <p className="text-xs text-white/50 mt-0.5">{p.texto}</p>
                  </div>
                </div>
              ))}
              <p className="text-white/40 text-xs text-center pt-2">
                Próxima clase: Machine Learning no supervisado —{" "}
                <span className="text-violet-400">
                  Clustering para identificar perfiles de atletas.
                </span>
              </p>
            </div>
          ),
          accentColor: "text-blue-400",
        },
      ]}
    />
  );
}

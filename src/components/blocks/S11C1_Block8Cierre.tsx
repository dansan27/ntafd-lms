import FullscreenBlock from "@/components/layout/FullscreenBlock";

const puntos = [
  {
    n: "1",
    titulo: "Encoder — Definición",
    texto: "Sensor que convierte movimiento mecánico en señal eléctrica para medir posición, velocidad, dirección y conteos.",
  },
  {
    n: "2",
    titulo: "Tecnologías: Óptico, Magnético, Resistivo, Mecánico",
    texto: "Los ópticos lideran en precisión de laboratorio; los magnéticos dominan en campo por su robustez ante suciedad y humedad.",
  },
  {
    n: "3",
    titulo: "Tipos: Lineal y Rotatorio",
    texto: "Lineal para desplazamientos en línea recta (ergo de remo, LPT). Rotatorio para velocidad angular (cicloergómetro, isocinético).",
  },
  {
    n: "4",
    titulo: "Métodos: Absoluto vs Incremental",
    texto: "Absoluto: posición única sin referencia. Incremental: cuenta pulsos desde home, más económico y común en deporte.",
  },
];

export default function S11C1_Block8Cierre() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "cierre-s11c1",
          bg: "from-[#070718] to-[#0d0a2e]",
          badge: "Semana 11 · Clase 1",
          badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
          eyebrow: "Resumen de Clase",
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Encoders —{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">
                Sensores Cinemáticos
              </span>{" "}
              de Precisión
            </h2>
          ),
          subtitle: (
            <p>
              Cuatro conceptos que explican cómo los encoders convierten el movimiento
              mecánico en datos cuantificables para el análisis del rendimiento deportivo.
            </p>
          ),
          body: (
            <div className="space-y-3">
              {puntos.map((p) => (
                <div
                  key={p.n}
                  className="flex gap-3 rounded-xl border border-violet-500/15 bg-violet-500/5 p-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-300">
                    {p.n}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-violet-300">{p.titulo}</p>
                    <p className="text-xs text-white/50 mt-0.5">{p.texto}</p>
                  </div>
                </div>
              ))}
              <p className="text-white/40 text-xs text-center pt-2">
                Próxima clase:{" "}
                <span className="text-emerald-400">
                  Tecnología aplicada en la valoración y análisis de la potencia muscular.
                </span>
              </p>
            </div>
          ),
          accentColor: "text-violet-400",
        },
      ]}
    />
  );
}

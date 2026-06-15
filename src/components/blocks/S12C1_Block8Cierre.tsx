import FullscreenBlock from "@/components/layout/FullscreenBlock";

const puntos = [
  {
    n: "1",
    titulo: "Velocidad Lineal vs Angular",
    texto: "La velocidad lineal (v = d/t) describe el sprint; la angular (ω = θ/t) describe la rotación de segmentos. Se interrelacionan: v = ω × r.",
  },
  {
    n: "2",
    titulo: "Agilidad = COD + Percepción",
    texto: "No es solo cambio de dirección físico. La agilidad real incluye percepción del entorno, anticipación y toma de decisiones en menos de 200 ms.",
  },
  {
    n: "3",
    titulo: "Indicadores de Evaluación",
    texto: "Tiempo total (T-test, Illinois), Índice de Agilidad, CODT, AFI, Índice de Desaceleración y Fuerza Lateral — cada uno mide un aspecto diferente.",
  },
  {
    n: "4",
    titulo: "Tecnologías de Medición",
    texto: "Fotocélulas y GPS para velocidad en campo; IMUs para movimiento y agilidad; cámaras 3D y plataformas de fuerza para análisis de laboratorio.",
  },
];

export default function S12C1_Block8Cierre() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "cierre-s12c1",
          bg: "from-[#070718] to-[#1a0e00]",
          badge: "Semana 12 · Clase 1",
          badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
          eyebrow: "Resumen de Clase",
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Velocidad y Agilidad —{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400">
                Tecnología para Medirlas
              </span>
            </h2>
          ),
          subtitle: (
            <p>
              Cuatro conceptos que explican cómo cuantificar la velocidad y la agilidad
              para el análisis y planificación del rendimiento deportivo.
            </p>
          ),
          body: (
            <div className="space-y-3">
              {puntos.map((p) => (
                <div
                  key={p.n}
                  className="flex gap-3 rounded-xl border border-orange-500/15 bg-orange-500/5 p-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-xs font-bold text-orange-300">
                    {p.n}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-orange-300">{p.titulo}</p>
                    <p className="text-xs text-white/50 mt-0.5">{p.texto}</p>
                  </div>
                </div>
              ))}
              <p className="text-white/40 text-xs text-center pt-2">
                Próxima semana:{" "}
                <span className="text-orange-400">
                  Continuamos explorando tecnologías avanzadas aplicadas al deporte.
                </span>
              </p>
            </div>
          ),
          accentColor: "text-orange-400",
        },
      ]}
    />
  );
}

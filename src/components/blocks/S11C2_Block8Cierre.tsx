import FullscreenBlock from "@/components/layout/FullscreenBlock";

const puntos = [
  {
    n: "1",
    titulo: "Potencia Muscular (P = F × v)",
    texto: "La potencia combina fuerza y velocidad. La potencia pico y el RFD son los indicadores más relevantes en deportes explosivos.",
  },
  {
    n: "2",
    titulo: "Plataforma de Fuerza y Salto",
    texto: "CMJ en strain-gauge o piezoeléctrica: curva F-t completa, RFD, potencia pico e índices de elasticidad (RSI) en tiempo real.",
  },
  {
    n: "3",
    titulo: "Curva Fuerza-Velocidad (F-V)",
    texto: "La hipérbola de Hill y la parábola de potencia definen los límites del músculo. El déficit F-V orienta la programación del entrenamiento.",
  },
  {
    n: "4",
    titulo: "Tensiomiografía (TMG)",
    texto: "Dm, Tc y Td caracterizan las propiedades contractiles no invasivamente. Útil para asimetría bilateral y readiness neuromuscular.",
  },
];

export default function S11C2_Block8Cierre() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "cierre-s11c2",
          bg: "from-[#070718] to-[#0a1a18]",
          badge: "Semana 11 · Clase 2",
          badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          eyebrow: "Resumen de Clase",
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Valoración de la{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Potencia Muscular
              </span>
            </h2>
          ),
          subtitle: (
            <p>
              Cuatro pilares tecnológicos para cuantificar la producción de potencia
              y tomar decisiones de entrenamiento basadas en datos objetivos.
            </p>
          ),
          body: (
            <div className="space-y-3">
              {puntos.map((p) => (
                <div
                  key={p.n}
                  className="flex gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">
                    {p.n}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-emerald-300">{p.titulo}</p>
                    <p className="text-xs text-white/50 mt-0.5">{p.texto}</p>
                  </div>
                </div>
              ))}
              <p className="text-white/40 text-xs text-center pt-2">
                Semana 11 completada —{" "}
                <span className="text-cyan-400">
                  VBT + plataformas de fuerza + TMG = tríada tecnológica del deporte de potencia.
                </span>
              </p>
            </div>
          ),
          accentColor: "text-emerald-400",
        },
      ]}
    />
  );
}

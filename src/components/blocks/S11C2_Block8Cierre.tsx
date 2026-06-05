import FullscreenBlock from "@/components/layout/FullscreenBlock";

const puntos = [
  {
    n: "1",
    titulo: "Fundamentos físicos: P = F × v",
    texto: "La potencia integra velocidad, fuerza y trabajo. Lineal y rotacional — ambas formas son relevantes en el deporte.",
  },
  {
    n: "2",
    titulo: "Fisiología: fibras y metabolismo",
    texto: "Las fibras Tipo IIx y el sistema ATP-PC son clave para la potencia explosiva. La relación F-V se optimiza a velocidades intermedias.",
  },
  {
    n: "3",
    titulo: "Tecnologías de evaluación",
    texto: "Cámaras 3D, plataformas de fuerza, IMUs y dinamómetros isocinéticos — cada una mide un aspecto diferente de la potencia muscular.",
  },
  {
    n: "4",
    titulo: "Metodologías: test de salto, sprint e isocinético",
    texto: "CMJ en plataforma, sprint con fotocélulas y evaluación Biodex forman la tríada metodológica para el perfilado completo de potencia.",
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
              Tecnología para la{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Potencia Muscular
              </span>
            </h2>
          ),
          subtitle: (
            <p>
              De los fundamentos físicos a las metodologías de campo: las herramientas
              que permiten cuantificar y optimizar la producción de potencia en el deporte.
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
                <span className="text-violet-400">
                  Encoders + Potencia Muscular: sensores para cuantificar el rendimiento explosivo.
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

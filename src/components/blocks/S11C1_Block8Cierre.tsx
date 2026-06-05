import FullscreenBlock from "@/components/layout/FullscreenBlock";

const puntos = [
  {
    n: "1",
    titulo: "Transductor Lineal de Posición (LPT)",
    texto: "Convierte el desplazamiento del hilo en velocidad de barra con precisión ±0.1 mm — base del VBT en laboratorio y campo.",
  },
  {
    n: "2",
    titulo: "Zonas de Velocidad",
    texto: "Cada zona (<0.35, 0.35–0.55, 0.55–0.75, >0.75 m/s) corresponde a un continuum fuerza-velocidad y un tipo de adaptación específico.",
  },
  {
    n: "3",
    titulo: "Perfil Carga-Velocidad (L-V)",
    texto: "Relación lineal individual entre %1RM y VMP — permite estimar el 1RM diario con solo 2–3 cargas submáximas.",
  },
  {
    n: "4",
    titulo: "Control de fatiga por % pérdida",
    texto: "Umbrales de pérdida de velocidad intra-set (10–40%) regulan el volumen efectivo y evitan el sobreentrenamiento neuromuscular.",
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
              VBT —{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                Entrenamiento
              </span>{" "}
              Basado en Velocidad
            </h2>
          ),
          subtitle: (
            <p>
              Cuatro conceptos clave que transforman los encoders en herramientas
              de autorregulación y monitoreo del entrenamiento de fuerza y potencia.
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
                <span className="text-fuchsia-400">
                  Tecnología para la valoración de la potencia muscular — plataformas de fuerza y tensiomiografía.
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

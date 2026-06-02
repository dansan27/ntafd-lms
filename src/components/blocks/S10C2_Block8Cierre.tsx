import FullscreenBlock from "@/components/layout/FullscreenBlock";

const puntos = [
  {
    n: "1",
    titulo: "Clustering = ML No Supervisado",
    texto: "Agrupa observaciones por similitud sin etiquetas previas. El algoritmo encuentra la estructura oculta.",
  },
  {
    n: "2",
    titulo: "K-Means: Centroides Iterativos",
    texto: "Asigna cada punto al centroide más cercano y recalcula hasta convergencia. Requiere K predefinido.",
  },
  {
    n: "3",
    titulo: "Aplicaciones en AFD",
    texto: "Perfiles de atletas · Zonas de entrenamiento · Detección de riesgo de lesión · Análisis táctico GPS.",
  },
  {
    n: "4",
    titulo: "Siempre validar con expertos",
    texto: "El cluster es estadístico — el significado deportivo lo aporta el experto del dominio.",
  },
];

export default function S10C2_Block8Cierre() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "cierre-s10c2",
          bg: "from-[#0d0718] to-[#1a0a2e]",
          badge: "Semana 10 · Clase 2",
          badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
          eyebrow: "Cierre del Módulo",
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Clustering para{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-400">
                Actividad Física y Deporte
              </span>
            </h2>
          ),
          subtitle: (
            <p>
              Con los sensores cinemáticos de la Clase 1 y el clustering de
              esta clase, tienes las herramientas para transformar datos de
              movimiento en{" "}
              <strong className="text-violet-300">perfiles de atleta</strong>{" "}
              accionables.
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
                    <p className="text-sm font-bold text-violet-300">
                      {p.titulo}
                    </p>
                    <p className="text-xs text-white/50 mt-0.5">{p.texto}</p>
                  </div>
                </div>
              ))}
              <p className="text-white/30 text-xs text-center pt-2 italic">
                Fin del módulo de Sensores y Análisis de Datos · Semana 10 ·
                Nuevas Tecnologías en Deporte
              </p>
            </div>
          ),
          accentColor: "text-violet-400",
        },
      ]}
    />
  );
}

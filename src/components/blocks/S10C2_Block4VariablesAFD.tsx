import FullscreenBlock from "@/components/layout/FullscreenBlock";
import ZoomableImage from "@/components/ui/ZoomableImage";

const variables = [
  { name: "VO₂máx", unit: "ml/kg/min", desc: "Capacidad aeróbica máxima" },
  { name: "FC máxima", unit: "bpm", desc: "Respuesta cardiovascular al esfuerzo" },
  { name: "FC en reposo", unit: "bpm", desc: "Indicador de eficiencia cardíaca" },
  { name: "Potencia umbral", unit: "W/kg", desc: "Potencia aeróbica relativa" },
  { name: "Velocidad pico", unit: "m/s", desc: "Capacidad neuromuscular" },
  { name: "HRV", unit: "ms", desc: "Variabilidad de FC — recuperación SNA" },
  { name: "Carga de entrenamiento", unit: "UA", desc: "Unidades arbitrarias de carga" },
];

const clusters = [
  {
    letra: "A",
    nombre: "Sprinters",
    desc: "Potencia alta · VO₂máx alto · Perfil de sprint",
    color: "text-violet-300",
    border: "border-violet-500/30",
    bg: "bg-violet-500/10",
    datos: "VO₂max ↑ · Potencia ↑↑ · FC reposo ↔",
  },
  {
    letra: "B",
    nombre: "Escaladores",
    desc: "Resistencia élite · FC reposo muy baja",
    color: "text-purple-300",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    datos: "VO₂max ↑↑ · Potencia ↔ · FC reposo ↓↓",
  },
  {
    letra: "C",
    nombre: "Rodadores",
    desc: "Potencia media · Alta HRV · Polivalentes",
    color: "text-fuchsia-300",
    border: "border-fuchsia-500/30",
    bg: "bg-fuchsia-500/10",
    datos: "VO₂max ↔ · Potencia ↔ · HRV ↑",
  },
];

export default function S10C2_Block4VariablesAFD() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "variables-clustering",
          bg: "from-[#0d0718] to-[#1a0a2e]",
          badge: "Semana 10 · Variables",
          badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
          eyebrow: "Feature Engineering",
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Variables para{" "}
              <span className="text-violet-400">Clustering</span> en Deporte
            </h2>
          ),
          subtitle: (
            <p>
              Seleccionar las variables correctas — y{" "}
              <strong className="text-violet-300">normalizarlas</strong> — es
              más importante que elegir el algoritmo. Sin Z-score, una
              variable con mayor escala domina el cálculo de distancias.
            </p>
          ),
          body: (
            <div className="space-y-2">
              {variables.map((v) => (
                <div key={v.name} className="flex items-center gap-2 text-xs">
                  <span className="text-violet-400 font-bold w-36 shrink-0">
                    {v.name}
                  </span>
                  <span className="text-white/40 w-16 shrink-0">{v.unit}</span>
                  <span className="text-white/50">{v.desc}</span>
                </div>
              ))}
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-3 mt-2">
                <p className="text-xs text-violet-300 font-semibold">
                  Normalización Z-score
                </p>
                <p className="text-xs text-white/50 mt-0.5 font-mono">
                  z = (x − μ) / σ → media=0, desv.típica=1
                </p>
              </div>
            </div>
          ),
          accentColor: "text-violet-400",
        },
        {
          id: "ejemplo-ciclistas",
          bg: "from-[#1a0a2e] to-[#0d0718]",
          badge: "Caso Práctico",
          badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
          eyebrow: "Ejemplo: Ciclistas",
          title: (
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Clustering de{" "}
              <span className="text-purple-400">Ciclistas</span>: 3 Perfiles
            </h2>
          ),
          subtitle: (
            <p>
              K-Means aplicado a datos de ciclistas profesionales identifica
              tres clusters naturales. La nomenclatura se asigna{" "}
              <em>post-hoc</em> por el experto deportivo.
            </p>
          ),
          body: (
            <div className="space-y-3">
              {clusters.map((c) => (
                <div
                  key={c.letra}
                  className={`rounded-xl border ${c.border} ${c.bg} p-3 flex gap-3 items-start`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-black ${c.color}`}
                  >
                    {c.letra}
                  </span>
                  <div>
                    <p className={`text-sm font-bold ${c.color}`}>
                      Cluster {c.letra} — {c.nombre}
                    </p>
                    <p className="text-xs text-white/50 mt-0.5">{c.desc}</p>
                    <p className="text-xs text-white/30 font-mono mt-1">
                      {c.datos}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ),
          visual: (
            <ZoomableImage
              src="/images/semana_10/cyclist_profiles.png"
              alt="Perfiles de Ciclistas"
              className="w-full max-h-[380px] object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
            />
          ),
          accentColor: "text-purple-400",
        },
      ]}
    />
  );
}

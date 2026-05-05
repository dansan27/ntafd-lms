import DashboardBlock from "@/components/layout/DashboardBlock";
import { Layers, Zap, Activity } from "lucide-react";

export default function S6C2_Block3FibrasTipos() {
  return (
    <DashboardBlock
      title="Tipos de Fibras Musculares"
      subtitle="Tres tipos de fibras con características radicalmente distintas — tu deporte determina cuál necesitas más."
      accentColor="from-blue-500 to-purple-500"
      headerIcon={<Layers size={22} className="text-blue-300" />}
      sections={[
        {
          id: "tres-tipos",
          title: "Type I · Type IIa · Type IIx",
          icon: <Layers size={14} className="text-blue-400" />,
          tabs: [
            {
              label: "Type I — Lentas",
              content: (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Velocidad contracción", value: "Lenta", icon: "🐢" },
                      { label: "Fuerza generada", value: "Baja", icon: "⬇️" },
                      { label: "Resistencia fatiga", value: "Alta", icon: "🔋" },
                      { label: "Mitocondrias", value: "Muchas", icon: "🔴" },
                      { label: "Reclutamiento", value: "1.º en activarse", icon: "🥇" },
                      { label: "Metabolismo", value: "Aeróbico", icon: "💨" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-blue-500/20 bg-blue-500/8 p-3">
                        <div className="text-xl mb-1">{item.icon}</div>
                        <p className="text-[11px] text-white/40 uppercase tracking-widest">{item.label}</p>
                        <p className="text-sm font-semibold text-blue-300 mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-blue-500/25 bg-blue-500/8 px-4 py-3">
                    <p className="text-sm text-blue-300">
                      🏃 <strong>Deportes dominantes:</strong> Maratón, triatlón, ciclismo de ruta, natación de fondo. Alta eficiencia aeróbica, baja potencia explosiva.
                    </p>
                  </div>
                </div>
              ),
            },
            {
              label: "Type IIa — Intermedias",
              content: (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Velocidad contracción", value: "Intermedia", icon: "⏱️" },
                      { label: "Fuerza generada", value: "Intermedia", icon: "↔️" },
                      { label: "Resistencia fatiga", value: "Intermedia", icon: "🔋" },
                      { label: "Mitocondrias", value: "Muchas", icon: "🔴" },
                      { label: "Reclutamiento", value: "2.º en activarse", icon: "🥈" },
                      { label: "Metabolismo", value: "Aeróbico + Anaeróbico", icon: "⚡" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-purple-500/20 bg-purple-500/8 p-3">
                        <div className="text-xl mb-1">{item.icon}</div>
                        <p className="text-[11px] text-white/40 uppercase tracking-widest">{item.label}</p>
                        <p className="text-sm font-semibold text-purple-300 mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-purple-500/25 bg-purple-500/8 px-4 py-3">
                    <p className="text-sm text-purple-300">
                      🏊 <strong>Deportes dominantes:</strong> 800m, 400m natación, fútbol, baloncesto. Responden muy bien al entrenamiento — pueden volverse más tipo I o tipo IIx.
                    </p>
                  </div>
                </div>
              ),
            },
            {
              label: "Type IIx — Rápidas",
              content: (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Velocidad contracción", value: "Rápida", icon: "⚡" },
                      { label: "Fuerza generada", value: "Máxima", icon: "⬆️" },
                      { label: "Resistencia fatiga", value: "Baja", icon: "📉" },
                      { label: "Mitocondrias", value: "Pocas", icon: "⬜" },
                      { label: "Reclutamiento", value: "3.º (alta intensidad)", icon: "🥉" },
                      { label: "Metabolismo", value: "Anaeróbico", icon: "💥" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-red-500/20 bg-red-500/8 p-3">
                        <div className="text-xl mb-1">{item.icon}</div>
                        <p className="text-[11px] text-white/40 uppercase tracking-widest">{item.label}</p>
                        <p className="text-sm font-semibold text-red-300 mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3">
                    <p className="text-sm text-red-300">
                      🏋️ <strong>Deportes dominantes:</strong> 100m, halterofilia, salto de longitud, lanzamientos. Máxima potencia, fatiga muy rápida.
                    </p>
                  </div>
                </div>
              ),
            },
          ],
        },
        {
          id: "comparativa",
          title: "Tabla comparativa",
          icon: <Activity size={14} className="text-blue-400" />,
          table: {
            headers: ["Característica", "Type I (lenta)", "Type IIa (intermedia)", "Type IIx (rápida)"],
            rows: [
              ["Tamaño de fibra", "Pequeño", "Mayor", "Mayor"],
              ["Umbral de reclutamiento", "Bajo — 1.º", "Medio — 2.º", "Alto — 3.º"],
              ["Velocidad de contracción", "Lenta", "Intermedia", "Rápida"],
              ["Fuerza máxima", "Baja", "Intermedia", "Máxima"],
              ["Capacidad anaeróbica", "Baja", "Alta", "Muy alta"],
              ["Resistencia a fatiga", "Alta", "Intermedia", "Baja"],
              ["Color (mioglobina)", "Rojo oscuro", "Rosado", "Blanco/pálido"],
            ],
            highlight: 3,
          },
          callout: {
            type: "tip",
            text: "La mayoría de personas tiene un Z-score cercano a 0 — proporciones similares de fibras lentas y rápidas. Los atletas de élite en deportes extremos (maratonistas, velocistas puros) suelen estar en los extremos de esta distribución.",
          },
        },
        {
          id: "deporte-fibras",
          title: "Fibras y metabolismo energético",
          icon: <Zap size={14} className="text-blue-400" />,
          content: (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  sport: "Fondo (Maratón)",
                  fiber: "Predominio Type I",
                  energy: "Aeróbico",
                  bar: "w-4/5",
                  barColor: "bg-blue-500",
                  desc: "Alta densidad mitocondrial, oxidación de ácidos grasos, bajo pico de fuerza pero alta resistencia",
                },
                {
                  sport: "Medio fondo (800m)",
                  fiber: "Mix Type I + IIa",
                  energy: "Aeróbico-Anaeróbico",
                  bar: "w-1/2",
                  barColor: "bg-purple-500",
                  desc: "Balance entre potencia y resistencia. Las fibras IIa son las más entrenables y adaptables",
                },
                {
                  sport: "Velocidad (100m)",
                  fiber: "Predominio Type IIx",
                  energy: "Anaeróbico",
                  bar: "w-1/5",
                  barColor: "bg-red-500",
                  desc: "Máxima potencia explosiva en 10 segundos. Alta tasa de fosfato de creatina, fatiga inmediata",
                },
              ].map((item) => (
                <div key={item.sport} className="rounded-xl border border-white/10 bg-white/4 p-4 space-y-3">
                  <div>
                    <p className="text-sm font-bold text-white">{item.sport}</p>
                    <p className="text-xs text-white/40">{item.fiber} · {item.energy}</p>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${item.bar} ${item.barColor} rounded-full`} />
                  </div>
                  <p className="text-xs text-white/45 leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>
          ),
        },
      ]}
    />
  );
}

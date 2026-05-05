import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S6C2_Block6Cierre() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "cierre-s6c2",
          bg: "from-[#0a0020] to-[#1a0005]",
          badge: "Semana 6 · Clase 2 · Cierre",
          badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
          centered: true,
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight text-center">
              "La educación no es el aprendizaje{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-purple-400">
                de hechos
              </span>
              , sino el entrenamiento de la mente para pensar."
            </h2>
          ),
          subtitle: <p className="text-center text-white/40 text-base">— Albert Einstein</p>,
          body: (
            <div className="flex flex-col items-center gap-6 mt-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl">
                {[
                  { icon: "🦴", label: "Fuerza muscular", sub: "Definición y sistemas" },
                  { icon: "🧬", label: "Fibras Type I/IIa/IIx", sub: "Características y deporte" },
                  { icon: "📊", label: "Z-score fibras", sub: "Distribución poblacional" },
                  { icon: "⚖️", label: "Dinamometría", sub: "Jamar, Biodex" },
                  { icon: "🟦", label: "Plataforma de fuerza", sub: "6 canales Kistler" },
                  { icon: "🤚", label: "Evaluación funcional", sub: "MMT y tests prácticos" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/10 bg-white/4 p-3 text-center">
                    <div className="text-2xl mb-1.5">{item.icon}</div>
                    <p className="text-xs font-semibold text-white">{item.label}</p>
                    <p className="text-[10px] text-white/35 mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-purple-500/20 bg-purple-500/8 px-6 py-4 max-w-lg text-center">
                <p className="text-sm text-purple-300/80 leading-relaxed">
                  Ahora que entiendes <strong className="text-purple-300">qué es la fuerza muscular y cómo se produce</strong>,
                  en la próxima clase verás los instrumentos tecnológicos para medirla con precisión.
                </p>
              </div>
            </div>
          ),
          accentColor: "text-red-400",
        },
      ]}
    />
  );
}

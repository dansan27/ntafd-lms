import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S9C2_Block8Cierre() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "cierre-final",
          bg: "from-[#030f0f] to-[#001a12]",
          badge: "Semana 9 · ECNT",
          badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
          eyebrow: "Conclusiones",
          centered: true,
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.05] tracking-tight">
              Integra la tecnología en tu{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">
                práctica clínica
              </span>
            </h2>
          ),
          subtitle: (
            <p className="text-white/60 max-w-xl mx-auto">
              La tecnología es una{" "}
              <strong className="text-teal-300">aliada del ejercicio en ECNT</strong> — potencia
              su impacto, mejora la adherencia y genera datos para tomar mejores decisiones clínicas.
            </p>
          ),
          body: (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-sm mt-4">
              {[
                { icon: "🫀", label: "HTA — Wearables y telemedicina" },
                { icon: "💉", label: "Diabetes — MCG continuo" },
                { icon: "🏃", label: "Cáncer — Ejercicio supervisado" },
                { icon: "🤖", label: "Futuro — IA y medicina de precisión" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-3 text-center space-y-1"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-white/60 text-xs leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          ),
          accentColor: "text-teal-400",
        },
      ]}
    />
  );
}

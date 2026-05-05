import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S6C2_Block1Gancho() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "gancho-fibras",
          bg: "from-[#0d0520] to-[#1a0a35]",
          badge: "Semana 6 · Clase 2",
          badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
          eyebrow: "El Gancho",
          centered: true,
          title: (
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight text-center">
              ¿Qué formas tenemos de{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                medir la fuerza
              </span>{" "}
              muscular?
            </h2>
          ),
          subtitle: (
            <p className="text-center">
              Antes de medir, hay que entender. ¿Qué <em>es</em> la fuerza muscular?
              ¿Qué sistemas del cuerpo la producen? ¿Qué tipo de fibra la genera?
            </p>
          ),
          body: (
            <div className="flex flex-col items-center gap-4">
              <div className="grid grid-cols-3 gap-4 mt-4">
                {[
                  { icon: "🦴", label: "Sistema musculoesquelético" },
                  { icon: "⚡", label: "Sistema nervioso" },
                  { icon: "❤️", label: "Sistema cardiovascular" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-purple-500/20 bg-purple-500/8 p-4 text-center"
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="text-xs text-purple-300/70">{item.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/25 uppercase tracking-widest mt-2">
                Tres sistemas, una contracción
              </p>
            </div>
          ),
          accentColor: "text-purple-400",
        },
      ]}
    />
  );
}

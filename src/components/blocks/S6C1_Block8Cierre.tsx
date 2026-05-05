import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S6C1_Block8Cierre() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "cierre-s6c1",
          bg: "from-[#1a0000] to-[#0d0505]",
          badge: "Semana 6 · Cierre",
          badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
          eyebrow: "Síntesis",
          centered: true,
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight text-center">
              Hoy aprendiste a{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">
                cuantificar la fuerza
              </span>
            </h2>
          ),
          subtitle: (
            <p className="text-center">
              Cuatro instrumentos, un objetivo: convertir el esfuerzo muscular en datos
              reproducibles, válidos y accionables.
            </p>
          ),
          body: (
            <div className="space-y-6 flex flex-col items-center">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2 w-full max-w-2xl">
                {[
                  { icon: "⚖️", label: "Celda de Carga", sub: "Galga extensométrica" },
                  { icon: "🦾", label: "Dinamómetro", sub: "Isométrico / isocinético" },
                  { icon: "🟦", label: "Plataforma", sub: "6 canales Kistler" },
                  { icon: "⚡", label: "EMG", sub: "Activación eléctrica" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 text-center"
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-[11px] text-white/40 mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-6 py-4 max-w-lg text-center">
                <p className="text-sm text-red-300/80 leading-relaxed">
                  <strong className="text-red-300">Para la próxima clase:</strong> piensa en
                  un ejercicio de tu deporte y qué sensor usarías para analizar la fuerza
                  involucrada. Ven preparado para justificarlo.
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

import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S6C1_Block7Reflexion() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "reflexion-fuerza",
          bg: "from-[#0d0515] to-[#1a0a2e]",
          badge: "Reflexión",
          badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
          eyebrow: "Más allá de los instrumentos",
          centered: true,
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight text-center">
              ¿Qué otra forma hay de medir la{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                fuerza en un atleta
              </span>
              ?
            </h2>
          ),
          subtitle: (
            <p className="text-center">
              Galgas, plataformas y EMG miden la fuerza <em>externa</em> o la activación
              eléctrica. Pero… ¿cómo sabemos cuánta fuerza produce realmente el tendón?
              ¿O el hueso? ¿O la articulación?
            </p>
          ),
          body: (
            <div className="space-y-4 text-center">
              <p className="text-white/40 text-sm">
                Reflexiona antes de continuar. Piensa en al menos un método — cualquier
                método, tecnológico o no — para cuantificar la fuerza muscular que aún
                no hemos visto en clase.
              </p>
              <div className="flex flex-col gap-3 items-center mt-6">
                {[
                  "Ultrasonografía de tendón en carga dinámica",
                  "Acelerometría inercial (IMU) + modelos biomecánicos",
                  "Sistemas de mocap + dinámica inversa (OpenSim)",
                ].map((hint, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-purple-500/20 bg-purple-500/8 px-5 py-3 max-w-sm text-sm text-purple-200/70 text-center"
                  >
                    {hint}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-white/20 mt-4 uppercase tracking-widest">
                Pistas — hay muchas más respuestas válidas
              </p>
            </div>
          ),
          accentColor: "text-purple-400",
        },
      ]}
    />
  );
}

import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S10C1_Block1Gancho() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "gancho-imu",
          bg: "from-[#070718] to-[#0a0a2e]",
          badge: "Semana 10 · Sensores",
          badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
          eyebrow: "El Gancho",
          title: (
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              ¿Cómo sabe tu{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                smartphone
              </span>{" "}
              cuándo girar la pantalla?
            </h2>
          ),
          subtitle: (
            <p>
              Un diminuto chip de silicio —{" "}
              <strong className="text-blue-300">el acelerómetro</strong> —
              detecta la orientación del dispositivo en tiempo real. Esa misma
              tecnología, combinada con giroscopios y magnetómetros, forma las{" "}
              <em>IMUs</em> que analizan el movimiento humano en el deporte de
              élite.
            </p>
          ),
          body: (
            <div className="space-y-3 text-white/50 text-base">
              <p>
                Hoy veremos cómo los sensores cinemáticos — IMUs,
                potenciómetros y encoders — capturan el movimiento articular,
                la velocidad angular y la aceleración para transformar el
                entrenamiento deportivo.
              </p>
              <p className="text-blue-400/70 font-medium">
                Del teléfono de tu bolsillo al laboratorio biomecánico de
                élite.
              </p>
            </div>
          ),
          accentColor: "text-blue-400",
        },
      ]}
    />
  );
}

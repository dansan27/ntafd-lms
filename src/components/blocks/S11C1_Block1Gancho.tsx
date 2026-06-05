import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S11C1_Block1Gancho() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "gancho-encoders",
          bg: "from-[#070718] to-[#0d0a2e]",
          badge: "Semana 11 · Sensores Cinemáticos",
          badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
          eyebrow: "El Gancho",
          title: (
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              ¿Qué tienen en común un{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">
                ascensor, un robot industrial
              </span>{" "}
              y un ciclómetro deportivo?
            </h2>
          ),
          subtitle: (
            <p>
              Todos usan <strong className="text-violet-300">encoders</strong> — sensores
              que convierten movimiento mecánico en señal eléctrica para conocer posición,
              velocidad y dirección en tiempo real.
            </p>
          ),
          body: (
            <div className="space-y-3 text-white/50 text-base">
              <p>
                En el deporte, los encoders están en ergómetros, sistemas de análisis
                de marcha y máquinas isocinéticas. Hoy aprenderemos cómo funcionan,
                sus tecnologías, tipos y métodos de medición:{" "}
                <strong className="text-violet-300">absolutos e incrementales</strong>.
              </p>
              <p className="text-violet-400/70 font-medium">
                Del pulso eléctrico al dato de rendimiento deportivo.
              </p>
            </div>
          ),
          accentColor: "text-violet-400",
        },
      ]}
    />
  );
}

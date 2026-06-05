import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S11C2_Block1Gancho() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "gancho-potencia",
          bg: "from-[#070718] to-[#0a1a18]",
          badge: "Semana 11 · Potencia Muscular",
          badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          eyebrow: "El Gancho",
          title: (
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              Usain Bolt no solo corre{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                rápido
              </span>{" "}
              — genera más de 2600 W en los primeros pasos
            </h2>
          ),
          subtitle: (
            <p>
              La{" "}
              <strong className="text-emerald-300">potencia muscular</strong> es la
              combinación de fuerza y velocidad que define el rendimiento en saltos,
              sprints y lanzamientos. Medirla requiere tecnología capaz de capturar
              fuerzas y velocidades en milisegundos.
            </p>
          ),
          body: (
            <div className="space-y-3 text-white/50 text-base">
              <p>
                Hoy exploraremos los fundamentos físicos de la potencia, la fisiología
                que la determina y las{" "}
                <strong className="text-emerald-300">tecnologías de valoración</strong>:
                plataformas de fuerza, captura de movimiento, dinamómetros isocinéticos
                y dispositivos inerciales.
              </p>
              <p className="text-emerald-400/70 font-medium">
                De la fibra muscular al dato de rendimiento: tecnología para entender la potencia.
              </p>
            </div>
          ),
          accentColor: "text-emerald-400",
        },
      ]}
    />
  );
}

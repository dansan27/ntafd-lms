import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S12C1_Block1Gancho() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "gancho-velocidad-agilidad",
          bg: "from-[#070718] to-[#1a0e00]",
          badge: "Semana 12 · Velocidad y Agilidad",
          badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
          eyebrow: "El Gancho",
          title: (
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              Un defensa tiene{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400">
                menos de 0.3 segundos
              </span>{" "}
              para reaccionar y cambiar de dirección
            </h2>
          ),
          subtitle: (
            <p>
              La{" "}
              <strong className="text-orange-300">velocidad y la agilidad</strong> son
              capacidades físicas determinantes en la mayoría de los deportes colectivos e
              individuales. Medirlas con precisión exige tecnología capaz de capturar
              movimientos en milisegundos.
            </p>
          ),
          body: (
            <div className="space-y-3 text-white/50 text-base">
              <p>
                Hoy exploraremos los fundamentos de la velocidad lineal y angular, los
                componentes de la agilidad y las{" "}
                <strong className="text-orange-300">tecnologías de valoración</strong>:
                sistemas de captura 3D, plataformas de fuerza, IMUs y fotocélulas.
              </p>
              <p className="text-orange-400/70 font-medium">
                Del gesto deportivo al dato de rendimiento: tecnología para entender la velocidad y la agilidad.
              </p>
            </div>
          ),
          accentColor: "text-orange-400",
        },
      ]}
    />
  );
}

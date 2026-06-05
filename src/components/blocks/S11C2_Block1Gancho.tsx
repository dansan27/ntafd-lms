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
              ¿Cuánta potencia genera un{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                salto vertical
              </span>{" "}
              de élite?
            </h2>
          ),
          subtitle: (
            <p>
              Un saltador de élite genera más de{" "}
              <strong className="text-emerald-300">4000 W</strong> de potencia pico
              en los primeros 200 ms del impulso. Medir esa explosividad requiere
              tecnología capaz de capturar fuerzas y velocidades en milisegundos.
            </p>
          ),
          body: (
            <div className="space-y-3 text-white/50 text-base">
              <p>
                Las plataformas de fuerza, transductores lineales y la tensiomiografía
                son las herramientas que permiten cuantificar,{" "}
                <strong className="text-emerald-300">comparar y optimizar</strong> la
                producción de potencia muscular en el deporte de alta competición.
              </p>
              <p className="text-emerald-400/70 font-medium">
                De la célula de carga al perfil neuromuscular: tecnología para entender la potencia.
              </p>
            </div>
          ),
          accentColor: "text-emerald-400",
        },
      ]}
    />
  );
}

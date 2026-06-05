import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S11C1_Block1Gancho() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "gancho-vbt",
          bg: "from-[#070718] to-[#0d0a2e]",
          badge: "Semana 11 · VBT",
          badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
          eyebrow: "El Gancho",
          title: (
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              ¿Por qué el{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-400">
                80% de tu 1RM
              </span>{" "}
              hoy no es igual al de mañana?
            </h2>
          ),
          subtitle: (
            <p>
              El porcentaje de carga es un número fijo, pero tu{" "}
              <strong className="text-violet-300">capacidad de producir velocidad</strong>{" "}
              varía cada día con el nivel de fatiga, el sueño y el estado neuromuscular.
              Los <em>transductores de velocidad</em> lo miden en tiempo real.
            </p>
          ),
          body: (
            <div className="space-y-3 text-white/50 text-base">
              <p>
                El Entrenamiento Basado en Velocidad (VBT) reemplaza los porcentajes
                fijos por la <strong className="text-violet-300">velocidad real de la barra</strong> como
                indicador de intensidad y fatiga, permitiendo autorregular la sesión al instante.
              </p>
              <p className="text-violet-400/70 font-medium">
                Del encoder rotativo al laboratorio de fuerza en campo: tecnología al servicio de la potencia.
              </p>
            </div>
          ),
          accentColor: "text-violet-400",
        },
      ]}
    />
  );
}

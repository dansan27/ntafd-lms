import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S6C1_Block1Gancho() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "gancho-pregunta",
          bg: "from-[#0a0a0a] to-[#1a0a00]",
          badge: "Semana 6 · Fuerza Muscular",
          badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
          eyebrow: "El Gancho",
          title: (
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              ¿Cuánto{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
                fuerza
              </span>{" "}
              genera un atleta de élite?
            </h2>
          ),
          subtitle: (
            <p>
              Un saltador de longitud aplica más de{" "}
              <strong className="text-orange-300">3 veces su peso corporal</strong> en el
              momento del despegue. Pero durante décadas, esa fuerza era invisible: solo
              podíamos <em>verla</em>, nunca <em>medirla</em>.
            </p>
          ),
          body: (
            <div className="space-y-3 text-white/50 text-base">
              <p>
                Hoy los sensores convierten cada Newton en datos. La pregunta ya no es
                «¿cuánta fuerza tienes?» sino «¿cómo la distribuyes, en qué eje y en
                cuántos milisegundos?»
              </p>
              <p className="text-orange-400/70 font-medium">
                La fuerza muscular tiene, por fin, un número exacto.
              </p>
            </div>
          ),
          accentColor: "text-orange-400",
        },
      ]}
    />
  );
}

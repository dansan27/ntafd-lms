import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S9C2_Block1Gancho() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "gancho-diabetes",
          bg: "from-[#030f0f] to-[#001a12]",
          badge: "Semana 9 · ECNT",
          badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
          eyebrow: "El Gancho",
          title: (
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              ¿Puede el{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">
                ejercicio
              </span>{" "}
              controlar la glucosa mejor que la medicación?
            </h2>
          ),
          subtitle: (
            <p>
              En diabetes tipo 2, una sola sesión de ejercicio moderado puede reducir la glucemia
              hasta en un{" "}
              <strong className="text-teal-300">20–30 mg/dL</strong> durante las siguientes
              24 horas. Pero sin tecnología de monitoreo, el paciente no lo sabe —
              y tampoco puede ajustar su dosis de insulina de forma segura.
            </p>
          ),
          body: (
            <div className="space-y-3 text-white/50 text-base">
              <p>
                Hoy exploraremos los dispositivos de Monitoreo Continuo de Glucosa (MCG),
                la tecnología aplicada al cáncer y las tendencias que marcarán la próxima
                década en salud digital.
              </p>
              <p className="text-teal-400/70 font-medium">
                El ejercicio es medicina — y la tecnología es el estetoscopio digital.
              </p>
            </div>
          ),
          accentColor: "text-teal-400",
        },
      ]}
    />
  );
}

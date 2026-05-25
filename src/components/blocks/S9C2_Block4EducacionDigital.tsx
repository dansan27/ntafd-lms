import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S9C2_Block4EducacionDigital() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "educacion-digital",
          bg: "from-[#030f0f] to-[#001a12]",
          badge: "Semana 9 · ECNT",
          badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
          eyebrow: "Educación Digital en Diabetes",
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.05] tracking-tight">
              Más allá del sensor:{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">
                educación y comunidad
              </span>
            </h2>
          ),
          subtitle: (
            <p>
              El MCG da datos, pero el paciente necesita{" "}
              <strong className="text-teal-300">contexto, educación y apoyo</strong> para
              interpretarlos y actuar. Las plataformas digitales cubren esa brecha.
            </p>
          ),
          body: (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mt-2">
              {[
                {
                  icon: "📚",
                  title: "Plataformas educativas",
                  desc: "Cursos en línea y webinars sobre manejo de diabetes y ejercicio seguro. Ej: diabetes.org",
                },
                {
                  icon: "👥",
                  title: "Comunidades virtuales",
                  desc: "Foros y grupos de apoyo entre pacientes. Intercambio de experiencias y estrategias.",
                },
                {
                  icon: "🧑‍⚕️",
                  title: "Coaching personalizado",
                  desc: "Asesoramiento de profesionales vía apps o plataformas con seguimiento y motivación.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4 space-y-2"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <p className="font-semibold text-white/80">{item.title}</p>
                  <p className="text-white/40">{item.desc}</p>
                </div>
              ))}
            </div>
          ),
          accentColor: "text-teal-400",
        },
      ]}
    />
  );
}

import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S9C1_Block3TecnologiaSalud() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "tecnologia-salud",
          bg: "from-[#030f0f] to-[#001a12]",
          badge: "Semana 9 · ECNT",
          badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
          eyebrow: "Rol de la Tecnología en Salud",
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.05] tracking-tight">
              De dispositivos básicos a{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">
                sistemas integrados
              </span>
            </h2>
          ),
          subtitle: (
            <p>
              La evolución tecnológica en salud ha pasado de termómetros y tensiómetros manuales
              a ecosistemas conectados que monitorean al paciente{" "}
              <strong className="text-teal-300">las 24 horas del día, en tiempo real</strong>.
            </p>
          ),
          body: (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mt-2">
              {[
                {
                  icon: "🔍",
                  title: "Prevención y detección temprana",
                  desc: "Identificar factores de riesgo antes de que se conviertan en enfermedad.",
                },
                {
                  icon: "📡",
                  title: "Monitoreo continuo",
                  desc: "Datos en tiempo real de glucosa, presión arterial, frecuencia cardíaca y más.",
                },
                {
                  icon: "💊",
                  title: "Adherencia al tratamiento",
                  desc: "Apps y recordatorios digitales que mejoran el seguimiento del paciente.",
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

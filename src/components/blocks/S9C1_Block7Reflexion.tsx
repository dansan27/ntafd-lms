import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S9C1_Block7Reflexion() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "reflexion-hta",
          bg: "from-[#030f0f] to-[#001a12]",
          badge: "Semana 9 · ECNT",
          badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
          eyebrow: "Reflexión",
          centered: true,
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight">
              ¿Qué tecnología elegirías{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">
                para tu paciente?
              </span>
            </h2>
          ),
          subtitle: (
            <p className="text-lg text-white/60 max-w-xl mx-auto">
              Tu paciente tiene 52 años, HTA estadio 1, trabaja sentado 8 horas al día y
              no practica actividad física regular. Tiene smartphone pero poca experiencia
              tecnológica.
            </p>
          ),
          body: (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-sm mt-4">
              {[
                { icon: "⌚", label: "Smartwatch con monitor de FC y PA" },
                { icon: "📱", label: "App de seguimiento de pasos y calorías" },
                { icon: "🩺", label: "Consulta de telemedicina semanal" },
                { icon: "🏥", label: "Tensiómetro digital con Bluetooth" },
              ].map((opt) => (
                <div
                  key={opt.label}
                  className="rounded-xl border border-white/10 bg-white/4 p-4 flex items-center gap-3"
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-white/70 font-medium">{opt.label}</span>
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

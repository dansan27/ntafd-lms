import { Layers, Smartphone, Activity, Lightbulb } from "lucide-react";
import DashboardBlock from "@/components/layout/DashboardBlock";

export default function S9C2_Block6RVRehabilitacion() {
  return (
    <DashboardBlock
      title="Realidad Virtual en Rehabilitación"
      subtitle="Entornos virtuales interactivos que transforman el ejercicio terapéutico en una experiencia motivadora."
      accentColor="from-teal-500 to-cyan-500"
      headerIcon={<Layers size={22} className="text-teal-300" />}
      sections={[
        {
          id: "plataformas-rv",
          title: "Plataformas y Sistemas",
          icon: <Layers size={14} className="text-teal-400" />,
          metrics: [
            {
              label: "VR Health",
              value: "Fitness en RV",
              icon: <Activity size={16} />,
              color: "from-teal-500/20 to-cyan-500/10 border-teal-500/30",
              textColor: "text-teal-400",
              description: "Juegos de movimiento que queman calorías y mejoran coordinación. Compatible con Meta Quest.",
            },
            {
              label: "Karuna VR",
              value: "Dolor crónico",
              icon: <Smartphone size={16} />,
              color: "from-cyan-500/20 to-teal-500/10 border-cyan-500/30",
              textColor: "text-cyan-400",
              description: "Terapia de exposición gradual para pacientes con dolor crónico y rehabilitación post-cáncer.",
            },
            {
              label: "ViviSports / ExerGame",
              value: "Adherencia +40%",
              icon: <Lightbulb size={16} />,
              color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
              textColor: "text-emerald-400",
              description: "Estudios muestran que la gamificación en RV aumenta la adherencia al ejercicio terapéutico.",
            },
          ],
        },
        {
          id: "ventajas-rv",
          title: "Ventajas de la RV en ECNT",
          icon: <Activity size={14} className="text-teal-400" />,
          tabs: [
            {
              label: "Para el paciente",
              content: (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Motivación", value: "Inmersión + gamificación" },
                      { label: "Distracción del dolor", value: "Reducción percibida 30%" },
                      { label: "Accesibilidad", value: "Desde el hogar" },
                      { label: "Feedback", value: "Visual en tiempo real" },
                    ].map((i) => (
                      <div key={i.label} className="rounded-lg border border-white/10 bg-white/4 p-3">
                        <p className="text-[11px] text-white/40 uppercase tracking-widest">{i.label}</p>
                        <p className="text-sm text-white/80 font-medium mt-0.5">{i.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            },
            {
              label: "Para el profesional",
              content: (
                <div className="space-y-3">
                  <p className="text-sm text-white/60">
                    El profesional puede programar sesiones, monitorear el esfuerzo en tiempo
                    real y ajustar la dificultad de forma remota.
                  </p>
                  <div className="rounded-xl border border-teal-500/25 bg-teal-500/8 px-4 py-3">
                    <p className="text-sm text-teal-300">
                      ✓ Ideal para oncología: el paciente realiza ejercicio en casa durante
                      ciclos de quimioterapia cuando no puede acudir al gimnasio.
                    </p>
                  </div>
                </div>
              ),
            },
          ],
          callout: {
            type: "info",
            text: "La RV es especialmente valiosa en pacientes oncológicos durante tratamientos activos, donde la fatiga y la neutropenia limitan la asistencia a centros de ejercicio presenciales.",
          },
        },
      ]}
    />
  );
}

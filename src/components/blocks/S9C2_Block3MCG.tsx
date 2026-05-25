import { Cpu, Activity, BarChart2, Wifi } from "lucide-react";
import DashboardBlock from "@/components/layout/DashboardBlock";

export default function S9C2_Block3MCG() {
  return (
    <DashboardBlock
      title="Monitoreo Continuo de Glucosa (MCG)"
      subtitle="Sensores subcutáneos que miden glucosa intersticial cada 1–5 minutos, sin pinchazos."
      accentColor="from-teal-500 to-cyan-500"
      headerIcon={<Cpu size={22} className="text-teal-300" />}
      sections={[
        {
          id: "dispositivos-mcg",
          title: "Dispositivos MCG líderes",
          icon: <Cpu size={14} className="text-teal-400" />,
          metrics: [
            {
              label: "FreeStyle Libre (Abbott)",
              value: "Sensor 14 días",
              icon: <Cpu size={16} />,
              color: "from-teal-500/20 to-cyan-500/10 border-teal-500/30",
              textColor: "text-teal-400",
              description: "Escaneo con smartphone — sin alertas automáticas en versión básica. Precio accesible.",
            },
            {
              label: "Dexcom G7",
              value: "Sensor 10 días",
              icon: <Activity size={16} />,
              color: "from-cyan-500/20 to-teal-500/10 border-cyan-500/30",
              textColor: "text-cyan-400",
              description: "Alertas en tiempo real, integración con insulin pumps y Apple Watch. Gold standard clínico.",
            },
            {
              label: "Precisión MARD",
              value: "< 9%",
              icon: <BarChart2 size={16} />,
              color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
              textColor: "text-emerald-400",
              description: "Mean Absolute Relative Difference — ambos dispositivos clasificados como precisión clínica.",
            },
          ],
        },
        {
          id: "ejercicio-mcg",
          title: "Integración con Ejercicio",
          icon: <Wifi size={14} className="text-teal-400" />,
          table: {
            headers: ["Situación", "Lectura MCG", "Acción recomendada"],
            rows: [
              ["Pre-ejercicio", "< 90 mg/dL", "Ingerir 15–20 g de carbohidratos antes de comenzar"],
              ["Pre-ejercicio", "90–250 mg/dL", "Zona segura — iniciar actividad normalmente"],
              ["Pre-ejercicio", "> 250 mg/dL", "Posponer ejercicio; verificar cetonas"],
              ["Durante", "↓ rápida (>2 mg/dL/min)", "Reducir intensidad; ingerir carbohidratos de acción rápida"],
              ["Post-ejercicio", "< 100 mg/dL", "Riesgo de hipoglucemia tardía — monitorear 4–8 h"],
            ],
            highlight: 2,
          },
          callout: {
            type: "clinical",
            text: "El MCG permite ajustar la intensidad del ejercicio según los niveles de glucosa en tiempo real — previniendo hipoglucemias peligrosas durante la actividad física en pacientes con diabetes tipo 1 y 2.",
          },
        },
      ]}
    />
  );
}

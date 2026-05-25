import { Smartphone, Activity, BarChart2, Wifi } from "lucide-react";
import DashboardBlock from "@/components/layout/DashboardBlock";

export default function S9C1_Block5Wearables() {
  return (
    <DashboardBlock
      title="Apps Móviles y Wearables"
      subtitle="Herramientas digitales para el monitoreo y la motivación en HTA y obesidad."
      accentColor="from-teal-500 to-cyan-500"
      headerIcon={<Smartphone size={22} className="text-teal-300" />}
      sections={[
        {
          id: "apps",
          title: "Apps de Actividad Física",
          icon: <Activity size={14} className="text-teal-400" />,
          metrics: [
            {
              label: "MyFitnessPal",
              value: "Nutrición + ejercicio",
              icon: <Activity size={16} />,
              color: "from-teal-500/20 to-cyan-500/10 border-teal-500/30",
              textColor: "text-teal-400",
              description: "Registro de calorías, macros y actividad diaria. +200M usuarios.",
            },
            {
              label: "Runtastic",
              value: "Cardio y running",
              icon: <BarChart2 size={16} />,
              color: "from-cyan-500/20 to-teal-500/10 border-cyan-500/30",
              textColor: "text-cyan-400",
              description: "GPS, ritmo, distancia y planes de entrenamiento personalizados.",
            },
            {
              label: "Google Fit / Apple Health",
              value: "Hub central",
              icon: <Wifi size={16} />,
              color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
              textColor: "text-emerald-400",
              description: "Integra datos de múltiples sensores y apps en un solo perfil de salud.",
            },
          ],
        },
        {
          id: "wearables",
          title: "Dispositivos Wearables",
          icon: <Smartphone size={14} className="text-teal-400" />,
          table: {
            headers: ["Dispositivo", "Métricas clave", "Ventaja para ECNT"],
            rows: [
              ["Apple Watch Series 9", "FC, SpO₂, ECG, PA estimada", "Alerta de FA; integra con registros médicos"],
              ["Fitbit Charge 6", "Pasos, sueño, FC en reposo", "Reto de pasos diarios — ideal para sedentarios"],
              ["Garmin Vívosmart 5", "Estrés (HRV), FC, calorías", "Monitoreo de variabilidad de FC 24/7"],
              ["Omron HeartGuide", "Presión arterial en muñeca", "Único wearable con PA clínicamente validada"],
            ],
            highlight: 2,
          },
          callout: {
            type: "tip",
            text: "Los wearables ofrecen retroalimentación en tiempo real y establecimiento de metas — dos factores clave para mejorar la adherencia al ejercicio en pacientes con HTA y obesidad.",
          },
        },
      ]}
    />
  );
}

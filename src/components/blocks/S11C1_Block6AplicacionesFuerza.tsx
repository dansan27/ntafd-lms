import DashboardBlock from "@/components/layout/DashboardBlock";
import { Activity } from "lucide-react";

export default function S11C1_Block6AplicacionesFuerza() {
  return (
    <DashboardBlock
      title="Aplicaciones del VBT en el Entrenamiento de Potencia"
      subtitle="Monitoreo en tiempo real, control de fatiga y periodización basada en velocidad."
      accentColor="from-violet-500 to-cyan-500"
      headerIcon={<Activity size={22} className="text-violet-300" />}
      sections={[
        {
          id: "aplicaciones-practicas",
          title: "Casos de Uso en Entrenamiento Deportivo",
          table: {
            headers: ["Aplicación", "Variable VBT", "Objetivo", "Deporte ejemplo"],
            rows: [
              ["Estimación 1RM diaria", "V a 2–3 cargas submáximas", "Ajuste diario de cargas", "Halterofilia, powerlifting"],
              ["Control de fatiga intra-set", "% pérdida velocidad", "Detener set en umbral 20%", "Fútbol, rugby, atletismo"],
              ["Seguimiento de rendimiento", "Tendencia VMP semanal", "Detectar sobreentrenamiento", "Todos los deportes de fuerza"],
              ["Potenciación post-activación (PAP)", "VMP pre/post", "Verificar efecto de potenciación", "Salto, sprint, lanzamiento"],
            ],
          },
        },
        {
          id: "protocolos-vbt",
          title: "Protocolos de Autorregulación con VBT",
          metrics: [
            {
              label: "Por velocidad objetivo",
              value: "0.60",
              unit: "m/s target",
              color: "from-violet-500/20 to-violet-600/10",
              textColor: "text-violet-300",
              description: "Prescribir carga que permita alcanzar la zona deseada · ajustar según VMP real del día",
            },
            {
              label: "Por pérdida de velocidad",
              value: "20%",
              unit: "límite set",
              color: "from-purple-500/20 to-purple-600/10",
              textColor: "text-purple-300",
              description: "Detener serie cuando la VMP cae >20% respecto a la primera repetición · controla hipertrofia vs potencia",
            },
            {
              label: "Por velocidad mínima",
              value: "MVT",
              unit: "umbral rep",
              color: "from-fuchsia-500/20 to-fuchsia-600/10",
              textColor: "text-fuchsia-300",
              description: "Cada ejercicio tiene una velocidad mínima de la última repetición posible · correlaciona con % 1RM real",
            },
          ],
          callout: {
            type: "info",
            text: "La velocidad mínima de la sentadilla paralela es ~0.17 m/s; press de banca ~0.15 m/s. Estas velocidades corresponden al 100% del 1RM y son constantes entre sesiones para el mismo atleta (González-Badillo, 2017).",
          },
        },
      ]}
    />
  );
}

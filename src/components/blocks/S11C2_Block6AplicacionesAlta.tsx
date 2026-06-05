import DashboardBlock from "@/components/layout/DashboardBlock";
import { Rocket } from "lucide-react";

export default function S11C2_Block6AplicacionesAlta() {
  return (
    <DashboardBlock
      title="Aplicaciones en Deporte de Alta Competición"
      subtitle="Integración de plataformas de fuerza, VBT y TMG en el ciclo de rendimiento deportivo."
      accentColor="from-emerald-500 to-cyan-500"
      headerIcon={<Rocket size={22} className="text-emerald-300" />}
      sections={[
        {
          id: "pipeline-evaluacion",
          title: "Pipeline de Valoración de Potencia en Élite",
          metrics: [
            {
              label: "Pretemporada",
              value: "Perfil F-V",
              unit: "baseline",
              color: "from-emerald-500/20 to-emerald-600/10",
              textColor: "text-emerald-300",
              description: "CMJ seriado + LPT en sentadilla → construir perfil F-V individual · identificar déficits → plan de entrenamiento",
            },
            {
              label: "Temporada",
              value: "Monitoreo",
              unit: "semanal",
              color: "from-cyan-500/20 to-cyan-600/10",
              textColor: "text-cyan-300",
              description: "CMJ lunes en calentamiento → índice de fatiga respecto al baseline · ajustar carga del microciclo",
            },
            {
              label: "Readiness",
              value: "Diario",
              unit: "pre-entrenamiento",
              color: "from-teal-500/20 to-teal-600/10",
              textColor: "text-teal-300",
              description: "CMJ de 3 repeticiones antes del calentamiento · % sobre baseline personal → decisión de carga del día",
            },
          ],
        },
        {
          id: "casos-reales",
          title: "Protocolos en Equipos Profesionales",
          table: {
            headers: ["Deporte", "Herramienta", "Protocolo", "Umbral de acción"],
            rows: [
              ["Fútbol profesional", "ForceDecks (strain gauge)", "CMJ bilateral × 3 cada lunes", "<95% baseline → carga reducida"],
              ["Baloncesto NBA", "GymAware + VBT", "VMP en sentadilla + CMJ", "VMP <−5% → día de recuperación activa"],
              ["Atletismo (saltos)", "Plataforma piezoeléctrica", "Perfil CMJ/SJ mensual", "CEA < 10% → trabajo pliométrico"],
              ["Rugby Premiership", "PUSH Band + TMG", "VBT martes + TMG isquios viernes", "Asimetría >10% → fisioterapia preventiva"],
            ],
          },
          callout: {
            type: "tip",
            text: "El CMJ simple con plataforma de fuerza es el test con mayor ratio validez/tiempo en el monitoreo del rendimiento. Tarda <30 segundos y predice el estado neuromuscular con alta fiabilidad (Hopkins, 2001).",
          },
        },
      ]}
    />
  );
}

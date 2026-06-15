import DashboardBlock from "@/components/layout/DashboardBlock";
import { BarChart2 } from "lucide-react";

export default function S12C1_Block5EvaluacionAgilidadI() {
  return (
    <DashboardBlock
      title="Evaluación de la Agilidad — Indicadores I"
      subtitle="Fórmulas e indicadores para medir el rendimiento en cambios de dirección y movimientos rápidos."
      accentColor="from-amber-500 to-orange-500"
      headerIcon={<BarChart2 size={22} className="text-amber-300" />}
      sections={[
        {
          id: "tiempo-total",
          title: "Pruebas de Tiempo Total",
          metrics: [
            {
              label: "T-Test",
              value: "9–12 s",
              unit: "élite",
              color: "from-amber-500/20 to-amber-600/10",
              textColor: "text-amber-300",
              description: "Prueba en forma de T con 4 conos · Mide cambios de dirección en 4 ángulos distintos · Fórmula: t_total = t_final − t_inicio",
            },
            {
              label: "Illinois Agility",
              value: "15–17 s",
              unit: "élite",
              color: "from-orange-500/20 to-orange-600/10",
              textColor: "text-orange-300",
              description: "Curso en zigzag 10 m × 5 m · Combina sprint recto con cambios bruscos de dirección · Menor tiempo = mejor agilidad",
            },
            {
              label: "505 Agility Test",
              value: "2.0–2.5 s",
              unit: "vuelta de 5 m",
              color: "from-yellow-500/20 to-yellow-600/10",
              textColor: "text-yellow-300",
              description: "Sprint 10 m + giro de 180° en 5 m · Test específico de cambio de dirección a alta velocidad",
            },
          ],
        },
        {
          id: "indices",
          title: "Índice de Agilidad (AI) y CODT",
          table: {
            headers: ["Indicador", "Fórmula", "Interpretación"],
            rows: [
              [
                "Índice de Agilidad (AI)",
                "AI = t_COD / t_recto",
                "Menor índice = mejor agilidad relativa a carrera en línea recta",
              ],
              [
                "CODT — Cambio de Dirección en el Tiempo",
                "CODT = t_cambio / ángulo (°)",
                "Menor tiempo por grado = mayor habilidad de giro",
              ],
              [
                "Velocidad en Cambio",
                "v_COD = d_parcial / t_parcial",
                "Velocidad media sostenida durante la fase de cambio",
              ],
            ],
          },
        },
        {
          id: "nota",
          title: "Limitaciones de los Tests con Conos",
          callout: {
            type: "tip",
            text: "Los tests de agilidad con recorridos predefinidos (T-Test, Illinois) miden el COD pero NO la agilidad reactiva. Para evaluar agilidad real se requieren protocolos con estímulos visuales o auditivos que obliguen al atleta a tomar decisiones durante la ejecución.",
          },
        },
      ]}
    />
  );
}

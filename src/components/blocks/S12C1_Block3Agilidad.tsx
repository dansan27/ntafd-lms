import DashboardBlock from "@/components/layout/DashboardBlock";
import { Rocket } from "lucide-react";

export default function S12C1_Block3Agilidad() {
  return (
    <DashboardBlock
      title="Agilidad"
      subtitle="Habilidad para cambiar de dirección y posición de manera rápida y controlada en respuesta a estímulos del entorno."
      accentColor="from-amber-500 to-yellow-500"
      headerIcon={<Rocket size={22} className="text-amber-300" />}
      sections={[
        {
          id: "que-es",
          title: "¿Qué es la Agilidad?",
          metrics: [
            {
              label: "Cambio de Dirección",
              value: "COD",
              unit: "físico",
              color: "from-amber-500/20 to-amber-600/10",
              textColor: "text-amber-300",
              description: "Capacidad de cambiar de dirección rápidamente — componente físico medible con tests de campo",
            },
            {
              label: "Percepción y Decisión",
              value: "< 200 ms",
              unit: "cognitivo",
              color: "from-orange-500/20 to-orange-600/10",
              textColor: "text-orange-300",
              description: "Leer el entorno, anticipar y decidir — componente cognitivo que distingue la agilidad real del COD simple",
            },
            {
              label: "Control Postural",
              value: "Equilibrio",
              unit: "biomecánico",
              color: "from-yellow-500/20 to-yellow-600/10",
              textColor: "text-yellow-300",
              description: "Mantener el centro de masa estable durante el cambio de dirección — clave para no perder velocidad",
            },
          ],
        },
        {
          id: "importancia",
          title: "¿Por Qué es Importante?",
          table: {
            headers: ["Deporte", "Acción de Agilidad", "Requisito Clave"],
            rows: [
              ["Fútbol", "Regate y cambio de dirección ante defensor", "Velocidad + decisión < 200 ms"],
              ["Baloncesto", "Corte hacia la canasta al recibir el pase", "Explosividad + coordinación"],
              ["Atletismo", "Carrera con obstáculos — sorteo de vallas", "Ritmo + reajuste de zancada"],
              ["Rugby", "Evasión de tackles en espacio reducido", "Fuerza lateral + aceleración"],
              ["Tenis", "Desplazamiento a la red tras globo del oponente", "Cambio de dirección + anticipación"],
            ],
          },
        },
        {
          id: "componentes",
          title: "Agilidad Reactiva vs Cambio de Dirección",
          callout: {
            type: "info",
            text: "Un atleta puede tener excelente COD (cambio de dirección predefinido) sin ser ágil en situaciones reales de juego. La agilidad reactiva exige percepción del entorno y toma de decisiones en tiempo real — componentes que los tests con conos fijos no evalúan.",
          },
        },
      ]}
    />
  );
}

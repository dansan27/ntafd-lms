import DashboardBlock from "@/components/layout/DashboardBlock";
import { TrendingDown } from "lucide-react";

export default function S11C1_Block4PerfilCargaVelocidad() {
  return (
    <DashboardBlock
      title="Perfil Carga-Velocidad (L-V Profile)"
      subtitle="La relación lineal entre carga y velocidad que define el potencial de fuerza y velocidad de cada atleta."
      accentColor="from-fuchsia-500 to-violet-500"
      headerIcon={<TrendingDown size={22} className="text-fuchsia-300" />}
      sections={[
        {
          id: "construccion-perfil",
          title: "Cómo construir el Perfil L-V",
          metrics: [
            {
              label: "Paso 1",
              value: "3–5",
              unit: "cargas test",
              color: "from-fuchsia-500/20 to-fuchsia-600/10",
              textColor: "text-fuchsia-300",
              description: "Ejecutar 1–3 repeticiones con cargas del 40% al 90% 1RM en días no fatigados",
            },
            {
              label: "Paso 2",
              value: "R²",
              unit: "> 0.95",
              color: "from-violet-500/20 to-violet-600/10",
              textColor: "text-violet-300",
              description: "Ajuste lineal entre %1RM y VMP — correlación esperada muy alta en ejercicios básicos",
            },
            {
              label: "Paso 3",
              value: "V0 / F0",
              unit: "extrapolación",
              color: "from-purple-500/20 to-purple-600/10",
              textColor: "text-purple-300",
              description: "V0 = velocidad teórica a carga 0 · F0 = fuerza teórica a velocidad 0 · definen el perfil",
            },
          ],
        },
        {
          id: "interpretacion-perfil",
          title: "Tipos de Perfil Fuerza-Velocidad",
          table: {
            headers: ["Perfil", "V0 relativo", "F0 relativo", "Tipo de atleta"],
            rows: [
              ["Orientado a Fuerza", "Bajo", "Alto", "Levantadores, lanzadores"],
              ["Equilibrado", "Moderado", "Moderado", "Equipo, polivalentes"],
              ["Orientado a Velocidad", "Alto", "Bajo", "Velocistas, saltadores"],
            ],
          },
          callout: {
            type: "tip",
            text: "El déficit de Fuerza-Velocidad (D F-V) indica si el atleta debe priorizar trabajo de fuerza máxima o de velocidad/potencia para maximizar la potencia pico. Un perfil desequilibrado >50% sugiere enfocarse en el extremo deficitario.",
          },
        },
      ]}
    />
  );
}

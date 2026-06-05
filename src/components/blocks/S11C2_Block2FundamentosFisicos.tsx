import DashboardBlock from "@/components/layout/DashboardBlock";
import { Zap } from "lucide-react";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S11C2_Block2FundamentosFisicos() {
  return (
    <DashboardBlock
      title="Velocidad, Fuerza, Trabajo y Potencia"
      subtitle="Los fundamentos físicos que explican la producción de potencia muscular en el deporte."
      accentColor="from-emerald-500 to-cyan-500"
      headerIcon={<Zap size={22} className="text-emerald-300" />}
      sections={[
        {
          id: "conceptos-fisicos",
          title: "Conceptos Físicos Clave",
          metrics: [
            {
              label: "Velocidad",
              value: "v = d/t",
              unit: "lineal/angular",
              color: "from-emerald-500/20 to-emerald-600/10",
              textColor: "text-emerald-300",
              description: "Lineal: desplazamiento en línea recta (sprint Usain Bolt) · Angular: velocidad de rotación (muñeca en saque de tenis)",
            },
            {
              label: "Fuerza / Torque",
              value: "τ = F × r",
              unit: "lineal/rotacional",
              color: "from-cyan-500/20 to-cyan-600/10",
              textColor: "text-cyan-300",
              description: "Fuerza: impulsa en línea recta (press de banca) · Torque: impulsa rotación (luchador grecoromano usando cadera)",
            },
            {
              label: "Trabajo",
              value: "W = F × d",
              unit: "J (joules)",
              color: "from-teal-500/20 to-teal-600/10",
              textColor: "text-teal-300",
              description: "Lineal: fuerza × distancia (remero en brazada) · Rotacional: torque × ángulo (lanzamiento de béisbol)",
            },
            {
              label: "Potencia",
              value: "P = W/t",
              unit: "W (watts)",
              color: "from-amber-500/20 to-amber-600/10",
              textColor: "text-amber-300",
              description: "Trabajo realizado por unidad de tiempo · P = F × v · cuanto más rápido se realiza el trabajo, mayor la potencia",
            },
          ],
          content: (
            <div className="flex justify-center mt-4">
              <div className="max-w-xl w-full">
                <ZoomableImage
                  src="/images/semana_11/velocidad_torque_deporte.png"
                  alt="Velocidad Lineal y Torque Rotacional en Deporte"
                  className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                />
              </div>
            </div>
          ),
        },
        {
          id: "ejemplos-deportivos",
          title: "Ejemplos por Concepto en el Deporte",
          table: {
            headers: ["Concepto", "Ejemplo lineal", "Ejemplo rotacional"],
            rows: [
              ["Velocidad", "Sprint de Usain Bolt a 10.44 m/s", "Velocidad angular de muñeca en saque de tenis"],
              ["Fuerza/Torque", "Press de banca: fuerza hacia arriba", "Lucha: torque de cadera para derribar oponente"],
              ["Trabajo", "Remo: fuerza × distancia de brazada", "Béisbol: torque de brazo × ángulo de lanzamiento"],
              ["Potencia", "Salto vertical: impulso explosivo", "Gimnasia: potencia rotacional en giro en suelo"],
            ],
          },
        },
      ]}
    />
  );
}

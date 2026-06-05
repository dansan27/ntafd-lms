import DashboardBlock from "@/components/layout/DashboardBlock";
import { Rocket } from "lucide-react";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S11C2_Block3ImportanciaPotencia() {
  return (
    <DashboardBlock
      title="¿Por qué es Importante la Potencia Muscular?"
      subtitle="La capacidad de producir movimientos explosivos y rápidos define el rendimiento en la mayoría de los deportes."
      accentColor="from-cyan-500 to-emerald-500"
      headerIcon={<Rocket size={22} className="text-cyan-300" />}
      sections={[
        {
          id: "elementos-potencia",
          title: "Elementos Clave de la Potencia Deportiva",
          metrics: [
            {
              label: "Velocidad",
              value: "Sprint",
              unit: "y desplazamiento",
              color: "from-cyan-500/20 to-cyan-600/10",
              textColor: "text-cyan-300",
              description: "Los velocistas dependen de la potencia para combinar fuerza y velocidad · mayor potencia = mayor velocidad de carrera",
            },
            {
              label: "Fuerza",
              value: "Base",
              unit: "de la potencia",
              color: "from-emerald-500/20 to-emerald-600/10",
              textColor: "text-emerald-300",
              description: "Sin fuerza adecuada no hay potencia alta. Los halterófilos aplican fuerzas elevadas en el menor tiempo posible",
            },
            {
              label: "Explosividad",
              value: "Máx. fuerza",
              unit: "en mín. tiempo",
              color: "from-amber-500/20 to-amber-600/10",
              textColor: "text-amber-300",
              description: "Capacidad de generar la mayor fuerza en el menor tiempo. Jugadores de básquet necesitan explosividad para saltos verticales",
            },
            {
              label: "Agilidad",
              value: "Cambios",
              unit: "de dirección",
              color: "from-teal-500/20 to-teal-600/10",
              textColor: "text-teal-300",
              description: "Movimientos rápidos y cambios de dirección. Futbolistas requieren alta potencia para mantener velocidad al girar",
            },
          ],
          content: (
            <div className="flex justify-center mt-4">
              <div className="max-w-xl w-full">
                <ZoomableImage
                  src="/images/semana_11/force_plate_jump_analysis.png"
                  alt="Análisis de Salto Vertical — Medición de Potencia"
                  className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                />
              </div>
            </div>
          ),
        },
        {
          id: "ejemplos-potencia",
          title: "Ejemplos de Potencia en Deportes",
          table: {
            headers: ["Deporte / Gesto", "Músculos clave", "Por qué importa la potencia"],
            rows: [
              ["Salto vertical (básquet, voleibol)", "Cuádriceps, glúteos, gemelos", "La potencia de extensión determina la altura alcanzada"],
              ["Sprint (atletismo, fútbol)", "Isquios, glúteos, sóleos", "La potencia en apoyo define la velocidad de carrera"],
              ["Arranque/Cargada (halterofilia)", "Toda la cadena posterior", "La potencia permite mover la barra en el menor tiempo"],
            ],
          },
          callout: {
            type: "info",
            text: "Cuanto mayor sea la potencia que un atleta puede generar, mayor será su capacidad de producir movimientos rápidos y efectivos. La potencia integra fuerza Y velocidad simultáneamente.",
          },
        },
      ]}
    />
  );
}

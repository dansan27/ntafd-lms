import DashboardBlock from "@/components/layout/DashboardBlock";
import { Layers } from "lucide-react";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S11C1_Block3TiposEncoder() {
  return (
    <DashboardBlock
      title="Tipos de Encoder: Lineal y Rotatorio"
      subtitle="La clasificación principal según el tipo de movimiento que detectan."
      accentColor="from-cyan-500 to-violet-500"
      headerIcon={<Layers size={22} className="text-cyan-300" />}
      sections={[
        {
          id: "tipos-principales",
          title: "Encoder Lineal vs Encoder Rotatorio",
          metrics: [
            {
              label: "Encoder Lineal",
              value: "Traslación",
              unit: "movimiento recto",
              color: "from-cyan-500/20 to-cyan-600/10",
              textColor: "text-cyan-300",
              description: "Mide desplazamiento en línea recta (mm, cm) · escala graduada + cabeza lectora · precisión hasta µm en laboratorio",
            },
            {
              label: "Encoder Rotatorio",
              value: "Rotación",
              unit: "movimiento angular",
              color: "from-violet-500/20 to-violet-600/10",
              textColor: "text-violet-300",
              description: "Mide posición y velocidad angular (grados, RPM, rad/s) · disco codificado + sensor · más común en deporte",
            },
          ],
          content: (
            <div className="flex justify-center mt-4">
              <div className="max-w-xl w-full">
                <ZoomableImage
                  src="/images/semana_11/encoder_lineal_vs_rotatorio.png"
                  alt="Encoder Lineal vs Encoder Rotatorio"
                  className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                />
              </div>
            </div>
          ),
        },
        {
          id: "aplicaciones-por-tipo",
          title: "Aplicaciones Deportivas según Tipo",
          table: {
            headers: ["Tipo", "Ejemplo deportivo", "Variable medida", "Equipo"],
            rows: [
              ["Lineal", "Ergo de remo (carro de asiento)", "Velocidad y distancia lineal", "Concept2, Technogym"],
              ["Lineal", "Transductor de hilo (LPT)", "Desplazamiento de barra", "GymAware (cable encoder)"],
              ["Rotatorio", "Cicloergómetro / spinner", "RPM y potencia de pedaleo", "Wattbike, SRM"],
              ["Rotatorio", "Dinamómetro isocinético", "Velocidad angular articular", "Biodex, Kin-Com"],
              ["Rotatorio", "Cinta de correr instrumentada", "Velocidad de banda", "Treadmetrix, HP Cosmos"],
            ],
          },
          callout: {
            type: "tip",
            text: "En ergometría, el encoder rotatorio en la rueda libre del cicloergómetro permite calcular la potencia en tiempo real: P = F × v, donde v se obtiene de la velocidad angular del encoder multiplicada por el radio del piñón.",
          },
        },
      ]}
    />
  );
}

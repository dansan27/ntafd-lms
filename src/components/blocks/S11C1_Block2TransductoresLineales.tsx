import DashboardBlock from "@/components/layout/DashboardBlock";
import { Ruler } from "lucide-react";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S11C1_Block2TransductoresLineales() {
  return (
    <DashboardBlock
      title="Transductores Lineales de Posición (LPT)"
      subtitle="El hilo que convierte el desplazamiento de la barra en velocidad digital."
      accentColor="from-violet-500 to-purple-500"
      headerIcon={<Ruler size={22} className="text-violet-300" />}
      sections={[
        {
          id: "tipos-lpt",
          title: "Tipos y Principio de Funcionamiento",
          metrics: [
            {
              label: "String Encoder",
              value: "±0.1",
              unit: "mm precisión",
              color: "from-violet-500/20 to-violet-600/10",
              textColor: "text-violet-300",
              description: "Hilo inextensible enrollado en bobina potenciométrica · mide desplazamiento lineal · 0–3 m de rango",
            },
            {
              label: "Encoder Rotativo",
              value: "1000",
              unit: "ppr",
              color: "from-purple-500/20 to-purple-600/10",
              textColor: "text-purple-300",
              description: "Convierte rotación en pulsos digitales · cálculo de velocidad por diferenciación · robusto para uso en campo",
            },
            {
              label: "Sensor Inercial",
              value: "200",
              unit: "Hz muestreo",
              color: "from-fuchsia-500/20 to-fuchsia-600/10",
              textColor: "text-fuchsia-300",
              description: "Acelerómetro integrado para estimar desplazamiento · sin cable · mayor error acumulativo",
            },
          ],
          content: (
            <div className="flex justify-center mt-4">
              <div className="max-w-xl w-full">
                <ZoomableImage
                  src="/images/semana_11/linear_position_transducer.png"
                  alt="Transductor Lineal de Posición en Rack de Sentadilla"
                  className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                />
              </div>
            </div>
          ),
        },
        {
          id: "variables-lpt",
          title: "Variables que mide un LPT",
          table: {
            headers: ["Variable", "Fórmula", "Unidad", "Aplicación en VBT"],
            rows: [
              ["Velocidad media", "Δd / Δt", "m/s", "Zona de entrenamiento objetivo"],
              ["Velocidad pico", "max(v(t))", "m/s", "Potencia muscular máxima"],
              ["Desplazamiento", "∫v dt", "m", "ROM de la repetición"],
              ["Potencia media", "F × v̄", "W", "Perfil fuerza-velocidad"],
            ],
          },
          callout: {
            type: "tip",
            text: "La velocidad media propulsiva (VMP) filtra la fase de deceleración voluntaria al final del movimiento y es el indicador más utilizado en VBT para prescribir la carga.",
          },
        },
      ]}
    />
  );
}

import DashboardBlock from "@/components/layout/DashboardBlock";
import { Cpu } from "lucide-react";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S11C1_Block2QueEsEncoder() {
  return (
    <DashboardBlock
      title="¿Qué es un Encoder?"
      subtitle="Un dispositivo sensor que convierte movimiento mecánico en señal eléctrica interpretable por un sistema."
      accentColor="from-violet-500 to-cyan-500"
      headerIcon={<Cpu size={22} className="text-violet-300" />}
      sections={[
        {
          id: "definicion-encoder",
          title: "Definición y Variables que Mide",
          metrics: [
            {
              label: "Posición",
              value: "Dónde",
              unit: "se encuentra",
              color: "from-violet-500/20 to-violet-600/10",
              textColor: "text-violet-300",
              description: "Determina la ubicación exacta del elemento móvil en su recorrido — lineal o angular",
            },
            {
              label: "Velocidad",
              value: "Qué tan",
              unit: "rápido se mueve",
              color: "from-cyan-500/20 to-cyan-600/10",
              textColor: "text-cyan-300",
              description: "Calculada a partir del cambio de posición por unidad de tiempo — fundamental en ergometría",
            },
            {
              label: "Dirección",
              value: "Hacia",
              unit: "dónde va",
              color: "from-indigo-500/20 to-indigo-600/10",
              textColor: "text-indigo-300",
              description: "Detecta sentido de rotación o traslación — importante en máquinas isocinéticas y robots",
            },
            {
              label: "Conteos",
              value: "Cuántos",
              unit: "ciclos/pulsos",
              color: "from-purple-500/20 to-purple-600/10",
              textColor: "text-purple-300",
              description: "Número de pulsos acumulados desde un punto de referencia — base de los encoders incrementales",
            },
          ],
          content: (
            <div className="flex justify-center mt-4">
              <div className="max-w-xl w-full">
                <ZoomableImage
                  src="/images/semana_11/encoder_optico_mecanismo.png"
                  alt="Mecanismo Interno de Encoder Óptico"
                  className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                />
              </div>
            </div>
          ),
        },
        {
          id: "tecnologias-encoder",
          title: "Tecnologías de Encoder",
          table: {
            headers: ["Tecnología", "Principio", "Ventaja", "Uso típico"],
            rows: [
              ["Óptico", "Disco perforado + fotodetector", "Alta resolución y precisión", "Laboratorio biomecánico, CNC"],
              ["Magnético", "Efecto Hall o magnetorresistivo", "Robusto, resistente a suciedad", "Campo deportivo, industria"],
              ["Resistivo (potenciómetro)", "División de voltaje por posición", "Simple y económico", "Goniometría articular"],
              ["Mecánico", "Contactos físicos escalonados", "Muy bajo costo", "Aplicaciones básicas"],
            ],
          },
          callout: {
            type: "info",
            text: "Los encoders ópticos dominan en aplicaciones de alta precisión (laboratorio, equipos isocinéticos) mientras que los magnéticos son preferidos en campo por su robustez ante polvo, humedad y vibración.",
          },
        },
      ]}
    />
  );
}

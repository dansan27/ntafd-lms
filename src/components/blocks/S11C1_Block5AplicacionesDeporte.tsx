import DashboardBlock from "@/components/layout/DashboardBlock";
import { Rocket } from "lucide-react";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S11C1_Block5AplicacionesDeporte() {
  return (
    <DashboardBlock
      title="Aplicaciones de Encoders en el Deporte"
      subtitle="Del laboratorio biomecánico al equipo de campo: encoders en el rendimiento deportivo."
      accentColor="from-cyan-500 to-indigo-500"
      headerIcon={<Rocket size={22} className="text-cyan-300" />}
      sections={[
        {
          id: "aplicaciones-principales",
          title: "Principales Aplicaciones Deportivas",
          table: {
            headers: ["Aplicación", "Tipo de encoder", "Variable obtenida", "Ejemplo real"],
            rows: [
              ["Cicloergómetro", "Rotatorio óptico/magnético", "RPM → Potencia (W)", "Wattbike Atom, Tacx Neo"],
              ["Máquina isocinética", "Rotatorio óptico cuadratura", "Velocidad angular articular (°/s)", "Biodex System 4, Kin-Com"],
              ["Ergo de remo", "Lineal (hilo/cable)", "Velocidad de tracción", "Concept2 RowErg"],
              ["Análisis de marcha", "Rotatorio en articulaciones", "Ángulo de cadera/rodilla/tobillo", "Gaitrite, Vicon"],
              ["Prótesis activa", "Absoluto multi-turn", "Posición articular continua", "Ossur Rheo Knee"],
            ],
          },
          content: (
            <div className="flex justify-center mt-4">
              <div className="max-w-xl w-full">
                <ZoomableImage
                  src="/images/semana_11/linear_position_transducer.png"
                  alt="Transductor de Posición en Aplicación Deportiva"
                  className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                />
              </div>
            </div>
          ),
        },
        {
          id: "encoders-campo",
          title: "Encoders en Análisis de Campo",
          metrics: [
            {
              label: "Sprint y velocidad",
              value: "cm/s",
              unit: "resolución",
              color: "from-cyan-500/20 to-cyan-600/10",
              textColor: "text-cyan-300",
              description: "Encoders en cinta instrumentada o radar + encoder de rueda miden velocidad de carrera con precisión milimétrica",
            },
            {
              label: "Fuerza y potencia",
              value: "W/rev",
              unit: "por ciclo",
              color: "from-indigo-500/20 to-indigo-600/10",
              textColor: "text-indigo-300",
              description: "Encoder + célula de carga en pedal o manivela → potencia instantánea · usado en ciclismo de alto rendimiento",
            },
            {
              label: "Biomecánica gestual",
              value: "360°",
              unit: "cobertura angular",
              color: "from-violet-500/20 to-violet-600/10",
              textColor: "text-violet-300",
              description: "Encoder multivuelta en articulación o segmento → análisis completo del gesto técnico (swing de golf, lanzamiento de disco)",
            },
          ],
          callout: {
            type: "tip",
            text: "En ciclismo de alto rendimiento, el medidor de potencia (power meter) integra un encoder de ángulo de biela + strain gauge en la manivela para calcular potencia en tiempo real con precisión ±1%, datos que el deportista ve en su ciclocomputador.",
          },
        },
      ]}
    />
  );
}

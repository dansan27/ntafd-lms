import DashboardBlock from "@/components/layout/DashboardBlock";
import { Cpu } from "lucide-react";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S11C1_Block5DispositivosVBT() {
  return (
    <DashboardBlock
      title="Dispositivos VBT Comerciales"
      subtitle="Del laboratorio al gym: los encoders y sensores que llevan el VBT al entrenamiento diario."
      accentColor="from-cyan-500 to-violet-500"
      headerIcon={<Cpu size={22} className="text-cyan-300" />}
      sections={[
        {
          id: "dispositivos-mercado",
          title: "Comparativa de Dispositivos Comerciales",
          table: {
            headers: ["Dispositivo", "Tecnología", "Frecuencia", "Característica"],
            rows: [
              ["GymAware", "Encoder lineal (cable)", "50 Hz", "Gold standard clínico · Bluetooth · iOS/Android"],
              ["PUSH Band 2.0", "IMU 9-DOF", "200 Hz", "Wearable muñeca · sin cable · app integrada"],
              ["OpenBarbell", "Encoder lineal", "100 Hz", "Open-source · bajo costo · app iOS"],
              ["BEAST Sensor", "IMU + magnetómetro", "100 Hz", "Clip en barra · análisis post-set"],
              ["Speed4Lifts", "App + video", "60–240 fps", "Sin hardware extra · smartphone con cámara"],
            ],
          },
          content: (
            <div className="flex justify-center mt-4">
              <div className="max-w-xl w-full">
                <ZoomableImage
                  src="/images/semana_11/vbt_device_sensor.png"
                  alt="Dispositivo VBT con Holografía de Velocidad"
                  className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                />
              </div>
            </div>
          ),
        },
        {
          id: "validez-dispositivos",
          title: "Criterios de Validación Técnica",
          metrics: [
            {
              label: "Encoders lineales",
              value: "Alta",
              unit: "validez",
              color: "from-green-500/20 to-green-600/10",
              textColor: "text-green-300",
              description: "Error medio <0.02 m/s · máxima concordancia con sistemas ópticos de referencia",
            },
            {
              label: "IMU wearables",
              value: "Moderada",
              unit: "validez",
              color: "from-yellow-500/20 to-yellow-600/10",
              textColor: "text-yellow-300",
              description: "Error 0.03–0.07 m/s · sensibles a colocación y calibración · adecuados para monitoreo de tendencia",
            },
            {
              label: "Apps de video",
              value: "Básica",
              unit: "validez",
              color: "from-orange-500/20 to-orange-600/10",
              textColor: "text-orange-300",
              description: "Depende del frame rate del smartphone · útiles para comparación intra-sujeto",
            },
          ],
        },
      ]}
    />
  );
}

import DashboardBlock from "@/components/layout/DashboardBlock";
import { Cpu } from "lucide-react";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S10C1_Block3IMU() {
  return (
    <DashboardBlock
      title="IMU — Unidad de Medición Inercial"
      subtitle="Fusión de 3 sensores para orientación 3D completa."
      accentColor="from-blue-500 to-indigo-500"
      headerIcon={<Cpu size={22} className="text-blue-300" />}
      sections={[
        {
          id: "ejes-sensoriales",
          title: "Los 3 Ejes Sensoriales",
          metrics: [
            {
              label: "Acelerómetro",
              value: "3 ejes",
              unit: "m/s²",
              color: "from-blue-500/20 to-blue-600/10",
              textColor: "text-blue-300",
              description: "Mide aceleración lineal · Rango ±2g a ±16g",
            },
            {
              label: "Giroscopio",
              value: "3 ejes",
              unit: "°/s",
              color: "from-indigo-500/20 to-indigo-600/10",
              textColor: "text-indigo-300",
              description: "Mide velocidad angular · Rango ±250 a ±2000°/s · drift acumulativo",
            },
            {
              label: "Magnetómetro",
              value: "3 ejes",
              unit: "µT",
              color: "from-cyan-500/20 to-cyan-600/10",
              textColor: "text-cyan-300",
              description: "Mide campo magnético · Referencia Norte · sensible a metales",
            },
          ],
          content: (
            <div className="flex justify-center mt-4">
              <div className="max-w-xl w-full">
                <ZoomableImage
                  src="/images/semana_10/imu_sensor_axes.png"
                  alt="Ejes del IMU"
                  className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                />
              </div>
            </div>
          ),
        },
        {
          id: "fusion-sensorial",
          title: "Algoritmos de Fusión Sensorial",
          table: {
            headers: ["Algoritmo", "Ventaja", "Limitación", "Uso en Deporte"],
            rows: [
              ["Filtro de Kalman", "Óptimo bajo ruido gaussiano", "Computacionalmente pesado", "Análisis de marcha clínico"],
              ["Madgwick", "Eficiente en tiempo real", "Parámetro beta a ajustar", "Smartwatches y wearables"],
              ["Mahony", "Ultra ligero en MCU", "Menor precisión", "Dispositivos IoT deportivos"],
            ],
          },
          callout: {
            type: "tip",
            text: "Los IMUs de 9 DOF (grados de libertad) combinan los 3 sensores para eliminar el drift del giroscopio mediante la referencia gravitacional y magnética.",
          },
        },
      ]}
    />
  );
}

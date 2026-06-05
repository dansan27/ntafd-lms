import DashboardBlock from "@/components/layout/DashboardBlock";
import { TrendingUp } from "lucide-react";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S11C2_Block4CurvaFuerzaVelocidad() {
  return (
    <DashboardBlock
      title="Curva Fuerza-Velocidad y Fuerza-Potencia"
      subtitle="La hipérbola de Hill: la relación fundamental que define los límites del músculo."
      accentColor="from-amber-500 to-emerald-500"
      headerIcon={<TrendingUp size={22} className="text-amber-300" />}
      sections={[
        {
          id: "curvas-fundamentales",
          title: "Las Dos Curvas del Músculo",
          metrics: [
            {
              label: "Curva F-V (hipérbola)",
              value: "F × (v + b) = c",
              unit: "Ecuación de Hill",
              color: "from-amber-500/20 to-amber-600/10",
              textColor: "text-amber-300",
              description: "A mayor velocidad de contracción → menor fuerza producida. Define los extremos F0 (fuerza isométrica máx.) y V0 (velocidad sin carga)",
            },
            {
              label: "Curva P-V (parabólica)",
              value: "Pmax = F0 × V0 / 4",
              unit: "potencia pico",
              color: "from-emerald-500/20 to-emerald-600/10",
              textColor: "text-emerald-300",
              description: "La potencia es máxima al ~30% F0 y ~30% V0. El entrenamiento mueve el vértice hacia arriba y la derecha",
            },
            {
              label: "Optimización del perfil",
              value: "D F-V",
              unit: "déficit %",
              color: "from-cyan-500/20 to-cyan-600/10",
              textColor: "text-cyan-300",
              description: "Diferencia entre el ángulo del perfil real y el teórico óptimo. Guía qué extremo entrenar prioritariamente",
            },
          ],
          content: (
            <div className="flex justify-center mt-4">
              <div className="max-w-xl w-full">
                <ZoomableImage
                  src="/images/semana_11/force_velocity_power_curve.png"
                  alt="Curva Fuerza-Velocidad y Curva de Potencia Muscular"
                  className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                />
              </div>
            </div>
          ),
        },
        {
          id: "metodologia-fv",
          title: "Protocolo de Evaluación del Perfil F-V en Campo",
          table: {
            headers: ["Prueba", "Variable medida", "Cargas / Condición", "Software"],
            rows: [
              ["Sprint incrementales", "Fuerza horizontal vs velocidad", "Sin carga → trineo lastrado", "MySprint, SpeedCourt"],
              ["CMJ con cargas", "Potencia vs carga sentadilla", "Peso corporal → 100% PC extra", "Runmatic, GymAware"],
              ["Lanzamiento balón", "Potencia vs masa balón", "0.5 kg → 5 kg", "IMU o video HS"],
            ],
          },
          callout: {
            type: "info",
            text: "El perfil F-V de sprint horizontal (Samozino, 2016) se calcula con solo un sprint libre filmado con el móvil usando la app MySprint — no requiere equipamiento de laboratorio.",
          },
        },
      ]}
    />
  );
}

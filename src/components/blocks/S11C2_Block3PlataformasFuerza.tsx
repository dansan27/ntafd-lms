import DashboardBlock from "@/components/layout/DashboardBlock";
import { BarChart2 } from "lucide-react";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S11C2_Block3PlataformasFuerza() {
  return (
    <DashboardBlock
      title="Plataformas de Fuerza y Análisis de Salto"
      subtitle="Células de carga que capturan la curva fuerza-tiempo completa en acciones explosivas."
      accentColor="from-cyan-500 to-emerald-500"
      headerIcon={<BarChart2 size={22} className="text-cyan-300" />}
      sections={[
        {
          id: "tipos-plataforma",
          title: "Tecnologías de Plataforma de Fuerza",
          metrics: [
            {
              label: "Piezoeléctrica",
              value: "5000",
              unit: "Hz muestreo",
              color: "from-cyan-500/20 to-cyan-600/10",
              textColor: "text-cyan-300",
              description: "Kistler, AMTI · alta frecuencia · captura RFD extremo · uso en laboratorio biomecánico",
            },
            {
              label: "Strain gauge",
              value: "1000",
              unit: "Hz muestreo",
              color: "from-emerald-500/20 to-emerald-600/10",
              textColor: "text-emerald-300",
              description: "ForceDecks, Vald · uso clínico y de campo · balance bilateral · precio accesible",
            },
            {
              label: "Tapete de contacto",
              value: "1",
              unit: "ms resolución",
              color: "from-teal-500/20 to-teal-600/10",
              textColor: "text-teal-300",
              description: "Solo mide tiempo de vuelo → calcula altura de salto · bajo costo · no da curva F-t",
            },
          ],
          content: (
            <div className="flex justify-center mt-4">
              <div className="max-w-xl w-full">
                <ZoomableImage
                  src="/images/semana_11/force_plate_jump_analysis.png"
                  alt="Plataforma de Fuerza con Análisis de Salto CMJ"
                  className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                />
              </div>
            </div>
          ),
        },
        {
          id: "tipos-salto",
          title: "Protocolos de Salto más Utilizados",
          table: {
            headers: ["Test", "Tipo de acción", "Variable principal", "Interpretación"],
            rows: [
              ["CMJ", "Ciclo estiramiento-acortamiento rápido", "Altura / Potencia pico", "Capacidad elástico-explosiva"],
              ["SJ", "Acción concéntrica pura", "Altura / Fuerza pico", "Fuerza concéntrica explosiva"],
              ["CMJ vs SJ deficit", "Comparación CEA", "% diferencia altura", "Eficiencia elástica ≥10% normal"],
              ["Drop Jump", "Caída + salto reactivo", "Índice de elasticidad (RSI)", "Rigidez del tendón, CEA largo"],
            ],
          },
          callout: {
            type: "tip",
            text: "El Reactive Strength Index (RSI = altura vuelo / tiempo contacto) evalúa la capacidad reactiva y pliométrica. Valores >2.5 en élite vertical, <1.5 indica déficit pliométrico.",
          },
        },
      ]}
    />
  );
}

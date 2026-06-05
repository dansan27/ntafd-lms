import DashboardBlock from "@/components/layout/DashboardBlock";
import { Activity } from "lucide-react";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S11C1_Block4MetodosMedicion() {
  return (
    <DashboardBlock
      title="Métodos de Medición: Absolutos e Incrementales"
      subtitle="Los dos grandes paradigmas de codificación de posición en encoders."
      accentColor="from-indigo-500 to-violet-500"
      headerIcon={<Activity size={22} className="text-indigo-300" />}
      sections={[
        {
          id: "absoluto-vs-incremental",
          title: "Encoder Absoluto vs Encoder Incremental",
          metrics: [
            {
              label: "Absoluto",
              value: "Posición",
              unit: "única por código",
              color: "from-indigo-500/20 to-indigo-600/10",
              textColor: "text-indigo-300",
              description: "Cada posición tiene un código binario único · no pierde posición al apagar · no necesita punto de referencia · más caro",
            },
            {
              label: "Incremental",
              value: "Pulsos",
              unit: "desde referencia",
              color: "from-violet-500/20 to-violet-600/10",
              textColor: "text-violet-300",
              description: "Cuenta pulsos desde un punto home · pierde posición si se apaga sin guardar · más simple y económico · muy común en deporte",
            },
          ],
          content: (
            <div className="flex justify-center mt-4">
              <div className="max-w-xl w-full">
                <ZoomableImage
                  src="/images/semana_11/encoder_absoluto_vs_incremental.png"
                  alt="Encoder Absoluto vs Incremental — Comparativa"
                  className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                />
              </div>
            </div>
          ),
        },
        {
          id: "comparativa-detallada",
          title: "Comparativa Técnica",
          table: {
            headers: ["Característica", "Absoluto", "Incremental"],
            rows: [
              ["Referencia al encender", "No necesaria (recuerda posición)", "Necesita ir al home"],
              ["Complejidad del disco", "Multi-pista (código Gray/BCD)", "Una o dos pistas (A/B)"],
              ["Resolución", "Fija por número de bits", "Aumenta con ppr (pulsos/rev)"],
              ["Uso en deporte", "Prótesis activas, exoesqueletos", "Cicloergómetros, encoders de barra"],
              ["Costo relativo", "Mayor", "Menor"],
            ],
          },
          callout: {
            type: "info",
            text: "Los encoders incrementales de cuadratura (canales A y B desfasados 90°) permiten detectar también la DIRECCIÓN del movimiento, lo que es esencial en máquinas isocinéticas para distinguir fase concéntrica de excéntrica.",
          },
        },
      ]}
    />
  );
}

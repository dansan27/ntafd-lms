import DashboardBlock from "@/components/layout/DashboardBlock";
import { TrendingUp } from "lucide-react";

export default function S11C1_Block6IntegracionSistemas() {
  return (
    <DashboardBlock
      title="Integración del Encoder en el Sistema de Medición"
      subtitle="Del sensor al dato: cómo el encoder se conecta con el sistema de adquisición y software."
      accentColor="from-violet-500 to-cyan-500"
      headerIcon={<TrendingUp size={22} className="text-violet-300" />}
      sections={[
        {
          id: "cadena-medicion",
          title: "Cadena de Medición con Encoder",
          metrics: [
            {
              label: "1. Encoder (sensor)",
              value: "Señal",
              unit: "A / B / Z",
              color: "from-violet-500/20 to-violet-600/10",
              textColor: "text-violet-300",
              description: "Genera pulsos digitales cuadrados en canales A y B (cuadratura) y pulso de índice Z (home) · salida TTL o RS422",
            },
            {
              label: "2. Interfaz / DAQ",
              value: "Conta-",
              unit: "dor de pulsos",
              color: "from-cyan-500/20 to-cyan-600/10",
              textColor: "text-cyan-300",
              description: "Tarjeta NI DAQ, Arduino o microcontrolador cuenta pulsos en tiempo real y envía datos por USB, Bluetooth o CAN bus",
            },
            {
              label: "3. Software",
              value: "Proceso",
              unit: "y visualización",
              color: "from-indigo-500/20 to-indigo-600/10",
              textColor: "text-indigo-300",
              description: "LabVIEW, Python, MATLAB o app propia calcula posición, velocidad, aceleración y potencia en tiempo real",
            },
          ],
        },
        {
          id: "señales-cuadratura",
          title: "Lectura de Cuadratura y Detección de Dirección",
          table: {
            headers: ["Estado canal A", "Estado canal B", "Significado", "Acción del contador"],
            rows: [
              ["↑ Subida", "Bajo (0)", "Rotación sentido horario", "+ 1 pulso"],
              ["↑ Subida", "Alto (1)", "Rotación antihoraria", "− 1 pulso"],
              ["Pulso Z", "— (reset)", "Posición de referencia (home)", "Contador = 0"],
            ],
          },
          callout: {
            type: "info",
            text: "La resolución efectiva de un encoder incremental de 1000 ppr se cuadruplica a 4000 pasos/rev usando la decodificación x4 (flancos de subida Y bajada de ambos canales A y B). Esto permite medir ángulos de 0.09° por paso en una máquina isocinética.",
          },
        },
      ]}
    />
  );
}

import { AnimatePresence, motion } from "framer-motion";
import { Activity, Zap, Cpu, Radio, Gamepad2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import DashboardBlock from "@/components/layout/DashboardBlock";
import S6C1_Dynamic3QuizFuerza from "../dynamics/S6C1_Dynamic3QuizFuerza";

export default function S6C1_Block6EMG() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 6, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic3Active = statuses?.find(s => s.dynamicId === 3)?.isActive ?? false;

  return (
    <div>
      <DashboardBlock
        title="FlexiForce y Electromiografía (EMG)"
        subtitle="Sensores de presión táctil y registro de la actividad eléctrica muscular."
        accentColor="from-purple-500 to-pink-500"
        headerIcon={<Activity size={22} className="text-purple-300" />}
        sections={[
          {
            id: "flexiforce",
            title: "Sensor FlexiForce",
            icon: <Radio size={14} className="text-purple-400" />,
            metrics: [
              {
                label: "Tecnología",
                value: "Piezoresistivo",
                icon: <Radio size={16} />,
                color: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
                textColor: "text-purple-400",
                description: "Resistencia varía con la presión aplicada",
              },
              {
                label: "Grosor sensor",
                value: "0.2 mm",
                icon: <Cpu size={16} />,
                color: "from-pink-500/20 to-purple-500/10 border-pink-500/30",
                textColor: "text-pink-400",
                description: "Ultrafino — no altera la distribución de carga",
              },
              {
                label: "Rango",
                value: "4.4 – 440 N",
                icon: <Zap size={16} />,
                color: "from-fuchsia-500/20 to-purple-500/10 border-fuchsia-500/30",
                textColor: "text-fuchsia-400",
                description: "Modelos A101, A201, A401",
              },
            ],
            callout: {
              type: "warning",
              text: "FlexiForce es menos preciso que la galga extensométrica (histéresis ~3–4% FS vs. ±0.1%). Se recomienda para distribución de presión plantar, análisis de plantilla y prótesis — no para medición de fuerza de alta precisión.",
            },
          },
          {
            id: "emg-tipos",
            title: "Electromiografía (EMG)",
            icon: <Activity size={14} className="text-purple-400" />,
            tabs: [
              {
                label: "Superficie (sEMG)",
                content: (
                  <div className="space-y-3">
                    <p className="text-sm text-white/60">
                      Electrodos colocados sobre la piel detectan los potenciales de acción
                      del músculo completo (suma de unidades motoras activas).
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Frecuencia señal", value: "10 – 500 Hz" },
                        { label: "Amplitud", value: "0.1 – 10 mV" },
                        { label: "Invasividad", value: "No invasivo" },
                        { label: "Músculo objetivo", value: "Superficial" },
                      ].map((i) => (
                        <div key={i.label} className="rounded-lg border border-white/10 bg-white/4 p-3">
                          <p className="text-[11px] text-white/40 uppercase tracking-widest">{i.label}</p>
                          <p className="text-sm text-white/80 font-medium mt-0.5">{i.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl border border-green-500/25 bg-green-500/8 px-4 py-3">
                      <p className="text-sm text-green-300">
                        ✓ Ideal para análisis de fatiga, coordinación intermuscular y
                        feedback en tiempo real durante el entrenamiento.
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                label: "Intramuscular (iEMG)",
                content: (
                  <div className="space-y-3">
                    <p className="text-sm text-white/60">
                      Aguja o hilo insertado dentro del músculo — capta unidades motoras
                      individuales con alta selectividad.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Selectividad", value: "Unidad motora individual" },
                        { label: "Amplitud", value: "hasta 20 mV" },
                        { label: "Invasividad", value: "Invasivo (aguja)" },
                        { label: "Entorno", value: "Laboratorio / clínica" },
                      ].map((i) => (
                        <div key={i.label} className="rounded-lg border border-white/10 bg-white/4 p-3">
                          <p className="text-[11px] text-white/40 uppercase tracking-widest">{i.label}</p>
                          <p className="text-sm text-white/80 font-medium mt-0.5">{i.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl border border-amber-500/25 bg-amber-500/8 px-4 py-3">
                      <p className="text-sm text-amber-300">
                        ⚠ Requiere personal sanitario cualificado. Uso restringido a
                        investigación y diagnóstico neuromuscular.
                      </p>
                    </div>
                  </div>
                ),
              },
            ],
          },
          {
            id: "emg-procesamiento",
            title: "Procesamiento de señal EMG",
            icon: <Cpu size={14} className="text-purple-400" />,
            table: {
              headers: ["Etapa", "Proceso", "Resultado"],
              rows: [
                ["Captación", "Electrodos + amplificador diferencial", "Señal cruda (μV – mV)"],
                ["Filtrado", "Paso banda 20–500 Hz + notch 50/60 Hz", "Señal limpia"],
                ["Rectificación", "Valor absoluto de la señal", "Envolvente positiva"],
                ["RMS / MAV", "Media cuadrática o valor medio absoluto", "Amplitud cuantificada"],
                ["Normalización", "% CVM (Contracción Voluntaria Máx.)", "Comparación entre sesiones"],
              ],
              highlight: 2,
            },
            callout: {
              type: "tip",
              text: "Normalizar el EMG al % de CVM permite comparar registros entre distintas sesiones, sujetos y laboratorios. Sin normalización, los valores absolutos no son comparables.",
            },
          },
        ]}
      />

      {/* Dynamic gate */}
      <div className="bg-[#030712] px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                {isDynamic3Active ? (
                  <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
                    <Gamepad2 size={14} /> Dinámica 3 Activa
                  </Badge>
                ) : (
                  <Button variant="outline" disabled className="gap-2 opacity-50 border-white/20 text-white/40">
                    <Lock size={14} /> El profesor activará esta dinámica
                  </Button>
                )}
              </div>
            </div>
            <AnimatePresence>
              {isDynamic3Active && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
                  <S6C1_Dynamic3QuizFuerza weekId={6} classId={1} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

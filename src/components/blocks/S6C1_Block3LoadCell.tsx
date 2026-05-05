import { AnimatePresence, motion } from "framer-motion";
import { Cpu, Zap, Layers, Gamepad2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import DashboardBlock from "@/components/layout/DashboardBlock";
import S6C1_Dynamic1IdentificaSensor from "../dynamics/S6C1_Dynamic1IdentificaSensor";

export default function S6C1_Block3LoadCell() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 6, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic1Active = statuses?.find(s => s.dynamicId === 1)?.isActive ?? false;

  return (
    <div>
      <DashboardBlock
        title="Celda de Carga (Load Cell)"
        subtitle="El transductor que convierte fuerza mecánica en señal eléctrica."
        accentColor="from-orange-500 to-amber-500"
        headerIcon={<Cpu size={22} className="text-orange-300" />}
        sections={[
          {
            id: "concepto",
            title: "¿Qué es una celda de carga?",
            icon: <Zap size={14} className="text-orange-400" />,
            metrics: [
              {
                label: "Principio",
                value: "Galga extensométrica",
                icon: <Cpu size={16} />,
                color: "from-orange-500/20 to-amber-500/10 border-orange-500/30",
                textColor: "text-orange-400",
                description: "Descubierta por Simmons & Ruge (1938)",
              },
              {
                label: "Señal de salida",
                value: "mV / V",
                icon: <Zap size={16} />,
                color: "from-amber-500/20 to-yellow-500/10 border-amber-500/30",
                textColor: "text-amber-400",
                description: "Proporcional a la fuerza aplicada",
              },
              {
                label: "Precisión típica",
                value: "±0.1%",
                icon: <Layers size={16} />,
                color: "from-yellow-500/20 to-orange-500/10 border-yellow-500/30",
                textColor: "text-yellow-400",
                description: "Fondo de escala (FS)",
              },
            ],
            callout: {
              type: "info",
              text: "La galga extensométrica es una resistencia eléctrica que cambia su valor al deformarse. A mayor deformación → mayor cambio de resistencia → mayor señal eléctrica. El Puente de Wheatstone amplifica esta diferencia.",
            },
          },
          {
            id: "principio",
            title: "Principio de funcionamiento",
            icon: <Cpu size={14} className="text-orange-400" />,
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      step: "1",
                      label: "Fuerza aplicada",
                      desc: "El cuerpo elástico (acero o aluminio) se deforma microscópicamente.",
                      color: "border-orange-500/30 bg-orange-500/8",
                      num: "text-orange-400",
                    },
                    {
                      step: "2",
                      label: "Cambio de resistencia",
                      desc: "La galga extensométrica pegada detecta la deformación y cambia su Ω.",
                      color: "border-amber-500/30 bg-amber-500/8",
                      num: "text-amber-400",
                    },
                    {
                      step: "3",
                      label: "Señal acondicionada",
                      desc: "El puente de Wheatstone → ADC → señal digital procesable.",
                      color: "border-yellow-500/30 bg-yellow-500/8",
                      num: "text-yellow-400",
                    },
                  ].map((s) => (
                    <div key={s.step} className={`rounded-xl border p-4 ${s.color}`}>
                      <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${s.num}`}>
                        Paso {s.step}
                      </div>
                      <p className="text-sm font-semibold text-white mb-1">{s.label}</p>
                      <p className="text-xs text-white/50 leading-snug">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ),
          },
          {
            id: "tipos",
            title: "5 tipos de celda de carga",
            icon: <Layers size={14} className="text-orange-400" />,
            table: {
              headers: ["Tipo", "Dirección de carga", "Aplicación deportiva"],
              rows: [
                ["Flexión", "Perpendicular al eje", "Plataforma de saltos, balanzas"],
                ["Cizallamiento", "Paralela al eje", "Dinamómetros de tracción"],
                ["Compresión", "Axial (empuje)", "Press de banca, salto vertical"],
                ["Tensión", "Axial (jalón)", "Pull-ups, remo, análisis de cadena"],
                ["Tipo S", "Tensión y compresión", "Poleas, cables de resistencia"],
              ],
              highlight: 2,
            },
            callout: {
              type: "tip",
              text: "El 'Tipo S' es el más versátil para el laboratorio deportivo: puede medir tanto jalones como empujes sin necesidad de cambiar el sensor.",
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
                {isDynamic1Active ? (
                  <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
                    <Gamepad2 size={14} /> Dinámica 1 Activa
                  </Badge>
                ) : (
                  <Button variant="outline" disabled className="gap-2 opacity-50 border-white/20 text-white/40">
                    <Lock size={14} /> El profesor activará esta dinámica
                  </Button>
                )}
              </div>
            </div>
            <AnimatePresence>
              {isDynamic1Active && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
                  <S6C1_Dynamic1IdentificaSensor weekId={6} classId={1} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

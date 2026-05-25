import { AnimatePresence, motion } from "framer-motion";
import { Wifi, Gamepad2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import DashboardBlock from "@/components/layout/DashboardBlock";
import S9C1_Dynamic3QuizHTA from "../dynamics/S9C1_Dynamic3QuizHTA";

export default function S9C1_Block6Telemedicina() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 9, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic3Active = statuses?.find(s => s.dynamicId === 3)?.isActive ?? false;

  return (
    <div>
      <DashboardBlock
        title="Telemedicina y Plataformas Online"
        subtitle="Conectividad digital que elimina barreras geográficas en el seguimiento de pacientes con ECNT."
        accentColor="from-teal-500 to-cyan-500"
        headerIcon={<Wifi size={22} className="text-teal-300" />}
        sections={[
          {
            id: "servicios",
            title: "Servicios de telemedicina para ECNT",
            icon: <Wifi size={14} className="text-teal-400" />,
            metrics: [
              {
                label: "Consultas virtuales",
                value: "Acceso 24/7",
                icon: <Wifi size={16} />,
                color: "from-teal-500/20 to-cyan-500/10 border-teal-500/30",
                textColor: "text-teal-400",
                description: "Profesionales disponibles desde cualquier lugar. Elimina desplazamientos para controles rutinarios.",
              },
              {
                label: "Programas personalizados",
                value: "Planes adaptativos",
                icon: <Wifi size={16} />,
                color: "from-cyan-500/20 to-teal-500/10 border-cyan-500/30",
                textColor: "text-cyan-400",
                description: "Planes de ejercicio y nutrición ajustados a las necesidades del paciente en tiempo real.",
              },
              {
                label: "Seguimiento remoto",
                value: "Monitoreo continuo",
                icon: <Wifi size={16} />,
                color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
                textColor: "text-emerald-400",
                description: "Datos de PA, glucosa y actividad física revisados por el médico sin visita presencial.",
              },
            ],
          },
          {
            id: "evidencia",
            title: "Evidencia clínica",
            icon: <Wifi size={14} className="text-teal-400" />,
            tabs: [
              {
                label: "HTA",
                content: (
                  <div className="space-y-3">
                    <p className="text-sm text-white/60">
                      Estudios clínicos muestran que el seguimiento remoto de PA + telemedicina
                      reduce la PA sistólica 5–10 mmHg adicionales vs. atención estándar.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Adherencia medicación", value: "+23%" },
                        { label: "Reducción PA sistólica", value: "−7.6 mmHg" },
                        { label: "Visitas de emergencia", value: "−31%" },
                        { label: "Satisfacción paciente", value: "87%" },
                      ].map((i) => (
                        <div key={i.label} className="rounded-lg border border-white/10 bg-white/4 p-3">
                          <p className="text-[11px] text-white/40 uppercase tracking-widest">{i.label}</p>
                          <p className="text-sm text-teal-300 font-bold mt-0.5">{i.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                label: "Obesidad",
                content: (
                  <div className="space-y-3">
                    <p className="text-sm text-white/60">
                      Programas de telemedicina combinados con seguimiento de actividad via wearables
                      logran mejor pérdida de peso a 12 meses que la intervención presencial sola.
                    </p>
                    <div className="rounded-xl border border-teal-500/25 bg-teal-500/8 px-4 py-3">
                      <p className="text-sm text-teal-300">
                        ✓ La combinación app + consulta virtual + wearable aumenta la adherencia al
                        programa de ejercicio en un 40% vs. solo consulta presencial (JMIR 2023).
                      </p>
                    </div>
                  </div>
                ),
              },
            ],
            callout: {
              type: "clinical",
              text: "La telemedicina no reemplaza la consulta presencial de diagnóstico — la complementa. Es especialmente valiosa para el seguimiento crónico, ajuste de medicación y coaching de ejercicio.",
            },
          },
        ]}
      />

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
                  <S9C1_Dynamic3QuizHTA weekId={9} classId={1} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

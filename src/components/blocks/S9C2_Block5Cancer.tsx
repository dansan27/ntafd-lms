import { AnimatePresence, motion } from "framer-motion";
import { Heart, Gamepad2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import DashboardBlock from "@/components/layout/DashboardBlock";
import S9C2_Dynamic2EjercicioCancer from "../dynamics/S9C2_Dynamic2EjercicioCancer";

export default function S9C2_Block5Cancer() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 9, classId: 2 },
    { refetchInterval: 3000 }
  );
  const isDynamic2Active = statuses?.find(s => s.dynamicId === 2)?.isActive ?? false;

  return (
    <div>
      <DashboardBlock
        title="Ejercicio en Cáncer"
        subtitle="El ejercicio físico es una intervención terapéutica basada en evidencia para pacientes oncológicos en todas las fases del tratamiento."
        accentColor="from-teal-500 to-cyan-500"
        headerIcon={<Heart size={22} className="text-teal-300" />}
        sections={[
          {
            id: "beneficios",
            title: "Beneficios del ejercicio en oncología",
            icon: <Heart size={14} className="text-teal-400" />,
            metrics: [
              {
                label: "Fatiga oncológica",
                value: "↓ 30–40%",
                icon: <Heart size={16} />,
                color: "from-teal-500/20 to-cyan-500/10 border-teal-500/30",
                textColor: "text-teal-400",
                description: "El ejercicio aeróbico moderado es el tratamiento más efectivo para la fatiga relacionada con el cáncer.",
              },
              {
                label: "Función inmune",
                value: "↑ Células NK",
                icon: <Heart size={16} />,
                color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
                textColor: "text-emerald-400",
                description: "Aumenta la actividad de células Natural Killer y linfocitos T — respuesta antitumoral mejorada.",
              },
              {
                label: "Calidad de vida",
                value: "+25% FACT-G",
                icon: <Heart size={16} />,
                color: "from-cyan-500/20 to-teal-500/10 border-cyan-500/30",
                textColor: "text-cyan-400",
                description: "Mejora significativa en escalas de calidad de vida (FACT-G) con ejercicio supervisado regular.",
              },
            ],
          },
          {
            id: "prescripcion",
            title: "Prescripción adaptada al tipo de cáncer",
            icon: <Heart size={14} className="text-teal-400" />,
            tabs: [
              {
                label: "Durante tratamiento activo",
                content: (
                  <div className="space-y-3">
                    <p className="text-sm text-white/60">
                      Durante quimioterapia o radioterapia, el ejercicio debe adaptarse según
                      la tolerancia y los efectos secundarios del tratamiento.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Intensidad", value: "Moderada (RPE 3–5/10)" },
                        { label: "Frecuencia", value: "3–5 días/semana" },
                        { label: "Duración", value: "20–45 min/sesión" },
                        { label: "Neutropenia", value: "Entorno domiciliario" },
                      ].map((i) => (
                        <div key={i.label} className="rounded-lg border border-white/10 bg-white/4 p-3">
                          <p className="text-[11px] text-white/40 uppercase tracking-widest">{i.label}</p>
                          <p className="text-sm text-white/80 font-medium mt-0.5">{i.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                label: "Post-tratamiento",
                content: (
                  <div className="space-y-3">
                    <p className="text-sm text-white/60">
                      Tras completar el tratamiento, la progresión del ejercicio puede ser más
                      agresiva. Objetivo: recuperar capacidad funcional y reducir recurrencia.
                    </p>
                    <div className="rounded-xl border border-teal-500/25 bg-teal-500/8 px-4 py-3">
                      <p className="text-sm text-teal-300">
                        ✓ ACSM 2022: Los supervivientes de cáncer deben realizar ≥150 min/semana de
                        ejercicio aeróbico moderado para reducir el riesgo de recurrencia y mejorar
                        la supervivencia a largo plazo.
                      </p>
                    </div>
                  </div>
                ),
              },
            ],
            callout: {
              type: "warning",
              text: "Siempre requiere supervisión médica. Contraindicaciones relativas: metástasis ósea (riesgo fractura), anemia severa (Hb < 8 g/dL) y trombocitopenia (<50,000 plaquetas).",
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
                {isDynamic2Active ? (
                  <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
                    <Gamepad2 size={14} /> Dinámica 2 Activa
                  </Badge>
                ) : (
                  <Button variant="outline" disabled className="gap-2 opacity-50 border-white/20 text-white/40">
                    <Lock size={14} /> El profesor activará esta dinámica
                  </Button>
                )}
              </div>
            </div>
            <AnimatePresence>
              {isDynamic2Active && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
                  <S9C2_Dynamic2EjercicioCancer weekId={9} classId={2} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

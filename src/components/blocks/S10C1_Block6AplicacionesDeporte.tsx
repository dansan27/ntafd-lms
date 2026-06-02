import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import FullscreenBlock from "@/components/layout/FullscreenBlock";
import S10C1_Dynamic3ClasificaSensor from "../dynamics/S10C1_Dynamic3ClasificaSensor";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S10C1_Block6AplicacionesDeporte() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 10, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic3Active = statuses?.find(s => s.dynamicId === 3)?.isActive ?? false;

  return (
    <div>
      <FullscreenBlock
        sections={[
          {
            id: "marcha-carrera",
            bg: "from-[#070718] to-[#0a0a2e]",
            badge: "Semana 10 · Aplicaciones",
            badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
            eyebrow: "IMU en Locomoción",
            title: (
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Análisis de <span className="text-blue-400">Marcha y Carrera</span>
              </h2>
            ),
            subtitle: (
              <p>
                IMUs colocados en cintura, muslos y pies capturan las variables
                cinemáticas del ciclo de marcha sin necesitar un laboratorio.
              </p>
            ),
            body: (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Cadencia", "Pasos por minuto (ppm)"],
                    ["Long. de zancada", "Distancia ciclo completo"],
                    ["Tiempo de vuelo", "Fase aérea en carrera"],
                    ["Simetría", "Comparación pierna D vs I"],
                  ].map(([v, d]) => (
                    <div key={v} className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
                      <p className="font-bold text-blue-300 text-xs">{v}</p>
                      <p className="text-white/50 text-xs mt-1">{d}</p>
                    </div>
                  ))}
                </div>
                <p className="text-white/40 text-xs">
                  Sistemas: <span className="text-blue-300">Xsens MVN</span> ·{" "}
                  <span className="text-blue-300">Noraxon</span> ·{" "}
                  <span className="text-blue-300">Vicon Nexus</span>
                </p>
              </div>
            ),
            visual: (
              <ZoomableImage
                src="/images/semana_10/gait_analysis.png"
                alt="Análisis de Marcha y Carrera"
                className="w-full max-h-[380px] object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
              />
            ),
            accentColor: "text-blue-400",
          },
          {
            id: "gesto-tecnico",
            bg: "from-[#0a0a2e] to-[#070718]",
            badge: "Gesto Técnico",
            badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
            eyebrow: "Análisis de Movimiento Deportivo",
            title: (
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                IMU para el <span className="text-indigo-400">Gesto Técnico</span>
              </h2>
            ),
            subtitle: (
              <p>
                Un sensor en la muñeca de un tenista registra la velocidad de raqueta
                y el ángulo de impacto en cada golpe — sin cables ni laboratorio.
              </p>
            ),
            body: (
              <div className="space-y-3 text-sm text-white/60">
                {[
                  ["Lanzamiento", "Béisbol / Tenis — velocidad y rotación de brazo"],
                  ["Cadera", "Golf / Natación — rotación y timing"],
                  ["Impacto en cabeza", "Rugby / Fútbol americano — g-force y HIC"],
                  ["Saque de tenis", "Velocidad de raqueta y ángulo de impacto"],
                ].map(([g, d]) => (
                  <div key={g} className="flex gap-3">
                    <span className="text-indigo-400 font-bold w-36 shrink-0 text-xs">{g}</span>
                    <span className="text-white/50 text-xs">{d}</span>
                  </div>
                ))}
              </div>
            ),
            visual: (
              <ZoomableImage
                src="/images/semana_10/wrist_motion_sensor.png"
                alt="Sensor en Muñeca para Gesto Técnico"
                className="w-full max-h-[380px] object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
              />
            ),
            accentColor: "text-indigo-400",
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
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <S10C1_Dynamic3ClasificaSensor weekId={10} classId={1} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

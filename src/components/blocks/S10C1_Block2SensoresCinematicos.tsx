import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import FullscreenBlock from "@/components/layout/FullscreenBlock";
import S10C1_Dynamic1IdentificaSensor from "../dynamics/S10C1_Dynamic1IdentificaSensor";
import ZoomableImage from "@/components/ui/ZoomableImage";

const sensors = [
  { name: "IMU", desc: "Orientación 3D (acc + giro + mag)", color: "text-blue-400" },
  { name: "Potenciómetro", desc: "Ángulo articular estático/dinámico", color: "text-indigo-400" },
  { name: "Encoder", desc: "Velocidad y posición rotacional", color: "text-cyan-400" },
  { name: "Cámara (MoCap)", desc: "Captura óptica de marcadores 3D", color: "text-violet-400" },
];

const variables: [string, string][] = [
  ["Posición", "¿Dónde está el segmento?"],
  ["Velocidad", "¿Con qué rapidez se mueve?"],
  ["Aceleración", "¿Cómo cambia la velocidad?"],
  ["Ángulo articular", "¿Cuánto se dobla la articulación?"],
];

export default function S10C1_Block2SensoresCinematicos() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 10, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic1Active = statuses?.find(s => s.dynamicId === 1)?.isActive ?? false;

  return (
    <div>
      <FullscreenBlock
        sections={[
          {
            id: "cinematica",
            bg: "from-[#070718] to-[#0a0a2e]",
            badge: "Semana 10 · Cinemática",
            badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
            eyebrow: "Fundamentos",
            title: (
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                ¿Qué estudia la{" "}
                <span className="text-blue-400">Cinemática</span>?
              </h2>
            ),
            subtitle: (
              <p>
                La cinemática describe el{" "}
                <strong className="text-blue-300">movimiento</strong> — posición,
                velocidad, aceleración y ángulos articulares — sin considerar las
                fuerzas que lo causan. Es la base del análisis biomecánico deportivo.
              </p>
            ),
            body: (
              <div className="space-y-2">
                {variables.map(([v, d]) => (
                  <div key={v} className="flex gap-2 text-sm">
                    <span className="text-blue-400 font-bold w-36 shrink-0">{v}</span>
                    <span className="text-white/60">{d}</span>
                  </div>
                ))}
              </div>
            ),
            visual: (
              <ZoomableImage
                src="/images/semana_10/cinematica_biomecanica.png"
                alt="Cinemática Biomecánica"
                className="w-full max-h-[380px] object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
              />
            ),
            accentColor: "text-blue-400",
          },
          {
            id: "tipos-sensores",
            bg: "from-[#0a0a2e] to-[#070718]",
            badge: "Clasificación",
            badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
            eyebrow: "Tipos de Sensores",
            title: (
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Sensores <span className="text-indigo-400">Cinemáticos</span> en Deporte
              </h2>
            ),
            subtitle: (
              <p>
                Cada sensor captura una dimensión diferente del movimiento. La elección
                depende de la variable biomecánica que necesitas medir.
              </p>
            ),
            body: (
              <div className="grid grid-cols-2 gap-3">
                {sensors.map((s) => (
                  <div key={s.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className={`font-bold text-sm ${s.color}`}>{s.name}</p>
                    <p className="text-xs text-white/50 mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
            ),
            visual: (
              <ZoomableImage
                src="/images/semana_10/sensores_cinematicos_grid.png"
                alt="Sensores Cinemáticos"
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
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <S10C1_Dynamic1IdentificaSensor weekId={10} classId={1} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

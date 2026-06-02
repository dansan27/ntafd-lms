import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import FullscreenBlock from "@/components/layout/FullscreenBlock";
import S10C1_Dynamic2QuizIMU from "../dynamics/S10C1_Dynamic2QuizIMU";
import ZoomableImage from "@/components/ui/ZoomableImage";

const articulaciones: [string, string, string, string][] = [
  ["Rodilla", "0–135°", "Goniometría", "Evaluación de flexión post-lesión"],
  ["Codo", "0–145°", "Electrogonímetro", "Control motor en lanzadores"],
  ["Tobillo", "20–50°", "Sensor inercial + potenc.", "Análisis de marcha y carrera"],
];

export default function S10C1_Block4Potenciometros() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 10, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic2Active = statuses?.find(s => s.dynamicId === 2)?.isActive ?? false;

  return (
    <div>
      <FullscreenBlock
        sections={[
          {
            id: "potenciometro-rotativo",
            bg: "from-[#070718] to-[#0a0a2e]",
            badge: "Semana 10 · Potenciómetro",
            badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
            eyebrow: "Sensor de Ángulo",
            title: (
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Potenciómetro <span className="text-blue-400">Rotativo</span>
              </h2>
            ),
            subtitle: (
              <p>
                Resistencia variable que convierte el{" "}
                <strong className="text-blue-300">ángulo articular</strong> en voltaje
                proporcional. Rango 0–360°, respuesta lineal o logarítmica según la aplicación.
              </p>
            ),
            body: (
              <div className="space-y-3 text-sm text-white/60">
                <p>
                  En biomecánica deportiva se usan como{" "}
                  <strong className="text-blue-300">electrogoniómetros</strong>: sensores
                  fijados sobre la articulación que registran el ángulo de
                  flexión/extensión en tiempo real durante el movimiento.
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    ["Rodilla", "Evaluación post-lesión de LCA"],
                    ["Codo", "Control motor en lanzadores"],
                    ["Tobillo", "Marcha y carrera"],
                  ].map(([j, u]) => (
                    <div key={j} className="flex gap-3">
                      <span className="text-indigo-400 font-bold w-20 shrink-0">{j}</span>
                      <span className="text-white/50">{u}</span>
                    </div>
                  ))}
                </div>
              </div>
            ),
            visual: (
              <ZoomableImage
                src="/images/semana_10/knee_potentiometer.png"
                alt="Potenciómetro en articulación"
                className="w-full max-h-[380px] object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
              />
            ),
            accentColor: "text-blue-400",
          },
          {
            id: "aplicaciones-deportivas",
            bg: "from-[#0a0a2e] to-[#070718]",
            badge: "Aplicaciones",
            badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
            eyebrow: "Evaluación Deportiva",
            title: (
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Goniometría <span className="text-indigo-400">Electrónica</span> en Articulaciones
              </h2>
            ),
            subtitle: (
              <p>
                Valores de referencia y dispositivos para la evaluación clínica y deportiva
                del rango articular de movimiento.
              </p>
            ),
            body: (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-white/70">
                  <thead>
                    <tr className="border-b border-white/10">
                      {["Articulación", "Rango normal", "Dispositivo", "Uso clínico"].map((h) => (
                        <th key={h} className="text-left py-2 pr-4 text-indigo-300 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {articulaciones.map(([a, r, d, u]) => (
                      <tr key={a} className="border-b border-white/5">
                        <td className="py-2 pr-4 text-white font-medium">{a}</td>
                        <td className="py-2 pr-4">{r}</td>
                        <td className="py-2 pr-4">{d}</td>
                        <td className="py-2">{u}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <S10C1_Dynamic2QuizIMU weekId={10} classId={1} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

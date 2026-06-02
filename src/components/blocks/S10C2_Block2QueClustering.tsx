import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import FullscreenBlock from "@/components/layout/FullscreenBlock";
import S10C2_Dynamic1ClasificaAtleta from "../dynamics/S10C2_Dynamic1ClasificaAtleta";

export default function S10C2_Block2QueClustering() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 10, classId: 2 },
    { refetchInterval: 3000 }
  );
  const isDynamic1Active = statuses?.find(s => s.dynamicId === 1)?.isActive ?? false;

  return (
    <div>
      <FullscreenBlock
        sections={[
          {
            id: "aprendizaje-no-supervisado",
            bg: "from-[#0d0718] to-[#1a0a2e]",
            badge: "Semana 10 · ML",
            badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
            eyebrow: "Fundamentos",
            title: (
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Aprendizaje <span className="text-violet-400">No Supervisado</span>
              </h2>
            ),
            subtitle: (
              <p>
                El algoritmo{" "}
                <strong className="text-violet-300">encuentra patrones sin etiquetas</strong>.
                No le decimos cuál es la respuesta correcta — él descubre estructura oculta
                en los datos por sí solo.
              </p>
            ),
            body: (
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { tipo: "Supervisado", desc: "Tiene etiquetas (labels). Aprende la función X→Y.", color: "text-blue-300", border: "border-blue-500/20", bg: "bg-blue-500/5" },
                    { tipo: "No Supervisado", desc: "Sin etiquetas. Encuentra grupos/patrones automáticamente.", color: "text-violet-300", border: "border-violet-500/30", bg: "bg-violet-500/10" },
                    { tipo: "Por Refuerzo", desc: "Aprende por recompensa/penalización en un entorno.", color: "text-purple-300", border: "border-purple-500/20", bg: "bg-purple-500/5" },
                  ].map((t) => (
                    <div key={t.tipo} className={`rounded-xl border ${t.border} ${t.bg} p-3 flex gap-3`}>
                      <span className={`font-bold text-xs w-32 shrink-0 ${t.color}`}>{t.tipo}</span>
                      <span className="text-white/50 text-xs">{t.desc}</span>
                    </div>
                  ))}
                </div>
                <p className="text-white/30 text-xs text-center italic">
                  Clustering = agrupamiento por similitud — paradigma no supervisado
                </p>
              </div>
            ),
            accentColor: "text-violet-400",
          },
          {
            id: "que-es-clustering",
            bg: "from-[#1a0a2e] to-[#0d0718]",
            badge: "Clustering",
            badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
            eyebrow: "Definición y Objetivo",
            title: (
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                ¿Qué es el <span className="text-purple-400">Clustering</span>?
              </h2>
            ),
            subtitle: (
              <p>
                Agrupar observaciones en{" "}
                <strong className="text-purple-300">clusters</strong> de forma que los
                miembros del mismo grupo sean más similares entre sí que con los de otros
                grupos. Minimiza distancia intra-cluster, maximiza distancia inter-cluster.
              </p>
            ),
            body: (
              <div className="space-y-3 text-sm text-white/60">
                <p className="text-xs font-semibold text-purple-300 uppercase tracking-widest">
                  Métricas de distancia
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["Euclidiana", "√Σ(xi−yi)²", "Estándar"],
                    ["Manhattan", "Σ|xi−yi|", "Outlier-robust"],
                    ["Coseno", "1 − cos(θ)", "Alta dimensión"],
                  ].map(([n, f, u]) => (
                    <div key={n} className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 text-center">
                      <p className="font-bold text-xs text-purple-300">{n}</p>
                      <p className="text-xs text-white/40 font-mono mt-1">{f}</p>
                      <p className="text-xs text-white/30 mt-0.5">{u}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/40">
                  Aplicaciones en AFD: perfiles de atletas · zonas de entrenamiento · riesgo de lesión
                </p>
              </div>
            ),
            accentColor: "text-purple-400",
          },
        ]}
      />

      <div className="bg-[#0d0718] px-6 pb-16">
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
                  <S10C2_Dynamic1ClasificaAtleta weekId={10} classId={2} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

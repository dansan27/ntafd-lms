import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import FullscreenBlock from "@/components/layout/FullscreenBlock";
import S10C2_Dynamic3IdentificaAlgoritmo from "../dynamics/S10C2_Dynamic3IdentificaAlgoritmo";

const flujo = [
  "Recolección de datos",
  "Limpieza / normalización",
  "Selección de variables",
  "Algoritmo de clustering",
  "Validación (Silhouette, Elbow)",
  "Interpretación por experto",
  "Decisión del entrenador",
];

export default function S10C2_Block6Interpretacion() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 10, classId: 2 },
    { refetchInterval: 3000 }
  );
  const isDynamic3Active = statuses?.find(s => s.dynamicId === 3)?.isActive ?? false;

  return (
    <div>
      <FullscreenBlock
        sections={[
          {
            id: "visualizacion",
            bg: "from-[#0d0718] to-[#1a0a2e]",
            badge: "Semana 10 · Visualización",
            badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
            eyebrow: "Ver los Clusters",
            title: (
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Visualización de <span className="text-violet-400">Resultados</span>
              </h2>
            ),
            subtitle: (
              <p>
                Los clusters en alta dimensión son invisibles. Las técnicas de
                reducción dimensional y validación los hacen{" "}
                <strong className="text-violet-300">interpretables</strong> para el
                cuerpo técnico.
              </p>
            ),
            body: (
              <div className="space-y-3 text-sm">
                {[
                  { viz: "PCA + Scatter plot", desc: "Proyecta clusters en 2D para visualización rápida", color: "text-violet-300", border: "border-violet-500/20", bg: "bg-violet-500/5" },
                  { viz: "Dendrograma", desc: "Árbol jerárquico — muestra cómo se fusionan los grupos", color: "text-purple-300", border: "border-purple-500/20", bg: "bg-purple-500/5" },
                  { viz: "Silhouette plot", desc: "Valida cohesión y separación de cada cluster", color: "text-fuchsia-300", border: "border-fuchsia-500/20", bg: "bg-fuchsia-500/5" },
                ].map((v) => (
                  <div key={v.viz} className={`rounded-xl border ${v.border} ${v.bg} p-3 flex gap-3`}>
                    <span className={`font-bold text-xs w-36 shrink-0 ${v.color}`}>{v.viz}</span>
                    <span className="text-white/50 text-xs">{v.desc}</span>
                  </div>
                ))}
                <p className="text-white/30 text-xs italic">
                  Siempre interpretar clusters con expertos del dominio deportivo — los números solos no bastan.
                </p>
              </div>
            ),
            accentColor: "text-violet-400",
          },
          {
            id: "del-dato-al-insight",
            bg: "from-[#1a0a2e] to-[#0d0718]",
            badge: "Flujo de Trabajo",
            badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
            eyebrow: "Del Dato al Insight",
            title: (
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Pipeline de <span className="text-purple-400">Análisis</span>
              </h2>
            ),
            subtitle: (
              <p>
                El clustering es una{" "}
                <strong className="text-purple-300">herramienta</strong>, no la
                decisión final. El experto deportivo es quien convierte el grupo
                estadístico en acción de entrenamiento.
              </p>
            ),
            body: (
              <div className="flex flex-col gap-1.5">
                {flujo.map((paso, i) => (
                  <div key={paso} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-[10px] font-bold text-purple-300">
                      {i + 1}
                    </span>
                    <span className="text-xs text-white/60">{paso}</span>
                    {i < flujo.length - 1 && (
                      <span className="text-white/20 text-xs ml-auto">↓</span>
                    )}
                  </div>
                ))}
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
                  <S10C2_Dynamic3IdentificaAlgoritmo weekId={10} classId={2} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

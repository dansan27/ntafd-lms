import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, Lock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import DashboardBlock from "@/components/layout/DashboardBlock";
import ZoomableImage from "@/components/ui/ZoomableImage";
import S12C1_Dynamic2RendimientoExplosivo from "../dynamics/S12C1_Dynamic2RendimientoExplosivo";

export default function S12C1_Block4RendimientoExplosivo() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 12, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic2Active = statuses?.find(s => s.dynamicId === 2)?.isActive ?? false;

  return (
    <div>
      <DashboardBlock
        title="Elementos del Rendimiento Explosivo"
        subtitle="Los cuatro pilares físicos que determinan la capacidad de velocidad y agilidad en el deporte."
        accentColor="from-orange-500 to-red-500"
        headerIcon={<TrendingUp size={22} className="text-orange-300" />}
        sections={[
          {
            id: "cuatro-pilares",
            title: "Los Cuatro Elementos Clave",
            metrics: [
              {
                label: "Velocidad",
                value: "v = d / t",
                unit: "sprint / desplazamiento",
                color: "from-orange-500/20 to-orange-600/10",
                textColor: "text-orange-300",
                description: "Capacidad de desplazarse rápidamente · Depende de potencia muscular · Velocistas alcanzan hasta 12 m/s en máxima velocidad",
              },
              {
                label: "Fuerza",
                value: "F = m × a",
                unit: "base de la potencia",
                color: "from-red-500/20 to-red-600/10",
                textColor: "text-red-300",
                description: "Fuerza máxima como base de producción de potencia · Levantadores aplican fuerzas muy elevadas en mínimo tiempo",
              },
              {
                label: "Explosividad",
                value: "RFD = ΔF / Δt",
                unit: "fuerza / tiempo",
                color: "from-amber-500/20 to-amber-600/10",
                textColor: "text-amber-300",
                description: "Máxima fuerza en el menor tiempo posible · Jugadores de baloncesto necesitan saltos explosivos para llegar a la canasta",
              },
              {
                label: "Agilidad",
                value: "COD + percepción",
                unit: "cambio de dirección",
                color: "from-yellow-500/20 to-yellow-600/10",
                textColor: "text-yellow-300",
                description: "Movimientos rápidos y cambios de dirección · Futbolistas mantienen velocidad al cambiar dirección durante el juego",
              },
            ],
          },
          {
            id: "pilares-visual",
            title: "Los Cuatro Pilares",
            content: (
              <div className="flex justify-center mt-4">
                <div className="max-w-xl w-full">
                  <ZoomableImage
                    src="/images/semana_12/rendimiento_explosivo.png"
                    alt="Cuatro Pilares del Rendimiento Explosivo"
                    className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                  />
                </div>
              </div>
            ),
          },
          {
            id: "relaciones",
            title: "Tests de Referencia por Elemento",
            table: {
              headers: ["Elemento", "Deporte Ejemplo", "Test de Referencia"],
              rows: [
                ["Velocidad", "Sprint 100 m — Usain Bolt 9.58 s", "Fotocélulas a 10 m, 20 m, 40 m"],
                ["Fuerza", "Levantamiento olímpico — arranque", "1RM Sentadilla / CMJ con plataforma"],
                ["Explosividad", "Salto vertical en baloncesto", "CMJ, Reactive Strength Index"],
                ["Agilidad", "Regate en fútbol", "T-Test, Illinois Agility Test"],
              ],
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
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <S12C1_Dynamic2RendimientoExplosivo weekId={12} classId={1} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

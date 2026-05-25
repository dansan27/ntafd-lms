import { AnimatePresence, motion } from "framer-motion";
import { TrendingUp, Gamepad2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import DashboardBlock from "@/components/layout/DashboardBlock";
import S9C2_Dynamic3TendenciasFuturas from "../dynamics/S9C2_Dynamic3TendenciasFuturas";

export default function S9C2_Block7Tendencias() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 9, classId: 2 },
    { refetchInterval: 3000 }
  );
  const isDynamic3Active = statuses?.find(s => s.dynamicId === 3)?.isActive ?? false;

  return (
    <div>
      <DashboardBlock
        title="Limitaciones Actuales y Tendencias Futuras"
        subtitle="La tecnología en salud tiene barreras reales — y un futuro transformador basado en IA, IoT y medicina de precisión."
        accentColor="from-teal-500 to-cyan-500"
        headerIcon={<TrendingUp size={22} className="text-teal-300" />}
        sections={[
          {
            id: "limitaciones",
            title: "Limitaciones actuales",
            icon: <TrendingUp size={14} className="text-teal-400" />,
            table: {
              headers: ["Barrera", "Impacto", "Posible solución"],
              rows: [
                ["Brecha digital", "Acceso limitado en zonas rurales y bajos recursos", "Subsidios tecnológicos, apps offline, SMS-based"],
                ["Costos elevados", "MCG, smartwatches y suscripciones no son accesibles", "Economías de escala, dispositivos genéricos open-source"],
                ["Privacidad y seguridad", "Riesgo de filtración de datos de salud sensibles", "Regulaciones HIPAA/GDPR, cifrado end-to-end"],
                ["Validación científica", "Falta de estudios a largo plazo en poblaciones diversas", "RCTs multicéntricos, colaboración académica global"],
              ],
              highlight: 0,
            },
            callout: {
              type: "warning",
              text: "La equidad en salud digital es el mayor desafío pendiente. La tecnología no debe ampliar la brecha entre quienes tienen acceso y quienes no.",
            },
          },
          {
            id: "tendencias",
            title: "Tendencias futuras en tecnología ECNT",
            icon: <TrendingUp size={14} className="text-teal-400" />,
            metrics: [
              {
                label: "Inteligencia Artificial",
                value: "Personalización masiva",
                icon: <TrendingUp size={16} />,
                color: "from-teal-500/20 to-cyan-500/10 border-teal-500/30",
                textColor: "text-teal-400",
                description: "Algoritmos que analizan big data para predecir recaídas, ajustar tratamientos y personalizar programas de ejercicio.",
              },
              {
                label: "Medicina de precisión",
                value: "Genómica + estilo de vida",
                icon: <TrendingUp size={16} />,
                color: "from-cyan-500/20 to-teal-500/10 border-cyan-500/30",
                textColor: "text-cyan-400",
                description: "Intervenciones basadas en genética individual, microbioma y datos biométricos continuos.",
              },
              {
                label: "IoT + 5G médico",
                value: "Monitoreo ubicuo",
                icon: <TrendingUp size={16} />,
                color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
                textColor: "text-emerald-400",
                description: "Red de dispositivos interconectados (tensiómetro, MCG, wearable) transmitiendo datos en tiempo real al equipo médico.",
              },
              {
                label: "Realidad Aumentada (RA)",
                value: "Educación + rehabilitación",
                icon: <TrendingUp size={16} />,
                color: "from-purple-500/20 to-teal-500/10 border-purple-500/30",
                textColor: "text-purple-400",
                description: "Guía visual superpuesta para ejercicios terapéuticos en casa, cirugía guiada y educación del paciente.",
              },
            ],
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
                  <S9C2_Dynamic3TendenciasFuturas weekId={9} classId={2} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

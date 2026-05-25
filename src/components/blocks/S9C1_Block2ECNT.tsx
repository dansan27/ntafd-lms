import { AnimatePresence, motion } from "framer-motion";
import { Heart, Gamepad2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import DashboardBlock from "@/components/layout/DashboardBlock";
import S9C1_Dynamic1ClasificaECNT from "../dynamics/S9C1_Dynamic1ClasificaECNT";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S9C1_Block2ECNT() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 9, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic1Active = statuses?.find(s => s.dynamicId === 1)?.isActive ?? false;

  return (
    <div>
      <DashboardBlock
        title="¿Qué son las Enfermedades Crónicas No Transmisibles?"
        subtitle="Condiciones de larga duración y progresión lenta que representan el mayor desafío de salud pública global."
        accentColor="from-teal-500 to-cyan-500"
        headerIcon={<Heart size={22} className="text-teal-300" />}
        sections={[
          {
            id: "definicion",
            title: "Definición y principales ECNT",
            icon: <Heart size={14} className="text-teal-400" />,
            metrics: [
              {
                label: "Cardiovasculares",
                value: "44% de muertes ECNT",
                icon: <Heart size={16} />,
                color: "from-red-500/20 to-rose-500/10 border-red-500/30",
                textColor: "text-red-400",
                description: "Infarto al miocardio, ACV, HTA — la causa #1 de muerte global.",
              },
              {
                label: "Cáncer",
                value: "22% de muertes ECNT",
                icon: <Heart size={16} />,
                color: "from-orange-500/20 to-amber-500/10 border-orange-500/30",
                textColor: "text-orange-400",
                description: "Más de 10 millones de muertes anuales. El ejercicio es factor protector.",
              },
              {
                label: "Diabetes",
                value: "4% de muertes ECNT",
                icon: <Heart size={16} />,
                color: "from-teal-500/20 to-cyan-500/10 border-teal-500/30",
                textColor: "text-teal-400",
                description: "537 millones de adultos afectados globalmente (IDF 2021). En crecimiento.",
              },
              {
                label: "Respiratorias crónicas",
                value: "EPOC + asma",
                icon: <Heart size={16} />,
                color: "from-blue-500/20 to-sky-500/10 border-blue-500/30",
                textColor: "text-blue-400",
                description: "Enfermedad Pulmonar Obstructiva Crónica, asociada a tabaco y contaminación.",
              },
            ],
            content: (
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-1.5">
                  <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Diapositiva 3: Definición</p>
                  <ZoomableImage
                    src="/images/semana 9/slide_3.png"
                    alt="Diapositiva 3: Definición de ECNT"
                    className="rounded-xl border border-white/10 shadow-lg w-full object-contain"
                  />
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Diapositiva 4: ¿Qué son las ECNT?</p>
                  <ZoomableImage
                    src="/images/semana 9/slide_4.png"
                    alt="Diapositiva 4: ¿Qué son las ECNT?"
                    className="rounded-xl border border-white/10 shadow-lg w-full object-contain"
                  />
                </div>
              </div>
            ),
          },
          {
            id: "factores",
            title: "Factores de riesgo comunes",
            icon: <Heart size={14} className="text-teal-400" />,
            table: {
              headers: ["Factor modificable", "ECNT asociada", "Intervención tecnológica"],
              rows: [
                ["Sedentarismo", "HTA, DM2, obesidad, cáncer colon", "Smartwatch, apps de pasos, telemedicina"],
                ["Dieta hipercalórica", "Obesidad, DM2, cardiovascular", "Apps de registro nutricional (MyFitnessPal)"],
                ["Tabaquismo", "Cáncer pulmón, EPOC, cardiovascular", "Apps de cesación tabáquica con IA"],
                ["Consumo excesivo alcohol", "Hepática, cardiovascular, cáncer", "Apps de seguimiento y coaching digital"],
              ],
              highlight: 2,
            },
            callout: {
              type: "tip",
              text: "Los factores de riesgo de las ECNT son mayoritariamente modificables. El ejercicio físico regular reduce el riesgo de HTA, DM2, ciertos cánceres y enfermedades cardiovasculares.",
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
                  <S9C1_Dynamic1ClasificaECNT weekId={9} classId={1} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { trpc } from "@/lib/trpc";
import DashboardBlock from "@/components/layout/DashboardBlock";
import ZoomableImage from "@/components/ui/ZoomableImage";
import S12C1_Dynamic1VelocidadOAngular from "../dynamics/S12C1_Dynamic1VelocidadOAngular";

export default function S12C1_Block2VelocidadLinealAngular() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 12, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic1Active = statuses?.find(s => s.dynamicId === 1)?.isActive ?? false;

  return (
    <div>
      <DashboardBlock
        title="Velocidad Lineal y Angular"
        subtitle="Dos formas de medir qué tan rápido se desplaza o rota un objeto en el contexto deportivo."
        accentColor="from-orange-500 to-amber-500"
        headerIcon={<Activity size={22} className="text-orange-300" />}
        sections={[
          {
            id: "conceptos-velocidad",
            title: "Definiciones y Fórmulas",
            metrics: [
              {
                label: "Velocidad Lineal",
                value: "v = d / t",
                unit: "m/s",
                color: "from-orange-500/20 to-orange-600/10",
                textColor: "text-orange-300",
                description: "Qué tan rápido se desplaza un objeto en línea recta · Ejemplo: Usain Bolt a 10.44 m/s en los 100m",
              },
              {
                label: "Velocidad Angular",
                value: "ω = θ / t",
                unit: "rad/s",
                color: "from-amber-500/20 to-amber-600/10",
                textColor: "text-amber-300",
                description: "Qué tan rápido rota un cuerpo · Ejemplo: velocidad angular de la muñeca durante el saque de tenis",
              },
              {
                label: "Relación v y ω",
                value: "v = ω × r",
                unit: "lineal ↔ angular",
                color: "from-yellow-500/20 to-yellow-600/10",
                textColor: "text-yellow-300",
                description: "La velocidad lineal en el borde de un segmento depende de la velocidad angular y el radio de giro",
              },
            ],
          },
          {
            id: "conceptos-visuales",
            title: "Visualización",
            content: (
              <div className="flex justify-center mt-4">
                <div className="max-w-xl w-full">
                  <ZoomableImage
                    src="/images/semana_12/velocidad_lineal_angular.png"
                    alt="Velocidad Lineal y Angular en el Deporte"
                    className="w-full h-auto object-contain rounded-2xl border border-white/10 bg-white/5 p-4"
                  />
                </div>
              </div>
            ),
          },
          {
            id: "ejemplos-deportivos",
            title: "Ejemplos por Deporte",
            table: {
              headers: ["Deporte", "Tipo de Velocidad", "Ejemplo"],
              rows: [
                ["Atletismo", "Lineal", "Sprint 100 m — velocidad horizontal máxima (Usain Bolt)"],
                ["Tenis", "Angular", "Muñeca en saque — velocidad angular para potencia de pelota"],
                ["Ciclismo", "Angular → Lineal", "Cadencia (rpm) × radio de rueda = velocidad en carretera"],
                ["Natación", "Angular", "Frecuencia de brazada — rotación de hombro y cadera"],
                ["Baloncesto", "Lineal + Angular", "Aceleración en fast break + rotación de tronco en pase"],
              ],
            },
          },
          {
            id: "medicion",
            title: "Tecnologías de Medición",
            callout: {
              type: "info",
              text: "Velocidad lineal: fotocélulas, GPS deportivo, sistemas de captura de movimiento. Velocidad angular: encoders rotatorios, giroscopios (IMUs 9-DOF) o análisis cinemático 3D con marcadores reflectivos.",
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
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <S12C1_Dynamic1VelocidadOAngular weekId={12} classId={1} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

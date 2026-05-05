import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Radio, Lock, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import S5_Dynamic2ErrorPulso from "../dynamics/S5_Dynamic2ErrorPulso";

const ERRORS = [
  {
    icon: "🥶",
    title: "Mala Circulación",
    cause: "Hipotermia, vasoconstricción, shock",
    effect: "Falta de flujo sanguíneo → señal débil o nula",
    severity: "Alta",
    sev: "bg-red-500/20 text-red-400",
  },
  {
    icon: "🤸",
    title: "Movimiento",
    cause: "Temblor, artefactos durante la medición",
    effect: "Fluctuaciones en absorción → lecturas erráticas",
    severity: "Alta",
    sev: "bg-red-500/20 text-red-400",
  },
  {
    icon: "🎨",
    title: "Pigmentación de Piel",
    cause: "Piel oscura, tatuajes, hematomas, nicotina",
    effect: "Altera la absorción de luz → menor precisión",
    severity: "Media",
    sev: "bg-yellow-500/20 text-yellow-400",
  },
  {
    icon: "💅",
    title: "Esmalte de Uñas",
    cause: "Colores oscuros (negro, azul, verde), uñas acrílicas",
    effect: "Bloquea o altera la luz → lecturas falsas",
    severity: "Media",
    sev: "bg-yellow-500/20 text-yellow-400",
  },
  {
    icon: "☀️",
    title: "Luz Ambiental Intensa",
    cause: "Sol directo, lámparas fluorescentes",
    effect: "Ruido en la señal → medición alterada",
    severity: "Media",
    sev: "bg-yellow-500/20 text-yellow-400",
  },
  {
    icon: "😮‍💨",
    title: "Hipoxemia Severa",
    cause: "Niveles extremadamente bajos de O₂",
    effect: "Subestimación de SpO₂ — peligroso clínicamente",
    severity: "Crítica",
    sev: "bg-red-600/30 text-red-300",
  },
  {
    icon: "🩸",
    title: "Anemia Severa",
    cause: "Nivel muy bajo de hemoglobina",
    effect: "SpO₂ relativa ok, pero cantidad absoluta de O₂ insuficiente",
    severity: "Media",
    sev: "bg-yellow-500/20 text-yellow-400",
  },
  {
    icon: "❄️",
    title: "Temperatura de la Piel",
    cause: "Piel fría, sudoración, extremidades frías",
    effect: "Reduce perfusión periférica → lecturas inexactas",
    severity: "Baja",
    sev: "bg-blue-500/20 text-blue-400",
  },
];

export default function S5_Block4ErroresMedicion() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 5, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic2Active = statuses?.find(s => s.dynamicId === 2)?.isActive ?? false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Radio size={14} /> Bloque 4 — Factores que Alteran la Medición
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
          8 cosas que lo <span className="text-primary">engañan</span>
        </h2>
        <p className="text-muted-foreground text-base max-w-lg mx-auto">
          El pulsioxímetro es preciso en condiciones ideales. Conoce cuándo no confiar en él.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ERRORS.map((e, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.07 }}>
            <Card className="border-border h-full">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{e.icon}</span>
                    <p className="font-bold text-sm">{e.title}</p>
                  </div>
                  <Badge className={`text-[10px] shrink-0 ${e.sev}`}>{e.severity}</Badge>
                </div>
                <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground/70">Causa:</span> {e.cause}</p>
                <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground/70">Efecto:</span> {e.effect}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Dynamic 2 gate */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            {isDynamic2Active ? (
              <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
                <Gamepad2 size={14} /> Dinámica Activa
              </Badge>
            ) : (
              <Button variant="outline" disabled className="gap-2 opacity-60">
                <Lock size={14} /> El profesor activará esta dinámica
              </Button>
            )}
          </div>
        </div>
        <AnimatePresence>
          {isDynamic2Active && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
              <S5_Dynamic2ErrorPulso />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}

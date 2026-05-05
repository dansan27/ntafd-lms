import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smartphone, Lock, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import S5_Dynamic3SmartvsOxi from "../dynamics/S5_Dynamic3SmartvsOxi";
import S5_ComparadorSmartVsOxi from "./S5_ComparadorSmartVsOxi";

const COMPARISON = [
  {
    feature: "LED principal (FC)",
    oximetro: "Rojo 660 nm",
    smartwatch: "Verde 520 nm",
    note: "El verde es menos reflectivo — más señal en muñeca",
  },
  {
    feature: "LED SpO₂",
    oximetro: "Infrarrojo 940 nm",
    smartwatch: "Infrarrojo 940 nm",
    note: "Mismo principio — distinta posición anatómica",
  },
  {
    feature: "Ubicación del sensor",
    oximetro: "Dedo / lóbulo",
    smartwatch: "Muñeca",
    note: "La muñeca tiene menos flujo capilar → más ruido",
  },
  {
    feature: "Precisión FC en reposo",
    oximetro: "99%",
    smartwatch: "91–97%",
    note: "Depende del modelo y contacto con piel",
  },
  {
    feature: "Precisión FC en ejercicio",
    oximetro: "96%",
    smartwatch: "78–88%",
    note: "Movimiento genera artefactos — punto débil del smartwatch",
  },
  {
    feature: "Uso clínico",
    oximetro: "✓ Certificado FDA/CE",
    smartwatch: "Solo orientativo",
    note: "No reemplaza al dispositivo médico",
  },
];

const GREEN_LED = {
  title: "¿Por qué LED verde en el smartwatch?",
  points: [
    "La luz verde (500–565 nm) es absorbida eficientemente por la hemoglobina",
    "La sangre refleja POCO la luz verde — alta diferencia pulsátil → buena señal FC",
    "Penetra bien en tejido superficial → ideal para muñeca",
    "Desventaja: más susceptible al artefacto de movimiento que el IR",
  ],
};

export default function S5_Block5Smartwatch() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 5, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic3Active = statuses?.find(s => s.dynamicId === 3)?.isActive ?? false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Smartphone size={14} /> Bloque 5 — Smartwatch vs Pulsioxímetro
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
          Mismo principio, <span className="text-primary">diferente luz</span>
        </h2>
        <p className="text-muted-foreground text-base max-w-lg mx-auto">
          Ambos usan fotopletismografía (PPG) — pero con longitudes de onda distintas y en posiciones distintas del cuerpo.
        </p>
      </motion.div>

      {/* Green LED explanation */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💚</span>
              <p className="font-bold">{GREEN_LED.title}</p>
            </div>
            <ul className="space-y-2">
              {GREEN_LED.points.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Comparador interactivo */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <S5_ComparadorSmartVsOxi />
      </motion.div>

      {/* Comparison table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="space-y-2">
          <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 px-4 pb-1">
            <span className="text-xs font-bold text-muted-foreground uppercase">Característica</span>
            <span className="text-xs font-bold text-red-400 uppercase text-center">Pulsioxímetro</span>
            <span className="text-xs font-bold text-blue-400 uppercase text-center">Smartwatch</span>
          </div>
          {COMPARISON.map((row, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.07 }}>
              <Card className="border-border">
                <CardContent className="p-3">
                  <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 items-center">
                    <div>
                      <p className="text-xs font-bold">{row.feature}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{row.note}</p>
                    </div>
                    <p className="text-xs text-red-300 font-medium text-center">{row.oximetro}</p>
                    <p className="text-xs text-blue-300 font-medium text-center">{row.smartwatch}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Dynamic 3 gate */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            {isDynamic3Active ? (
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
          {isDynamic3Active && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
              <S5_Dynamic3SmartvsOxi />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}

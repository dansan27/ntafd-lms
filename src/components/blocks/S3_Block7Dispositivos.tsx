import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smartphone, Lock, Gamepad2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import S3C2_Dynamic3ClasificaDispositivo from "../dynamics/S3C2_Dynamic3ClasificaDispositivo";

// Data from PDF: Polar H10 vs AR12plus comparison table
const COMPARISON_DATA = [
  { condition: "Sentado/Leyendo", total: 3248, polar: 0.12, ar12: 0.15 },
  { condition: "Tareas del hogar", total: 4047, polar: 0.24, ar12: 0.27 },
  { condition: "Caminando", total: 4673, polar: 0.08, ar12: 0.04 },
  { condition: "Trotando", total: 7229, polar: 0.72, ar12: 12.15 },
  { condition: "Fuerza / Pesas", total: 5818, polar: 0.38, ar12: 7.80 },
  { condition: "TOTAL", total: 25015, polar: 0.36, ar12: 5.40 },
];

const POLAR_FEATURES = [
  "Sensor de alta precisión para medir FC en tiempo real",
  "Sistema de electrodos de contacto en el pecho",
  "Configuración simplificada de 2 electrodos (vs. 12 del ECG estándar)",
  "Transmisión Bluetooth 5.0 + ANT+ para conectar con apps",
  "Memoria interna para almacenar sesiones sin smartphone",
  "Compatible con TrainingPeaks, Strava, Garmin Connect, etc.",
];

const USE_CASES = [
  { emoji: "🏃", title: "Running y trail", desc: "Monitoreo de FC durante entrenamiento. Menor error que óptico en intensidades altas.", winner: "Polar H10" },
  { emoji: "🚴", title: "Ciclismo", desc: "Combinado con potenciómetro para control de zonas de entrenamiento.", winner: "Polar H10" },
  { emoji: "🏊", title: "Natación", desc: "Resistente al agua (30 m). Almacena datos en memoria interna.", winner: "Polar H10" },
  { emoji: "🏥", title: "Investigación / Clínica", desc: "Diagnóstico de arritmias, estudio de morfología de onda. Necesita 12 derivaciones.", winner: "ECG Clínico" },
];

export default function S3_Block7Dispositivos() {
  const [, params] = useRoute("/week/:week/class/:class");
  const classId = params ? parseInt(params.class, 10) : 2;

  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 3, classId },
    { refetchInterval: 3000 }
  );
  const isDynamic3Active = statuses?.find(s => s.dynamicId === 3)?.isActive ?? false;

  const maxError = Math.max(...COMPARISON_DATA.slice(0, -1).map(d => d.ar12));

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Smartphone size={14} />
          Bloque 7 — Dispositivos: Polar H10
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Del laboratorio al <span className="text-primary">campo deportivo</span>
        </h1>
      </motion.div>

      {/* Polar H10 hero card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <Badge className="bg-primary/20 text-primary border-primary/30">Sensor Recomendado</Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Polar H10</h2>
                <p className="text-white/60 text-sm">
                  Sensor de frecuencia cardíaca de pecho con precisión clínica, diseñado para capturar
                  el ritmo cardíaco en tiempo real durante actividad física de alta intensidad.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Bluetooth 5.0", "ANT+", "Waterproof 30m", "Memoria interna"].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Device visualization */}
              <div className="flex justify-center">
                <div className="relative w-40 h-24">
                  {/* Chest strap body */}
                  <div className="absolute inset-x-0 bottom-2 h-6 bg-white/10 rounded-full" />
                  {/* Sensor pod */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <div className="space-y-1 text-center">
                      <motion.div
                        className="w-4 h-4 rounded-full bg-primary mx-auto"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <p className="text-white/60 text-[9px] font-mono">H10</p>
                    </div>
                  </div>
                  {/* Signal rings */}
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20"
                      style={{ width: 20 + i * 20, height: 20 + i * 20 }}
                      animate={{ opacity: [0.8, 0, 0.8], scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Animated comparison chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-center">
          Polar H10 vs. Medilog AR12plus — Errores por actividad
        </h3>
        <p className="text-xs text-center text-muted-foreground">
          % de intervalos RR con error · Estudio de validación (n=25,015 intervalos)
        </p>
        <div className="space-y-3">
          {COMPARISON_DATA.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className={`space-y-1 ${i === COMPARISON_DATA.length - 1 ? "pt-2 border-t border-border" : ""}`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${i === COMPARISON_DATA.length - 1 ? "font-bold" : ""}`}>{row.condition}</span>
                <div className="flex gap-4">
                  <span className="text-primary font-semibold">H10: {row.polar}%</span>
                  <span className="text-slate-500">AR12: {row.ar12}%</span>
                </div>
              </div>
              <div className="flex gap-1 h-4">
                <div className="flex-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max((row.polar / maxError) * 100, 2)}%` }}
                    transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                  />
                </div>
                <div className="flex-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${row.ar12 > 5 ? "bg-red-400" : "bg-slate-400"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max((row.ar12 / maxError) * 100, 2)}%` }}
                    transition={{ duration: 1, delay: 0.7 + i * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-4 justify-center text-xs">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-primary" /> Polar H10</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-400" /> AR12plus</div>
        </div>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="text-emerald-600 mx-auto mb-1" size={18} />
            <p className="text-sm font-semibold text-emerald-800">El Polar H10 gana en actividades de alta intensidad</p>
            <p className="text-xs text-emerald-700 mt-1">
              En trotando: 0.72% error (H10) vs 12.15% error (AR12plus). 17× más preciso en movimiento.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card>
          <CardContent className="p-5 space-y-3">
            <h3 className="font-bold">Características técnicas del Polar H10</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {POLAR_FEATURES.map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + i * 0.07 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="text-primary font-bold flex-shrink-0">→</span>
                  {feat}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Use cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {USE_CASES.map((uc, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 + i * 0.1 }}
            whileHover={{ y: -3 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{uc.emoji}</span>
                  <p className="font-semibold">{uc.title}</p>
                  <Badge variant="outline" className={`ml-auto text-xs ${uc.winner === "Polar H10" ? "text-primary border-primary/30" : "text-slate-500"}`}>
                    {uc.winner}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{uc.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Dynamic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
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
                <Lock size={14} />
                El profesor activará esta dinámica
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
              <S3C2_Dynamic3ClasificaDispositivo />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Lock, Gamepad2, ChevronDown, ChevronUp, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import S3_Dynamic1ClasificaMetodo from "../dynamics/S3_Dynamic1ClasificaMetodo";

const METHODS = [
  {
    id: "gases",
    name: "Análisis de Gases",
    tipo: "Directo",
    esfuerzo: "Máximo",
    equipment: "Espirómetro + analizador de gases",
    precision: "Alta",
    precisionColor: "text-emerald-500",
    tipoColor: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
    esfuerzoColor: "bg-red-500/10 text-red-700 border-red-500/30",
    desc: "Gold standard. Mide directamente el O₂ consumido y el CO₂ producido durante el ejercicio mediante una mascarilla conectada a un analizador.",
    pros: ["Máxima precisión — medición real", "Método de referencia para validar otros tests"],
    cons: ["Equipamiento costoso y especializado", "Requiere personal entrenado"],
    emoji: "🫁",
  },
  {
    id: "cooper",
    name: "Test de Cooper",
    tipo: "Indirecto",
    esfuerzo: "Máximo",
    equipment: "Cronómetro + pista atlética",
    precision: "Moderada",
    precisionColor: "text-amber-500",
    tipoColor: "bg-violet-500/10 text-violet-700 border-violet-500/30",
    esfuerzoColor: "bg-red-500/10 text-red-700 border-red-500/30",
    desc: "Correr la mayor distancia posible en 12 minutos. El VO₂ Máx se estima con la fórmula: (distancia en m − 504.9) / 44.73.",
    pros: ["Económico y fácil de aplicar en campo", "Puede aplicarse a grupos grandes"],
    cons: ["Requiere motivación máxima del sujeto", "Afectado por habilidad de paso del corredor"],
    emoji: "🏃",
  },
  {
    id: "bruce",
    name: "Protocolo de Bruce",
    tipo: "Indirecto",
    esfuerzo: "Máximo",
    equipment: "Cinta rodante + cronómetro",
    precision: "Moderada",
    precisionColor: "text-amber-500",
    tipoColor: "bg-violet-500/10 text-violet-700 border-violet-500/30",
    esfuerzoColor: "bg-red-500/10 text-red-700 border-red-500/30",
    desc: "Protocolo incremental en cinta. Cada 3 min aumenta velocidad e inclinación. El VO₂ se estima por el tiempo total completado.",
    pros: ["Ampliamente usado en cardiología clínica", "Bien documentado y validado"],
    cons: ["Requiere cinta rodante con control de inclinación", "Las ecuaciones de predicción tienen margen de error"],
    emoji: "🏋️",
  },
  {
    id: "astrand",
    name: "Test de Åstrand-Rhyming",
    tipo: "Indirecto",
    esfuerzo: "Submáximo",
    equipment: "Cicloergómetro + monitor FC",
    precision: "Moderada",
    precisionColor: "text-amber-500",
    tipoColor: "bg-violet-500/10 text-violet-700 border-violet-500/30",
    esfuerzoColor: "bg-blue-500/10 text-blue-700 border-blue-500/30",
    desc: "6 minutos en cicloergómetro a carga constante al 50-70% FCmáx. Usa nomograma o ecuación para estimar VO₂ Máx.",
    pros: ["Más seguro — no requiere esfuerzo máximo", "Útil en pacientes cardíacos y personas mayores"],
    cons: ["Mayor margen de error que tests máximos", "Requiere FC estable en estado estacionario"],
    emoji: "🚴",
  },
  {
    id: "6min",
    name: "Test de 6 Minutos Marcha",
    tipo: "Indirecto",
    esfuerzo: "Submáximo",
    equipment: "Cronómetro + corredor de 30 m",
    precision: "Baja",
    precisionColor: "text-slate-500",
    tipoColor: "bg-violet-500/10 text-violet-700 border-violet-500/30",
    esfuerzoColor: "bg-blue-500/10 text-blue-700 border-blue-500/30",
    desc: "Máxima distancia caminando en 6 minutos en corredor de 30 m. Usado principalmente en poblaciones clínicas.",
    pros: ["Muy seguro y fácil de administrar", "Estándar en insuficiencia cardíaca y EPOC"],
    cons: ["Baja precisión para deportistas", "Refleja limitaciones funcionales más que VO₂ puro"],
    emoji: "🚶",
  },
  {
    id: "lactato",
    name: "Prueba de Lactato",
    tipo: "Indirecto",
    esfuerzo: "Submáximo",
    equipment: "Lactómetro + monitor FC",
    precision: "Moderada",
    precisionColor: "text-amber-500",
    tipoColor: "bg-violet-500/10 text-violet-700 border-violet-500/30",
    esfuerzoColor: "bg-blue-500/10 text-blue-700 border-blue-500/30",
    desc: "Muestras de sangre (lóbulo oreja) a cargas incrementales. Determina umbrales de lactato (VT1, VT2) y correlaciona con VO₂ Máx.",
    pros: ["Identifica umbrales de entrenamiento precisos", "Información adicional sobre metabolismo anaeróbico"],
    cons: ["Invasivo (extracción de sangre)", "Requiere lactómetro y personal calificado"],
    emoji: "🩸",
  },
];

export default function S3_Block4MetodosMedicion() {
  const [expanded, setExpanded] = useState<string | null>("gases");

  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 3, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic1Active = statuses?.find(s => s.dynamicId === 1)?.isActive ?? false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <FlaskConical size={14} />
          Bloque 4 — Métodos de Medición
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          ¿Cómo se <span className="text-primary">mide</span> el VO₂ Máx?
        </h1>
      </motion.div>

      {/* Classification overview */}
      <AnimatePresence mode="wait">
        {!isDynamic1Active && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-10"
          >
            {/* Direct vs Indirect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 gap-4"
            >
              <Card className="border-l-4 border-emerald-500">
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-500/10">
                      <span className="text-xl">🫁</span>
                    </div>
                    <div>
                      <p className="font-bold">Método Directo</p>
                      <p className="text-xs text-muted-foreground">Medición real del O₂</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Mide directamente los gases respiratorios con espirómetro. Es el <strong>gold standard</strong>.
                    Solo el análisis de gases entra en esta categoría.
                  </p>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 text-xs">1 método</Badge>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-violet-500">
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-violet-500/10">
                      <span className="text-xl">📐</span>
                    </div>
                    <div>
                      <p className="font-bold">Métodos Indirectos</p>
                      <p className="text-xs text-muted-foreground">Estimación por rendimiento o FC</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Estiman el VO₂ Máx mediante ecuaciones basadas en distancia recorrida,
                    tiempo completado o frecuencia cardíaca.
                  </p>
                  <Badge variant="outline" className="text-violet-600 border-violet-500/30 text-xs">5 métodos</Badge>
                </CardContent>
              </Card>
            </motion.div>

            {/* Methods list */}
            <div className="space-y-3">
              {METHODS.map((method, i) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <button
                        onClick={() => setExpanded(expanded === method.id ? null : method.id)}
                        className="w-full p-4 flex items-center gap-3 text-left hover:bg-muted/30 transition-colors"
                      >
                        <span className="text-2xl flex-shrink-0">{method.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold">{method.name}</p>
                            <Badge variant="outline" className={`text-xs ${method.tipoColor}`}>{method.tipo}</Badge>
                            <Badge variant="outline" className={`text-xs ${method.esfuerzoColor}`}>{method.esfuerzo}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{method.equipment}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs font-medium ${method.precisionColor}`}>
                            Precisión: {method.precision}
                          </span>
                          {expanded === method.id ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {expanded === method.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <div className="px-5 pb-5 pt-2 border-t border-border space-y-3">
                              <p className="text-sm text-muted-foreground">{method.desc}</p>
                              <div className="grid md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-emerald-600">Ventajas</p>
                                  {method.pros.map((p, j) => (
                                    <div key={j} className="flex items-start gap-1.5">
                                      <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                      <p className="text-xs text-muted-foreground">{p}</p>
                                    </div>
                                  ))}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-red-500">Limitaciones</p>
                                  {method.cons.map((c, j) => (
                                    <div key={j} className="flex items-start gap-1.5">
                                      <XCircle size={12} className="text-red-400 mt-0.5 flex-shrink-0" />
                                      <p className="text-xs text-muted-foreground">{c}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic divider */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            {isDynamic1Active ? (
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
          {isDynamic1Active && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <S3_Dynamic1ClasificaMetodo />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

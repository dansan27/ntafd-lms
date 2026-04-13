import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Lock, Gamepad2, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import S3C1_Dynamic3InterpretaVO2 from "../dynamics/S3C1_Dynamic3InterpretaVO2";

const CLASSIFICATION = [
  { label: "Excelente",     men: ">55",   women: ">50",   color: "bg-emerald-500", textColor: "text-emerald-700", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-400" },
  { label: "Bueno",         men: "45–55", women: "40–50", color: "bg-blue-500",    textColor: "text-blue-700",    bg: "bg-blue-50 dark:bg-blue-950/30",    border: "border-blue-400" },
  { label: "Promedio",      men: "38–45", women: "33–40", color: "bg-amber-400",   textColor: "text-amber-700",   bg: "bg-amber-50 dark:bg-amber-950/30",  border: "border-amber-400" },
  { label: "Bajo promedio", men: "30–38", women: "25–33", color: "bg-orange-500",  textColor: "text-orange-700",  bg: "bg-orange-50 dark:bg-orange-950/30",border: "border-orange-400" },
  { label: "Deficiente",    men: "<30",   women: "<25",   color: "bg-red-500",     textColor: "text-red-700",     bg: "bg-red-50 dark:bg-red-950/30",      border: "border-red-400" },
];

const SPORTS = [
  { sport: "Ciclismo de ruta (élite)",  emoji: "🚴", vo2: 85, range: "80–90",  color: "bg-primary" },
  { sport: "Esquí de fondo (élite)",    emoji: "⛷️", vo2: 87, range: "85–90",  color: "bg-primary" },
  { sport: "Atletismo fondo (élite)",   emoji: "🏃", vo2: 75, range: "70–80",  color: "bg-blue-500" },
  { sport: "Natación (élite)",          emoji: "🏊", vo2: 70, range: "65–75",  color: "bg-cyan-500" },
  { sport: "Fútbol (profesional)",      emoji: "⚽", vo2: 60, range: "55–65",  color: "bg-emerald-500" },
  { sport: "Deportes de fuerza",        emoji: "🏋️", vo2: 50, range: "45–55",  color: "bg-amber-500" },
];

// SVG path for two aging curves (trained vs untrained)
const MAX_VO2 = 90;
const AGES = [20, 25, 30, 35, 40, 45, 50, 55, 60];
const W = 280;
const H = 90;
function ageX(age: number) { return ((age - 20) / 40) * W + 10; }
function trainedY(age: number) { const v = Math.max(40, 70 - Math.max(0, age - 25) * 0.7); return H - (v / MAX_VO2) * H + 5; }
function untrainedY(age: number) { const v = Math.max(20, 50 - Math.max(0, age - 25) * 1.0); return H - (v / MAX_VO2) * H + 5; }
function buildPath(fn: (a: number) => number) {
  return AGES.map((a, i) => `${i === 0 ? "M" : "L"} ${ageX(a).toFixed(1)} ${fn(a).toFixed(1)}`).join(" ");
}

export default function S3C1_Block6Valores() {
  const [, params] = useRoute("/week/:week/class/:class");
  const classId = params ? parseInt(params.class, 10) : 1;
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 3, classId },
    { refetchInterval: 3000 }
  );
  const isDynamic3Active = statuses?.find((s) => s.dynamicId === 3)?.isActive ?? false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <BarChart3 size={14} />
          Bloque 6 — Valores de Referencia
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          ¿Cuál es tu <span className="text-primary">nivel</span> de VO₂ Máx?
        </h1>
      </motion.div>

      <AnimatePresence mode="wait">
        {!isDynamic3Active && (
          <motion.div
            key="valores-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            {/* Classification table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <h3 className="font-semibold text-center">Clasificación por nivel (ml/kg/min)</h3>
              <div className="space-y-2">
                {CLASSIFICATION.map((row, i) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <Card className={`border-l-4 ${row.border} ${row.bg}`}>
                      <CardContent className="p-3 flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${row.color} flex-shrink-0`} />
                        <span className={`font-semibold text-sm w-28 flex-shrink-0 ${row.textColor}`}>{row.label}</span>
                        <div className="flex gap-6 text-sm">
                          <span className="text-muted-foreground">♂ <strong>{row.men}</strong></span>
                          <span className="text-muted-foreground">♀ <strong>{row.women}</strong></span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sports bar chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <h3 className="font-semibold text-center">VO₂ Máx en deportistas de élite</h3>
              <Card>
                <CardContent className="p-5 space-y-3">
                  {SPORTS.map((s, i) => (
                    <motion.div
                      key={s.sport}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-xl w-7 flex-shrink-0 text-center">{s.emoji}</span>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{s.sport}</span>
                          <span className="text-xs font-bold text-muted-foreground">{s.range} ml/kg/min</span>
                        </div>
                        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${s.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(s.vo2 / 90) * 100}%` }}
                            transition={{ duration: 1.1, delay: 1.0 + i * 0.1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Age decay chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 justify-center">
                <TrendingDown size={16} className="text-orange-500" />
                <h3 className="font-semibold text-center">Declive del VO₂ Máx con la edad</h3>
              </div>
              <Card>
                <CardContent className="p-5 space-y-2">
                  <svg viewBox={`0 0 ${W + 20} ${H + 20}`} className="w-full h-32">
                    {/* Axes */}
                    <line x1="10" y1={H + 5} x2={W + 10} y2={H + 5} stroke="hsl(var(--border))" strokeWidth="1" />
                    <line x1="10" y1="5" x2="10" y2={H + 5} stroke="hsl(var(--border))" strokeWidth="1" />
                    {/* Age labels */}
                    {AGES.filter((_, i) => i % 2 === 0).map((age) => (
                      <text key={age} x={ageX(age)} y={H + 17} textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))">{age}</text>
                    ))}
                    {/* Trained line */}
                    <motion.path
                      d={buildPath(trainedY)}
                      stroke="hsl(var(--primary))"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.6, delay: 1.8, ease: "easeInOut" }}
                    />
                    {/* Untrained line */}
                    <motion.path
                      d={buildPath(untrainedY)}
                      stroke="hsl(var(--destructive))"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="6 3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.6, delay: 2.0, ease: "easeInOut" }}
                    />
                  </svg>
                  <div className="flex gap-4 justify-center text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-0.5 bg-primary rounded" />
                      <span className="text-muted-foreground">Entrenado</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-px bg-destructive rounded border-dashed" style={{ borderTop: "2px dashed" }} />
                      <span className="text-muted-foreground">No entrenado</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="bg-muted/40 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-destructive">~1%</p>
                      <p className="text-xs text-muted-foreground">declive anual tras los 25 sin entrenamiento</p>
                    </div>
                    <div className="bg-muted/40 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-primary">+15–25%</p>
                      <p className="text-xs text-muted-foreground">mejora posible con entrenamiento aeróbico</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic divider */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
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
              <S3C1_Dynamic3InterpretaVO2 />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

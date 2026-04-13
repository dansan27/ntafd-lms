import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Zone = 1 | 2 | 3 | 4 | 5;

const ZONES: Record<Zone, { label: string; range: string; description: string; color: string; hoverBg: string; activeBg: string; textColor: string }> = {
  1: { label: "Zona 1", range: "50-60% VO₂", description: "Recuperación activa",        color: "bg-sky-500",    hoverBg: "hover:bg-sky-50 hover:border-sky-400 dark:hover:bg-sky-950/30",       activeBg: "bg-sky-100 border-sky-400 text-sky-800 dark:bg-sky-950/50 dark:border-sky-600 dark:text-sky-300",    textColor: "text-sky-700 dark:text-sky-400" },
  2: { label: "Zona 2", range: "60-70% VO₂", description: "Base aeróbica",              color: "bg-green-500",  hoverBg: "hover:bg-green-50 hover:border-green-400 dark:hover:bg-green-950/30",  activeBg: "bg-green-100 border-green-400 text-green-800 dark:bg-green-950/50 dark:border-green-600 dark:text-green-300", textColor: "text-green-700 dark:text-green-400" },
  3: { label: "Zona 3", range: "70-80% VO₂", description: "Tempo / Umbral aeróbico",   color: "bg-yellow-500", hoverBg: "hover:bg-yellow-50 hover:border-yellow-400 dark:hover:bg-yellow-950/30", activeBg: "bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-950/50 dark:border-yellow-600 dark:text-yellow-700", textColor: "text-yellow-700 dark:text-yellow-400" },
  4: { label: "Zona 4", range: "80-90% VO₂", description: "Umbral anaeróbico",         color: "bg-orange-500", hoverBg: "hover:bg-orange-50 hover:border-orange-400 dark:hover:bg-orange-950/30", activeBg: "bg-orange-100 border-orange-400 text-orange-800 dark:bg-orange-950/50 dark:border-orange-600 dark:text-orange-300", textColor: "text-orange-700 dark:text-orange-400" },
  5: { label: "Zona 5", range: "90-100% VO₂", description: "VO₂ Máx / Intervalo máx", color: "bg-red-500",    hoverBg: "hover:bg-red-50 hover:border-red-400 dark:hover:bg-red-950/30",       activeBg: "bg-red-100 border-red-400 text-red-800 dark:bg-red-950/50 dark:border-red-600 dark:text-red-300",    textColor: "text-red-700 dark:text-red-400" },
};

const SCENARIOS: {
  scenario: string;
  answer: Zone;
  options: Zone[];
  explanation: string;
  emoji: string;
}[] = [
  {
    emoji: "🗣️",
    scenario: "El atleta corre a paso conversacional, puede hablar fácilmente durante 60 minutos",
    answer: 2,
    options: [1, 2, 3, 4],
    explanation: "La 'prueba de la conversación' es el marcador clásico de Zona 2. A 60-70% VO₂ Máx se entrena la base aeróbica sin acidosis; el lactato se mantiene bajo (~2 mmol/L).",
  },
  {
    emoji: "⚡",
    scenario: "Intervalos de 30 segundos al sprint máximo, recuperación completa entre series",
    answer: 5,
    options: [3, 4, 5, 2],
    explanation: "Un sprint máximo de 30 segundos demanda el 100% de la capacidad aeróbica y glucolítica. Esto corresponde a Zona 5 (90-100% VO₂ Máx), donde el estímulo es el VO₂ Máx.",
  },
  {
    emoji: "😴",
    scenario: "Sesión de recuperación tras competencia, frecuencia cardíaca muy baja",
    answer: 1,
    options: [1, 2, 3, 4],
    explanation: "La sesión de recuperación activa opera al 50-60% VO₂ Máx (Zona 1). Favorece el flujo sanguíneo para eliminar residuos metabólicos sin generar fatiga adicional.",
  },
  {
    emoji: "🏁",
    scenario: "Carrera continua 45 min a ritmo de competencia de 10K",
    answer: 4,
    options: [2, 3, 4, 5],
    explanation: "El ritmo de 10K se sostiene alrededor del umbral anaeróbico (80-90% VO₂ Máx, Zona 4). El lactato está elevado (~4 mmol/L) pero en equilibrio durante la carrera.",
  },
  {
    emoji: "🌄",
    scenario: "Entrenamiento largo de fondo (LSD) a 2-3 horas, ritmo cómodo pero sostenido",
    answer: 2,
    options: [1, 2, 3, 4],
    explanation: "El Long Slow Distance (LSD) es el pilar de la Zona 2. A 60-70% VO₂ Máx se optimizan las adaptaciones mitocondriales y la oxidación de grasas sin agotar las reservas.",
  },
  {
    emoji: "🔬",
    scenario: "Series de 4 minutos al 90% FCmáx con 3 min recuperación (protocolo Helgerud HIIT)",
    answer: 5,
    options: [3, 4, 5, 2],
    explanation: "El protocolo Helgerud de 4×4 min busca acumular tiempo en Zona 5 (≥90% FCmáx ≈ 90-100% VO₂ Máx). Estudios demuestran que es el estímulo más eficaz para aumentar el VO₂ Máx.",
  },
];

interface Props { weekId?: number; classId?: number; }

export default function S3C1_Dynamic4ZonasTren({ weekId = 3, classId = 1 }: Props) {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<{ selected: Zone; correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => toast.success(`Completado: ${data.score}/${data.maxScore}`),
    onError: (err) => toast.error(err.message),
  });

  const current = SCENARIOS[currentIndex];
  const progress = ((currentIndex + (finished ? 1 : 0)) / SCENARIOS.length) * 100;
  const correctCount = answers.filter(a => a.correct).length;

  const handleSelect = (zone: Zone) => {
    if (selectedZone !== null) return;
    setSelectedZone(zone);
    setShowExplanation(true);
    const correct = zone === current.answer;
    const newAnswers = [...answers, { selected: zone, correct }];
    setAnswers(newAnswers);

    setTimeout(() => {
      setShowExplanation(false);
      setSelectedZone(null);
      if (currentIndex + 1 >= SCENARIOS.length) {
        setFinished(true);
        const score = newAnswers.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 4,
            response: { answers: newAnswers },
            score, maxScore: SCENARIOS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex(i => i + 1);
      }
    }, 2500);
  };

  if (finished) {
    const pct = Math.round((correctCount / SCENARIOS.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
          <div className="text-5xl">{correctCount === SCENARIOS.length ? "🏆" : correctCount >= 4 ? "🎉" : "📚"}</div>
          <h2 className="text-2xl font-bold">Actividad completada</h2>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">{pct}%</p>
            <p className="text-xs text-muted-foreground">{correctCount}/{SCENARIOS.length} correctas</p>
          </div>
          <p className="text-muted-foreground text-sm">
            {pct === 100 ? "¡Dominas las zonas de entrenamiento!" : pct >= 60 ? "Buen trabajo. Revisa los límites de cada zona." : "Repasa los rangos de VO₂ Máx por zona."}
          </p>
        </motion.div>

        <div className="space-y-3">
          {SCENARIOS.map((sc, i) => {
            const zone = ZONES[sc.answer];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-start gap-3 p-3 rounded-2xl ${answers[i]?.correct ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"}`}
              >
                <span className="text-lg flex-shrink-0">{sc.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium line-clamp-2">{sc.scenario}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold text-white ${zone.color}`}>{zone.label}</span>
                    <span className="text-xs text-muted-foreground">{zone.description}</span>
                  </div>
                  {!answers[i]?.correct && (
                    <p className="text-xs text-red-500 mt-0.5">Tu respuesta: {ZONES[answers[i]?.selected].label}</p>
                  )}
                </div>
                {answers[i]?.correct
                  ? <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} />
                  : <XCircle className="text-red-500 flex-shrink-0" size={18} />
                }
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <Badge className="bg-primary/10 text-primary">Dinámica 4 — Semana 3, Clase 1</Badge>
        <h2 className="text-2xl md:text-3xl font-bold">Zonas de Entrenamiento</h2>
        <p className="text-sm text-muted-foreground">Identifica a qué zona corresponde cada escenario</p>
      </motion.div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Escenario {currentIndex + 1} de {SCENARIOS.length}</span>
          <span>{correctCount} correctas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-4"
        >
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-4xl">{current.emoji}</div>
              <p className="text-base md:text-lg font-semibold leading-relaxed">{current.scenario}</p>
              <p className="text-xs text-muted-foreground">¿A qué zona de entrenamiento corresponde?</p>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {current.options.map((zoneNum) => {
              const zone = ZONES[zoneNum];
              const isCorrect = zoneNum === current.answer;
              const isSelected = selectedZone === zoneNum;
              let state: "default" | "correct" | "wrong" = "default";
              if (selectedZone !== null) {
                if (isCorrect) state = "correct";
                else if (isSelected) state = "wrong";
              }
              return (
                <motion.button
                  key={zoneNum}
                  whileHover={selectedZone === null ? { scale: 1.01 } : {}}
                  whileTap={selectedZone === null ? { scale: 0.99 } : {}}
                  onClick={() => handleSelect(zoneNum)}
                  disabled={selectedZone !== null}
                  className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all flex items-center gap-3 ${
                    state === "correct" ? "bg-green-100 border-green-400 text-green-800 dark:bg-green-950/50 dark:border-green-600 dark:text-green-300" :
                    state === "wrong" ? "bg-red-100 border-red-400 text-red-800 dark:bg-red-950/50 dark:border-red-600 dark:text-red-300" :
                    selectedZone !== null ? "opacity-50 border-border" :
                    `border-border ${zone.hoverBg}`
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white ${
                    state === "correct" ? "bg-green-500" :
                    state === "wrong" ? "bg-red-500" :
                    zone.color
                  }`}>
                    {state === "correct" ? "✓" : state === "wrong" ? "✗" : `Z${zoneNum}`}
                  </span>
                  <div>
                    <span className="font-semibold">{zone.label}</span>
                    <span className="text-muted-foreground font-normal"> — {zone.description}</span>
                    <span className={`ml-2 text-xs ${zone.textColor}`}>({zone.range})</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className={`border ${selectedZone === current.answer ? "border-green-400 bg-green-50 dark:bg-green-950/30" : "border-red-400 bg-red-50 dark:bg-red-950/30"}`}>
                  <CardContent className="p-4 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${ZONES[current.answer].color}`}>
                        {ZONES[current.answer].label}
                      </span>
                      <p className={`font-semibold ${selectedZone === current.answer ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                        {selectedZone === current.answer ? "¡Correcto! 🎉" : "Incorrecto 💡"}
                      </p>
                    </div>
                    <p className="text-muted-foreground">{current.explanation}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

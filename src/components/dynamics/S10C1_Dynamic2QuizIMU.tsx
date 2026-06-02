import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const QUESTIONS = [
  {
    question: "¿Cuántos grados de libertad (DOF) tiene un IMU de 9 DOF?",
    options: ["3", "6", "9", "12"],
    correct: 2,
    explanation: "9 DOF = 3 ejes acelerómetro + 3 ejes giroscopio + 3 ejes magnetómetro.",
  },
  {
    question: "¿Cuál es el problema principal del giroscopio sin fusión sensorial?",
    options: [
      "Bajo consumo energético",
      "Drift acumulativo",
      "Alta frecuencia de muestreo",
      "Sensibilidad a temperatura",
    ],
    correct: 1,
    explanation: "El giroscopio acumula pequeños errores de integración (drift) que se amplifican con el tiempo sin una referencia de corrección.",
  },
  {
    question: "¿Qué algoritmo de fusión es el más eficiente computacionalmente?",
    options: ["Kalman extendido", "Madgwick", "Mahony", "Complementario simple"],
    correct: 2,
    explanation: "El filtro de Mahony es el más ligero y adecuado para microcontroladores de bajo consumo.",
  },
  {
    question: "¿En qué unidades mide el acelerómetro?",
    options: ["RPM", "°/s", "m/s²", "Tesla"],
    correct: 2,
    explanation: "El acelerómetro mide aceleración lineal en m/s² (o en unidades 'g' donde 1g = 9.81 m/s²).",
  },
  {
    question: "Un IMU colocado en el sacro de un corredor mide principalmente...",
    options: [
      "Velocidad de carrera",
      "Cadencia y simetría de zancada",
      "Frecuencia cardíaca",
      "Potencia de pedaleo",
    ],
    correct: 1,
    explanation: "El sacro es el punto gold standard para IMU en análisis de marcha: captura oscilación pélvica, cadencia y simetría entre piernas.",
  },
];

interface Props { weekId?: number; classId?: number; }

export default function S10C1_Dynamic2QuizIMU({ weekId = 10, classId = 1 }: Props) {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; selectedIndex: number; correct: boolean }[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => toast.success(`Resultado: ${data.score}/${data.maxScore} correctas`),
    onError: (err) => toast.error(err.message),
  });

  const current = QUESTIONS[currentIndex];
  const correctCount = answers.filter((a) => a.correct).length;
  const progress = ((currentIndex + (finished ? 1 : 0)) / QUESTIONS.length) * 100;

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    setSelectedIndex(idx);
    setShowFeedback(true);
    const correct = idx === current.correct;
    const newAnswers = [...answers, { question: current.question, selectedIndex: idx, correct }];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIndex + 1 >= QUESTIONS.length) {
        setFinished(true);
        const total = newAnswers.filter((a) => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 2,
            response: { answers: newAnswers },
            score: total,
            maxScore: QUESTIONS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex((prev) => prev + 1);
        setSelectedIndex(null);
        setShowFeedback(false);
      }
    }, 1900);
  };

  if (finished) {
    const pct = Math.round((correctCount / QUESTIONS.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <span className="text-6xl">{pct >= 80 ? "🧠" : pct >= 60 ? "📡" : "📖"}</span>
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Dominas las IMUs!" : pct >= 60 ? "Buen trabajo" : "Repasa las IMUs"}</h3>
          <p className="text-muted-foreground">{correctCount} de {QUESTIONS.length} correctas — {pct}%</p>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
          </div>
        </motion.div>
        <div className="space-y-2">
          {answers.map((a, i) => (
            <Card key={i} className={`border ${a.correct ? "border-green-500/30" : "border-red-500/30"}`}>
              <CardContent className="p-3 flex items-start gap-2">
                {a.correct ? <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={16} /> : <XCircle className="text-red-400 shrink-0 mt-0.5" size={16} />}
                <div>
                  <p className="text-xs font-medium">{QUESTIONS[i].question}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{QUESTIONS[i].options[a.selectedIndex]}</p>
                  {!a.correct && <p className="text-xs text-green-400/70 mt-0.5">✓ {QUESTIONS[i].options[QUESTIONS[i].correct]}</p>}
                  <p className="text-xs text-white/30 mt-0.5">{QUESTIONS[i].explanation}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Pregunta {currentIndex + 1} de {QUESTIONS.length}</span>
          <span>{correctCount} correctas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-5">
              <Badge className="bg-blue-500/20 text-blue-300 text-xs">📡 Quiz IMU</Badge>
              <p className="text-base font-bold leading-snug">{current.question}</p>
              <div className="grid grid-cols-1 gap-2">
                {current.options.map((opt, i) => {
                  const isSelected = selectedIndex === i;
                  const isCorrect = i === current.correct;
                  let style = "border-border hover:border-primary/50 hover:bg-primary/5";
                  if (showFeedback && isSelected && isCorrect) style = "border-green-500 bg-green-500/10";
                  else if (showFeedback && isSelected && !isCorrect) style = "border-red-500 bg-red-500/10";
                  else if (showFeedback && isCorrect) style = "border-green-500/50 bg-green-500/5";
                  return (
                    <button key={i} onClick={() => handleSelect(i)}
                      className={`text-left p-3 rounded-xl border text-sm font-medium transition-all ${style}`}>
                      <span className="text-muted-foreground mr-2">{["A", "B", "C", "D"][i]}.</span>{opt}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {showFeedback && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl p-3 text-xs ${selectedIndex === current.correct ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"}`}>
                    <p className="font-bold mb-1">{selectedIndex === current.correct ? "✓ Correcto" : "✗ Incorrecto"}</p>
                    <p className="text-muted-foreground">{current.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

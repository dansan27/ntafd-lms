import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const QUESTIONS = [
  {
    question: "¿Qué onda del ECG representa la despolarización de las aurículas?",
    options: ["Onda P", "Onda QRS", "Onda T", "Segmento ST"],
    answer: "Onda P",
    explanation: "La onda P es pequeña y redondeada. Representa la contracción de las aurículas que empuja la sangre hacia los ventrículos.",
  },
  {
    question: "¿Cuál es el evento más prominente del trazado ECG y qué representa?",
    options: ["Onda P — contracción auricular", "Complejo QRS — despolarización ventricular", "Onda T — relajación auricular", "Segmento PR — conducción AV"],
    answer: "Complejo QRS — despolarización ventricular",
    explanation: "El complejo QRS es la deflexión más grande y rápida. Representa la contracción de los ventrículos — el evento mecánico principal del latido.",
  },
  {
    question: "¿Qué representa la onda T en el ECG?",
    options: ["Despolarización auricular", "Conducción en el nodo AV", "Repolarización ventricular", "Contracción isométrica"],
    answer: "Repolarización ventricular",
    explanation: "La onda T representa la 'recarga' eléctrica de los ventrículos. Es más lenta y redondeada que el QRS. Normalmente es positiva.",
  },
  {
    question: "¿Qué indica un intervalo QT prolongado?",
    options: ["Bradicardia sinusal", "Hipertrofia ventricular izquierda", "Riesgo de arritmia ventricular grave", "Bloqueo de rama derecha"],
    answer: "Riesgo de arritmia ventricular grave",
    explanation: "El intervalo QT prolongado (>450 ms hombres, >460 ms mujeres) indica que los ventrículos tardan más en repolarizarse, aumentando el riesgo de torsades de pointes y muerte súbita.",
  },
  {
    question: "Usando la regla de los 300, si hay 5 cuadros grandes entre dos picos R, ¿cuál es la FC?",
    options: ["50 bpm", "60 bpm", "75 bpm", "100 bpm"],
    answer: "60 bpm",
    explanation: "FC = 300 ÷ 5 cuadros = 60 bpm. Es la FC de reposo habitual en un adulto promedio. En atletas puede bajar a 40–50 bpm (bradicardia entrenada).",
  },
  {
    question: "¿Qué representa el segmento ST en el ECG?",
    options: ["Conducción desde aurículas a ventrículos", "Período de despolarización completa del ventrículo", "Inicio de la repolarización auricular", "Activación del nodo SA"],
    answer: "Período de despolarización completa del ventrículo",
    explanation: "Durante el segmento ST el ventrículo está completamente despolarizado (contraído). La elevación o depresión del ST indica isquemia o infarto de miocardio.",
  },
];

interface Props {
  weekId?: number;
  classId?: number;
}

export default function S4_Dynamic1IdentificaOnda({ weekId = 4, classId = 1 }: Props) {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; selected: string; correct: boolean }[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => toast.success(`Resultado: ${data.score}/${data.maxScore} correctas`),
    onError: (err) => toast.error(err.message),
  });

  const current = QUESTIONS[currentIndex];

  const handleSelect = (option: string) => {
    if (showFeedback) return;
    setSelected(option);
    setShowFeedback(true);
    const correct = option === current.answer;
    const newAnswer = { question: current.question, selected: option, correct };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    setTimeout(() => {
      if (currentIndex + 1 >= QUESTIONS.length) {
        setFinished(true);
        const correctCount = updatedAnswers.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 1,
            response: { answers: updatedAnswers },
            score: correctCount,
            maxScore: QUESTIONS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex(prev => prev + 1);
        setSelected(null);
        setShowFeedback(false);
      }
    }, 1800);
  };

  const correctCount = answers.filter(a => a.correct).length;
  const progress = ((currentIndex + (finished ? 1 : 0)) / QUESTIONS.length) * 100;

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <div className="text-5xl">{correctCount === QUESTIONS.length ? "🏆" : correctCount >= 4 ? "🎉" : "💪"}</div>
          <h2 className="text-2xl font-bold">
            {correctCount === QUESTIONS.length ? "¡Perfecto!" : correctCount >= 4 ? "¡Excelente!" : "¡Buen intento!"}
          </h2>
          <p className="text-muted-foreground">{correctCount}/{QUESTIONS.length} respuestas correctas</p>
        </motion.div>

        <Card>
          <CardContent className="p-4 space-y-2">
            {answers.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-start gap-3 p-3 rounded-lg ${a.correct ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium line-clamp-2">{QUESTIONS[i].question}</p>
                  {!a.correct && <p className="text-xs text-muted-foreground mt-0.5">Correcto: <strong>{QUESTIONS[i].answer}</strong></p>}
                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{QUESTIONS[i].explanation}</p>
                </div>
                {a.correct ? <CheckCircle2 className="text-green-600 flex-shrink-0" size={16} /> : <XCircle className="text-red-500 flex-shrink-0" size={16} />}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <Badge className="bg-primary/10 text-primary">Dinámica 1 — Semana 4</Badge>
        <h2 className="text-2xl font-bold">Identifica la Onda ECG</h2>
        <p className="text-muted-foreground text-sm">Demuestra que conoces los componentes del electrocardiograma.</p>
      </motion.div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Pregunta {currentIndex + 1} de {QUESTIONS.length}</span>
          <span>{correctCount} correctas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          <Card className={`transition-all ${showFeedback ? (selected === current.answer ? "ring-4 ring-green-400" : "ring-4 ring-red-400") : ""}`}>
            <CardContent className="p-6 space-y-5">
              <p className="text-base font-medium leading-relaxed">{current.question}</p>

              <div className="grid grid-cols-1 gap-2">
                {current.options.map((option) => {
                  let variant: "outline" | "default" | "destructive" = "outline";
                  let extra = "";
                  if (showFeedback) {
                    if (option === current.answer) { extra = "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"; }
                    else if (option === selected && option !== current.answer) { extra = "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"; }
                  }
                  return (
                    <button
                      key={option}
                      onClick={() => handleSelect(option)}
                      disabled={showFeedback}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                        showFeedback ? extra || "opacity-40" : "hover:border-primary/50 hover:bg-primary/5"
                      } ${selected === option && !showFeedback ? "border-primary bg-primary/5" : ""}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-xl text-xs leading-relaxed ${
                    selected === current.answer
                      ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                      : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  <strong>{selected === current.answer ? "✓ Correcto — " : "✗ Incorrecto — "}</strong>
                  {current.explanation}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

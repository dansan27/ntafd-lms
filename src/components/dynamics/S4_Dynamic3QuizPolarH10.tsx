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
    question: "¿Cuántos electrodos usa el Polar H10 para medir la señal cardíaca?",
    options: ["1 electrodo", "2 electrodos", "4 electrodos", "10 electrodos"],
    answer: "2 electrodos",
    explanation: "El Polar H10 usa 2 electrodos de contacto en la correa de pecho, funcionando como una derivación I del ECG (Lead I).",
  },
  {
    question: "¿Cuál es la principal ventaja del Polar H10 sobre el AR12plus?",
    options: [
      "Menor precio",
      "Mayor duración de batería",
      "Mejor adherencia de sensores y algoritmo de ruido más avanzado",
      "Más derivaciones ECG",
    ],
    answer: "Mejor adherencia de sensores y algoritmo de ruido más avanzado",
    explanation: "La correa elástica del Polar H10 garantiza mejor contacto electrodo-piel, y su algoritmo propietario filtra mejor el ruido por movimiento en ejercicio intenso.",
  },
  {
    question: "¿Qué dato adicional puede calcular el Polar H10 que lo diferencia de un medidor de FC básico?",
    options: ["SpO₂ (saturación de oxígeno)", "Temperatura corporal", "HRV (variabilidad de frecuencia cardíaca)", "VO₂ máx directo"],
    answer: "HRV (variabilidad de frecuencia cardíaca)",
    explanation: "El Polar H10 transmite intervalos R-R precisos en milisegundos, permitiendo calcular el HRV — un marcador clave de recuperación y estado del sistema nervioso autónomo.",
  },
  {
    question: "¿Por qué los sensores ópticos de muñeca son menos precisos que el Polar H10 durante ejercicio intenso?",
    options: [
      "Usan Bluetooth en lugar de ANT+",
      "El movimiento genera artefactos que confunden al fotopletismógrafo",
      "La frecuencia de muestreo es mayor",
      "No tienen algoritmo de filtrado",
    ],
    answer: "El movimiento genera artefactos que confunden al fotopletismógrafo",
    explanation: "Los sensores de muñeca usan luz para detectar el flujo sanguíneo. En alta intensidad, el movimiento del brazo genera artefactos de movimiento que pueden causar errores de hasta 20–30 bpm.",
  },
  {
    question: "¿Cuál es la frecuencia de muestreo de la señal ECG en el Polar H10?",
    options: ["100 Hz", "250 Hz", "500 Hz", "1000 Hz"],
    answer: "1000 Hz",
    explanation: "El Polar H10 muestrea la señal a 1000 Hz (1000 muestras/segundo) cuando se usa en modo ECG, capturando incluso los detalles más finos de las ondas P y T.",
  },
];

interface Props {
  weekId?: number;
  classId?: number;
}

export default function S4_Dynamic3QuizPolarH10({ weekId = 4, classId = 1 }: Props) {
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
    const updated = [...answers, newAnswer];
    setAnswers(updated);

    setTimeout(() => {
      if (currentIndex + 1 >= QUESTIONS.length) {
        setFinished(true);
        const correctCount = updated.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 3,
            response: { answers: updated },
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
          <div className="text-5xl">{correctCount === QUESTIONS.length ? "🏆" : correctCount >= 3 ? "🎉" : "💪"}</div>
          <h2 className="text-2xl font-bold">
            {correctCount === QUESTIONS.length ? "¡Experto en Polar H10!" : correctCount >= 3 ? "¡Muy bien!" : "¡Sigue practicando!"}
          </h2>
          <p className="text-muted-foreground">{correctCount}/{QUESTIONS.length} correctas</p>
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
        <Badge className="bg-primary/10 text-primary">Dinámica 3 — Semana 4</Badge>
        <h2 className="text-2xl font-bold">Quiz: Polar H10</h2>
        <p className="text-muted-foreground text-sm">Pon a prueba tus conocimientos sobre el sensor de referencia deportiva.</p>
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
              <div className="flex items-center gap-2">
                <span className="text-3xl">🫀</span>
                <p className="text-base font-medium leading-relaxed">{current.question}</p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {current.options.map((option) => {
                  let extra = "";
                  if (showFeedback) {
                    if (option === current.answer) extra = "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400";
                    else if (option === selected) extra = "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400";
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

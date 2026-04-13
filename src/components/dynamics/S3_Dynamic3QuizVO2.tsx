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
    question: "¿Cuál es el valor aproximado de VO₂ Máx de un ciclista de Tour de France élite?",
    options: ["45-50 ml/kg/min", "60-65 ml/kg/min", "80-90 ml/kg/min", "100+ ml/kg/min"],
    answer: 2,
    explanation: "Los ciclistas de élite del Tour tienen valores de 80-90 ml/kg/min. El record histórico es 97.5 (Oskar Svendsen).",
    emoji: "🚴",
  },
  {
    question: "Según la Ecuación de Fick, el VO₂ Máx = CO × (a-vO₂). ¿Qué significa CO?",
    options: ["Consumo de Oxígeno", "Gasto Cardíaco (Cardiac Output)", "Concentración de Oxígeno", "Ciclo de Oxidación"],
    answer: 1,
    explanation: "CO = Gasto Cardíaco = FC × Volumen Sistólico. Mide los litros de sangre bombeados por minuto.",
    emoji: "❤️",
  },
  {
    question: "¿En qué frecuencia opera la interferencia de red eléctrica en Perú/Europa que debe eliminarse del ECG?",
    options: ["25 Hz", "50 Hz", "60 Hz", "100 Hz"],
    answer: 1,
    explanation: "En Perú, Europa y parte de Asia la red eléctrica opera a 50 Hz. En EE.UU. y América del Norte es 60 Hz. El filtro Notch elimina esta frecuencia específica.",
    emoji: "⚡",
  },
  {
    question: "¿Qué evento cardíaco representa el complejo QRS en el ECG?",
    options: ["Despolarización auricular", "Repolarización auricular", "Despolarización ventricular", "Repolarización ventricular"],
    answer: 2,
    explanation: "El complejo QRS representa la despolarización ventricular — el momento en que los ventrículos se contraen para bombear sangre al cuerpo y los pulmones.",
    emoji: "📈",
  },
  {
    question: "El Test de Cooper estima el VO₂ Máx midiendo...",
    options: ["El volumen de gases espirados en reposo", "La distancia máxima recorrida en 12 minutos", "La frecuencia cardíaca máxima en cicloergómetro", "La concentración de lactato en sangre"],
    answer: 1,
    explanation: "El Test de Cooper mide la máxima distancia recorrida corriendo en 12 minutos. La fórmula: VO₂ = (distancia en m − 504.9) / 44.73",
    emoji: "🏃",
  },
];

interface Props { weekId?: number; classId?: number; }

export default function S3_Dynamic3QuizVO2({ weekId = 3, classId = 1 }: Props) {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => toast.success(`Quiz completado: ${data.score}/${data.maxScore}`),
    onError: (err) => toast.error(err.message),
  });

  const current = QUESTIONS[currentIndex];
  const progress = ((currentIndex + (finished ? 1 : 0)) / QUESTIONS.length) * 100;
  const correctCount = answers.filter(a => a.correct).length;

  const handleSelect = (optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    setShowExplanation(true);
    const correct = optionIndex === current.answer;
    const newAnswers = [...answers, { correct }];
    setAnswers(newAnswers);

    setTimeout(() => {
      setShowExplanation(false);
      setSelectedOption(null);
      if (currentIndex + 1 >= QUESTIONS.length) {
        setFinished(true);
        const score = newAnswers.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 3,
            response: { answers: newAnswers },
            score, maxScore: QUESTIONS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex(i => i + 1);
      }
    }, 2500);
  };

  if (finished) {
    const pct = Math.round((correctCount / QUESTIONS.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
          <div className="text-5xl">{correctCount === QUESTIONS.length ? "🏆" : correctCount >= 3 ? "🎉" : "📚"}</div>
          <h2 className="text-2xl font-bold">Quiz completado</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{pct}%</p>
              <p className="text-xs text-muted-foreground">{correctCount}/{QUESTIONS.length} correctas</p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            {pct === 100 ? "¡Dominas la fisiología cardiovascular!" : pct >= 60 ? "Buen conocimiento. Repasa los conceptos que fallaste." : "Revisa los bloques de contenido y vuelve a intentarlo."}
          </p>
        </motion.div>

        <div className="space-y-3">
          {QUESTIONS.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-start gap-3 p-3 rounded-2xl ${answers[i].correct ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"}`}
            >
              <span className="text-lg flex-shrink-0">{q.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">{q.question}</p>
                <p className="text-xs text-muted-foreground mt-1">✓ {q.options[q.answer]}</p>
              </div>
              {answers[i].correct
                ? <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} />
                : <XCircle className="text-red-500 flex-shrink-0" size={18} />
              }
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <Badge className="bg-primary/10 text-primary">Dinámica 3 — Semana 3</Badge>
        <h2 className="text-2xl md:text-3xl font-bold">Quiz VO₂ Máx y ECG</h2>
      </motion.div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Pregunta {currentIndex + 1} de {QUESTIONS.length}</span>
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
              <p className="text-base md:text-lg font-semibold leading-relaxed">{current.question}</p>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {current.options.map((option, i) => {
              let state: "default" | "correct" | "wrong" | "missed" = "default";
              if (selectedOption !== null) {
                if (i === current.answer) state = "correct";
                else if (i === selectedOption && selectedOption !== current.answer) state = "wrong";
              }
              return (
                <motion.button
                  key={i}
                  whileHover={selectedOption === null ? { scale: 1.01 } : {}}
                  whileTap={selectedOption === null ? { scale: 0.99 } : {}}
                  onClick={() => handleSelect(i)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all flex items-center gap-3 ${
                    state === "correct" ? "bg-green-100 border-green-400 text-green-800 dark:bg-green-950/50 dark:border-green-600 dark:text-green-300" :
                    state === "wrong" ? "bg-red-100 border-red-400 text-red-800 dark:bg-red-950/50 dark:border-red-600 dark:text-red-300" :
                    selectedOption !== null ? "opacity-50 border-border" :
                    "hover:border-primary hover:bg-primary/5 border-border"
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    state === "correct" ? "bg-green-500 text-white" :
                    state === "wrong" ? "bg-red-500 text-white" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {state === "correct" ? "✓" : state === "wrong" ? "✗" : String.fromCharCode(65 + i)}
                  </span>
                  {option}
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
                <Card className={`border ${selectedOption === current.answer ? "border-green-400 bg-green-50 dark:bg-green-950/30" : "border-amber-400 bg-amber-50 dark:bg-amber-950/30"}`}>
                  <CardContent className="p-4 text-sm">
                    <p className={`font-semibold mb-1 ${selectedOption === current.answer ? "text-green-700" : "text-amber-700"}`}>
                      {selectedOption === current.answer ? "¡Correcto! 🎉" : "Respuesta incorrecta 💡"}
                    </p>
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

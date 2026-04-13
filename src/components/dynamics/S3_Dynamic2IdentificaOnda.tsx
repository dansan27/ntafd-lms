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
    question: "Pequeña onda positiva antes del QRS. Indica que las AURÍCULAS se están despolarizando.",
    answer: "P",
    hint: "Despolarización auricular — nodo SA → aurículas",
    emoji: "💙",
  },
  {
    question: "Complejo de ondas agudas (Q descendente, R alto positivo, S descendente). Representa la despolarización VENTRICULAR.",
    answer: "QRS",
    hint: "La contracción ventricular — el latido principal",
    emoji: "❤️",
  },
  {
    question: "Onda redondeada que sigue al QRS. Indica la REPOLARIZACIÓN ventricular — los ventrículos se recuperan.",
    answer: "T",
    hint: "Repolarización ventricular — preparación para el siguiente latido",
    emoji: "🔄",
  },
  {
    question: "Segmento plano entre el complejo QRS y la onda T. Su elevación o depresión indica ISQUEMIA miocárdica.",
    answer: "ST",
    hint: "Segmento crítico — isquemia si se eleva o deprime > 1 mm",
    emoji: "⚠️",
  },
  {
    question: "Intervalo desde el inicio de la onda P hasta el inicio del QRS. Refleja el retardo del NODO AURICULOVENTRICULAR (AV).",
    answer: "PR",
    hint: "Retraso fisiológico en el nodo AV — normal: 120-200 ms",
    emoji: "⏱️",
  },
  {
    question: "El nodo aquí genera el impulso eléctrico que inicia cada latido. Se llama marcapasos natural del corazón.",
    answer: "SA",
    hint: "Nodo Sinoauricular — marcapasos natural",
    emoji: "⚡",
  },
];

const OPTIONS = ["P", "QRS", "T", "ST", "PR", "SA"];

interface Props { weekId?: number; classId?: number; }

export default function S3_Dynamic2IdentificaOnda({ weekId = 3, classId = 1 }: Props) {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; userAnswer: string; correct: boolean }[]>([]);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => toast.success(`Resultado: ${data.score}/${data.maxScore}`),
    onError: (err) => toast.error(err.message),
  });

  const current = QUESTIONS[currentIndex];
  const progress = ((currentIndex + (finished ? 1 : 0)) / QUESTIONS.length) * 100;
  const correctCount = answers.filter(a => a.correct).length;

  const handleAnswer = (userAnswer: string) => {
    if (feedback !== null || finished) return;
    const correct = userAnswer === current.answer;
    const newAnswers = [...answers, { question: current.question.substring(0, 40) + "...", userAnswer, correct }];
    setAnswers(newAnswers);
    setFeedback(correct);

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 >= QUESTIONS.length) {
        setFinished(true);
        const score = newAnswers.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 2,
            response: { answers: newAnswers },
            score, maxScore: QUESTIONS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex(i => i + 1);
      }
    }, 1400);
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <div className="text-5xl">{correctCount === QUESTIONS.length ? "🏆" : correctCount >= 4 ? "🎉" : "💪"}</div>
          <h2 className="text-2xl font-bold">{correctCount === QUESTIONS.length ? "¡ECG Perfecto!" : correctCount >= 4 ? "¡Excelente lectura!" : "¡Sigue practicando!"}</h2>
          <p className="text-muted-foreground">{correctCount}/{QUESTIONS.length} ondas identificadas correctamente</p>
        </motion.div>
        <Card>
          <CardContent className="p-4 space-y-2">
            {answers.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-start gap-3 p-3 rounded-xl ${a.correct ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"}`}
              >
                <span className="text-lg flex-shrink-0">{QUESTIONS[i].emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{QUESTIONS[i].hint}</p>
                  {!a.correct && (
                    <p className="text-xs mt-1">
                      Tu respuesta: <span className="font-bold text-red-600">{a.userAnswer}</span>
                      {" → "}Correcto: <span className="font-bold text-green-600">{QUESTIONS[i].answer}</span>
                    </p>
                  )}
                </div>
                {a.correct
                  ? <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} />
                  : <XCircle className="text-red-500 flex-shrink-0" size={18} />
                }
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <Badge className="bg-primary/10 text-primary">Dinámica 2 — Semana 3</Badge>
        <h2 className="text-2xl md:text-3xl font-bold">Identifica la Onda ECG</h2>
        <p className="text-muted-foreground text-sm">Lee la descripción y selecciona el componente del ECG correcto.</p>
      </motion.div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentIndex + 1}/{QUESTIONS.length}</span>
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
          <Card className={`transition-all ${
            feedback === true ? "ring-4 ring-green-400" : feedback === false ? "ring-4 ring-red-400" : ""
          }`}>
            <CardContent className="p-6 md:p-8 text-center space-y-4">
              <div className="text-4xl">{current.emoji}</div>
              <p className="text-base md:text-lg font-medium leading-relaxed">{current.question}</p>
              {feedback !== null && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Badge className={`text-white px-3 py-1 ${feedback ? "bg-green-500" : "bg-red-500"}`}>
                    {feedback ? `¡Correcto! Es la onda ${current.answer}` : `Incorrecto → Es: ${current.answer}`}
                  </Badge>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map((opt) => (
          <Button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={feedback !== null}
            variant="outline"
            className="h-14 text-lg font-bold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
}

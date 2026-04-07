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
    question: "¿Qué es la composición corporal?",
    options: [
      "El peso total de una persona",
      "La proporción de grasa, músculo, hueso y agua que componen el cuerpo",
      "La cantidad de calorías que consume un atleta",
      "La medida de la estatura y el peso combinados",
    ],
    correct: 1,
    emoji: "🏋️",
  },
  {
    question: "¿Cuál es el método gold standard para medir composición corporal?",
    options: ["Bioimpedancia (BIA)", "Antropometría", "DEXA", "Bod Pod"],
    correct: 2,
    emoji: "🥇",
  },
  {
    question: "¿Qué mide la bioimpedancia eléctrica?",
    options: [
      "La densidad ósea",
      "La resistencia del cuerpo al paso de una corriente eléctrica para estimar composición corporal",
      "La fuerza muscular máxima",
      "La cantidad de oxígeno en sangre",
    ],
    correct: 1,
    emoji: "⚡",
  },
  {
    question: "¿Qué componente NO es parte de la masa magra (masa libre de grasa)?",
    options: ["Músculo esquelético", "Hueso", "Grasa subcutánea", "Agua corporal"],
    correct: 2,
    emoji: "🦴",
  },
  {
    question: "¿Cuál es la ventaja principal del DEXA sobre otros métodos?",
    options: [
      "Es el más barato",
      "No requiere equipo especializado",
      "Proporciona análisis regional y diferencia masa ósea, magra y grasa con alta precisión",
      "Se puede hacer en casa sin ayuda profesional",
    ],
    correct: 2,
    emoji: "☢️",
  },
  {
    question: "¿Qué tecnología usa ZOZOFIT para evaluar la composición corporal?",
    options: [
      "Rayos X de baja intensidad",
      "Corriente eléctrica de baja frecuencia",
      "Escaneo 3D del cuerpo mediante cámara del smartphone",
      "Ultrasonido de alta frecuencia",
    ],
    correct: 2,
    emoji: "📱",
  },
  {
    question: "¿Cuál es la diferencia entre un método directo y uno indirecto de evaluación corporal?",
    options: [
      "Los directos son más baratos que los indirectos",
      "Los directos miden el componente de forma real (disección), los indirectos estiman a partir de otras variables",
      "Los directos solo se usan en deportistas y los indirectos en personas sedentarias",
      "No hay diferencia, son sinónimos",
    ],
    correct: 1,
    emoji: "🔬",
  },
  {
    question: "¿Por qué es importante monitorear la composición corporal en deportistas?",
    options: [
      "Solo para controlar el peso antes de competencias",
      "Para ajustar entrenamiento, nutrición y prevenir lesiones basándose en cambios en masa grasa y magra",
      "Porque es un requisito obligatorio de todas las federaciones deportivas",
      "Únicamente para determinar la categoría de peso en deportes de combate",
    ],
    correct: 1,
    emoji: "📊",
  },
];

interface Props {
  weekId?: number;
  classId?: number;
  onComplete?: (score: number, maxScore: number) => void;
}

export default function S2_Dynamic3QuizComposicion({ weekId = 2, classId = 1, onComplete }: Props) {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; userAnswer: number; correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState<number | null>(null);
  const [isCorrectFeedback, setIsCorrectFeedback] = useState<boolean | null>(null);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => {
      toast.success(`Resultado: ${data.score}/${data.maxScore} correctas`);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleAnswer = (optionIndex: number) => {
    if (finished || showFeedback !== null) return;
    const q = QUESTIONS[currentIndex];
    const correct = q.correct === optionIndex;

    const newAnswer = { question: q.question, userAnswer: optionIndex, correct };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setShowFeedback(optionIndex);
    setIsCorrectFeedback(correct);

    setTimeout(() => {
      setShowFeedback(null);
      setIsCorrectFeedback(null);
      if (currentIndex + 1 >= QUESTIONS.length) {
        setFinished(true);
        const correctCount = updatedAnswers.filter((a) => a.correct).length;
        const maxScore = QUESTIONS.length;
        if (token) {
          submitMutation.mutate({
            token,
            weekId,
            classId,
            dynamicId: 3,
            response: { answers: updatedAnswers },
            score: correctCount,
            maxScore,
            timeSpentMs: Date.now() - startTime,
          });
        }
        onComplete?.(correctCount, maxScore);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 1500);
  };

  const correctCount = answers.filter((a) => a.correct).length;
  const progress = ((currentIndex + (finished ? 1 : 0)) / QUESTIONS.length) * 100;

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <div className="text-5xl">
            {correctCount === QUESTIONS.length ? "🏆" : correctCount >= 6 ? "🎉" : correctCount >= 4 ? "👍" : "💪"}
          </div>
          <h2 className="text-2xl font-bold">
            {correctCount === QUESTIONS.length
              ? "¡Perfecto!"
              : correctCount >= 6
              ? "¡Excelente!"
              : correctCount >= 4
              ? "¡Bien hecho!"
              : "¡Sigue estudiando!"}
          </h2>
          <p className="text-muted-foreground">
            {correctCount}/{QUESTIONS.length} respuestas correctas
          </p>
        </motion.div>

        <Card>
          <CardContent className="p-4 space-y-3">
            {answers.map((a, i) => {
              const q = QUESTIONS[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    a.correct ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"
                  }`}
                >
                  <span className="text-xl flex-shrink-0">{q.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{q.question}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {!a.correct && (
                        <>
                          Tu respuesta: {q.options[a.userAnswer]} &rarr;{" "}
                        </>
                      )}
                      Correcto: <strong>{q.options[q.correct]}</strong>
                    </p>
                  </div>
                  {a.correct ? (
                    <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} />
                  ) : (
                    <XCircle className="text-red-500 flex-shrink-0" size={18} />
                  )}
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = QUESTIONS[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <Badge className="bg-primary/10 text-primary">Dinámica 3 - Semana 2</Badge>
        <h2 className="text-2xl md:text-3xl font-bold">Quiz de Composición Corporal</h2>
        <p className="text-muted-foreground text-sm">
          Pon a prueba tus conocimientos sobre composición corporal y métodos de evaluación.
        </p>
      </motion.div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Pregunta {currentIndex + 1}/{QUESTIONS.length}
          </span>
          <span>{correctCount} correctas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className={`overflow-hidden transition-all ${
              isCorrectFeedback === true
                ? "ring-4 ring-green-400"
                : isCorrectFeedback === false
                ? "ring-4 ring-red-400"
                : ""
            }`}
          >
            <CardContent className="p-6 md:p-8 text-center space-y-2">
              <div className="text-5xl">{currentQ.emoji}</div>
              <p className="text-lg font-medium leading-relaxed">{currentQ.question}</p>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-3">
        {currentQ.options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          let extraClass = "";
          if (showFeedback !== null) {
            if (i === currentQ.correct) {
              extraClass =
                "ring-2 ring-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300";
            } else if (i === showFeedback && !isCorrectFeedback) {
              extraClass =
                "ring-2 ring-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300";
            }
          }
          return (
            <Button
              key={i}
              variant="outline"
              onClick={() => handleAnswer(i)}
              disabled={showFeedback !== null}
              className={`h-auto py-4 text-left justify-start gap-3 text-sm whitespace-normal ${extraClass}`}
            >
              <Badge
                variant="secondary"
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs"
              >
                {letter}
              </Badge>
              <span className="text-left">{opt}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

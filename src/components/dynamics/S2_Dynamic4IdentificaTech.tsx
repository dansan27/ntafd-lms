import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  Scan,
  Waves,
  Ruler,
  Wind,
  Smartphone,
  Droplets,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const SCENARIOS = [
  {
    description:
      "Un atleta se acuesta en una camilla mientras un brazo mecánico pasa sobre su cuerpo emitiendo rayos X de baja intensidad para analizar la densidad de diferentes tejidos.",
    answer: "DEXA",
    icon: Scan,
    iconColor: "text-yellow-400",
    emoji: "☢️",
  },
  {
    description:
      "El deportista se para descalzo sobre una báscula especial que envía una corriente eléctrica imperceptible a través de su cuerpo para estimar la proporción de agua, grasa y músculo.",
    answer: "BIA",
    icon: Waves,
    iconColor: "text-blue-400",
    emoji: "⚡",
  },
  {
    description:
      "El nutricionista mide pliegues cutáneos con un calibrador en 7 sitios del cuerpo del atleta, registrando el grosor de cada pliegue en milímetros.",
    answer: "Antropometría",
    icon: Ruler,
    iconColor: "text-orange-400",
    emoji: "📏",
  },
  {
    description:
      "El atleta se sienta dentro de una cámara ovalada hermética que mide el volumen de aire desplazado por su cuerpo para calcular la densidad corporal.",
    answer: "Bod Pod",
    icon: Wind,
    iconColor: "text-green-400",
    emoji: "🥚",
  },
  {
    description:
      "El deportista usa un traje especial con marcadores y se toma fotos con su smartphone desde varios ángulos. Una app reconstruye un modelo 3D de su cuerpo.",
    answer: "ZOZOFIT / Escaneo 3D",
    icon: Smartphone,
    iconColor: "text-purple-400",
    emoji: "📱",
  },
  {
    description:
      "Se sumerge al atleta completamente en un tanque de agua especial mientras exhala todo el aire de sus pulmones. Se calcula su densidad corporal según el peso bajo el agua.",
    answer: "Pesaje Hidrostático",
    icon: Droplets,
    iconColor: "text-cyan-400",
    emoji: "🏊",
  },
];

const ALL_OPTIONS = [
  "DEXA",
  "BIA",
  "Antropometría",
  "Bod Pod",
  "ZOZOFIT / Escaneo 3D",
  "Pesaje Hidrostático",
];

interface Props {
  weekId?: number;
  classId?: number;
  onComplete?: (score: number, maxScore: number) => void;
}

export default function S2_Dynamic4IdentificaTech({ weekId = 2, classId = 1, onComplete }: Props) {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<
    { scenario: number; userAnswer: string; correctAnswer: string; correct: boolean }[]
  >([]);
  const [finished, setFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrectFeedback, setIsCorrectFeedback] = useState<boolean | null>(null);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => {
      toast.success(`Resultado: ${data.score}/${data.maxScore} correctas`);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleAnswer = (userAnswer: string) => {
    if (finished || selectedAnswer !== null) return;
    const scenario = SCENARIOS[currentIndex];
    const correct = scenario.answer === userAnswer;

    const newAnswer = {
      scenario: currentIndex + 1,
      userAnswer,
      correctAnswer: scenario.answer,
      correct,
    };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setSelectedAnswer(userAnswer);
    setIsCorrectFeedback(correct);

    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrectFeedback(null);
      if (currentIndex + 1 >= SCENARIOS.length) {
        setFinished(true);
        const score = updatedAnswers.filter((a) => a.correct).length;
        const maxScore = SCENARIOS.length;
        if (token) {
          submitMutation.mutate({
            token,
            weekId,
            classId,
            dynamicId: 4,
            response: { answers: updatedAnswers },
            score,
            maxScore,
            timeSpentMs: Date.now() - startTime,
          });
        }
        onComplete?.(score, maxScore);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 1500);
  };

  const correctCount = answers.filter((a) => a.correct).length;
  const progress = ((currentIndex + (finished ? 1 : 0)) / SCENARIOS.length) * 100;

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-3"
        >
          <div className="text-5xl">
            {correctCount === SCENARIOS.length
              ? "🏆"
              : correctCount >= 4
              ? "🎉"
              : correctCount >= 3
              ? "👍"
              : "💪"}
          </div>
          <h2 className="text-2xl font-bold">
            {correctCount === SCENARIOS.length
              ? "¡Perfecto!"
              : correctCount >= 4
              ? "¡Excelente!"
              : correctCount >= 3
              ? "¡Bien hecho!"
              : "¡Sigue practicando!"}
          </h2>
          <p className="text-muted-foreground">
            {correctCount}/{SCENARIOS.length} escenarios identificados correctamente
          </p>
        </motion.div>

        <Card>
          <CardContent className="p-4 space-y-3">
            {answers.map((a, i) => {
              const scenario = SCENARIOS[i];
              const ScenarioIcon = scenario.icon;
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
                  <div className="flex-shrink-0 mt-0.5">
                    <ScenarioIcon className={scenario.iconColor} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Escenario {i + 1}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {!a.correct && (
                        <>
                          Tu respuesta: {a.userAnswer} &rarr;{" "}
                        </>
                      )}
                      Correcto: <strong>{a.correctAnswer}</strong>
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

  const currentScenario = SCENARIOS[currentIndex];
  const CurrentIcon = currentScenario.icon;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <Badge className="bg-primary/10 text-primary">Dinámica 4 - Semana 2</Badge>
        <h2 className="text-2xl md:text-3xl font-bold">Identifica la Tecnología</h2>
        <p className="text-muted-foreground text-sm">
          Lee el escenario y selecciona qué método de evaluación de composición corporal se describe.
        </p>
      </motion.div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Escenario {currentIndex + 1}/{SCENARIOS.length}
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
            <CardContent className="p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                  <CurrentIcon className={currentScenario.iconColor} size={32} />
                </div>
              </div>
              <p className="text-base leading-relaxed text-center italic">
                &ldquo;{currentScenario.description}&rdquo;
              </p>
              {isCorrectFeedback !== null && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
                  <Badge
                    className={`text-white text-sm px-3 py-1 ${
                      isCorrectFeedback ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {isCorrectFeedback
                      ? "¡Correcto!"
                      : `Incorrecto → ${currentScenario.answer}`}
                  </Badge>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALL_OPTIONS.map((opt) => {
          let extraClass = "";
          if (selectedAnswer !== null) {
            if (opt === currentScenario.answer) {
              extraClass =
                "ring-2 ring-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300";
            } else if (opt === selectedAnswer && !isCorrectFeedback) {
              extraClass =
                "ring-2 ring-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300";
            }
          }
          return (
            <Button
              key={opt}
              variant="outline"
              onClick={() => handleAnswer(opt)}
              disabled={selectedAnswer !== null}
              className={`h-auto py-4 text-sm font-medium ${extraClass}`}
            >
              {opt}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

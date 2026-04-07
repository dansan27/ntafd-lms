import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, DollarSign, Target, MapPin, RadioTower, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type CharacteristicKey = "costo" | "precision" | "accesibilidad" | "radiacion" | "tiempo";

interface MethodData {
  name: string;
  emoji: string;
  characteristics: Record<CharacteristicKey, string>;
}

const METHODS: MethodData[] = [
  {
    name: "DEXA",
    emoji: "☢️",
    characteristics: {
      costo: "Alto",
      precision: "Alta",
      accesibilidad: "Baja",
      radiacion: "Sí (baja dosis)",
      tiempo: "10-20 min",
    },
  },
  {
    name: "BIA (Bioimpedancia)",
    emoji: "⚡",
    characteristics: {
      costo: "Bajo",
      precision: "Media",
      accesibilidad: "Alta",
      radiacion: "No",
      tiempo: "1-5 min",
    },
  },
  {
    name: "Antropometría",
    emoji: "📏",
    characteristics: {
      costo: "Bajo",
      precision: "Media",
      accesibilidad: "Alta",
      radiacion: "No",
      tiempo: "15-30 min",
    },
  },
  {
    name: "Bod Pod",
    emoji: "🥚",
    characteristics: {
      costo: "Alto",
      precision: "Alta",
      accesibilidad: "Baja",
      radiacion: "No",
      tiempo: "5-10 min",
    },
  },
  {
    name: "Escaneo 3D",
    emoji: "📱",
    characteristics: {
      costo: "Medio",
      precision: "Media",
      accesibilidad: "Media",
      radiacion: "No",
      tiempo: "1-5 min",
    },
  },
];

const CHARACTERISTICS: { key: CharacteristicKey; label: string; icon: typeof DollarSign; options: string[] }[] = [
  { key: "costo", label: "Costo", icon: DollarSign, options: ["Alto", "Medio", "Bajo"] },
  { key: "precision", label: "Precisión", icon: Target, options: ["Alta", "Media", "Baja"] },
  { key: "accesibilidad", label: "Accesibilidad", icon: MapPin, options: ["Alta", "Media", "Baja"] },
  { key: "radiacion", label: "Radiación", icon: RadioTower, options: ["Sí (baja dosis)", "No"] },
  { key: "tiempo", label: "Tiempo requerido", icon: Clock, options: ["1-5 min", "5-10 min", "10-20 min", "15-30 min"] },
];

interface Props {
  weekId?: number;
  classId?: number;
  onComplete?: (score: number, maxScore: number) => void;
}

export default function S2_Dynamic2TablaComparativa({ weekId = 2, classId = 1, onComplete }: Props) {
  const { token } = useStudent();
  const [answers, setAnswers] = useState<
    { method: string; characteristic: string; userAnswer: string; correctAnswer: string; correct: boolean }[]
  >([]);
  const [finished, setFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState<boolean | null>(null);
  const [startTime] = useState(Date.now());

  // Assign 2 characteristics per method for 10 total questions
  const methodCharAssignments: { methodIdx: number; charIdx: number }[] = [
    { methodIdx: 0, charIdx: 0 }, // DEXA - costo
    { methodIdx: 0, charIdx: 3 }, // DEXA - radiacion
    { methodIdx: 1, charIdx: 1 }, // BIA - precision
    { methodIdx: 1, charIdx: 2 }, // BIA - accesibilidad
    { methodIdx: 2, charIdx: 0 }, // Antropometria - costo
    { methodIdx: 2, charIdx: 4 }, // Antropometria - tiempo
    { methodIdx: 3, charIdx: 1 }, // Bod Pod - precision
    { methodIdx: 3, charIdx: 3 }, // Bod Pod - radiacion
    { methodIdx: 4, charIdx: 0 }, // Escaneo 3D - costo
    { methodIdx: 4, charIdx: 2 }, // Escaneo 3D - accesibilidad
  ];

  const currentStep = answers.length;
  const currentAssignment = methodCharAssignments[currentStep];

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => {
      toast.success(`Resultado: ${data.score}/${data.maxScore} correctas`);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleAnswer = (userAnswer: string) => {
    if (finished || showFeedback !== null || !currentAssignment) return;

    const method = METHODS[currentAssignment.methodIdx];
    const char = CHARACTERISTICS[currentAssignment.charIdx];
    const correctAnswer = method.characteristics[char.key];
    const correct = correctAnswer === userAnswer;

    const newAnswer = {
      method: method.name,
      characteristic: char.label,
      userAnswer,
      correctAnswer,
      correct,
    };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setShowFeedback(correct);

    setTimeout(() => {
      setShowFeedback(null);
      if (updatedAnswers.length >= methodCharAssignments.length) {
        setFinished(true);
        const score = updatedAnswers.filter((a) => a.correct).length;
        const maxScore = methodCharAssignments.length;
        if (token) {
          submitMutation.mutate({
            token,
            weekId,
            classId,
            dynamicId: 2,
            response: { answers: updatedAnswers },
            score,
            maxScore,
            timeSpentMs: Date.now() - startTime,
          });
        }
        onComplete?.(score, maxScore);
      }
    }, 1300);
  };

  const score = answers.filter((a) => a.correct).length;
  const maxScore = methodCharAssignments.length;
  const progress = (answers.length / methodCharAssignments.length) * 100;

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <div className="text-5xl">{score === maxScore ? "🏆" : score >= 7 ? "🎉" : score >= 5 ? "👍" : "💪"}</div>
          <h2 className="text-2xl font-bold">
            {score === maxScore ? "¡Perfecto!" : score >= 7 ? "¡Excelente!" : score >= 5 ? "¡Bien hecho!" : "¡Sigue practicando!"}
          </h2>
          <p className="text-muted-foreground">
            {score}/{maxScore} respuestas correctas
          </p>
        </motion.div>

        <Card>
          <CardContent className="p-4 space-y-2">
            {answers.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  a.correct ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"
                }`}
              >
                <span className="text-xl flex-shrink-0">{METHODS[methodCharAssignments[i].methodIdx].emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {a.method} &mdash; {a.characteristic}
                  </p>
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
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentAssignment) return null;

  const method = METHODS[currentAssignment.methodIdx];
  const char = CHARACTERISTICS[currentAssignment.charIdx];
  const CharIcon = char.icon;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <Badge className="bg-primary/10 text-primary">Dinámica 2 - Semana 2</Badge>
        <h2 className="text-2xl md:text-3xl font-bold">Tabla Comparativa</h2>
        <p className="text-muted-foreground text-sm">
          Selecciona la característica correcta para cada método de medición de composición corporal.
        </p>
      </motion.div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {currentStep + 1}/{methodCharAssignments.length}
          </span>
          <span>{score} correctas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className={`overflow-hidden transition-all ${
              showFeedback === true
                ? "ring-4 ring-green-400"
                : showFeedback === false
                ? "ring-4 ring-red-400"
                : ""
            }`}
          >
            <CardContent className="p-6 md:p-8 text-center space-y-4">
              <div className="text-5xl">{method.emoji}</div>
              <p className="text-xl font-bold">{method.name}</p>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <CharIcon size={18} />
                <span className="text-sm font-medium">{char.label}</span>
              </div>
              {showFeedback !== null && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Badge className={`text-white text-sm px-3 py-1 ${showFeedback ? "bg-green-500" : "bg-red-500"}`}>
                    {showFeedback
                      ? "¡Correcto!"
                      : `Incorrecto → ${method.characteristics[char.key]}`}
                  </Badge>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {char.options.map((opt) => (
          <Button
            key={opt}
            variant="outline"
            onClick={() => handleAnswer(opt)}
            disabled={showFeedback !== null}
            className="h-auto py-4 text-sm font-medium"
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
}

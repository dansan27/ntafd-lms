import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Dumbbell, Sofa, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const SITUATIONS = [
  { text: "Juan sube las escaleras en vez del ascensor para llegar a su oficina", answer: "actividad_fisica", emoji: "🚶" },
  { text: "María corre 5km todos los martes y jueves siguiendo un plan de entrenamiento", answer: "ejercicio", emoji: "🏃‍♀️" },
  { text: "Pedro ve Netflix acostado en el sofá toda la tarde", answer: "ninguno", emoji: "📺" },
  { text: "Ana camina 20 minutos al trabajo todos los días", answer: "actividad_fisica", emoji: "👩‍💼" },
  { text: "Carlos hace pesas 4 veces por semana con un programa de hipertrofia", answer: "ejercicio", emoji: "🏋️" },
  { text: "Un futbolista profesional hace entrenamiento táctico con GPS y pulsómetro", answer: "ejercicio", emoji: "⚽" },
  { text: "Lucía pasea a su perro por el parque 30 minutos cada mañana", answer: "actividad_fisica", emoji: "🐕" },
];

const CATEGORIES = [
  { id: "actividad_fisica", label: "Actividad Física", icon: Activity, color: "bg-green-600 hover:bg-green-700", desc: "Movimiento sin plan específico" },
  { id: "ejercicio", label: "Ejercicio Físico", icon: Dumbbell, color: "bg-blue-600 hover:bg-blue-700", desc: "Planificado + estructurado" },
  { id: "ninguno", label: "Ninguno", icon: Sofa, color: "bg-gray-600 hover:bg-gray-700", desc: "No es actividad física" },
];

export default function Dynamic3ClassifyAction() {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ situation: string; userAnswer: string; correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState<boolean | null>(null);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => {
      toast.success(`Resultado: ${data.score}/${data.maxScore} correctas`);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleAnswer = (userAnswer: string) => {
    if (finished || showFeedback !== null) return;
    const situation = SITUATIONS[currentIndex];
    const correct = situation.answer === userAnswer;

    const newAnswer = { situation: situation.text, userAnswer, correct };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setShowFeedback(correct);

    setTimeout(() => {
      setShowFeedback(null);
      if (currentIndex + 1 >= SITUATIONS.length) {
        setFinished(true);
        const correctCount = updatedAnswers.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token,
            dynamicId: 3,
            response: { answers: updatedAnswers },
            score: correctCount,
            maxScore: SITUATIONS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 1200);
  };

  const correctCount = answers.filter(a => a.correct).length;
  const progress = ((currentIndex + (finished ? 1 : 0)) / SITUATIONS.length) * 100;

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <div className="text-5xl">{correctCount === SITUATIONS.length ? "🏆" : correctCount >= 5 ? "🎉" : "💪"}</div>
          <h2 className="text-2xl font-bold">
            {correctCount === SITUATIONS.length ? "¡Perfecto!" : correctCount >= 5 ? "¡Excelente!" : "¡Buen intento!"}
          </h2>
          <p className="text-muted-foreground">{correctCount}/{SITUATIONS.length} clasificaciones correctas</p>
        </motion.div>

        <Card>
          <CardContent className="p-4 space-y-2">
            {answers.map((a, i) => {
              const sit = SITUATIONS[i];
              const correctCat = CATEGORIES.find(c => c.id === sit.answer);
              return (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${a.correct ? "bg-green-50" : "bg-red-50"}`}>
                  <span className="text-xl flex-shrink-0">{sit.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{sit.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {!a.correct && <>Tu respuesta: {CATEGORIES.find(c => c.id === a.userAnswer)?.label} → </>}
                      Correcto: <strong>{correctCat?.label}</strong>
                    </p>
                  </div>
                  {a.correct ? <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} /> : <XCircle className="text-red-500 flex-shrink-0" size={18} />}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <Badge className="bg-primary/10 text-primary">Dinámica 3</Badge>
        <h2 className="text-2xl md:text-3xl font-bold">Clasifica la Acción</h2>
        <p className="text-muted-foreground text-sm">
          ¿Es Actividad Física, Ejercicio Físico o Ninguno? Aplica las definiciones del ACSM.
        </p>
      </motion.div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentIndex + 1}/{SITUATIONS.length}</span>
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
          <Card className={`overflow-hidden transition-all ${
            showFeedback === true ? "ring-4 ring-green-400" :
            showFeedback === false ? "ring-4 ring-red-400" : ""
          }`}>
            <CardContent className="p-6 md:p-8 text-center space-y-4">
              <div className="text-5xl">{SITUATIONS[currentIndex].emoji}</div>
              <p className="text-lg font-medium leading-relaxed">{SITUATIONS[currentIndex].text}</p>
              {showFeedback !== null && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Badge className={`text-white text-sm px-3 py-1 ${showFeedback ? "bg-green-500" : "bg-red-500"}`}>
                    {showFeedback ? "¡Correcto!" : `Incorrecto → ${CATEGORIES.find(c => c.id === SITUATIONS[currentIndex].answer)?.label}`}
                  </Badge>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => handleAnswer(cat.id)}
            disabled={showFeedback !== null}
            className={`h-auto py-4 text-white flex flex-col items-center gap-1 ${cat.color}`}
          >
            <cat.icon size={20} />
            <span className="font-bold text-sm">{cat.label}</span>
            <span className="text-[10px] opacity-70">{cat.desc}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

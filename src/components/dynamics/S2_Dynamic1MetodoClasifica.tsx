import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, FlaskConical, Microscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const METHODS = [
  { text: "Disección Cadavérica", answer: "directo", emoji: "🔬" },
  { text: "Pesaje Hidrostático", answer: "indirecto", emoji: "🏊" },
  { text: "DEXA", answer: "indirecto", emoji: "☢️" },
  { text: "Bod Pod", answer: "indirecto", emoji: "🥚" },
  { text: "Pliegues Cutáneos", answer: "indirecto", emoji: "📏" },
  { text: "Bioimpedancia (BIA)", answer: "indirecto", emoji: "⚡" },
  { text: "Circunferencias", answer: "indirecto", emoji: "📐" },
  { text: "Escaneo 3D", answer: "indirecto", emoji: "📱" },
];

const CATEGORIES = [
  { id: "directo", label: "Directo", icon: Microscope, color: "bg-emerald-600 hover:bg-emerald-700", desc: "Medición directa del componente" },
  { id: "indirecto", label: "Indirecto", icon: FlaskConical, color: "bg-violet-600 hover:bg-violet-700", desc: "Estimación a partir de otra variable" },
];

interface Props {
  weekId?: number;
  classId?: number;
}

export default function S2_Dynamic1MetodoClasifica({ weekId = 2, classId = 1 }: Props) {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ method: string; userAnswer: string; correct: boolean }[]>([]);
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
    const method = METHODS[currentIndex];
    const correct = method.answer === userAnswer;

    const newAnswer = { method: method.text, userAnswer, correct };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setShowFeedback(correct);

    setTimeout(() => {
      setShowFeedback(null);
      if (currentIndex + 1 >= METHODS.length) {
        setFinished(true);
        const correctCount = updatedAnswers.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token,
            weekId,
            classId,
            dynamicId: 1,
            response: { answers: updatedAnswers },
            score: correctCount,
            maxScore: METHODS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 1200);
  };

  const correctCount = answers.filter(a => a.correct).length;
  const progress = ((currentIndex + (finished ? 1 : 0)) / METHODS.length) * 100;

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <div className="text-5xl">{correctCount === METHODS.length ? "🏆" : correctCount >= 6 ? "🎉" : "💪"}</div>
          <h2 className="text-2xl font-bold">
            {correctCount === METHODS.length ? "¡Perfecto!" : correctCount >= 6 ? "¡Excelente!" : "¡Buen intento!"}
          </h2>
          <p className="text-muted-foreground">{correctCount}/{METHODS.length} clasificaciones correctas</p>
        </motion.div>

        <Card>
          <CardContent className="p-4 space-y-2">
            {answers.map((a, i) => {
              const m = METHODS[i];
              const correctCat = CATEGORIES.find(c => c.id === m.answer);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-start gap-3 p-3 rounded-lg ${a.correct ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"}`}
                >
                  <span className="text-xl flex-shrink-0">{m.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{m.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {!a.correct && <>Tu respuesta: {CATEGORIES.find(c => c.id === a.userAnswer)?.label} → </>}
                      Correcto: <strong>{correctCat?.label}</strong>
                    </p>
                  </div>
                  {a.correct ? <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} /> : <XCircle className="text-red-500 flex-shrink-0" size={18} />}
                </motion.div>
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
        <Badge className="bg-primary/10 text-primary">Dinámica 1 - Semana 2</Badge>
        <h2 className="text-2xl md:text-3xl font-bold">Clasifica el Método</h2>
        <p className="text-muted-foreground text-sm">
          ¿El método de evaluación es Directo o Indirecto? Clasifica cada uno correctamente.
        </p>
      </motion.div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentIndex + 1}/{METHODS.length}</span>
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
              <div className="text-5xl">{METHODS[currentIndex].emoji}</div>
              <p className="text-lg font-medium leading-relaxed">{METHODS[currentIndex].text}</p>
              {showFeedback !== null && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Badge className={`text-white text-sm px-3 py-1 ${showFeedback ? "bg-green-500" : "bg-red-500"}`}>
                    {showFeedback ? "¡Correcto!" : `Incorrecto → ${CATEGORIES.find(c => c.id === METHODS[currentIndex].answer)?.label}`}
                  </Badge>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => handleAnswer(cat.id)}
            disabled={showFeedback !== null}
            className={`h-auto py-5 text-white flex flex-col items-center gap-2 ${cat.color}`}
          >
            <cat.icon size={24} />
            <span className="font-bold text-base">{cat.label}</span>
            <span className="text-xs opacity-70">{cat.desc}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

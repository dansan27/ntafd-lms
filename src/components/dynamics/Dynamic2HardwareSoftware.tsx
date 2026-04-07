import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Cpu, Code, CheckCircle2, XCircle, Timer, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const ITEMS = [
  { name: "Disco Duro", answer: "hardware", emoji: "💾" },
  { name: "Windows 11", answer: "software", emoji: "🪟" },
  { name: "Sensor de temperatura", answer: "hardware", emoji: "🌡️" },
  { name: "Strava", answer: "software", emoji: "📱" },
  { name: "Pantalla LED", answer: "hardware", emoji: "🖥️" },
  { name: "Algoritmo cuenta pasos", answer: "software", emoji: "🔢" },
  { name: "Memoria RAM", answer: "hardware", emoji: "🧮" },
  { name: "Android", answer: "software", emoji: "🤖" },
];

export default function Dynamic2HardwareSoftware() {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ item: string; userAnswer: string; correct: boolean; timeMs: number }[]>([]);
  const [finished, setFinished] = useState(false);
  const [itemStartTime, setItemStartTime] = useState(Date.now());
  const [startTime] = useState(Date.now());
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(null);

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => {
      toast.success(`Resultado: ${data.score}/${data.maxScore} correctas`);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleAnswer = useCallback((userAnswer: string) => {
    if (finished || showFeedback) return;
    const item = ITEMS[currentIndex];
    const correct = item.answer === userAnswer;
    const timeMs = Date.now() - itemStartTime;

    const newAnswer = { item: item.name, userAnswer, correct, timeMs };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    setShowFeedback(correct ? "correct" : "wrong");

    setTimeout(() => {
      setShowFeedback(null);
      if (currentIndex + 1 >= ITEMS.length) {
        setFinished(true);
        // Submit results
        const correctCount = updatedAnswers.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token,
            dynamicId: 2,
            response: { answers: updatedAnswers },
            score: correctCount,
            maxScore: ITEMS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex(prev => prev + 1);
        setItemStartTime(Date.now());
      }
    }, 800);
  }, [currentIndex, answers, finished, itemStartTime, showFeedback, token, startTime, submitMutation]);

  const currentItem = ITEMS[currentIndex];
  const progress = ((currentIndex + (finished ? 1 : 0)) / ITEMS.length) * 100;
  const correctCount = answers.filter(a => a.correct).length;
  const avgTime = answers.length > 0 ? Math.round(answers.reduce((sum, a) => sum + a.timeMs, 0) / answers.length) : 0;

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <div className="text-5xl mb-2">{correctCount === ITEMS.length ? "🏆" : correctCount >= 6 ? "🎉" : "💪"}</div>
          <h2 className="text-2xl font-bold">
            {correctCount === ITEMS.length ? "¡Perfecto!" : correctCount >= 6 ? "¡Muy bien!" : "¡Buen intento!"}
          </h2>
          <p className="text-muted-foreground">{correctCount}/{ITEMS.length} respuestas correctas</p>
          <p className="text-sm text-muted-foreground">Tiempo promedio: {avgTime}ms por elemento</p>
        </motion.div>

        <Card>
          <CardContent className="p-4 space-y-2">
            {answers.map((a, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${a.correct ? "bg-green-50" : "bg-red-50"}`}>
                <span className="text-xl">{ITEMS[i].emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.item}</p>
                  <p className="text-xs text-muted-foreground">
                    Tu respuesta: {a.userAnswer} {!a.correct && `→ Correcto: ${ITEMS[i].answer}`}
                  </p>
                </div>
                <div className="text-right">
                  {a.correct ? <CheckCircle2 className="text-green-600" size={18} /> : <XCircle className="text-red-500" size={18} />}
                  <p className="text-[10px] text-muted-foreground">{a.timeMs}ms</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <Badge className="bg-primary/10 text-primary">Dinámica 2</Badge>
        <h2 className="text-2xl md:text-3xl font-bold">Hardware vs Software</h2>
        <p className="text-muted-foreground text-sm">
          Clasifica cada elemento lo más rápido posible. ¡Se mide tu tiempo de reacción!
        </p>
      </motion.div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentIndex + 1}/{ITEMS.length}</span>
          <span className="flex items-center gap-1"><Timer size={12} /> {avgTime}ms promedio</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`overflow-hidden transition-all ${
            showFeedback === "correct" ? "ring-4 ring-green-400" :
            showFeedback === "wrong" ? "ring-4 ring-red-400" : ""
          }`}>
            <CardContent className="p-8 text-center space-y-6">
              <div className="text-6xl">{currentItem.emoji}</div>
              <h3 className="text-2xl font-bold">{currentItem.name}</h3>
              {showFeedback && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  {showFeedback === "correct" ? (
                    <Badge className="bg-green-500 text-white text-lg px-4 py-1">¡Correcto!</Badge>
                  ) : (
                    <Badge className="bg-red-500 text-white text-lg px-4 py-1">Incorrecto</Badge>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => handleAnswer("hardware")}
          disabled={!!showFeedback}
          className="h-20 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Cpu className="mr-2" size={24} />
          Hardware
        </Button>
        <Button
          onClick={() => handleAnswer("software")}
          disabled={!!showFeedback}
          className="h-20 text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Code className="mr-2" size={24} />
          Software
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        <Zap size={12} className="inline mr-1" />
        Responde lo más rápido posible — se registra tu tiempo de reacción
      </p>
    </div>
  );
}

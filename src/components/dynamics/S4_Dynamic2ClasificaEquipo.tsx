import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Stethoscope, Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const ITEMS = [
  { text: "ECG de 12 derivaciones en reposo", emoji: "🏥", answer: "clinico", hint: "Requiere 10 electrodos y técnico especializado" },
  { text: "Polar H10 durante un partido de fútbol", emoji: "⚽", answer: "deportivo", hint: "Diseñado para movimiento y sudor" },
  { text: "Monitor Holter 24 horas", emoji: "📟", answer: "clinico", hint: "Registro continuo para diagnóstico cardiológico" },
  { text: "KardiaMobile (AliveCor) en el gym", emoji: "📱", answer: "deportivo", hint: "App con certificación FDA para uso personal" },
  { text: "Ecocardiograma de estrés", emoji: "🔬", answer: "clinico", hint: "Requiere cardiólogo y equipo de ultrasonido" },
  { text: "Sensor Garmin HRM-Pro", emoji: "⌚", answer: "deportivo", hint: "Integrado con relojes deportivos GPS" },
  { text: "ECG intrahospitalario post-infarto", emoji: "🏨", answer: "clinico", hint: "Monitoreo continuo en UCI cardiológica" },
  { text: "EMAY Portable ECG en campo", emoji: "🏃", answer: "deportivo", hint: "Portátil, sin configuración, batería AAA" },
];

const CATEGORIES = [
  { id: "clinico", label: "Clínico / Médico", icon: Stethoscope, color: "bg-blue-600 hover:bg-blue-700 text-white", desc: "Hospital, diagnóstico, especialista" },
  { id: "deportivo", label: "Uso Deportivo", icon: Dumbbell, color: "bg-emerald-600 hover:bg-emerald-700 text-white", desc: "Campo, entrenamiento, portátil" },
];

interface Props {
  weekId?: number;
  classId?: number;
}

export default function S4_Dynamic2ClasificaEquipo({ weekId = 4, classId = 1 }: Props) {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ item: string; userAnswer: string; correct: boolean }[]>([]);
  const [showFeedback, setShowFeedback] = useState<boolean | null>(null);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => toast.success(`Resultado: ${data.score}/${data.maxScore} correctas`),
    onError: (err) => toast.error(err.message),
  });

  const handleAnswer = (userAnswer: string) => {
    if (showFeedback !== null || finished) return;
    const item = ITEMS[currentIndex];
    const correct = item.answer === userAnswer;
    const newAnswer = { item: item.text, userAnswer, correct };
    const updated = [...answers, newAnswer];
    setAnswers(updated);
    setShowFeedback(correct);

    setTimeout(() => {
      setShowFeedback(null);
      if (currentIndex + 1 >= ITEMS.length) {
        setFinished(true);
        const correctCount = updated.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 2,
            response: { answers: updated },
            score: correctCount,
            maxScore: ITEMS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 1400);
  };

  const correctCount = answers.filter(a => a.correct).length;
  const progress = ((currentIndex + (finished ? 1 : 0)) / ITEMS.length) * 100;

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <div className="text-5xl">{correctCount === ITEMS.length ? "🏆" : correctCount >= 6 ? "🎉" : "💪"}</div>
          <h2 className="text-2xl font-bold">
            {correctCount === ITEMS.length ? "¡Perfecto!" : correctCount >= 6 ? "¡Muy bien!" : "¡Sigue practicando!"}
          </h2>
          <p className="text-muted-foreground">{correctCount}/{ITEMS.length} clasificaciones correctas</p>
        </motion.div>

        <Card>
          <CardContent className="p-4 space-y-2">
            {answers.map((a, i) => {
              const item = ITEMS[i];
              const correctCat = CATEGORIES.find(c => c.id === item.answer);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`flex items-start gap-3 p-3 rounded-lg ${a.correct ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"}`}
                >
                  <span className="text-xl flex-shrink-0">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {!a.correct && <>Tu resp: {CATEGORIES.find(c => c.id === a.userAnswer)?.label} → </>}
                      Correcto: <strong>{correctCat?.label}</strong>
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.hint}</p>
                  </div>
                  {a.correct ? <CheckCircle2 className="text-green-600 flex-shrink-0" size={16} /> : <XCircle className="text-red-500 flex-shrink-0" size={16} />}
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <Badge className="bg-primary/10 text-primary">Dinámica 2 — Semana 4</Badge>
        <h2 className="text-2xl md:text-3xl font-bold">Clasifica el Equipo</h2>
        <p className="text-muted-foreground text-sm">¿Es de uso clínico/médico o deportivo? Clasifica cada dispositivo correctamente.</p>
      </motion.div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentIndex + 1}/{ITEMS.length}</span>
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
          transition={{ duration: 0.25 }}
        >
          <Card className={`overflow-hidden transition-all ${
            showFeedback === true ? "ring-4 ring-green-400" :
            showFeedback === false ? "ring-4 ring-red-400" : ""
          }`}>
            <CardContent className="p-6 md:p-8 text-center space-y-4">
              <div className="text-5xl">{ITEMS[currentIndex].emoji}</div>
              <p className="text-lg font-medium leading-relaxed">{ITEMS[currentIndex].text}</p>
              {showFeedback !== null && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Badge className={`text-white text-sm px-3 py-1 ${showFeedback ? "bg-green-500" : "bg-red-500"}`}>
                    {showFeedback ? "¡Correcto!" : `Incorrecto → ${CATEGORIES.find(c => c.id === ITEMS[currentIndex].answer)?.label}`}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">{ITEMS[currentIndex].hint}</p>
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
            className={`h-auto py-5 flex flex-col items-center gap-2 ${cat.color}`}
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

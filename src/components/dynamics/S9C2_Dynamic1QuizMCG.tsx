import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const QUESTIONS = [
  {
    question: "¿Qué mide exactamente un sensor MCG como el FreeStyle Libre?",
    options: ["Glucosa en sangre capilar", "Glucosa en líquido intersticial", "Insulina circulante", "HbA1c en tiempo real"],
    answer: "Glucosa en líquido intersticial",
    explanation: "Los MCG miden glucosa intersticial (entre células), no en sangre directamente. Hay un retraso de 10–15 min vs glucemia capilar — importante durante ejercicio intenso.",
  },
  {
    question: "¿Cuál es la principal ventaja del Dexcom G7 sobre el FreeStyle Libre 2?",
    options: ["Menor precio", "Alertas en tiempo real sin necesidad de escanear", "Mayor duración del sensor (21 días)", "Mide también insulina"],
    answer: "Alertas en tiempo real sin necesidad de escanear",
    explanation: "Dexcom G7 envía alertas continuas (hipoglucemia/hiperglucemia) al smartphone sin escanear. FreeStyle Libre requiere escaneo activo en su versión básica.",
  },
  {
    question: "Un atleta con DM1 tiene glucemia pre-ejercicio de 80 mg/dL. ¿Qué debe hacer antes de comenzar?",
    options: ["Inyectarse insulina rápida", "Ingerir 15–20 g de carbohidratos", "Comenzar el ejercicio normalmente", "Posponer el ejercicio indefinidamente"],
    answer: "Ingerir 15–20 g de carbohidratos",
    explanation: "Con glucemia < 90 mg/dL pre-ejercicio, hay riesgo de hipoglucemia. Se recomienda ingerir 15–20 g de carbohidratos de acción rápida antes de comenzar.",
  },
  {
    question: "¿Qué significa MARD < 9% en un MCG?",
    options: [
      "El sensor dura menos de 9 días",
      "El error promedio absoluto relativo es menor al 9% — precisión clínica aceptable",
      "El sensor solo funciona el 9% del día",
      "Requiere calibración cada 9 horas",
    ],
    answer: "El error promedio absoluto relativo es menor al 9% — precisión clínica aceptable",
    explanation: "MARD (Mean Absolute Relative Difference) indica la precisión del MCG vs glucemia capilar. MARD < 9% es el estándar de precisión clínica aceptable para uso terapéutico.",
  },
  {
    question: "¿Cuál es el principal riesgo del ejercicio físico en pacientes con DM1 que usan insulina?",
    options: ["Hipertensión aguda", "Hipoglucemia durante o post-ejercicio", "Cetoacidosis inmediata", "Fatiga muscular severa"],
    answer: "Hipoglucemia durante o post-ejercicio",
    explanation: "El ejercicio aumenta la sensibilidad a la insulina y consume glucosa muscular. En DM1, esto puede causar hipoglucemia hasta 24–48 h después del ejercicio — el MCG permite detectarla.",
  },
];

interface Props { weekId?: number; classId?: number }

export default function S9C2_Dynamic1QuizMCG({ weekId = 9, classId = 2 }: Props) {
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
  const correctCount = answers.filter(a => a.correct).length;
  const progress = ((currentIndex + (finished ? 1 : 0)) / QUESTIONS.length) * 100;

  const handleSelect = (option: string) => {
    if (showFeedback) return;
    setSelected(option);
    setShowFeedback(true);
    const correct = option === current.answer;
    const newAnswers = [...answers, { question: current.question, selected: option, correct }];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIndex + 1 >= QUESTIONS.length) {
        setFinished(true);
        const total = newAnswers.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 1,
            response: { answers: newAnswers },
            score: total,
            maxScore: QUESTIONS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex(prev => prev + 1);
        setSelected(null);
        setShowFeedback(false);
      }
    }, 1900);
  };

  if (finished) {
    const pct = Math.round((correctCount / QUESTIONS.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <span className="text-6xl">{pct >= 80 ? "💉" : pct >= 60 ? "💡" : "📖"}</span>
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Dominas el MCG!" : pct >= 60 ? "Buen manejo clínico" : "Repasa los dispositivos MCG"}</h3>
          <p className="text-muted-foreground">{correctCount} de {QUESTIONS.length} correctas — {pct}%</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Pregunta {currentIndex + 1} de {QUESTIONS.length}</span>
          <span>{correctCount} correctas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-5">
              <Badge className="bg-teal-500/20 text-teal-300 text-xs">💉 MCG en Acción</Badge>
              <p className="text-base font-bold leading-snug">{current.question}</p>
              <div className="grid grid-cols-1 gap-2">
                {current.options.map((opt, i) => {
                  const isSelected = selected === opt;
                  const isCorrect = opt === current.answer;
                  let style = "border-border hover:border-primary/50 hover:bg-primary/5";
                  if (showFeedback && isSelected && isCorrect) style = "border-green-500 bg-green-500/10";
                  else if (showFeedback && isSelected && !isCorrect) style = "border-red-500 bg-red-500/10";
                  else if (showFeedback && isCorrect) style = "border-green-500/50 bg-green-500/5";
                  return (
                    <button key={i} onClick={() => handleSelect(opt)}
                      className={`text-left p-3 rounded-xl border text-sm font-medium transition-all ${style}`}>
                      <span className="text-muted-foreground mr-2">{["A", "B", "C", "D"][i]}.</span>{opt}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {showFeedback && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl p-3 text-xs ${selected === current.answer ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"}`}>
                    <p className="font-bold mb-1">{selected === current.answer ? "✓ Correcto" : "✗ Incorrecto"}</p>
                    <p className="text-muted-foreground">{current.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

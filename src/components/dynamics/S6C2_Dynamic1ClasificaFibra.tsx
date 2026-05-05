import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const SCENARIOS = [
  {
    scenario: "Una triatleta profesional completa un Ironman (3.8 km nado + 180 km bici + 42 km carrera). ¿Qué tipo de fibra muscular domina su perfil genético?",
    answer: "Type I",
    explanation: "El triatlón de distancia larga requiere trabajo aeróbico sostenido durante 8–17 horas. Las fibras Type I (lentas) son altamente resistentes a la fatiga y eficientes en metabolismo oxidativo.",
  },
  {
    scenario: "Un velocista olímpico corre los 100m en 9.8s con máxima potencia explosiva. ¿Qué tipo de fibra predomina en sus cuádriceps y glúteos?",
    answer: "Type IIx",
    explanation: "Los 100m requieren máxima potencia en 10 segundos. Las fibras Type IIx (rápidas) generan la mayor fuerza y velocidad de contracción, aunque se fatigan muy rápido.",
  },
  {
    scenario: "Un jugador de fútbol alterna sprints cortos con trote lento durante 90 minutos. Sus fibras musculares son intermedias y muy adaptables al entrenamiento.",
    answer: "Type IIa",
    explanation: "El fútbol combina esfuerzos aeróbicos y anaeróbicos. Las fibras Type IIa son las más plásticas — pueden mejorar tanto la resistencia como la potencia según el entrenamiento.",
  },
  {
    scenario: "Un halterófilo hace un Clean & Jerk con 200 kg en menos de 2 segundos. ¿Qué tipo de fibra se recluta en este esfuerzo máximo?",
    answer: "Type IIx",
    explanation: "La halterofilia requiere máxima fuerza en tiempo mínimo. Esto activa las fibras Type IIx (último en reclutarse, pero de mayor potencia). También participan IIa, pero IIx son las que marcan el límite.",
  },
  {
    scenario: "Una ciclista de ruta pedalea 5 horas a intensidad moderada (~65% VO₂ Máx). ¿Qué fibras mantienen la actividad durante todo el recorrido?",
    answer: "Type I",
    explanation: "A baja-moderada intensidad, el sistema nervioso recluta primero las fibras Type I. Son las más eficientes aeróbicamente y muy resistentes a la fatiga — perfectas para esfuerzos prolongados.",
  },
  {
    scenario: "Un nadador realiza series de 400m a intensidad submáxima. Sus fibras musculares tienen buena capacidad aeróbica Y anaeróbica, y responden bien al entrenamiento.",
    answer: "Type IIa",
    explanation: "La natación de 400m está en la zona mixta aeróbica-anaeróbica. Las fibras Type IIa son las más relevantes en esta distancia y las que más se adaptan al entrenamiento específico.",
  },
];

const OPTIONS = ["Type I", "Type IIa", "Type IIx"];

interface Props { weekId?: number; classId?: number; }

export default function S6C2_Dynamic1ClasificaFibra({ weekId = 6, classId = 2 }: Props) {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ selected: string; correct: boolean }[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => toast.success(`Resultado: ${data.score}/${data.maxScore} correctas`),
    onError: (err) => toast.error(err.message),
  });

  const current = SCENARIOS[currentIndex];
  const correctCount = answers.filter(a => a.correct).length;
  const progress = ((currentIndex + (finished ? 1 : 0)) / SCENARIOS.length) * 100;

  const handleSelect = (option: string) => {
    if (showFeedback) return;
    setSelected(option);
    setShowFeedback(true);
    const correct = option === current.answer;
    const newAnswers = [...answers, { selected: option, correct }];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIndex + 1 >= SCENARIOS.length) {
        setFinished(true);
        const total = newAnswers.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 1,
            response: { answers: newAnswers },
            score: total,
            maxScore: SCENARIOS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex(prev => prev + 1);
        setSelected(null);
        setShowFeedback(false);
      }
    }, 2000);
  };

  if (finished) {
    const pct = Math.round((correctCount / SCENARIOS.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <span className="text-6xl">{pct >= 80 ? "🧬" : pct >= 60 ? "💪" : "📖"}</span>
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Experto en fibras!" : pct >= 60 ? "Buen trabajo" : "Repasa los tipos"}</h3>
          <p className="text-muted-foreground">{correctCount} de {SCENARIOS.length} correctas — {pct}%</p>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
          </div>
        </motion.div>
        <div className="grid grid-cols-3 gap-3">
          {OPTIONS.map(o => {
            const total = SCENARIOS.filter(s => s.answer === o).length;
            const correct = answers.filter((a, i) => SCENARIOS[i].answer === o && a.correct).length;
            return (
              <Card key={o}>
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold">{correct}/{total}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{o}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Escenario {currentIndex + 1} de {SCENARIOS.length}</span>
          <span>{correctCount} correctas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-5">
              <Badge className="bg-purple-500/20 text-purple-300 text-xs">🧬 Clasifica la Fibra</Badge>
              <div className="rounded-xl bg-muted/40 border border-border p-4">
                <p className="text-sm leading-relaxed">{current.scenario}</p>
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">¿Qué tipo de fibra muscular predomina?</p>
              <div className="grid grid-cols-3 gap-3">
                {OPTIONS.map((opt) => {
                  const isSelected = selected === opt;
                  const isCorrect = opt === current.answer;
                  let style = "border-border hover:border-primary/50 hover:bg-primary/5";
                  if (showFeedback && isSelected && isCorrect) style = "border-green-500 bg-green-500/10 text-green-300";
                  else if (showFeedback && isSelected && !isCorrect) style = "border-red-500 bg-red-500/10 text-red-300";
                  else if (showFeedback && isCorrect) style = "border-green-500/50 bg-green-500/5 text-green-400";
                  return (
                    <button key={opt} onClick={() => handleSelect(opt)}
                      className={`p-4 rounded-xl border text-sm font-bold transition-all text-center ${style}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {showFeedback && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl p-3 text-xs flex items-start gap-2 ${selected === current.answer ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"}`}>
                    {selected === current.answer
                      ? <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                      : <XCircle size={14} className="shrink-0 mt-0.5" />}
                    <div>
                      <p className="font-bold">{selected === current.answer ? "Correcto" : `Incorrecto — es ${current.answer}`}</p>
                      <p className="text-muted-foreground mt-0.5">{current.explanation}</p>
                    </div>
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

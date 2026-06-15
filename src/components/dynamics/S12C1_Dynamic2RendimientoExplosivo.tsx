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
    scenario: "Un velocista completa 10 metros en 1.8 segundos desde parado. ¿Qué capacidad se evalúa principalmente?",
    answer: "Velocidad",
    explanation: "El tiempo en 10 m desde parado evalúa la velocidad de sprint y la aceleración inicial — capacidad de desplazamiento rápido en línea recta.",
  },
  {
    scenario: "Un jugador de voleibol realiza un salto vertical con impulso desde parado (CMJ). ¿Qué capacidad mide este test?",
    answer: "Explosividad",
    explanation: "El CMJ mide la potencia explosiva del tren inferior — capacidad de generar la máxima fuerza en el menor tiempo posible (Rate of Force Development).",
  },
  {
    scenario: "Un remero completa el test de 1RM de sentadilla para planificar su temporada de fuerza. ¿Qué capacidad se evalúa?",
    answer: "Fuerza",
    explanation: "El test 1RM evalúa la fuerza máxima — la capacidad de producir la mayor fuerza posible en una repetición, base de la producción de potencia.",
  },
  {
    scenario: "Un jugador de fútbol completa el T-Test en 9.4 segundos cambiando de dirección entre 4 conos. ¿Qué capacidad se mide?",
    answer: "Agilidad",
    explanation: "El T-Test evalúa la agilidad — capacidad de cambiar de dirección rápidamente con control postural, combinando velocidad y coordinación.",
  },
  {
    scenario: "Un nadador aplica 1800 N en la salida de bloque en 0.12 segundos. ¿Cuál es la capacidad más relevante aquí?",
    answer: "Explosividad",
    explanation: "La salida en natación requiere máxima explosividad — aplicar el mayor impulso posible en mínimo tiempo para maximizar la velocidad inicial.",
  },
];

const OPTIONS = ["Velocidad", "Fuerza", "Explosividad", "Agilidad"];

interface Props { weekId?: number; classId?: number; }

export default function S12C1_Dynamic2RendimientoExplosivo({ weekId = 12, classId = 1 }: Props) {
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
  const correctCount = answers.filter((a) => a.correct).length;
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
        const total = newAnswers.filter((a) => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 2,
            response: { answers: newAnswers },
            score: total,
            maxScore: SCENARIOS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex((prev) => prev + 1);
        setSelected(null);
        setShowFeedback(false);
      }
    }, 2200);
  };

  if (finished) {
    const pct = Math.round((correctCount / SCENARIOS.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <span className="text-6xl">{pct >= 80 ? "💥" : pct >= 60 ? "🏋️" : "📖"}</span>
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Experto en rendimiento explosivo!" : pct >= 60 ? "Buen trabajo" : "Repasa los 4 elementos"}</h3>
          <p className="text-muted-foreground">{correctCount} de {SCENARIOS.length} correctas — {pct}%</p>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <motion.div className="h-full bg-amber-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
          </div>
        </motion.div>
        <div className="space-y-2">
          {answers.map((a, i) => (
            <Card key={i} className={`border ${a.correct ? "border-green-500/30" : "border-red-500/30"}`}>
              <CardContent className="p-3 flex items-start gap-2">
                {a.correct ? <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={14} /> : <XCircle className="text-red-400 shrink-0 mt-0.5" size={14} />}
                <div>
                  <p className="text-xs font-medium">{SCENARIOS[i].scenario}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Tu respuesta: {a.selected}</p>
                  {!a.correct && <p className="text-xs text-green-400/70 mt-0.5">✓ {SCENARIOS[i].answer}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
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
          <Card className="border-amber-500/20">
            <CardContent className="p-6 space-y-5">
              <Badge className="bg-amber-500/20 text-amber-300 text-xs">💥 ¿Qué elemento del rendimiento?</Badge>
              <div className="rounded-xl bg-muted/40 border border-border p-4">
                <p className="text-sm leading-relaxed">{current.scenario}</p>
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                ¿Qué capacidad se evalúa principalmente?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {OPTIONS.map((opt) => {
                  const isSelected = selected === opt;
                  const isCorrect = opt === current.answer;
                  let style = "border-border hover:border-amber-500/50 hover:bg-amber-500/5";
                  if (showFeedback && isSelected && isCorrect) style = "border-green-500 bg-green-500/10 text-green-300";
                  else if (showFeedback && isSelected && !isCorrect) style = "border-red-500 bg-red-500/10 text-red-300";
                  else if (showFeedback && isCorrect) style = "border-green-500/50 bg-green-500/5 text-green-400";
                  const icons: Record<string, string> = { Velocidad: "🏃", Fuerza: "🏋️", Explosividad: "💥", Agilidad: "🔀" };
                  return (
                    <button key={opt} onClick={() => handleSelect(opt)}
                      className={`p-3 rounded-xl border text-sm font-bold transition-all text-center ${style}`}>
                      {icons[opt]} {opt}
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

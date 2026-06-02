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
    scenario: "Quieres agrupar 500 ciclistas en 3 perfiles (sprint / mixto / resistencia) de forma rápida",
    answer: "K-Means",
    explanation: "Número de clusters conocido (K=3), datos grandes, eficiencia requerida — K-Means es la opción más adecuada y escalable.",
  },
  {
    scenario: "Necesitas detectar atletas con patrones de carga anómalos que podrían lesionarse",
    answer: "DBSCAN",
    explanation: "DBSCAN detecta outliers como funcionalidad nativa — identifica atletas atípicos sin necesidad de especificar el número de grupos.",
  },
  {
    scenario: "Deseas explorar la jerarquía natural de estilos de juego en un equipo de fútbol sin saber cuántos grupos existen",
    answer: "Clustering Jerárquico",
    explanation: "No requiere K predefinido y genera un dendrograma exploratorio — ideal para descubrir la estructura de datos sin hipótesis previas.",
  },
  {
    scenario: "Tienes datos de GPS de 1000 jugadores y quieres identificar zonas de presión táctica",
    answer: "K-Means",
    explanation: "K-Means es escalable a 1000+ puntos y con K=3–5 produce zonas tácticamente interpretables en espacio 2D (x, y de campo).",
  },
  {
    scenario: "Quieres agrupar nadadores por similitud de técnica y obtener una visualización tipo árbol",
    answer: "Clustering Jerárquico",
    explanation: "El dendrograma visual del clustering jerárquico es interpretable sin K predefinido — perfecto para análisis exploratorio de técnica.",
  },
];

const OPTIONS = ["K-Means", "DBSCAN", "Clustering Jerárquico"];

interface Props { weekId?: number; classId?: number; }

export default function S10C2_Dynamic3IdentificaAlgoritmo({ weekId = 10, classId = 2 }: Props) {
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
            token, weekId, classId, dynamicId: 3,
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
    }, 2000);
  };

  if (finished) {
    const pct = Math.round((correctCount / SCENARIOS.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <span className="text-6xl">{pct >= 80 ? "🤖" : pct >= 60 ? "💜" : "📖"}</span>
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Experto en algoritmos!" : pct >= 60 ? "Buen trabajo" : "Repasa los algoritmos"}</h3>
          <p className="text-muted-foreground">{correctCount} de {SCENARIOS.length} correctas — {pct}%</p>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
          </div>
        </motion.div>
        <div className="grid grid-cols-3 gap-3">
          {OPTIONS.map((o) => {
            const total = SCENARIOS.filter((s) => s.answer === o).length;
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
        <div className="space-y-2">
          {answers.map((a, i) => (
            <Card key={i} className={`border ${a.correct ? "border-green-500/30" : "border-red-500/30"}`}>
              <CardContent className="p-3 flex items-start gap-2">
                {a.correct ? <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={14} /> : <XCircle className="text-red-400 shrink-0 mt-0.5" size={14} />}
                <div>
                  <p className="text-xs font-medium">{SCENARIOS[i].scenario}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Tu respuesta: {a.selected}</p>
                  {!a.correct && <p className="text-xs text-green-400/70 mt-0.5">✓ {SCENARIOS[i].answer}</p>}
                  <p className="text-xs text-white/30 mt-0.5">{SCENARIOS[i].explanation}</p>
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
          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-5">
              <Badge className="bg-violet-500/20 text-violet-300 text-xs">🤖 Identifica el Algoritmo</Badge>
              <div className="rounded-xl bg-muted/40 border border-border p-4">
                <p className="text-sm leading-relaxed">{current.scenario}</p>
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                ¿Qué algoritmo de clustering usarías?
              </p>
              <div className="flex flex-col gap-2">
                {OPTIONS.map((opt) => {
                  const isSelected = selected === opt;
                  const isCorrect = opt === current.answer;
                  let style = "border-border hover:border-primary/50 hover:bg-primary/5";
                  if (showFeedback && isSelected && isCorrect) style = "border-green-500 bg-green-500/10 text-green-300";
                  else if (showFeedback && isSelected && !isCorrect) style = "border-red-500 bg-red-500/10 text-red-300";
                  else if (showFeedback && isCorrect) style = "border-green-500/50 bg-green-500/5 text-green-400";
                  return (
                    <button key={opt} onClick={() => handleSelect(opt)}
                      className={`p-3 rounded-xl border text-sm font-bold transition-all text-center ${style}`}>
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

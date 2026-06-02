import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const QUESTIONS = [
  {
    question: "En K-Means, ¿qué representa el 'centroide'?",
    options: [
      "El punto más alejado del cluster",
      "La media del cluster",
      "El punto más cercano al origen",
      "El dato más frecuente",
    ],
    correct: 1,
    explanation: "El centroide es el punto medio del cluster, calculado como la media aritmética de todas las observaciones asignadas.",
  },
  {
    question: "¿Qué hace el 'Elbow Method' en K-Means?",
    options: [
      "Elimina outliers automáticamente",
      "Determina el K óptimo",
      "Normaliza los datos",
      "Reduce dimensiones",
    ],
    correct: 1,
    explanation: "Grafica la inercia (WCSS) para diferentes valores de K; el 'codo' marca el punto donde agregar más clusters ya no mejora significativamente.",
  },
  {
    question: "¿Cuál es la ventaja principal de DBSCAN sobre K-Means?",
    options: [
      "Es más rápido",
      "Detecta outliers y formas arbitrarias",
      "Requiere menos datos",
      "Siempre converge",
    ],
    correct: 1,
    explanation: "DBSCAN no requiere especificar K y puede identificar atletas atípicos (outliers) automáticamente, algo que K-Means no hace.",
  },
  {
    question: "¿Por qué es fundamental normalizar los datos antes de clusterizar?",
    options: [
      "Para reducir el tamaño del dataset",
      "Para que variables con diferente escala no dominen la distancia",
      "Para mejorar la visualización",
      "Para eliminar correlaciones",
    ],
    correct: 1,
    explanation: "Sin normalización, variables como 'potencia en vatios' (100–400W) dominarían sobre 'FC reposo' (40–80 bpm) distorsionando los clusters.",
  },
  {
    question: "El Silhouette Score varía entre -1 y 1. Un valor cercano a 1 indica...",
    options: [
      "Clusters solapados",
      "Outliers detectados",
      "Clusters bien separados y cohesivos",
      "K demasiado alto",
    ],
    correct: 2,
    explanation: "Silhouette ≈ 1 significa que el punto está muy cercano a su propio cluster y muy lejos de los vecinos — clustering de alta calidad.",
  },
];

interface Props { weekId?: number; classId?: number; }

export default function S10C2_Dynamic2QuizClustering({ weekId = 10, classId = 2 }: Props) {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; selectedIndex: number; correct: boolean }[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => toast.success(`Resultado: ${data.score}/${data.maxScore} correctas`),
    onError: (err) => toast.error(err.message),
  });

  const current = QUESTIONS[currentIndex];
  const correctCount = answers.filter((a) => a.correct).length;
  const progress = ((currentIndex + (finished ? 1 : 0)) / QUESTIONS.length) * 100;

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    setSelectedIndex(idx);
    setShowFeedback(true);
    const correct = idx === current.correct;
    const newAnswers = [...answers, { question: current.question, selectedIndex: idx, correct }];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIndex + 1 >= QUESTIONS.length) {
        setFinished(true);
        const total = newAnswers.filter((a) => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 2,
            response: { answers: newAnswers },
            score: total,
            maxScore: QUESTIONS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex((prev) => prev + 1);
        setSelectedIndex(null);
        setShowFeedback(false);
      }
    }, 1900);
  };

  if (finished) {
    const pct = Math.round((correctCount / QUESTIONS.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <span className="text-6xl">{pct >= 80 ? "🤖" : pct >= 60 ? "💜" : "📖"}</span>
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Dominas el clustering!" : pct >= 60 ? "Buen trabajo" : "Repasa los algoritmos"}</h3>
          <p className="text-muted-foreground">{correctCount} de {QUESTIONS.length} correctas — {pct}%</p>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
          </div>
        </motion.div>
        <div className="space-y-2">
          {answers.map((a, i) => (
            <Card key={i} className={`border ${a.correct ? "border-green-500/30" : "border-red-500/30"}`}>
              <CardContent className="p-3 flex items-start gap-2">
                {a.correct ? <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={16} /> : <XCircle className="text-red-400 shrink-0 mt-0.5" size={16} />}
                <div>
                  <p className="text-xs font-medium">{QUESTIONS[i].question}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{QUESTIONS[i].options[a.selectedIndex]}</p>
                  {!a.correct && <p className="text-xs text-green-400/70 mt-0.5">✓ {QUESTIONS[i].options[QUESTIONS[i].correct]}</p>}
                  <p className="text-xs text-white/30 mt-0.5">{QUESTIONS[i].explanation}</p>
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
          <span>Pregunta {currentIndex + 1} de {QUESTIONS.length}</span>
          <span>{correctCount} correctas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-5">
              <Badge className="bg-violet-500/20 text-violet-300 text-xs">🤖 Quiz Clustering</Badge>
              <p className="text-base font-bold leading-snug">{current.question}</p>
              <div className="grid grid-cols-1 gap-2">
                {current.options.map((opt, i) => {
                  const isSelected = selectedIndex === i;
                  const isCorrect = i === current.correct;
                  let style = "border-border hover:border-primary/50 hover:bg-primary/5";
                  if (showFeedback && isSelected && isCorrect) style = "border-green-500 bg-green-500/10";
                  else if (showFeedback && isSelected && !isCorrect) style = "border-red-500 bg-red-500/10";
                  else if (showFeedback && isCorrect) style = "border-green-500/50 bg-green-500/5";
                  return (
                    <button key={i} onClick={() => handleSelect(i)}
                      className={`text-left p-3 rounded-xl border text-sm font-medium transition-all ${style}`}>
                      <span className="text-muted-foreground mr-2">{["A", "B", "C", "D"][i]}.</span>{opt}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {showFeedback && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl p-3 text-xs ${selectedIndex === current.correct ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"}`}>
                    <p className="font-bold mb-1">{selectedIndex === current.correct ? "✓ Correcto" : "✗ Incorrecto"}</p>
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

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
    question: "¿Cuál es el orden de reclutamiento de las fibras musculares al aumentar la intensidad del ejercicio?",
    options: ["Type IIx → Type IIa → Type I", "Type I → Type IIa → Type IIx", "Type IIa → Type I → Type IIx", "Todas se reclutan simultáneamente"],
    answer: "Type I → Type IIa → Type IIx",
    explanation: "Principio del tamaño (Henneman): se reclutan primero las unidades motoras más pequeñas (Type I, umbral bajo) y progresivamente las mayores (Type IIa, luego IIx) conforme aumenta la demanda de fuerza.",
  },
  {
    question: "¿Cuál de estas características es EXCLUSIVA de las fibras Type IIx (fast-twitch)?",
    options: ["Alta densidad mitocondrial", "Alta resistencia a la fatiga", "Mayor capacidad de potencia normalizada", "Primer umbral de reclutamiento"],
    answer: "Mayor capacidad de potencia normalizada",
    explanation: "Las fibras Type IIx tienen la mayor capacidad de potencia y fuerza, pero pocas mitocondrias, baja resistencia a fatiga y se reclutan al final. La alta densidad mitocondrial y resistencia a fatiga son de las Type I.",
  },
  {
    question: "¿Qué ocurre con las fibras Type IIa cuando se realiza entrenamiento aeróbico de larga duración?",
    options: [
      "Se convierten en Type IIx para mayor potencia",
      "No cambian — su fenotipo es fijo genéticamente",
      "Adquieren características más similares a Type I (más mitocondrias)",
      "Se atrofian y desaparecen con el tiempo",
    ],
    answer: "Adquieren características más similares a Type I (más mitocondrias)",
    explanation: "Las fibras Type IIa son las más plásticas. El entrenamiento aeróbico aumenta su densidad mitocondrial y capilarización, acercándolas al perfil de Type I. El entrenamiento de fuerza las acerca a Type IIx.",
  },
  {
    question: "Una persona tiene un Z-score de +1.5 en la distribución de fibras musculares. ¿Qué significa esto?",
    options: [
      "Tiene más fibras lentas que el 84% de la población",
      "Tiene más fibras rápidas que el 84% de la población",
      "Su proporción de fibras es exactamente promedio",
      "Tiene predominio de fibras Type IIa exclusivamente",
    ],
    answer: "Tiene más fibras rápidas que el 84% de la población",
    explanation: "Z-score positivo = más fibras rápidas (Type II). Z=+1 corresponde al percentil 84, Z=+1.5 al percentil ~93. Esta persona tiene ventaja genética para deportes de potencia y velocidad.",
  },
  {
    question: "¿Cuál de estos métodos permite MEDIR directamente la actividad eléctrica de una unidad motora individual?",
    options: [
      "EMG de superficie (sEMG)",
      "Plataforma de fuerza Kistler",
      "EMG intramuscular (aguja)",
      "Dinamómetro isocinético Biodex",
    ],
    answer: "EMG intramuscular (aguja)",
    explanation: "El EMG de superficie captura la suma de muchas unidades motoras. Para registrar una unidad motora individual se necesita un electrodo de aguja intramuscular (invasivo). El sEMG es excelente para análisis de grupos musculares pero no llega a ese nivel de detalle.",
  },
  {
    question: "¿Qué sistema del cuerpo es responsable de GRADUAR la fuerza muscular (más fuerza → más unidades motoras activas)?",
    options: [
      "Sistema cardiovascular (flujo sanguíneo al músculo)",
      "Sistema musculoesquelético (longitud del sarcómero)",
      "Sistema nervioso (reclutamiento y frecuencia de disparo)",
      "Sistema endocrino (testosterona y cortisol)",
    ],
    answer: "Sistema nervioso (reclutamiento y frecuencia de disparo)",
    explanation: "El SNC gradúa la fuerza mediante dos mecanismos: 1) Reclutamiento — activa más unidades motoras; 2) Frecuencia de disparo (rate coding) — aumenta la frecuencia de potenciales de acción. Ambos suman para generar más tensión.",
  },
];

interface Props { weekId?: number; classId?: number; }

export default function S6C2_Dynamic2QuizFibras({ weekId = 6, classId = 2 }: Props) {
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
            token, weekId, classId, dynamicId: 2,
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
          <span className="text-6xl">{pct >= 80 ? "🧠" : pct >= 60 ? "💡" : "📖"}</span>
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Dominas la fisiología!" : pct >= 60 ? "Buen trabajo" : "Repasa los conceptos"}</h3>
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
                  <p className="text-xs text-muted-foreground mt-0.5">{a.selected}</p>
                  {!a.correct && <p className="text-xs text-green-400/70 mt-0.5">✓ {QUESTIONS[i].answer}</p>}
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
              <Badge className="bg-indigo-500/20 text-indigo-300 text-xs">🧬 Quiz Fibras Musculares</Badge>
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

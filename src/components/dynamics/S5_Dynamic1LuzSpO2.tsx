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
    question: "¿Qué longitud de onda usa el LED rojo del pulsioxímetro?",
    options: ["520 nm", "660 nm", "940 nm", "1000 nm"],
    answer: "660 nm",
    explanation: "El LED rojo opera a 660 nm. Es la longitud de onda que absorbe preferentemente la desoxihemoglobina (sangre sin O₂). La diferencia con el IR permite calcular el SpO₂.",
  },
  {
    question: "¿Qué molécula absorbe preferentemente la luz infrarroja (940 nm)?",
    options: ["Desoxihemoglobina (HHb)", "Oxihemoglobina (HbO₂)", "Mioglobina", "Albúmina"],
    answer: "Oxihemoglobina (HbO₂)",
    explanation: "La oxihemoglobina (sangre oxigenada) absorbe más luz infrarroja a 940 nm. La desoxihemoglobina absorbe más luz roja a 660 nm. Esta diferencia es la base del cálculo del SpO₂.",
  },
  {
    question: "¿Por qué el smartwatch usa LED verde (520 nm) para medir FC y no rojo?",
    options: [
      "El verde es más barato de fabricar",
      "La sangre refleja poco la luz verde, generando una señal PPG clara en muñeca",
      "El rojo no puede penetrar la piel",
      "El verde mide SpO₂ más precisamente",
    ],
    answer: "La sangre refleja poco la luz verde, generando una señal PPG clara en muñeca",
    explanation: "La luz verde es altamente absorbida (poco reflejada) por la hemoglobina. Esto genera una señal pulsátil fuerte (PPG) perfecta para detectar el ritmo cardíaco en muñeca, donde hay menos tejido que en el dedo.",
  },
  {
    question: "¿Cuál es el rango normal de SpO₂ en una persona sana a nivel del mar?",
    options: ["80–89%", "90–94%", "95–100%", "101–105%"],
    answer: "95–100%",
    explanation: "SpO₂ normal: 95–100%. Por debajo de 94% se considera hipoxia leve. Por debajo de 90% es emergencia clínica. En atletas bien entrenados en altitud, valores de 92–94% pueden ser normales temporalmente.",
  },
  {
    question: "¿Qué ocurre con la señal del pulsioxímetro cuando hay vasoconstricción por frío?",
    options: [
      "La señal se amplifica — más fácil de medir",
      "No cambia — el sensor es inmune a la temperatura",
      "La señal se debilita — menos flujo capilar en la periferia",
      "El SpO₂ aumenta automáticamente",
    ],
    answer: "La señal se debilita — menos flujo capilar en la periferia",
    explanation: "La vasoconstricción reduce el flujo sanguíneo en los capilares periféricos (dedos, lóbulo). Menos sangre = menos absorción de luz = señal más débil = lecturas inexactas o imposibles.",
  },
];

interface Props { weekId?: number; classId?: number; }

export default function S5_Dynamic1LuzSpO2({ weekId = 5, classId = 1 }: Props) {
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
    const newAnswer = { question: current.question, selected: option, correct };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    setTimeout(() => {
      if (currentIndex + 1 >= QUESTIONS.length) {
        setFinished(true);
        const total = updatedAnswers.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 1,
            response: { answers: updatedAnswers },
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
          <span className="text-6xl">{pct >= 80 ? "🔬" : pct >= 60 ? "💡" : "📖"}</span>
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Dominas la óptica!" : pct >= 60 ? "Buen trabajo" : "Repasa los LEDs"}</h3>
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
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary text-xs">🔬 SpO₂ & Luz</Badge>
              </div>
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

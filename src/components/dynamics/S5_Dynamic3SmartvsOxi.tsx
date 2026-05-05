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
    question: "¿Qué tecnología usa LED verde (520 nm) para medir frecuencia cardíaca?",
    options: ["Pulsioxímetro de dedo", "Banda pectoral Polar H10", "Smartwatch (PPG en muñeca)", "Electrocardiógrafo"],
    answer: "Smartwatch (PPG en muñeca)",
    explanation: "El smartwatch usa LED verde porque la hemoglobina lo absorbe eficientemente en muñeca. El pulsioxímetro usa rojo (660 nm) + IR (940 nm) en dedo o lóbulo para calcular SpO₂.",
  },
  {
    question: "Un médico necesita confirmar la SpO₂ de un paciente en urgencias. ¿Qué dispositivo usar?",
    options: [
      "Apple Watch Ultra 2 — tiene SpO₂",
      "Pulsioxímetro certificado FDA — medición clínica validada",
      "Garmin Fenix 8 — más preciso en deporte",
      "Fitbit Charge 6 — monitoreo continuo",
    ],
    answer: "Pulsioxímetro certificado FDA — medición clínica validada",
    explanation: "Los smartwatches miden SpO₂ de forma orientativa, no están certificados como dispositivos médicos. En urgencias, solo un pulsioxímetro médico certificado (FDA/CE) garantiza la precisión requerida para decisiones clínicas.",
  },
  {
    question: "¿Por qué la precisión del smartwatch para FC cae durante ejercicio intenso?",
    options: [
      "La batería se agota más rápido con la actividad",
      "El algoritmo cambia al modo ahorro de energía",
      "El movimiento genera artefactos que confunden al sensor óptico PPG",
      "La sudoración bloquea el LED completamente",
    ],
    answer: "El movimiento genera artefactos que confunden al sensor óptico PPG",
    explanation: "El sensor PPG detecta variaciones de luz por el pulso cardíaco. El movimiento del brazo genera variaciones de luz adicionales (artefactos) que el algoritmo no siempre puede separar del pulso real, reduciendo la precisión hasta un 15%.",
  },
  {
    question: "¿En qué deporte el smartwatch es MENOS confiable para medir FC?",
    options: ["Yoga — posiciones estáticas", "Natación — agua estable", "Levantamiento de pesas — grip fuerte comprime la muñeca", "Meditación sentado"],
    answer: "Levantamiento de pesas — grip fuerte comprime la muñeca",
    explanation: "El grip fuerte en levantamiento comprime los vasos de la muñeca, reduciendo el flujo sanguíneo y la señal PPG. Además, las vibraciones de la barra añaden artefactos. La banda pectoral es el gold standard para este deporte.",
  },
  {
    question: "¿Cuál es la principal ventaja del pulsioxímetro de dedo sobre el smartwatch para SpO₂?",
    options: [
      "Tiene GPS integrado para deportes",
      "Es más barato en todos los casos",
      "Posición anatómica más vascularizada y con mayor precisión clínica validada",
      "Usa LED verde que no daña los ojos",
    ],
    answer: "Posición anatómica más vascularizada y con mayor precisión clínica validada",
    explanation: "El dedo tiene capilares más accesibles y mayor flujo sanguíneo que la muñeca. Además, los pulsioxímetros de dedo están validados clínicamente (FDA/CE) y tienen error estándar ±2% vs ±3–5% del smartwatch.",
  },
];

interface Props { weekId?: number; classId?: number; }

export default function S5_Dynamic3SmartvsOxi({ weekId = 5, classId = 1 }: Props) {
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
            token, weekId, classId, dynamicId: 3,
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
          <span className="text-6xl">{pct >= 80 ? "⌚" : pct >= 60 ? "💡" : "📖"}</span>
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Experto en sensores!" : pct >= 60 ? "Buen análisis" : "Revisa la comparativa"}</h3>
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
                <Badge className="bg-blue-500/20 text-blue-300 text-xs">⌚ vs 💡 Smartwatch vs Pulsioxímetro</Badge>
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

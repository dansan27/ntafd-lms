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
    question: "¿Cuántos canales de medición tiene la plataforma de fuerza Kistler estándar?",
    options: ["3 (Fx, Fy, Fz)", "4 (Fx, Fy, Fz, F total)", "6 (Fx, Fy, Fz, Mx, My, Mz)", "12 (4 celdas × 3 ejes)"],
    answer: "6 (Fx, Fy, Fz, Mx, My, Mz)",
    explanation: "La plataforma Kistler tiene 6 canales: 3 de fuerza (Fx, Fy, Fz) y 3 de momento (Mx, My, Mz). Esto permite calcular el punto de aplicación de la fuerza (Centro de Presión, CoP).",
  },
  {
    question: "¿Quiénes descubrieron la galga extensométrica en 1938?",
    options: ["Kistler y Biodex", "Simmons y Ruge", "Cooper y Tanaka", "Newton y Hooke"],
    answer: "Simmons y Ruge",
    explanation: "Arthur Ruge y Edward Simmons desarrollaron independientemente la galga extensométrica en 1938. Su principio (cambio de resistencia por deformación) sigue siendo la base de la mayoría de celdas de carga actuales.",
  },
  {
    question: "Un sEMG muestra mayor amplitud de señal. ¿Qué significa esto fisiológicamente?",
    options: [
      "El músculo está en reposo completo",
      "Más unidades motoras están activas y/o disparando más rápido",
      "El electrodo está mal colocado",
      "La señal tiene más ruido eléctrico",
    ],
    answer: "Más unidades motoras están activas y/o disparando más rápido",
    explanation: "La amplitud del EMG refleja el reclutamiento de unidades motoras (cuántas) y la frecuencia de disparo (cada cuánto). Mayor fuerza = más amplitud EMG (hasta la saturación).",
  },
  {
    question: "¿Cuál es la frecuencia de muestreo típica de una plataforma de fuerza de laboratorio?",
    options: ["10 Hz", "100 Hz", "1000 Hz", "10000 Hz"],
    answer: "1000 Hz",
    explanation: "1000 Hz significa 1000 muestras por segundo. Esto permite capturar eventos rápidos como la fase de contacto en un salto (<100 ms) o la curva fuerza-tiempo de un golpe.",
  },
  {
    question: "¿Para qué sirve normalizar el EMG al % de CVM (Contracción Voluntaria Máxima)?",
    options: [
      "Para aumentar la amplitud de la señal",
      "Para eliminar el ruido de la red eléctrica",
      "Para poder comparar registros entre sesiones, sujetos y laboratorios",
      "Para calcular la velocidad de conducción nerviosa",
    ],
    answer: "Para poder comparar registros entre sesiones, sujetos y laboratorios",
    explanation: "Sin normalización, dos sujetos con igual fuerza pueden tener amplitudes de EMG muy distintas (grasa subcutánea, distancia electrodo-músculo). El % CVM elimina esta variabilidad y hace los datos comparables.",
  },
  {
    question: "Una celda de carga 'Tipo S' puede medir:",
    options: [
      "Solo compresión (empuje hacia abajo)",
      "Solo tensión (jalón hacia arriba)",
      "Tanto tensión como compresión",
      "Solo fuerzas laterales (cizallamiento)",
    ],
    answer: "Tanto tensión como compresión",
    explanation: "La celda Tipo S tiene forma de 'S' y puede medir fuerzas de tensión (jalón) y compresión (empuje) en el mismo eje. Es la más versátil para laboratorio deportivo — poleas, cables, suspensiones.",
  },
];

interface Props { weekId?: number; classId?: number; }

export default function S6C1_Dynamic3QuizFuerza({ weekId = 6, classId = 1 }: Props) {
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
            token, weekId, classId, dynamicId: 3,
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
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Dominas la medición de fuerza!" : pct >= 60 ? "Buen trabajo" : "Repasa los conceptos"}</h3>
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
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-300 text-xs">🧠 Quiz Fuerza Muscular</Badge>
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

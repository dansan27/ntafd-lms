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
    question: "¿Cuál es la principal causa de muerte asociada a las ECNT según la OMS?",
    options: ["Enfermedades respiratorias crónicas", "Enfermedades cardiovasculares", "Diabetes mellitus", "Cáncer colorrectal"],
    answer: "Enfermedades cardiovasculares",
    explanation: "Las enfermedades cardiovasculares (infarto, ACV) son la principal causa de muerte por ECNT, responsables del 44% de las 41 millones de muertes anuales.",
  },
  {
    question: "¿Qué tipo de ejercicio tiene mayor evidencia para reducir la presión arterial sistólica en HTA?",
    options: ["Ejercicio de fuerza máxima (1RM)", "Ejercicio aeróbico continuo moderado", "Sprint de alta intensidad (HIIT extremo)", "Ejercicio de flexibilidad pasiva"],
    answer: "Ejercicio aeróbico continuo moderado",
    explanation: "El ejercicio aeróbico moderado (50–70% FCmáx, ≥30 min, ≥3 veces/semana) reduce en promedio 5–8 mmHg la PA sistólica en pacientes con HTA.",
  },
  {
    question: "Un smartwatch mide la PA usando fotopletismografía (PPG). ¿Cuál es su limitación principal?",
    options: ["No puede medir la frecuencia cardíaca", "No tiene validación clínica equivalente al esfigmomanómetro", "Solo funciona en reposo", "Requiere calibración diaria con sangre"],
    answer: "No tiene validación clínica equivalente al esfigmomanómetro",
    explanation: "Aunque los smartwatches estiman PA por PPG, ningún modelo actual tiene validación clínica ISO 81060-2 equivalente a un tensiómetro de brazo — no deben usarse para diagnóstico.",
  },
  {
    question: "¿Qué beneficio ofrece la telemedicina específicamente para pacientes con HTA?",
    options: [
      "Reemplaza completamente las consultas presenciales",
      "Permite el seguimiento remoto con ajuste de medicación en tiempo real",
      "Elimina la necesidad de medir la PA en casa",
      "Diagnóstica la HTA sin necesidad de tensiómetro",
    ],
    answer: "Permite el seguimiento remoto con ajuste de medicación en tiempo real",
    explanation: "La telemedicina permite al médico revisar los registros domiciliarios de PA, ajustar medicación y dar indicaciones de ejercicio sin que el paciente se desplace.",
  },
  {
    question: "MyFitnessPal y Runtastic son ejemplos de:",
    options: ["Dispositivos de MCG para diabetes", "Apps de actividad física y nutrición para ECNT", "Plataformas de diagnóstico médico", "Sistemas de realidad virtual en rehabilitación"],
    answer: "Apps de actividad física y nutrición para ECNT",
    explanation: "MyFitnessPal (registro nutricional y calórico) y Runtastic (GPS y entrenamiento cardio) son apps de estilo de vida que apoyan el manejo de HTA y obesidad mediante monitoreo de actividad.",
  },
  {
    question: "¿Cuál es el Índice de Masa Corporal (IMC) que define obesidad grado I?",
    options: ["IMC ≥ 25 kg/m²", "IMC ≥ 30 kg/m²", "IMC ≥ 35 kg/m²", "IMC ≥ 40 kg/m²"],
    answer: "IMC ≥ 30 kg/m²",
    explanation: "Según la OMS: sobrepeso = IMC 25–29.9, Obesidad grado I = 30–34.9, grado II = 35–39.9, grado III (mórbida) = ≥40 kg/m².",
  },
];

interface Props { weekId?: number; classId?: number }

export default function S9C1_Dynamic3QuizHTA({ weekId = 9, classId = 1 }: Props) {
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
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Dominas ECNT y tecnología!" : pct >= 60 ? "Buen trabajo" : "Repasa los conceptos"}</h3>
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
              <Badge className="bg-teal-500/20 text-teal-300 text-xs">🧠 Quiz HTA y Wearables</Badge>
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

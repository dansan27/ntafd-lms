import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const SCENARIOS = [
  {
    scenario: "Paciente con HTA estadio 1, sedentario, quiere monitorear su presión arterial en casa sin ir al médico cada semana.",
    options: ["Tensiómetro digital con Bluetooth + app", "Smartwatch con sensor PPG", "Glucómetro de dedo", "App de meditación"],
    answer: "Tensiómetro digital con Bluetooth + app",
    explanation: "El tensiómetro de brazo con Bluetooth (ej. Omron) es el gold standard para PA domiciliaria. Los smartwatches estimaban PA pero no tienen validación clínica equivalente.",
  },
  {
    scenario: "Persona con obesidad grado I que quiere perder peso. Necesita un seguimiento de calorías y actividad física diaria.",
    options: ["Báscula de grasa corporal BIA + MyFitnessPal", "Glucómetro continuo", "Monitor de PA", "ECG portátil"],
    answer: "Báscula de grasa corporal BIA + MyFitnessPal",
    explanation: "La combinación de bioimpedancia para composición corporal y app de registro alimentario-físico es la herramienta más completa para manejo de peso.",
  },
  {
    scenario: "Atleta de resistencia con HTA controlada. Quiere monitorear su FC, zonas de entrenamiento y calidad del sueño.",
    options: ["Smartwatch deportivo (Garmin/Polar)", "Tensiómetro manual", "App de meditación", "MCG subcutáneo"],
    answer: "Smartwatch deportivo (Garmin/Polar)",
    explanation: "Para atletas con HTA controlada, un smartwatch deportivo ofrece FC en tiempo real, zonas de entrenamiento y HRV — sin restricciones de intensidad.",
  },
  {
    scenario: "Adulto mayor con obesidad y HTA que vive solo. Su médico necesita supervisar remotamente su actividad y signos vitales.",
    options: ["Pulsera de actividad con telemedicina", "Cicloergómetro de laboratorio", "Espirometría digital", "App de recetas"],
    answer: "Pulsera de actividad con telemedicina",
    explanation: "Una pulsera de actividad conectada a una plataforma de telemedicina permite al médico revisar datos de PA, FC y actividad de forma remota — clave en adultos mayores solos.",
  },
];

interface Props { weekId?: number; classId?: number }

export default function S9C1_Dynamic2EligeDispositivo({ weekId = 9, classId = 1 }: Props) {
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
            token, weekId, classId, dynamicId: 2,
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
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
          <span className="text-6xl">{pct >= 80 ? "📱" : pct >= 60 ? "💡" : "📖"}</span>
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Excelente elección tecnológica!" : pct >= 60 ? "Buen criterio clínico" : "Repasa las indicaciones"}</h3>
          <p className="text-muted-foreground">{correctCount} de {SCENARIOS.length} — {pct}%</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Caso {currentIndex + 1} de {SCENARIOS.length}</span>
          <span>{correctCount} correctas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-5">
              <Badge className="bg-teal-500/20 text-teal-300 text-xs">📱 Elige la Tecnología</Badge>
              <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
                <p className="text-sm text-white/70 leading-relaxed">{current.scenario}</p>
              </div>
              <p className="text-sm font-bold">¿Qué tecnología recomiendas?</p>
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

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const SCENARIOS = [
  {
    scenario: "Un paciente llega de una zona nevada con los dedos entumecidos. El pulsioxímetro muestra 'No signal'. ¿Cuál es la causa?",
    options: ["Esmalte de uñas oscuro", "Mala circulación por frío — vasoconstricción", "Hipoxemia severa", "Luz ambiental intensa"],
    answer: "Mala circulación por frío — vasoconstricción",
    explanation: "La hipotermia causa vasoconstricción periférica — el flujo sanguíneo en los dedos se reduce drásticamente. Sin flujo = sin señal óptica. Calentar la mano antes de medir.",
  },
  {
    scenario: "Una atleta en la cinta de correr a máxima velocidad muestra SpO₂ fluctuando entre 88% y 99% cada segundo. ¿Qué causa esto?",
    options: ["Hipoxemia real por esfuerzo", "Artefacto de movimiento", "Anemia severa", "Uñas acrílicas"],
    answer: "Artefacto de movimiento",
    explanation: "Las fluctuaciones rápidas e irregulares son el patrón clásico del artefacto de movimiento. El sensor no puede distinguir entre la pulsación del corazón y el movimiento del brazo. A esa velocidad, el SpO₂ real no fluctúa 11% en un segundo.",
  },
  {
    scenario: "Un paciente con uñas pintadas de negro azabache tiene SpO₂ aparente de 85%. Al quitarse el esmalte, el sensor lee 97%. ¿Qué falló?",
    options: ["Anemia severa no detectada", "El esmalte oscuro bloqueó la luz del LED", "Hipoxemia real", "Temperatura baja de la sala"],
    answer: "El esmalte oscuro bloqueó la luz del LED",
    explanation: "Los esmaltes de colores oscuros (negro, azul, verde) absorben y bloquean la luz roja e infrarroja del sensor. Generan lecturas falsamente bajas. Siempre retirar el esmalte o colocar el sensor en otro dedo.",
  },
  {
    scenario: "Un análisis de sangre muestra hemoglobina de 5 g/dL (severa anemia). El pulsioxímetro marca 97%. ¿Cómo interpretas esto?",
    options: [
      "El paciente está bien — 97% es normal",
      "El SpO₂ relativo es correcto pero la cantidad absoluta de O₂ en sangre es insuficiente",
      "El sensor está fallando — recalibrarlo",
      "La anemia aumenta la lectura del sensor",
    ],
    answer: "El SpO₂ relativo es correcto pero la cantidad absoluta de O₂ en sangre es insuficiente",
    explanation: "El pulsioxímetro mide el % de hemoglobina saturada — no la cantidad total. Con anemia severa, el 97% de 5 g/dL = muy poco O₂ disponible para los tejidos. El sensor no puede detectar anemia. Requiere hemograma.",
  },
  {
    scenario: "Durante una sesión de fisioterapia bajo luz solar directa por la ventana, las lecturas del pulsioxímetro son inconsistentes. ¿Por qué?",
    options: [
      "El calor del sol calienta la hemoglobina",
      "La luz ambiental intensa interfiere con el fotodetector del sensor",
      "La vasoconstricción por UV altera la señal",
      "El paciente tiene hipoxemia por el calor",
    ],
    answer: "La luz ambiental intensa interfiere con el fotodetector del sensor",
    explanation: "El fotodetector mide la luz que atraviesa el tejido. La luz solar intensa agrega 'ruido' a esa medición, haciendo difícil separar la señal del pulso de la luz ambiental. Solución: cubrir el sensor o alejar al paciente de la ventana.",
  },
];

interface Props { weekId?: number; classId?: number; }

export default function S5_Dynamic2ErrorPulso({ weekId = 5, classId = 1 }: Props) {
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

  const current = SCENARIOS[currentIndex];
  const correctCount = answers.filter(a => a.correct).length;
  const progress = ((currentIndex + (finished ? 1 : 0)) / SCENARIOS.length) * 100;

  const handleSelect = (option: string) => {
    if (showFeedback) return;
    setSelected(option);
    setShowFeedback(true);
    const correct = option === current.answer;
    const newAnswer = { question: current.scenario, selected: option, correct };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    setTimeout(() => {
      if (currentIndex + 1 >= SCENARIOS.length) {
        setFinished(true);
        const total = updatedAnswers.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 2,
            response: { answers: updatedAnswers },
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
    }, 1900);
  };

  if (finished) {
    const pct = Math.round((correctCount / SCENARIOS.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <span className="text-6xl">{pct >= 80 ? "🩺" : pct >= 60 ? "💡" : "📖"}</span>
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Excelente diagnóstico!" : pct >= 60 ? "Bien encaminado" : "Repasa los factores"}</h3>
          <p className="text-muted-foreground">{correctCount} de {SCENARIOS.length} escenarios correctos — {pct}%</p>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
          </div>
        </motion.div>
        <div className="space-y-2">
          {answers.map((a, i) => (
            <Card key={i} className={`border ${a.correct ? "border-green-500/30" : "border-red-500/30"}`}>
              <CardContent className="p-3 flex items-start gap-2">
                {a.correct ? <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={16} /> : <XCircle className="text-red-400 shrink-0 mt-0.5" size={16} />}
                <p className="text-xs text-muted-foreground">{a.selected}</p>
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
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-500/20 text-yellow-300 text-xs">⚠️ Escenario Clínico</Badge>
              </div>
              <p className="text-base font-bold leading-snug">{current.scenario}</p>
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

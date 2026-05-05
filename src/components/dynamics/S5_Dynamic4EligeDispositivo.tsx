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
    scenario: "🚴 Ciclista de ruta haciendo 4 horas a alta intensidad con pendientes. Quiere monitoreo continuo de FC preciso durante los sprints.",
    options: [
      "Smartwatch en muñeca — cómodo y tiene GPS",
      "Banda pectoral Polar H10 + ciclocomputador Garmin",
      "Pulsioxímetro de dedo sujeto con cinta",
      "Cualquiera — todos miden igual en bici",
    ],
    answer: "Banda pectoral Polar H10 + ciclocomputador Garmin",
    explanation: "Durante sprints (&gt;85% FC máx) el smartwatch pierde precisión por artefactos de movimiento. La banda pectoral Polar H10 usa electrodos ECG — gold standard con ±1 bpm de precisión. El ciclocomputador muestra los datos en tiempo real.",
  },
  {
    scenario: "🏋️ Powerlifter en competición de squat máximo. Su entrenador quiere verificar la recuperación de FC entre series.",
    options: [
      "Smartwatch en muñeca izquierda durante el lift",
      "Pulsioxímetro en el dedo meñique sujeto con cinta",
      "Banda pectoral + app en el móvil para ver FC entre series",
      "El smartwatch es suficiente si el atleta descansa el brazo",
    ],
    answer: "Banda pectoral + app en el móvil para ver FC entre series",
    explanation: "El grip fuerte en squat comprime la muñeca y bloquea la señal del smartwatch. El pulsioxímetro en el dedo se cae o interfiere. La banda pectoral no se ve afectada por el grip y registra la recuperación de FC con alta precisión entre series.",
  },
  {
    scenario: "🚵 Ciclista de montaña en ruta de 6 horas con grandes desniveles. Quiere monitorear SpO₂ en altitud (3200 m) y FC.",
    options: [
      "Solo smartwatch — tiene SpO₂ y GPS",
      "Pulsioxímetro médico en el dedo + smartwatch para GPS",
      "Banda pectoral + pulsioxímetro de dedo certificado + GPS externo",
      "Ningún sensor es confiable en altitud",
    ],
    answer: "Banda pectoral + pulsioxímetro de dedo certificado + GPS externo",
    explanation: "En altitud el SpO₂ del smartwatch tiene error mayor (±5%). Para decisiones de seguridad real (aclimatación, síntomas de mal de altura) se necesita un pulsioxímetro médico certificado. La banda pectoral da FC precisa para control del esfuerzo.",
  },
  {
    scenario: "🧘 Instructora de yoga quiere monitorear la FC de sus alumnos durante clases para ver su nivel de activación/calma.",
    options: [
      "Pulsioxímetros de dedo para todos — son los más precisos",
      "Smartwatches — son no invasivos, silenciosos y precisos en reposo/baja intensidad",
      "Bandas pectorales — son el gold standard",
      "No usar tecnología — interrumpe la práctica",
    ],
    answer: "Smartwatches — son no invasivos, silenciosos y precisos en reposo/baja intensidad",
    explanation: "El yoga es de baja a moderada intensidad — rango donde el smartwatch es preciso (±3 bpm). Son discretos, no interrumpen la clase, y permiten monitoreo continuo sin cables ni clips. Las bandas pectorales serían incómodas y los pulsioxímetros de dedo limitarían el movimiento.",
  },
  {
    scenario: "🏊 Triatleta en entrenamiento de natación. Quiere datos de FC durante las series en el agua.",
    options: [
      "Smartwatch resistente al agua — funciona en natación",
      "Pulsioxímetro impermeable de dedo",
      "Banda pectoral Polar H10 — transmite FC vía Bluetooth bajo el agua",
      "Banda pectoral Garmin HRM-Pro — almacena datos y los sube post-entrenamiento",
    ],
    answer: "Banda pectoral Garmin HRM-Pro — almacena datos y los sube post-entrenamiento",
    explanation: "Bluetooth no penetra bien el agua — el smartwatch pierde la señal del corazón al sumergirse. El Polar H10 transmite bajo el agua solo a corta distancia. El HRM-Pro almacena los datos en memoria interna y los sincroniza al salir del agua — solución más práctica.",
  },
];

interface Props { weekId?: number; classId?: number; }

export default function S5_Dynamic4EligeDispositivo({ weekId = 5, classId = 1 }: Props) {
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
            token, weekId, classId, dynamicId: 4,
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
          <span className="text-6xl">{pct >= 80 ? "🏆" : pct >= 60 ? "⌚" : "📖"}</span>
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Asesor de tecnología deportiva!" : pct >= 60 ? "Buen criterio técnico" : "Sigue practicando"}</h3>
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
                <Badge className="bg-green-500/20 text-green-300 text-xs">🏆 Elige el dispositivo correcto</Badge>
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

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
    question: "Un investigador necesita medir la fuerza vertical durante un salto con contramovimiento (CMJ). ¿Qué instrumento usarías?",
    options: ["Dinamómetro Jamar", "Plataforma de Fuerza", "Sensor FlexiForce", "EMG de superficie"],
    answer: "Plataforma de Fuerza",
    explanation: "La plataforma de fuerza captura la fuerza de reacción del suelo (GRF) en 3 ejes simultáneos con frecuencias de muestreo de hasta 1000 Hz — ideal para el análisis de saltos.",
  },
  {
    question: "¿Qué principio físico utiliza una celda de carga de galga extensométrica para medir fuerza?",
    options: [
      "El campo magnético cambia al aplicar presión",
      "La resistencia eléctrica cambia al deformarse el material",
      "La frecuencia de resonancia varía con la carga",
      "La capacitancia varía con la distancia entre placas",
    ],
    answer: "La resistencia eléctrica cambia al deformarse el material",
    explanation: "La galga extensométrica (Simmons & Ruge, 1938) es una resistencia que se deforma con la carga. Al deformarse, cambia su longitud y sección → cambia su resistencia eléctrica → señal proporcional a la fuerza.",
  },
  {
    question: "Un fisioterapeuta quiere evaluar la fuerza de prensión de un paciente para detectar sarcopenia. ¿Qué instrumento es el gold standard clínico?",
    options: ["Biodex System", "Plataforma Kistler", "Dinamómetro Jamar (isométrico)", "Sensor FlexiForce plantar"],
    answer: "Dinamómetro Jamar (isométrico)",
    explanation: "El Jamar es el gold standard para medir fuerza de prensión. Es isométrico (sin movimiento articular), portátil y tiene valores normativos por edad y sexo según la ASHT.",
  },
  {
    question: "¿Por qué el sensor FlexiForce NO es recomendable para medir la fuerza máxima en un test de 1RM?",
    options: [
      "No puede medir fuerzas superiores a 10 N",
      "Su histéresis (~3–4% FS) es mucho mayor que la galga extensométrica (±0.1%)",
      "Solo funciona con líquidos",
      "No genera señal eléctrica",
    ],
    answer: "Su histéresis (~3–4% FS) es mucho mayor que la galga extensométrica (±0.1%)",
    explanation: "El FlexiForce es piezoresistivo y tiene una histéresis de 3–4% del fondo de escala. Para mediciones de alta precisión (como un 1RM), se necesitan galgas extensométricas con ±0.1% FS.",
  },
  {
    question: "Un preparador físico quiere analizar el desequilibrio muscular entre cuádriceps e isquiotibiales de un futbolista. ¿Qué instrumento ofrece el perfil de torque más completo?",
    options: ["Celda de carga Tipo S", "Plataforma de Fuerza Kistler", "Dinamómetro isocinético Biodex", "EMG intramuscular"],
    answer: "Dinamómetro isocinético Biodex",
    explanation: "El Biodex mide torque a velocidad angular constante (30–300 °/s). Permite calcular el ratio isquiotibiales/cuádriceps. Un ratio <60% se asocia a mayor riesgo de rotura del LCA.",
  },
];

interface Props { weekId?: number; classId?: number; }

export default function S6C1_Dynamic1IdentificaSensor({ weekId = 6, classId = 1 }: Props) {
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
            token, weekId, classId, dynamicId: 1,
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
          <span className="text-6xl">{pct >= 80 ? "⚖️" : pct >= 60 ? "🦾" : "📖"}</span>
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Dominas los sensores!" : pct >= 60 ? "Buen trabajo" : "Repasa los instrumentos"}</h3>
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
                <Badge className="bg-orange-500/20 text-orange-300 text-xs">⚖️ Identifica el Sensor</Badge>
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

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
    question: "Un atleta de montaña llega a 4500 m de altitud. Su pulsioxímetro marca 88% de SpO₂. ¿Qué debes hacer?",
    options: [
      "Continuar el entrenamiento normalmente",
      "Reducir intensidad y monitorear — es hipoxia moderada",
      "Esperar a que baje al 80% para actuar",
      "Solo aplicar suplementos de hierro",
    ],
    answer: "Reducir intensidad y monitorear — es hipoxia moderada",
    explanation: "88% cae en el rango de hipoxia moderada (86–90%). Se debe reducir la carga, hidratarse y monitorear. Si baja de 85%, es emergencia médica.",
  },
  {
    question: "¿Qué longitudes de onda usa el pulsioxímetro para medir la SpO₂?",
    options: [
      "Ultravioleta 280 nm y visible 450 nm",
      "Roja 660 nm e infrarroja 940 nm",
      "Verde 520 nm y azul 450 nm",
      "Microondas 1200 nm y rayos X",
    ],
    answer: "Roja 660 nm e infrarroja 940 nm",
    explanation: "La hemoglobina oxigenada absorbe más luz IR (940 nm) y la desoxigenada absorbe más luz roja (660 nm). El ratio entre estas absorpciones permite calcular el % de saturación.",
  },
  {
    question: "¿Por qué el pulsioxímetro NO puede detectar intoxicación por monóxido de carbono (CO)?",
    options: [
      "Porque el CO no entra en el torrente sanguíneo",
      "Porque la carboxihemoglobina absorbe luz similar a la oxihemoglobina",
      "Porque el sensor de dedo no alcanza vasos capilares",
      "Porque el CO solo afecta los pulmones",
    ],
    answer: "Porque la carboxihemoglobina absorbe luz similar a la oxihemoglobina",
    explanation: "La carboxihemoglobina (HbCO) tiene una curva de absorción similar a la HbO₂ en las longitudes usadas por el pulsioxímetro estándar. Por eso puede mostrar SpO₂ normal cuando en realidad hay intoxicación grave.",
  },
  {
    question: "¿Cómo detecta el pulsioxímetro la frecuencia cardíaca simultáneamente con el SpO₂?",
    options: [
      "Usando un electrodo adicional de ECG integrado",
      "Midiendo la temperatura del dedo que sube con cada latido",
      "Detectando las variaciones cíclicas en la absorción de luz causadas por cada pulso",
      "Contando las veces que el dedo se mueve",
    ],
    answer: "Detectando las variaciones cíclicas en la absorción de luz causadas por cada pulso",
    explanation: "Con cada latido, la cantidad de sangre en los capilares del dedo aumenta, lo que cambia la absorción de luz. El sensor detecta estas variaciones (fotopletismografía) para calcular la FC.",
  },
  {
    question: "Un ciclista tiene las manos muy frías tras 3 horas de entrenamiento en montaña. Su pulsioxímetro muestra 91%. ¿Cuál es la interpretación correcta?",
    options: [
      "Hipoxia leve — suspender actividad inmediatamente",
      "Lectura posiblemente errónea por vasoconstricción periférica",
      "Resultado completamente normal para ciclismo",
      "Debe aumentar la intensidad para mejorar la oxigenación",
    ],
    answer: "Lectura posiblemente errónea por vasoconstricción periférica",
    explanation: "El frío causa vasoconstricción periférica, reduciendo el flujo sanguíneo en los dedos. Esto genera lecturas de SpO₂ falsamente bajas. Se recomienda tomar la lectura después de calentar la mano o usar un sensor de lóbulo de oreja.",
  },
  {
    question: "¿Cuántas matices distingue una persona tricromática en el test de visión de color?",
    options: ["< 20 matices", "20–32 matices", "33–39 matices", "> 40 matices"],
    answer: "20–32 matices",
    explanation: "Los tricromáticos (visión normal) distinguen 20–32 matices. Los dicromáticos (<20) tienen daltonismo. Los tetracromáticos (33–39) tienen visión de color superior — condición rara, más común en mujeres.",
  },
];

interface Props {
  weekId?: number;
  classId?: number;
}

export default function S4_Dynamic4TestPulsioximetro({ weekId = 4, classId = 1 }: Props) {
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

  const handleSelect = (option: string) => {
    if (showFeedback) return;
    setSelected(option);
    setShowFeedback(true);
    const correct = option === current.answer;
    const newAnswer = { question: current.question, selected: option, correct };
    const updated = [...answers, newAnswer];
    setAnswers(updated);

    setTimeout(() => {
      if (currentIndex + 1 >= QUESTIONS.length) {
        setFinished(true);
        const correctCount = updated.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 4,
            response: { answers: updated },
            score: correctCount,
            maxScore: QUESTIONS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex(prev => prev + 1);
        setSelected(null);
        setShowFeedback(false);
      }
    }, 1800);
  };

  const correctCount = answers.filter(a => a.correct).length;
  const progress = ((currentIndex + (finished ? 1 : 0)) / QUESTIONS.length) * 100;

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <div className="text-5xl">{correctCount === QUESTIONS.length ? "🏆" : correctCount >= 4 ? "🎉" : "💪"}</div>
          <h2 className="text-2xl font-bold">
            {correctCount === QUESTIONS.length ? "¡Perfecto dominio!" : correctCount >= 4 ? "¡Excelente!" : "¡Buen intento!"}
          </h2>
          <p className="text-muted-foreground">{correctCount}/{QUESTIONS.length} correctas</p>
        </motion.div>

        <Card>
          <CardContent className="p-4 space-y-2">
            {answers.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-start gap-3 p-3 rounded-lg ${a.correct ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium line-clamp-2">{QUESTIONS[i].question}</p>
                  {!a.correct && <p className="text-xs text-muted-foreground mt-0.5">Correcto: <strong>{QUESTIONS[i].answer}</strong></p>}
                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{QUESTIONS[i].explanation}</p>
                </div>
                {a.correct ? <CheckCircle2 className="text-green-600 flex-shrink-0" size={16} /> : <XCircle className="text-red-500 flex-shrink-0" size={16} />}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <Badge className="bg-primary/10 text-primary">Dinámica 4 — Semana 4</Badge>
        <h2 className="text-2xl font-bold">Test: Pulsioxímetro</h2>
        <p className="text-muted-foreground text-sm">Escenarios clínicos y conceptos clave de pulsioximetría deportiva.</p>
      </motion.div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Pregunta {currentIndex + 1} de {QUESTIONS.length}</span>
          <span>{correctCount} correctas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          <Card className={`transition-all ${showFeedback ? (selected === current.answer ? "ring-4 ring-green-400" : "ring-4 ring-red-400") : ""}`}>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-start gap-2">
                <span className="text-3xl flex-shrink-0">💡</span>
                <p className="text-base font-medium leading-relaxed">{current.question}</p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {current.options.map((option) => {
                  let extra = "";
                  if (showFeedback) {
                    if (option === current.answer) extra = "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400";
                    else if (option === selected) extra = "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400";
                  }
                  return (
                    <button
                      key={option}
                      onClick={() => handleSelect(option)}
                      disabled={showFeedback}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                        showFeedback ? extra || "opacity-40" : "hover:border-primary/50 hover:bg-primary/5"
                      } ${selected === option && !showFeedback ? "border-primary bg-primary/5" : ""}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-xl text-xs leading-relaxed ${
                    selected === current.answer
                      ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                      : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  <strong>{selected === current.answer ? "✓ Correcto — " : "✗ Incorrecto — "}</strong>
                  {current.explanation}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

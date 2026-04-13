import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const SCENARIOS = [
  {
    text: "Atleta profesional necesita screening cardíaco pre-competencia para detectar WPW syndrome",
    answer: "clinico",
    feedback: "El síndrome de WPW requiere análisis de la onda delta y el intervalo PR corto — solo detectable con ECG clínico de 12 derivaciones.",
  },
  {
    text: "Ciclista quiere monitorear su zona de entrenamiento durante una sesión de 3 horas en ruta",
    answer: "deportivo",
    feedback: "El Polar H10 o wearable similar transmite FC en tiempo real a ciclocomputadores (Garmin, Wahoo) durante horas, sin necesidad de diagnóstico clínico.",
  },
  {
    text: "Paciente con palpitaciones irregulares en reposo, médico sospecha arritmia",
    answer: "clinico",
    feedback: "Para detectar arritmias (fibrilación auricular, extrasístoles, bloqueos) se necesita la morfología completa de cada onda — únicamente el ECG clínico lo provee.",
  },
  {
    text: "Triatleta de Ironman quiere registrar FC y HRV durante el entrenamiento de natación",
    answer: "deportivo",
    feedback: "El Polar H10 es waterproof a 30 m, almacena datos internamente y es el estándar oro para FC y HRV en deportes acuáticos.",
  },
  {
    text: "Médico del equipo necesita analizar morfología exacta de la onda P en un corredor de élite",
    answer: "clinico",
    feedback: "La morfología de la onda P (duración, amplitud, bifidez) solo es evaluable con el ECG de 12 derivaciones. Los sensores deportivos no proporcionan forma de onda.",
  },
  {
    text: "Corredor amateur quiere ver en qué zona cardíaca entrena en sus carreras de 10K",
    answer: "deportivo",
    feedback: "Un sensor pectoral como el Polar H10 o un wearable proporciona FC en tiempo real con alta precisión, ideal para entrenar por zonas sin necesidad de clínica.",
  },
  {
    text: "Estudio de investigación necesita medir intervalos QT precisos durante ejercicio máximo",
    answer: "clinico",
    feedback: "La medición precisa del intervalo QT (y su dispersión) requiere las 12 derivaciones del ECG clínico. Es un marcador de riesgo arrítmico que no puede estimarse con sensores deportivos.",
  },
  {
    text: "Jugador de fútbol quiere conectar su sensor a Garmin para ver estadísticas post-partido",
    answer: "deportivo",
    feedback: "El Polar H10 se conecta vía ANT+ y Bluetooth a Garmin, Strava y Polar Flow para ver estadísticas de FC, zonas y carga post-partido.",
  },
];

const CATEGORIES = [
  {
    id: "clinico",
    label: "ECG Clínico",
    sub: "12 derivaciones",
    emoji: "🏥",
    color: "bg-blue-700 hover:bg-blue-800",
    ringColor: "ring-blue-400",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
  },
  {
    id: "deportivo",
    label: "Sensor Deportivo",
    sub: "Polar H10 / Wearable",
    emoji: "⌚",
    color: "bg-emerald-600 hover:bg-emerald-700",
    ringColor: "ring-emerald-400",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
];

interface Props { weekId?: number; classId?: number; }

export default function S3C2_Dynamic3ClasificaDispositivo({ weekId = 3, classId = 2 }: Props) {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ text: string; chosen: string; correct: boolean; feedback: string }[]>([]);
  const [feedbackState, setFeedbackState] = useState<{ correct: boolean; explanation: string; chosenId: string } | null>(null);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => toast.success(`Completado: ${data.score}/${data.maxScore}`),
    onError: (err) => toast.error(err.message),
  });

  const current = SCENARIOS[currentIndex];
  const progress = ((currentIndex + (finished ? 1 : 0)) / SCENARIOS.length) * 100;
  const correctCount = answers.filter((a) => a.correct).length;

  const handleAnswer = (categoryId: string) => {
    if (feedbackState) return;
    const correct = categoryId === current.answer;
    const result = { text: current.text, chosen: categoryId, correct, feedback: current.feedback };
    const newAnswers = [...answers, result];
    setAnswers(newAnswers);
    setFeedbackState({ correct, explanation: current.feedback, chosenId: categoryId });

    setTimeout(() => {
      setFeedbackState(null);
      if (currentIndex + 1 >= SCENARIOS.length) {
        setFinished(true);
        const score = newAnswers.filter((a) => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 3,
            response: { answers: newAnswers },
            score, maxScore: SCENARIOS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 2800);
  };

  const chosenCategory = feedbackState
    ? CATEGORIES.find((c) => c.id === feedbackState.chosenId)
    : null;

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <div className="text-5xl">
            {correctCount === SCENARIOS.length ? "🏆" : correctCount >= 6 ? "🎉" : "💪"}
          </div>
          <h2 className="text-2xl font-bold">
            {correctCount === SCENARIOS.length
              ? "¡Clasificación perfecta!"
              : correctCount >= 6
              ? "¡Muy buen criterio clínico!"
              : "¡Sigue practicando!"}
          </h2>
          <p className="text-muted-foreground">
            {correctCount}/{SCENARIOS.length} escenarios clasificados correctamente
          </p>
        </motion.div>

        <div className="space-y-3">
          {answers.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`p-4 rounded-2xl border ${
                a.correct
                  ? "bg-green-50 border-green-200 dark:bg-green-950/30"
                  : "bg-red-50 border-red-200 dark:bg-red-950/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{a.correct ? "🏥" : "⌚"}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-snug">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{a.feedback}</p>
                </div>
                {a.correct
                  ? <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                  : <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <Badge className="bg-primary/10 text-primary">Dinámica 3 — Semana 3 · Clase 2</Badge>
        <h2 className="text-2xl md:text-3xl font-bold">Clasifica el Dispositivo</h2>
        <p className="text-muted-foreground text-sm">
          Lee el escenario y decide: ¿ECG clínico o sensor deportivo?
        </p>
      </motion.div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Escenario {currentIndex + 1} de {SCENARIOS.length}</span>
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
          <Card
            className={`transition-all duration-300 ${
              feedbackState?.correct
                ? "ring-4 ring-green-400"
                : feedbackState && !feedbackState.correct
                ? "ring-4 ring-red-400"
                : ""
            }`}
          >
            <CardContent className="p-6 space-y-4">
              <p className="text-base md:text-lg font-medium text-center leading-relaxed">
                {current.text}
              </p>

              <AnimatePresence>
                {feedbackState && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div
                      className={`rounded-2xl p-3 text-sm ${
                        feedbackState.correct
                          ? "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300"
                      }`}
                    >
                      <p className="font-semibold mb-1 flex items-center gap-1">
                        {feedbackState.correct ? (
                          <><CheckCircle2 size={15} /> ¡Correcto! Era {chosenCategory?.emoji} {chosenCategory?.label}</>
                        ) : (
                          <><XCircle size={15} /> Incorrecto — la respuesta correcta es {CATEGORIES.find((c) => c.id === current.answer)?.emoji} {CATEGORIES.find((c) => c.id === current.answer)?.label}</>
                        )}
                      </p>
                      <p className="text-xs leading-relaxed">{feedbackState.explanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => handleAnswer(cat.id)}
            disabled={!!feedbackState}
            className={`h-auto py-5 text-white flex flex-col items-center gap-2 ${cat.color}`}
          >
            <span className="text-3xl">{cat.emoji}</span>
            <span className="font-bold">{cat.label}</span>
            <span className="text-xs opacity-75">{cat.sub}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

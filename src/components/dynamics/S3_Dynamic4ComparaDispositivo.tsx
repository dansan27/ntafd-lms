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
    emoji: "🏃",
    title: "Maratonista en entrenamiento",
    description: "Atleta amateur que entrena 5 veces por semana. Quiere monitorear sus zonas de frecuencia cardíaca durante rodajes de 15-25 km.",
    answer: "polar",
    explanation: "El Polar H10 es ideal: alta precisión en running, transmite en tiempo real a apps como Strava o Garmin Connect, resistente al sudor.",
  },
  {
    emoji: "🏥",
    title: "Paciente con sospecha de arritmia",
    description: "Paciente de 55 años con palpitaciones irregulares. El cardiólogo necesita analizar la morfología de cada onda y detectar bloqueos AV.",
    answer: "ecg12",
    explanation: "El ECG de 12 derivaciones es imprescindible para diagnóstico clínico. El Polar H10 no puede detectar bloqueos ni analizar morfología de onda.",
  },
  {
    emoji: "🚴",
    title: "Ciclista de ruta — Test de campo",
    description: "Entrenador quiere medir la FC durante un test de esfuerzo incremental en bicicleta (2-3 horas, alta intensidad) para calcular zonas de entrenamiento.",
    answer: "polar",
    explanation: "El Polar H10 supera al ECG de investigación en ciclismo de alta intensidad (menor error en movimiento) y transmite a ciclocomputadores como Garmin.",
  },
  {
    emoji: "🔬",
    title: "Investigación científica — Validación",
    description: "Investigador necesita medir con máxima precisión el intervalo QT y la dispersión del QT en deportistas de élite para publicar un paper.",
    answer: "ecg12",
    explanation: "Para medición del intervalo QT y análisis clínico detallado se necesita ECG de 12 derivaciones. El Polar H10 no proporciona morfología de onda.",
  },
  {
    emoji: "🏊",
    title: "Nadador — Monitoreo continuo",
    description: "Atleta olímpico de natación. Su entrenador quiere monitorear la FC durante los intervalos de entrenamiento en piscina.",
    answer: "polar",
    explanation: "El Polar H10 es waterproof (30 m) y almacena datos internamente cuando no hay Bluetooth disponible. Perfecto para natación.",
  },
  {
    emoji: "💪",
    title: "Deportista de fuerza — Análisis de recuperación",
    description: "Powerlifter que quiere monitorear su FC y variabilidad (HRV) durante una sesión de sentadillas y peso muerto.",
    answer: "polar",
    explanation: "El Polar H10 con apps como HRV4Training o Elite HRV permite medir HRV. En fuerza el error es bajo (0.38%), adecuado para monitoreo.",
  },
];

const DEVICES = [
  { id: "polar", label: "Polar H10", sub: "Sensor pectoral deportivo", emoji: "⌚", color: "bg-primary hover:bg-primary/90" },
  { id: "ecg12", label: "ECG 12 derivaciones", sub: "Laboratorio / clínica", emoji: "🏥", color: "bg-slate-700 hover:bg-slate-800" },
];

interface Props { weekId?: number; classId?: number; }

export default function S3_Dynamic4ComparaDispositivo({ weekId = 3, classId = 1 }: Props) {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ scenario: string; correct: boolean; explanation: string }[]>([]);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => toast.success(`Resultado: ${data.score}/${data.maxScore}`),
    onError: (err) => toast.error(err.message),
  });

  const current = SCENARIOS[currentIndex];
  const progress = ((currentIndex + (finished ? 1 : 0)) / SCENARIOS.length) * 100;
  const correctCount = answers.filter(a => a.correct).length;

  const handleAnswer = (deviceId: string) => {
    if (feedback) return;
    const correct = deviceId === current.answer;
    const result = { scenario: current.title, correct, explanation: current.explanation };
    const newAnswers = [...answers, result];
    setAnswers(newAnswers);
    setFeedback({ correct, explanation: current.explanation });

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 >= SCENARIOS.length) {
        setFinished(true);
        const score = newAnswers.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 4,
            response: { answers: newAnswers },
            score, maxScore: SCENARIOS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex(i => i + 1);
      }
    }, 2800);
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <div className="text-5xl">{correctCount === SCENARIOS.length ? "🏆" : correctCount >= 4 ? "🎉" : "💪"}</div>
          <h2 className="text-2xl font-bold">{correctCount === SCENARIOS.length ? "¡Criterio perfecto!" : "¡Buen diagnóstico!"}</h2>
          <p className="text-muted-foreground">{correctCount}/{SCENARIOS.length} decisiones correctas</p>
        </motion.div>
        <div className="space-y-3">
          {answers.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-2xl border ${a.correct ? "bg-green-50 border-green-200 dark:bg-green-950/30" : "bg-red-50 border-red-200 dark:bg-red-950/30"}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{SCENARIOS[i].emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{a.scenario}</p>
                  <p className="text-xs text-muted-foreground mt-1">{a.explanation}</p>
                </div>
                {a.correct ? <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} /> : <XCircle className="text-red-500 flex-shrink-0" size={18} />}
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
        <Badge className="bg-primary/10 text-primary">Dinámica 4 — Semana 3</Badge>
        <h2 className="text-2xl md:text-3xl font-bold">Elige el Dispositivo</h2>
        <p className="text-muted-foreground text-sm">Lee el escenario y elige el dispositivo más adecuado.</p>
      </motion.div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentIndex + 1}/{SCENARIOS.length}</span>
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
          <Card className={`transition-all ${
            feedback?.correct ? "ring-4 ring-green-400" : feedback && !feedback.correct ? "ring-4 ring-red-400" : ""
          }`}>
            <CardContent className="p-6 space-y-3">
              <div className="text-4xl text-center">{current.emoji}</div>
              <h3 className="font-bold text-center text-lg">{current.title}</h3>
              <p className="text-sm text-muted-foreground text-center leading-relaxed">{current.description}</p>
              {feedback && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className={`rounded-2xl p-3 text-sm ${feedback.correct ? "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"}`}>
                    <p className="font-semibold mb-1">{feedback.correct ? "✓ ¡Decisión correcta!" : "✗ No es la mejor opción"}</p>
                    <p className="text-xs">{feedback.explanation}</p>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DEVICES.map((device) => (
          <Button
            key={device.id}
            onClick={() => handleAnswer(device.id)}
            disabled={!!feedback}
            className={`h-auto py-5 text-white flex flex-col items-center gap-2 ${device.color}`}
          >
            <span className="text-3xl">{device.emoji}</span>
            <span className="font-bold">{device.label}</span>
            <span className="text-xs opacity-70">{device.sub}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

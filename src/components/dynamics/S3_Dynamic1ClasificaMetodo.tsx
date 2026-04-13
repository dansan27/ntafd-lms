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

const TESTS = [
  { text: "Análisis de Gases (Espirómetro)", tipo: "directo", esfuerzo: "maximo", emoji: "🫁" },
  { text: "Test de Cooper — 12 min correr", tipo: "indirecto", esfuerzo: "maximo", emoji: "🏃" },
  { text: "Protocolo de Bruce (cinta)", tipo: "indirecto", esfuerzo: "maximo", emoji: "🏋️" },
  { text: "Test de Åstrand-Rhyming (bicicleta)", tipo: "indirecto", esfuerzo: "submaximo", emoji: "🚴" },
  { text: "Test de 6 Minutos Marcha", tipo: "indirecto", esfuerzo: "submaximo", emoji: "🚶" },
  { text: "Prueba de Lactato", tipo: "indirecto", esfuerzo: "submaximo", emoji: "🩸" },
];

interface Props { weekId?: number; classId?: number; }

export default function S3_Dynamic1ClasificaMetodo({ weekId = 3, classId = 1 }: Props) {
  const { token } = useStudent();
  const [step, setStep] = useState<"tipo" | "esfuerzo">("tipo");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tipoAnswer, setTipoAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ test: string; correct: boolean }[]>([]);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => toast.success(`Resultado: ${data.score}/${data.maxScore}`),
    onError: (err) => toast.error(err.message),
  });

  const current = TESTS[currentIndex];

  const handleTipo = (answer: string) => {
    if (feedback !== null) return;
    setTipoAnswer(answer);
    setStep("esfuerzo");
  };

  const handleEsfuerzo = (answer: string) => {
    if (feedback !== null) return;
    const tipoCorrect = tipoAnswer === current.tipo;
    const esfuerzoCorrect = answer === current.esfuerzo;
    const correct = tipoCorrect && esfuerzoCorrect;

    const newAnswers = [...answers, { test: current.text, correct }];
    setAnswers(newAnswers);
    setFeedback(correct);

    setTimeout(() => {
      setFeedback(null);
      setTipoAnswer(null);
      setStep("tipo");
      if (currentIndex + 1 >= TESTS.length) {
        setFinished(true);
        const score = newAnswers.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 1,
            response: { answers: newAnswers },
            score, maxScore: TESTS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex(i => i + 1);
      }
    }, 1400);
  };

  const progress = ((currentIndex + (finished ? 1 : 0)) / TESTS.length) * 100;
  const correctCount = answers.filter(a => a.correct).length;

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <div className="text-5xl">{correctCount === TESTS.length ? "🏆" : correctCount >= 4 ? "🎉" : "💪"}</div>
          <h2 className="text-2xl font-bold">{correctCount === TESTS.length ? "¡Perfecto!" : correctCount >= 4 ? "¡Muy bien!" : "¡Buen intento!"}</h2>
          <p className="text-muted-foreground">{correctCount}/{TESTS.length} clasificaciones correctas</p>
        </motion.div>
        <Card>
          <CardContent className="p-4 space-y-2">
            {answers.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-xl ${a.correct ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"}`}
              >
                <span className="text-lg">{TESTS[i].emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{a.test}</p>
                  <p className="text-xs text-muted-foreground">
                    {TESTS[i].tipo} · {TESTS[i].esfuerzo}
                  </p>
                </div>
                {a.correct
                  ? <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} />
                  : <XCircle className="text-red-500 flex-shrink-0" size={18} />
                }
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <Badge className="bg-primary/10 text-primary">Dinámica 1 — Semana 3</Badge>
        <h2 className="text-2xl md:text-3xl font-bold">Clasifica el Test de VO₂</h2>
        <p className="text-muted-foreground text-sm">
          {step === "tipo" ? "¿Es un método Directo o Indirecto?" : "¿El esfuerzo es Máximo o Submáximo?"}
        </p>
      </motion.div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentIndex + 1}/{TESTS.length}</span>
          <span>{correctCount} correctas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentIndex}-${step}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          <Card className={`overflow-hidden transition-all ${
            feedback === true ? "ring-4 ring-green-400" : feedback === false ? "ring-4 ring-red-400" : ""
          }`}>
            <CardContent className="p-6 md:p-8 text-center space-y-4">
              <div className="text-5xl">{current.emoji}</div>
              <p className="text-lg font-semibold">{current.text}</p>
              {tipoAnswer && step === "esfuerzo" && (
                <Badge variant="outline" className="text-primary border-primary/30">
                  Tipo seleccionado: {tipoAnswer === "directo" ? "Directo" : "Indirecto"} — ahora: ¿Máximo o Submáximo?
                </Badge>
              )}
              {feedback !== null && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Badge className={`text-white text-sm px-3 py-1 ${feedback ? "bg-green-500" : "bg-red-500"}`}>
                    {feedback ? "¡Correcto!" : `Respuesta: ${current.tipo} · ${current.esfuerzo}`}
                  </Badge>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {step === "tipo" ? (
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "directo", label: "Directo", sub: "Medición real de gases", color: "bg-emerald-600 hover:bg-emerald-700" },
            { id: "indirecto", label: "Indirecto", sub: "Estimación por FC/rendimiento", color: "bg-violet-600 hover:bg-violet-700" },
          ].map((opt) => (
            <Button
              key={opt.id}
              onClick={() => handleTipo(opt.id)}
              disabled={feedback !== null}
              className={`h-auto py-4 text-white flex flex-col gap-1 ${opt.color}`}
            >
              <span className="font-bold">{opt.label}</span>
              <span className="text-xs opacity-70">{opt.sub}</span>
            </Button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "maximo", label: "Máximo", sub: "Esfuerzo al límite", color: "bg-red-600 hover:bg-red-700" },
            { id: "submaximo", label: "Submáximo", sub: "Esfuerzo moderado", color: "bg-blue-600 hover:bg-blue-700" },
          ].map((opt) => (
            <Button
              key={opt.id}
              onClick={() => handleEsfuerzo(opt.id)}
              disabled={feedback !== null}
              className={`h-auto py-4 text-white flex flex-col gap-1 ${opt.color}`}
            >
              <span className="font-bold">{opt.label}</span>
              <span className="text-xs opacity-70">{opt.sub}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

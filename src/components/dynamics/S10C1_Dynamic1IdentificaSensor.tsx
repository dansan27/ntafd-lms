import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const SCENARIOS = [
  {
    scenario: "Medir el ángulo de flexión de rodilla durante la sentadilla",
    answer: "Potenciómetro",
    explanation: "El electrogonímetro (potenciómetro rotativo) mide directamente el ángulo articular de la rodilla durante el movimiento — medición articular directa y continua.",
  },
  {
    scenario: "Analizar la orientación de la pelvis durante el sprint",
    answer: "IMU",
    explanation: "El IMU colocado en el sacro captura la orientación 3D pélvica en tiempo real de forma inalámbrica — el gold standard para análisis de marcha y carrera en campo.",
  },
  {
    scenario: "Medir las RPM de un cicloergómetro durante un test incremental",
    answer: "Encoder",
    explanation: "El encoder óptico de cuadratura mide con alta precisión la velocidad rotacional del pedaleo — variable crítica para el cálculo de potencia en el cicloergómetro.",
  },
  {
    scenario: "Capturar el movimiento completo de un jugador de baloncesto en cancha",
    answer: "Cámara MoCap",
    explanation: "La captura de movimiento óptica (MoCap) registra todos los segmentos del cuerpo simultáneamente sin sensores sobre el atleta — ideal para análisis global en laboratorio.",
  },
  {
    scenario: "Detectar la rotación de la muñeca de un tenista durante el saque",
    answer: "IMU",
    explanation: "Un IMU de 9 DOF en la muñeca registra la velocidad angular y orientación de la raqueta en tiempo real durante el saque — inalámbrico y sin interferir con el gesto.",
  },
];

const OPTIONS = ["IMU", "Potenciómetro", "Encoder", "Cámara MoCap"];

interface Props { weekId?: number; classId?: number; }

export default function S10C1_Dynamic1IdentificaSensor({ weekId = 10, classId = 1 }: Props) {
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
  const correctCount = answers.filter((a) => a.correct).length;
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
        const total = newAnswers.filter((a) => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 1,
            response: { answers: newAnswers },
            score: total,
            maxScore: SCENARIOS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex((prev) => prev + 1);
        setSelected(null);
        setShowFeedback(false);
      }
    }, 2000);
  };

  if (finished) {
    const pct = Math.round((correctCount / SCENARIOS.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <span className="text-6xl">{pct >= 80 ? "🎯" : pct >= 60 ? "📡" : "📖"}</span>
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Experto en sensores!" : pct >= 60 ? "Buen trabajo" : "Repasa los sensores"}</h3>
          <p className="text-muted-foreground">{correctCount} de {SCENARIOS.length} correctas — {pct}%</p>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
          </div>
        </motion.div>
        <div className="grid grid-cols-2 gap-3">
          {OPTIONS.map((o) => {
            const total = SCENARIOS.filter((s) => s.answer === o).length;
            const correct = answers.filter((a, i) => SCENARIOS[i].answer === o && a.correct).length;
            return (
              <Card key={o}>
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold">{correct}/{total}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{o}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="space-y-2">
          {answers.map((a, i) => (
            <Card key={i} className={`border ${a.correct ? "border-green-500/30" : "border-red-500/30"}`}>
              <CardContent className="p-3 flex items-start gap-2">
                {a.correct ? <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={14} /> : <XCircle className="text-red-400 shrink-0 mt-0.5" size={14} />}
                <div>
                  <p className="text-xs font-medium">{SCENARIOS[i].scenario}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Tu respuesta: {a.selected}</p>
                  {!a.correct && <p className="text-xs text-green-400/70 mt-0.5">✓ {SCENARIOS[i].answer}</p>}
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
          <span>Escenario {currentIndex + 1} de {SCENARIOS.length}</span>
          <span>{correctCount} correctas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-5">
              <Badge className="bg-blue-500/20 text-blue-300 text-xs">📡 Identifica el Sensor</Badge>
              <div className="rounded-xl bg-muted/40 border border-border p-4">
                <p className="text-sm leading-relaxed">{current.scenario}</p>
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                ¿Qué sensor usarías?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {OPTIONS.map((opt) => {
                  const isSelected = selected === opt;
                  const isCorrect = opt === current.answer;
                  let style = "border-border hover:border-primary/50 hover:bg-primary/5";
                  if (showFeedback && isSelected && isCorrect) style = "border-green-500 bg-green-500/10 text-green-300";
                  else if (showFeedback && isSelected && !isCorrect) style = "border-red-500 bg-red-500/10 text-red-300";
                  else if (showFeedback && isCorrect) style = "border-green-500/50 bg-green-500/5 text-green-400";
                  return (
                    <button key={opt} onClick={() => handleSelect(opt)}
                      className={`p-3 rounded-xl border text-sm font-bold transition-all text-center ${style}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {showFeedback && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl p-3 text-xs flex items-start gap-2 ${selected === current.answer ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"}`}>
                    {selected === current.answer
                      ? <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                      : <XCircle size={14} className="shrink-0 mt-0.5" />}
                    <div>
                      <p className="font-bold">{selected === current.answer ? "Correcto" : `Incorrecto — es ${current.answer}`}</p>
                      <p className="text-muted-foreground mt-0.5">{current.explanation}</p>
                    </div>
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

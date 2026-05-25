import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const SCENARIOS = [
  {
    condition: "Hipertensión Arterial",
    isECNT: true,
    explanation: "Sí, es una ECNT. Evolución lenta, crónica, asociada a estilo de vida. Responsable del 19% de las muertes cardiovasculares globales.",
  },
  {
    condition: "Gripe (Influenza)",
    isECNT: false,
    explanation: "No es una ECNT. Es una enfermedad infecciosa transmisible, aguda y de corta duración.",
  },
  {
    condition: "Diabetes Tipo 2",
    isECNT: true,
    explanation: "Sí, es una ECNT. Resistencia crónica a la insulina, de progresión lenta y fuertemente ligada a hábitos de vida.",
  },
  {
    condition: "Apendicitis aguda",
    isECNT: false,
    explanation: "No es una ECNT. Es una emergencia médica aguda, no crónica ni relacionada con el estilo de vida.",
  },
  {
    condition: "Cáncer de colon",
    isECNT: true,
    explanation: "Sí, es una ECNT. El cáncer colorrectal está asociado a factores de riesgo modificables: dieta, sedentarismo y obesidad.",
  },
  {
    condition: "Fractura de tobillo",
    isECNT: false,
    explanation: "No es una ECNT. Es una lesión traumática aguda, no una enfermedad crónica.",
  },
];

interface Props { weekId?: number; classId?: number }

export default function S9C1_Dynamic1ClasificaECNT({ weekId = 9, classId = 1 }: Props) {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ condition: string; selected: boolean; correct: boolean }[]>([]);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => toast.success(`Resultado: ${data.score}/${data.maxScore} correctas`),
    onError: (err) => toast.error(err.message),
  });

  const current = SCENARIOS[currentIndex];
  const correctCount = answers.filter(a => a.correct).length;

  const handleSelect = (isECNT: boolean) => {
    if (showFeedback) return;
    setSelected(isECNT);
    setShowFeedback(true);
    const correct = isECNT === current.isECNT;
    const newAnswers = [...answers, { condition: current.condition, selected: isECNT, correct }];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIndex + 1 >= SCENARIOS.length) {
        setFinished(true);
        const total = newAnswers.filter(a => a.correct).length;
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
        setCurrentIndex(prev => prev + 1);
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
          <span className="text-6xl">{pct >= 80 ? "🫀" : pct >= 60 ? "💡" : "📖"}</span>
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Dominas las ECNT!" : pct >= 60 ? "Buen trabajo" : "Repasa los conceptos"}</h3>
          <p className="text-muted-foreground">{correctCount} de {SCENARIOS.length} correctas — {pct}%</p>
        </motion.div>
        <div className="space-y-2">
          {answers.map((a, i) => (
            <Card key={i} className={`border ${a.correct ? "border-green-500/30" : "border-red-500/30"}`}>
              <CardContent className="p-3 flex items-start gap-2">
                {a.correct ? <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={16} /> : <XCircle className="text-red-400 shrink-0 mt-0.5" size={16} />}
                <div>
                  <p className="text-xs font-medium">{SCENARIOS[i].condition}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Tu respuesta: {a.selected ? "ECNT ✓" : "No ECNT"}</p>
                  {!a.correct && <p className="text-xs text-green-400/70 mt-0.5">✓ {SCENARIOS[i].explanation}</p>}
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
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Caso {currentIndex + 1} de {SCENARIOS.length}</span>
        <span>{correctCount} correctas</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-5">
              <Badge className="bg-teal-500/20 text-teal-300 text-xs">🫀 Clasifica la ECNT</Badge>
              <p className="text-base font-bold">¿Es una Enfermedad Crónica No Transmisible?</p>
              <div className="rounded-xl border border-white/10 bg-white/4 p-5 text-center">
                <p className="text-2xl font-black text-white">{current.condition}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "✓ Sí, es ECNT", value: true, style: showFeedback && selected === true ? (current.isECNT ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10") : "border-border hover:border-primary/50" },
                  { label: "✗ No es ECNT", value: false, style: showFeedback && selected === false ? (!current.isECNT ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10") : "border-border hover:border-primary/50" },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    onClick={() => handleSelect(opt.value)}
                    className={`p-4 rounded-xl border text-sm font-bold transition-all ${opt.style}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {showFeedback && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl p-3 text-xs ${selected === current.isECNT ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"}`}>
                    <p className="font-bold mb-1">{selected === current.isECNT ? "✓ Correcto" : "✗ Incorrecto"}</p>
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

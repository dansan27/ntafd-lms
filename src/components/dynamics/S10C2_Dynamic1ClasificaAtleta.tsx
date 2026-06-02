import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const PERFILES = [
  {
    nombre: "Atleta A",
    vo2max: 45,
    fcReposo: 68,
    potencia: 6.2,
    answer: "Sprinter (Potencia)",
    explanation: "Potencia relativa muy alta (6.2 W/kg) con VO₂máx moderado (45 ml/kg/min) — perfil clásico de velocidad y fuerza explosiva.",
  },
  {
    nombre: "Atleta B",
    vo2max: 72,
    fcReposo: 42,
    potencia: 3.8,
    answer: "Resistencia (Endurance)",
    explanation: "VO₂máx élite (72 ml/kg/min) y FC reposo muy baja (42 bpm) — marcadores fisiológicos de atleta de resistencia de alto nivel.",
  },
  {
    nombre: "Atleta C",
    vo2max: 58,
    fcReposo: 55,
    potencia: 5.0,
    answer: "Mixto (Polivalente)",
    explanation: "Valores intermedios y balanceados en los tres indicadores — perfil polivalente que puede rendir en distintas demandas.",
  },
  {
    nombre: "Atleta D",
    vo2max: 48,
    fcReposo: 70,
    potencia: 5.8,
    answer: "Sprinter (Potencia)",
    explanation: "Potencia alta (5.8 W/kg) con VO₂máx bajo-moderado (48 ml/kg/min) y FC reposo elevada — perfil de potencia/velocidad.",
  },
];

const OPTIONS = ["Sprinter (Potencia)", "Mixto (Polivalente)", "Resistencia (Endurance)"];

interface Props { weekId?: number; classId?: number; }

export default function S10C2_Dynamic1ClasificaAtleta({ weekId = 10, classId = 2 }: Props) {
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

  const current = PERFILES[currentIndex];
  const correctCount = answers.filter((a) => a.correct).length;
  const progress = ((currentIndex + (finished ? 1 : 0)) / PERFILES.length) * 100;

  const handleSelect = (option: string) => {
    if (showFeedback) return;
    setSelected(option);
    setShowFeedback(true);
    const correct = option === current.answer;
    const newAnswers = [...answers, { selected: option, correct }];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIndex + 1 >= PERFILES.length) {
        setFinished(true);
        const total = newAnswers.filter((a) => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 1,
            response: { answers: newAnswers },
            score: total,
            maxScore: PERFILES.length,
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
    const pct = Math.round((correctCount / PERFILES.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <span className="text-6xl">{pct >= 80 ? "🏆" : pct >= 60 ? "💜" : "📖"}</span>
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Experto en clustering!" : pct >= 60 ? "Buen trabajo" : "Repasa los perfiles"}</h3>
          <p className="text-muted-foreground">{correctCount} de {PERFILES.length} correctas — {pct}%</p>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
          </div>
        </motion.div>
        <div className="space-y-2">
          {answers.map((a, i) => (
            <Card key={i} className={`border ${a.correct ? "border-green-500/30" : "border-red-500/30"}`}>
              <CardContent className="p-3 flex items-start gap-2">
                {a.correct ? <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={14} /> : <XCircle className="text-red-400 shrink-0 mt-0.5" size={14} />}
                <div>
                  <p className="text-xs font-medium">
                    {PERFILES[i].nombre} — VO₂máx: {PERFILES[i].vo2max} · FC: {PERFILES[i].fcReposo} · Pot: {PERFILES[i].potencia} W/kg
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Tu respuesta: {a.selected}</p>
                  {!a.correct && <p className="text-xs text-green-400/70 mt-0.5">✓ {PERFILES[i].answer}</p>}
                  <p className="text-xs text-white/30 mt-0.5">{PERFILES[i].explanation}</p>
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
          <span>Perfil {currentIndex + 1} de {PERFILES.length}</span>
          <span>{correctCount} correctas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-5">
              <Badge className="bg-violet-500/20 text-violet-300 text-xs">🏃 Clasifica el Atleta</Badge>
              <div className="rounded-xl bg-muted/40 border border-border p-4 space-y-3">
                <p className="text-sm font-bold text-violet-300">{current.nombre}</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 p-2">
                    <p className="text-xs text-white/40">VO₂máx</p>
                    <p className="text-base font-black text-violet-300">{current.vo2max}</p>
                    <p className="text-[10px] text-white/30">ml/kg/min</p>
                  </div>
                  <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 p-2">
                    <p className="text-xs text-white/40">FC reposo</p>
                    <p className="text-base font-black text-violet-300">{current.fcReposo}</p>
                    <p className="text-[10px] text-white/30">bpm</p>
                  </div>
                  <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 p-2">
                    <p className="text-xs text-white/40">Potencia</p>
                    <p className="text-base font-black text-violet-300">{current.potencia}</p>
                    <p className="text-[10px] text-white/30">W/kg</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                ¿A qué cluster pertenece este atleta?
              </p>
              <div className="flex flex-col gap-2">
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

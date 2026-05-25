import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const STATEMENTS = [
  {
    text: "El ejercicio aeróbico reduce la fatiga relacionada con el cáncer.",
    isTrue: true,
    explanation: "VERDADERO. Múltiples meta-análisis confirman que el ejercicio aeróbico moderado reduce significativamente la fatiga oncológica — el síntoma más reportado en quimioterapia.",
  },
  {
    text: "Los pacientes oncológicos deben evitar todo ejercicio durante la quimioterapia.",
    isTrue: false,
    explanation: "FALSO. Las guías actuales (ACSM 2022) recomiendan ejercicio moderado durante el tratamiento activo — con supervisión médica y adaptación según tolerancia.",
  },
  {
    text: "El ejercicio mejora la función inmunológica en pacientes con cáncer.",
    isTrue: true,
    explanation: "VERDADERO. El ejercicio aumenta la actividad de células NK (natural killer) y linfocitos T, mejorando la respuesta inmune — relevante durante y post-tratamiento oncológico.",
  },
  {
    text: "La realidad virtual en rehabilitación oncológica solo tiene beneficios físicos, no psicológicos.",
    isTrue: false,
    explanation: "FALSO. La RV también ofrece beneficios psicológicos: reduce ansiedad, distrae del dolor y mejora el estado de ánimo. En oncología, el componente psicológico es tan importante como el físico.",
  },
  {
    text: "El tipo y etapa del cáncer influye en la prescripción de ejercicio.",
    isTrue: true,
    explanation: "VERDADERO. La prescripción debe adaptarse: ej. cáncer de mama vs. cáncer hematológico tienen diferentes consideraciones de riesgo, y en fase de neutropenia se evitan entornos públicos.",
  },
  {
    text: "El ejercicio de fuerza está contraindicado en todos los pacientes con cáncer.",
    isTrue: false,
    explanation: "FALSO. El ejercicio de fuerza moderado mejora la masa muscular (caquexia), la fatiga y la calidad de vida. Solo se limita en casos de metástasis ósea o riesgo de fractura específico.",
  },
];

interface Props { weekId?: number; classId?: number }

export default function S9C2_Dynamic2EjercicioCancer({ weekId = 9, classId = 2 }: Props) {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ isTrue: boolean; correct: boolean }[]>([]);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => toast.success(`Resultado: ${data.score}/${data.maxScore} correctas`),
    onError: (err) => toast.error(err.message),
  });

  const current = STATEMENTS[currentIndex];
  const correctCount = answers.filter(a => a.correct).length;

  const handleSelect = (isTrue: boolean) => {
    if (showFeedback) return;
    setSelected(isTrue);
    setShowFeedback(true);
    const correct = isTrue === current.isTrue;
    const newAnswers = [...answers, { isTrue, correct }];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIndex + 1 >= STATEMENTS.length) {
        setFinished(true);
        const total = newAnswers.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 2,
            response: { answers: newAnswers },
            score: total,
            maxScore: STATEMENTS.length,
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
    const pct = Math.round((correctCount / STATEMENTS.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <span className="text-6xl">{pct >= 80 ? "🏃" : pct >= 60 ? "💡" : "📖"}</span>
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Gran conocimiento en oncología!" : pct >= 60 ? "Buen trabajo" : "Repasa los beneficios del ejercicio"}</h3>
          <p className="text-muted-foreground">{correctCount} de {STATEMENTS.length} correctas — {pct}%</p>
        </motion.div>
        <div className="space-y-2">
          {answers.map((a, i) => (
            <Card key={i} className={`border ${a.correct ? "border-green-500/30" : "border-red-500/30"}`}>
              <CardContent className="p-3 flex items-start gap-2">
                {a.correct ? <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={16} /> : <XCircle className="text-red-400 shrink-0 mt-0.5" size={16} />}
                <div>
                  <p className="text-xs font-medium">{STATEMENTS[i].text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Respuesta correcta: {STATEMENTS[i].isTrue ? "Verdadero" : "Falso"}</p>
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
        <span>Afirmación {currentIndex + 1} de {STATEMENTS.length}</span>
        <span>{correctCount} correctas</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-5">
              <Badge className="bg-teal-500/20 text-teal-300 text-xs">🏃 Ejercicio y Cáncer — ¿V o F?</Badge>
              <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-5">
                <p className="text-base font-semibold text-white leading-relaxed">{current.text}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "✓ Verdadero", value: true },
                  { label: "✗ Falso", value: false },
                ].map((opt) => {
                  const isSelected = selected === opt.value;
                  const isCorrect = opt.value === current.isTrue;
                  let style = "border-border hover:border-primary/50 hover:bg-primary/5";
                  if (showFeedback && isSelected && isCorrect) style = "border-green-500 bg-green-500/10";
                  else if (showFeedback && isSelected && !isCorrect) style = "border-red-500 bg-red-500/10";
                  else if (showFeedback && isCorrect) style = "border-green-500/50 bg-green-500/5";
                  return (
                    <button key={String(opt.value)} onClick={() => handleSelect(opt.value)}
                      className={`p-4 rounded-xl border text-sm font-bold transition-all ${style}`}>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {showFeedback && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl p-3 text-xs ${selected === current.isTrue ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"}`}>
                    <p className="font-bold mb-1">{selected === current.isTrue ? "✓ Correcto" : "✗ Incorrecto"}</p>
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

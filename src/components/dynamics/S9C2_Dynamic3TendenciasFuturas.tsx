import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const QUESTIONS = [
  {
    question: "Un algoritmo analiza big data de miles de pacientes para predecir qué tratamiento funcionará mejor para un paciente específico con diabetes. ¿Qué tendencia representa esto?",
    options: ["Realidad Aumentada (RA)", "Inteligencia Artificial (IA)", "IoT médico", "Telemedicina"],
    answer: "Inteligencia Artificial (IA)",
    explanation: "El análisis de big data para personalizar tratamientos es IA aplicada a medicina. Los modelos aprenden de millones de casos para predecir respuestas individuales.",
  },
  {
    question: "Un tensiómetro en casa, un MCG en el brazo y un smartwatch se comunican automáticamente con el médico 24/7. ¿Qué tecnología hace esto posible?",
    options: ["Realidad Virtual (RV)", "Inteligencia Artificial", "Internet de las Cosas (IoT) médico + 5G", "Medicina de precisión genómica"],
    answer: "Internet de las Cosas (IoT) médico + 5G",
    explanation: "La conectividad entre dispositivos de salud domiciliarios (IoT) transmitida con baja latencia por redes 5G permite el monitoreo continuo remoto del paciente.",
  },
  {
    question: "Se analiza el genoma de un paciente para diseñar una intervención de ejercicio y nutrición exactamente adaptada a su predisposición genética a la obesidad. ¿Qué es esto?",
    options: ["Telemedicina avanzada", "Medicina de precisión", "Realidad aumentada clínica", "Gamificación terapéutica"],
    answer: "Medicina de precisión",
    explanation: "La medicina de precisión personaliza intervenciones basándose en genética, microbioma, estilo de vida y datos biométricos individuales — más allá de protocolos poblacionales.",
  },
  {
    question: "¿Cuál es la principal limitación de la tecnología en salud para pacientes con ECNT en países de ingresos bajos?",
    options: [
      "La tecnología es demasiado simple para estas enfermedades",
      "Brecha digital: acceso limitado en zonas rurales y comunidades de bajos recursos",
      "Los médicos no saben usar las tecnologías",
      "No existen regulaciones para estas tecnologías",
    ],
    answer: "Brecha digital: acceso limitado en zonas rurales y comunidades de bajos recursos",
    explanation: "La brecha digital es la principal barrera de equidad en salud digital. El acceso a smartphones, internet y dispositivos wearables sigue siendo desigual a nivel global.",
  },
  {
    question: "Un cirujano usa gafas que proyectan imágenes de la anatomía del paciente superpuestas sobre el campo quirúrgico durante una operación. ¿Qué tecnología es?",
    options: ["Realidad Virtual (RV)", "Realidad Aumentada (RA)", "Inteligencia Artificial", "IoT quirúrgico"],
    answer: "Realidad Aumentada (RA)",
    explanation: "La Realidad Aumentada superpone información digital sobre el mundo real (RA), a diferencia de la RV que sumerge al usuario en un entorno completamente virtual.",
  },
];

interface Props { weekId?: number; classId?: number }

export default function S9C2_Dynamic3TendenciasFuturas({ weekId = 9, classId = 2 }: Props) {
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
            token, weekId, classId, dynamicId: 3,
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
    }, 2000);
  };

  if (finished) {
    const pct = Math.round((correctCount / QUESTIONS.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <span className="text-6xl">{pct >= 80 ? "🤖" : pct >= 60 ? "💡" : "📖"}</span>
          <h3 className="text-2xl font-black">{pct >= 80 ? "¡Visión del futuro digital!" : pct >= 60 ? "Buen criterio tecnológico" : "Repasa las tendencias"}</h3>
          <p className="text-muted-foreground">{correctCount} de {QUESTIONS.length} correctas — {pct}%</p>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Escenario {currentIndex + 1} de {QUESTIONS.length}</span>
          <span>{correctCount} correctas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-5">
              <Badge className="bg-teal-500/20 text-teal-300 text-xs">🤖 Tecnologías del Futuro</Badge>
              <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
                <p className="text-sm text-white/70 leading-relaxed">{current.question}</p>
              </div>
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

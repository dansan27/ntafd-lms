import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const ITEMS = [
  {
    description: "Mide los gases O₂ y CO₂ en el aire expirado con sensores paramagnéticos y de infrarrojos",
    answer: "Analizador de gases",
    options: ["Analizador de gases", "Turbina/flujómetro", "Cámara de mezcla", "Sistema de metabolismo (Vyntus CPX)"],
    explanation: "El analizador de gases emplea sensores paramagnéticos para O₂ y de infrarrojos (NDIR) para CO₂, permitiendo medición precisa de la composición del aire expirado.",
    emoji: "🔬",
  },
  {
    description: "Permite respirar durante el ejercicio mientras se recolectan muestras de aire expirado",
    answer: "Boquilla y mascarilla de Rudolph",
    options: ["Boquilla y mascarilla de Rudolph", "Analizador de gases", "Cámara de mezcla", "Turbina/flujómetro"],
    explanation: "La boquilla/mascarilla de Rudolph forma el sello hermético necesario para dirigir todo el aire expirado hacia el sistema de análisis sin fugas.",
    emoji: "😮‍💨",
  },
  {
    description: "Analiza la mezcla de aire espirado durante varios segundos para calcular concentraciones medias",
    answer: "Cámara de mezcla",
    options: ["Cámara de mezcla", "Boquilla y mascarilla de Rudolph", "Sistema de metabolismo (Vyntus CPX)", "Treadmill (cinta ergométrica)"],
    explanation: "La cámara de mezcla homogeniza el aire expirado aliento a aliento, ofreciendo una concentración media estable para un análisis más robusto.",
    emoji: "💨",
  },
  {
    description: "Mide la velocidad y la inclinación programable para tests de Bruce o Balke",
    answer: "Treadmill (cinta ergométrica)",
    options: ["Treadmill (cinta ergométrica)", "Analizador de gases", "Turbina/flujómetro", "Boquilla y mascarilla de Rudolph"],
    explanation: "El treadmill motorizado controla velocidad (km/h) e inclinación (%) según los protocolos de prueba de esfuerzo máximo como Bruce o Balke.",
    emoji: "🏃",
  },
  {
    description: "Mide el flujo o volumen de aire que entra y sale en cada respiración",
    answer: "Turbina/flujómetro",
    options: ["Turbina/flujómetro", "Cámara de mezcla", "Analizador de gases", "Sistema de metabolismo (Vyntus CPX)"],
    explanation: "La turbina bidireccional cuantifica el volumen corriente y la ventilación minuto en cada ciclo respiratorio con alta precisión.",
    emoji: "🌀",
  },
  {
    description: "Conecta todos los módulos de análisis de gases para calcular VO₂, VCO₂ y RQ en tiempo real",
    answer: "Sistema de metabolismo (Vyntus CPX)",
    options: ["Sistema de metabolismo (Vyntus CPX)", "Treadmill (cinta ergométrica)", "Cámara de mezcla", "Analizador de gases"],
    explanation: "El Vyntus CPX integra turbina, analizadores y software para calcular consumo de O₂, producción de CO₂ y cociente respiratorio respiración a respiración.",
    emoji: "🖥️",
  },
];

interface Props { weekId?: number; classId?: number; }

export default function S3C1_Dynamic2EquipoLab({ weekId = 3, classId = 1 }: Props) {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<{ selected: string; correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => toast.success(`Completado: ${data.score}/${data.maxScore}`),
    onError: (err) => toast.error(err.message),
  });

  const current = ITEMS[currentIndex];
  const progress = ((currentIndex + (finished ? 1 : 0)) / ITEMS.length) * 100;
  const correctCount = answers.filter(a => a.correct).length;

  const handleSelect = (option: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    setShowExplanation(true);
    const correct = option === current.answer;
    const newAnswers = [...answers, { selected: option, correct }];
    setAnswers(newAnswers);

    setTimeout(() => {
      setShowExplanation(false);
      setSelectedOption(null);
      if (currentIndex + 1 >= ITEMS.length) {
        setFinished(true);
        const score = newAnswers.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 2,
            response: { answers: newAnswers },
            score, maxScore: ITEMS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex(i => i + 1);
      }
    }, 2500);
  };

  if (finished) {
    const pct = Math.round((correctCount / ITEMS.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
          <div className="text-5xl">{correctCount === ITEMS.length ? "🏆" : correctCount >= 4 ? "🎉" : "📚"}</div>
          <h2 className="text-2xl font-bold">¡Juego completado!</h2>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">{pct}%</p>
            <p className="text-xs text-muted-foreground">{correctCount}/{ITEMS.length} correctas</p>
          </div>
          <p className="text-muted-foreground text-sm">
            {pct === 100 ? "¡Conoces perfectamente el laboratorio de gases!" : pct >= 60 ? "Buen trabajo. Repasa los equipos que fallaste." : "Revisa la descripción de cada equipo del laboratorio."}
          </p>
        </motion.div>

        <div className="space-y-3">
          {ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-start gap-3 p-3 rounded-2xl ${answers[i]?.correct ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"}`}
            >
              <span className="text-lg flex-shrink-0">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium line-clamp-2">{item.description}</p>
                <p className="text-xs text-muted-foreground mt-1">✓ {item.answer}</p>
                {!answers[i]?.correct && (
                  <p className="text-xs text-red-500 mt-0.5">Tu respuesta: {answers[i]?.selected}</p>
                )}
              </div>
              {answers[i]?.correct
                ? <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} />
                : <XCircle className="text-red-500 flex-shrink-0" size={18} />
              }
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <Badge className="bg-primary/10 text-primary">Dinámica 2 — Semana 3, Clase 1</Badge>
        <h2 className="text-2xl md:text-3xl font-bold">Identifica el Equipo de Laboratorio</h2>
        <p className="text-sm text-muted-foreground">Lee la descripción y selecciona el equipo correcto</p>
      </motion.div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Equipo {currentIndex + 1} de {ITEMS.length}</span>
          <span>{correctCount} correctas</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-4"
        >
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-4xl">{current.emoji}</div>
              <p className="text-base md:text-lg font-semibold leading-relaxed">{current.description}</p>
              <p className="text-xs text-muted-foreground">¿A qué equipo describe esta función?</p>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {current.options.map((option, i) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === current.answer;
              let state: "default" | "correct" | "wrong" | "missed" = "default";
              if (selectedOption !== null) {
                if (isCorrect) state = "correct";
                else if (isSelected) state = "wrong";
              }
              return (
                <motion.button
                  key={option}
                  whileHover={selectedOption === null ? { scale: 1.01 } : {}}
                  whileTap={selectedOption === null ? { scale: 0.99 } : {}}
                  onClick={() => handleSelect(option)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all flex items-center gap-3 ${
                    state === "correct" ? "bg-green-100 border-green-400 text-green-800 dark:bg-green-950/50 dark:border-green-600 dark:text-green-300" :
                    state === "wrong" ? "bg-red-100 border-red-400 text-red-800 dark:bg-red-950/50 dark:border-red-600 dark:text-red-300" :
                    selectedOption !== null ? "opacity-50 border-border" :
                    "hover:border-primary hover:bg-primary/5 border-border"
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    state === "correct" ? "bg-green-500 text-white" :
                    state === "wrong" ? "bg-red-500 text-white" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {state === "correct" ? "✓" : state === "wrong" ? "✗" : String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className={`border ${selectedOption === current.answer ? "border-green-400 bg-green-50 dark:bg-green-950/30" : "border-red-400 bg-red-50 dark:bg-red-950/30"}`}>
                  <CardContent className="p-4 text-sm">
                    <p className={`font-semibold mb-1 ${selectedOption === current.answer ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                      {selectedOption === current.answer ? "¡Correcto! 🎉" : `Incorrecto — es: ${current.answer} 💡`}
                    </p>
                    <p className="text-muted-foreground">{current.explanation}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

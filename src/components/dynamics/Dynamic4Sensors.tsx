import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Eye, Search, CheckCircle2, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const SENSOR_QUESTIONS = [
  { question: "¿Qué sensor mide la aceleración en una o más direcciones?", answer: "acelerómetro", hints: ["movimiento", "aceleración"], category: "Movimiento" },
  { question: "¿Qué sensor detecta velocidad angular o cambio de orientación?", answer: "giroscopio", hints: ["rotación", "orientación"], category: "Movimiento" },
  { question: "¿Qué sensor mide la fuerza de agarre de la mano?", answer: "dinamómetro", hints: ["fuerza", "jamar"], category: "Fuerza" },
  { question: "¿Qué sensor mide la posición angular o lineal de un eje?", answer: "encoder", hints: ["posición", "eje"], category: "Posición" },
  { question: "¿Qué sensor detecta cambios en la temperatura?", answer: "termistor", hints: ["temperatura", "calor"], category: "Temperatura" },
  { question: "¿Qué sensor mide la presión atmosférica?", answer: "barómetro", hints: ["presión", "atmósfera"], category: "Presión" },
  { question: "¿Qué sensor detecta la intensidad de luz?", answer: "fotodiodo", hints: ["luz", "intensidad"], category: "Luz" },
  { question: "¿Qué sensor detecta gases específicos en el ambiente?", answer: "sensor de gas", hints: ["gas", "químico"], category: "Químico" },
];

export default function Dynamic4Sensors() {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [answers, setAnswers] = useState<{ question: string; userAnswer: string; correct: boolean; hintUsed: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState<boolean | null>(null);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => {
      toast.success(`Resultado: ${data.score}/${data.maxScore} correctas`);
    },
    onError: (err) => toast.error(err.message),
  });

  const checkAnswer = () => {
    const question = SENSOR_QUESTIONS[currentIndex];
    const normalized = userInput.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const answerNorm = question.answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const correct = normalized.includes(answerNorm) || answerNorm.includes(normalized);

    const newAnswer = { question: question.question, userAnswer: userInput, correct, hintUsed: showHint };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setShowResult(correct);

    setTimeout(() => {
      setShowResult(null);
      setUserInput("");
      setShowHint(false);
      if (currentIndex + 1 >= SENSOR_QUESTIONS.length) {
        setFinished(true);
        const correctCount = updatedAnswers.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token,
            dynamicId: 4,
            response: { answers: updatedAnswers },
            score: correctCount,
            maxScore: SENSOR_QUESTIONS.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 1500);
  };

  const correctCount = answers.filter(a => a.correct).length;
  const currentQ = SENSOR_QUESTIONS[currentIndex];

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-3">
          <div className="text-5xl">{correctCount >= 6 ? "🏆" : correctCount >= 4 ? "🎉" : "💪"}</div>
          <h2 className="text-2xl font-bold">
            {correctCount >= 6 ? "¡Experto en sensores!" : correctCount >= 4 ? "¡Buen conocimiento!" : "¡Sigue aprendiendo!"}
          </h2>
          <p className="text-muted-foreground">{correctCount}/{SENSOR_QUESTIONS.length} sensores identificados</p>
        </motion.div>

        <Card>
          <CardContent className="p-4 space-y-2">
            {answers.map((a, i) => {
              const q = SENSOR_QUESTIONS[i];
              return (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${a.correct ? "bg-green-50" : "bg-red-50"}`}>
                  <Badge variant="outline" className="flex-shrink-0 mt-0.5 text-[10px]">{q.category}</Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{q.question}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tu respuesta: "{a.userAnswer}" → Correcto: <strong>{q.answer}</strong>
                      {a.hintUsed && <span className="text-amber-600 ml-1">(con pista)</span>}
                    </p>
                  </div>
                  {a.correct ? <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} /> : <span className="text-red-500 flex-shrink-0 text-sm">✗</span>}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <Badge className="bg-primary/10 text-primary">Dinámica 4</Badge>
        <h2 className="text-2xl md:text-3xl font-bold">Reto de Sensores</h2>
        <p className="text-muted-foreground text-sm">
          Identifica el sensor correcto para cada descripción. Puedes pedir pistas.
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="outline">{currentIndex + 1}/{SENSOR_QUESTIONS.length}</Badge>
          <Badge className="bg-green-100 text-green-800">{correctCount} correctas</Badge>
        </div>
      </motion.div>

      <Card className={`overflow-hidden transition-all ${
        showResult === true ? "ring-4 ring-green-400" :
        showResult === false ? "ring-4 ring-red-400" : ""
      }`}>
        <div className="bg-sidebar text-white p-4">
          <Badge className="bg-white/20 text-white mb-2">{currentQ.category}</Badge>
          <p className="text-lg font-medium">{currentQ.question}</p>
        </div>
        <CardContent className="p-5 space-y-4">
          {showHint && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  <strong>Pistas:</strong> {currentQ.hints.join(", ")}
                </p>
              </div>
            </motion.div>
          )}

          {showResult !== null ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-4">
              {showResult ? (
                <div className="text-green-600">
                  <CheckCircle2 size={48} className="mx-auto mb-2" />
                  <p className="font-bold text-lg">¡Correcto!</p>
                </div>
              ) : (
                <div className="text-red-500">
                  <p className="font-bold text-lg mb-1">Incorrecto</p>
                  <p className="text-sm">La respuesta era: <strong>{currentQ.answer}</strong></p>
                </div>
              )}
            </motion.div>
          ) : (
            <>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    placeholder="Escribe el nombre del sensor..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && userInput.trim() && checkAnswer()}
                    className="pl-9"
                    autoFocus
                  />
                </div>
                <Button
                  onClick={checkAnswer}
                  disabled={!userInput.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send size={16} />
                </Button>
              </div>
              {!showHint && (
                <Button variant="ghost" size="sm" onClick={() => setShowHint(true)} className="text-amber-600 hover:text-amber-700">
                  <Eye size={14} className="mr-1" /> Ver pista
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

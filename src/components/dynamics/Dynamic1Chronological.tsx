import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, CheckCircle2, XCircle, Send, Loader2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const CORRECT_ORDER = ["Fuego", "Bronce", "Imprenta", "Máquina de vapor", "Internet"];
const INITIAL_ITEMS = [
  { id: "imprenta", label: "Imprenta", emoji: "📖", year: "~1440" },
  { id: "fuego", label: "Fuego", emoji: "🔥", year: "~1M a.C." },
  { id: "vapor", label: "Máquina de vapor", emoji: "🚂", year: "~1769" },
  { id: "internet", label: "Internet", emoji: "🌐", year: "~1969" },
  { id: "bronce", label: "Bronce", emoji: "⚔️", year: "~3000 a.C." },
];

export default function Dynamic1Chronological() {
  const { token } = useStudent();
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      setScore(data.score);
      toast.success(`Respuesta registrada: ${data.score}/${data.maxScore} correctas`);
    },
    onError: (err) => toast.error(err.message),
  });

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (submitted) return;
    const newItems = [...items];
    const [moved] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, moved);
    setItems(newItems);
  };

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      moveItem(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleTouchMove = (index: number, direction: "up" | "down") => {
    if (submitted) return;
    const newIndex = direction === "up" ? Math.max(0, index - 1) : Math.min(items.length - 1, index + 1);
    if (newIndex !== index) moveItem(index, newIndex);
  };

  const handleSubmit = () => {
    if (!token) return;
    const userOrder = items.map(i => i.label);
    let correctCount = 0;
    userOrder.forEach((label, idx) => {
      if (label === CORRECT_ORDER[idx]) correctCount++;
    });

    const timeSpent = Date.now() - startTime;
    submitMutation.mutate({
      token,
      dynamicId: 1,
      response: { userOrder, correctOrder: CORRECT_ORDER },
      score: correctCount,
      maxScore: 5,
      timeSpentMs: timeSpent,
    });
  };

  const handleReset = () => {
    setItems([...INITIAL_ITEMS].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <Badge className="bg-primary/10 text-primary">Dinámica 1</Badge>
        <h2 className="text-2xl md:text-3xl font-bold">Reto Cronológico</h2>
        <p className="text-muted-foreground text-sm">
          Ordena estos 5 inventos del más antiguo al más reciente. Arrastra o usa las flechas.
        </p>
      </motion.div>

      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">MÁS ANTIGUO</span>
            <span className="text-xs text-muted-foreground font-medium">MÁS RECIENTE ↓</span>
          </div>
          <AnimatePresence>
            {items.map((item, index) => {
              const isCorrect = submitted && item.label === CORRECT_ORDER[index];


              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  draggable={!submitted}
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    submitted
                      ? isCorrect
                        ? "border-green-400 bg-green-50"
                        : "border-red-300 bg-red-50"
                      : "border-border bg-card hover:border-primary/50 cursor-grab active:cursor-grabbing"
                  }`}
                >
                  <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.label}</p>
                    {submitted && <p className="text-xs text-muted-foreground">{item.year}</p>}
                  </div>
                  {!submitted && (
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleTouchMove(index, "up")}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => handleTouchMove(index, "down")}
                        disabled={index === items.length - 1}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  )}
                  {submitted && (
                    isCorrect
                      ? <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                      : <XCircle className="text-red-500 flex-shrink-0" size={20} />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </CardContent>
      </Card>

      {submitted ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className={score === 5 ? "bg-green-50 border-green-300" : "bg-amber-50 border-amber-300"}>
            <CardContent className="p-5 text-center">
              <div className="text-4xl mb-2">{score === 5 ? "🎉" : score >= 3 ? "👍" : "💪"}</div>
              <h3 className="font-bold text-lg mb-1">
                {score === 5 ? "¡Perfecto!" : score >= 3 ? "¡Buen trabajo!" : "¡Sigue intentando!"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {score}/5 en el orden correcto
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Orden correcto: Fuego → Bronce → Imprenta → Máquina de vapor → Internet
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw size={16} className="mr-1" /> Mezclar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {submitMutation.isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</>
            ) : (
              <><Send size={16} className="mr-1" /> Enviar respuesta</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ROUNDS = [
  { question: "¿Qué cambió más la historia?", optionA: "El fuego", optionB: "La imprenta", emojiA: "🔥", emojiB: "📖" },
  { question: "¿Qué es más importante en el deporte?", optionA: "Hardware", optionB: "Software", emojiA: "🖥️", emojiB: "💻" },
  { question: "¿Sensor más útil para fútbol?", optionA: "Acelerómetro", optionB: "GPS", emojiA: "📊", emojiB: "📍" },
  { question: "¿Dónde se genera más innovación?", optionA: "Laboratorio", optionB: "Campo de juego", emojiA: "🔬", emojiB: "⚽" },
  { question: "¿Qué definirá el futuro del deporte?", optionA: "Inteligencia Artificial", optionB: "Edición genética", emojiA: "🤖", emojiB: "🧬" },
];

export default function Block7Gamificacion() {
  const [currentRound, setCurrentRound] = useState(0);
  const [choices, setChoices] = useState<(string | null)[]>(Array(5).fill(null));

  const handleChoice = (choice: string) => {
    const newChoices = [...choices];
    newChoices[currentRound] = choice;
    setChoices(newChoices);
  };

  const round = ROUNDS[currentRound];
  const answeredCount = choices.filter(c => c !== null).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Gamepad2 size={14} />
          Bloque 7 — Gamificación
        </div>
        <h1 className="text-3xl md:text-5xl font-bold">
          ¿Esto o <span className="text-primary">Aquello</span>?
        </h1>
      </motion.div>

      {/* Round Progress */}
      <div className="flex justify-center gap-2">
        {ROUNDS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentRound(i)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i === currentRound
                ? "bg-primary text-white scale-110 shadow-lg"
                : choices[i] !== null
                ? "bg-green-500 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {choices[i] !== null ? <CheckCircle2 size={16} /> : i + 1}
          </button>
        ))}
      </div>

      {/* Current Round */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRound}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-sidebar text-white p-6 text-center">
                <Badge className="bg-white/20 text-white mb-3">Ronda {currentRound + 1} de 5</Badge>
                <h3 className="text-xl font-bold">{round.question}</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleChoice("A")}
                    className={`p-6 rounded-xl border-2 text-center transition-all hover:shadow-lg ${
                      choices[currentRound] === "A"
                        ? "border-primary bg-primary/10 shadow-lg"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="text-5xl mb-3">{round.emojiA}</p>
                    <p className="font-semibold">{round.optionA}</p>
                    {choices[currentRound] === "A" && (
                      <Badge className="mt-2 bg-primary text-white">Tu elección</Badge>
                    )}
                  </button>
                  <button
                    onClick={() => handleChoice("B")}
                    className={`p-6 rounded-xl border-2 text-center transition-all hover:shadow-lg ${
                      choices[currentRound] === "B"
                        ? "border-primary bg-primary/10 shadow-lg"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="text-5xl mb-3">{round.emojiB}</p>
                    <p className="font-semibold">{round.optionB}</p>
                    {choices[currentRound] === "B" && (
                      <Badge className="mt-2 bg-primary text-white">Tu elección</Badge>
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentRound(Math.max(0, currentRound - 1))}
          disabled={currentRound === 0}
        >
          <ArrowLeft size={16} className="mr-1" /> Anterior
        </Button>
        <span className="text-sm text-muted-foreground">{answeredCount}/5</span>
        <Button
          onClick={() => setCurrentRound(Math.min(4, currentRound + 1))}
          disabled={currentRound === 4}
          className="bg-primary hover:bg-primary/90"
        >
          Siguiente <ArrowRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
}

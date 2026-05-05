import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, BookOpen, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { COURSE_CONFIG } from "@/data/courseConfig";
import { FLASHCARDS_BY_WEEK } from "@/data/achievements";

const WEEK_COLORS: Record<number, string> = {
  1: "from-blue-600 to-indigo-600",
  2: "from-green-600 to-teal-600",
  3: "from-purple-600 to-pink-600",
  4: "from-orange-500 to-red-500",
  5: "from-cyan-500 to-blue-500",
};

function FlipCard({ front, back, category }: { front: string; back: string; category: string }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-full h-56 cursor-pointer"
      style={{ perspective: 1200 }}
      onClick={() => setFlipped(v => !v)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120, damping: 15 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl border border-border bg-card flex flex-col items-center justify-center p-6 text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Badge variant="secondary" className="mb-3 text-xs">{category}</Badge>
          <p className="text-lg font-semibold text-foreground leading-snug">{front}</p>
          <p className="text-xs text-muted-foreground mt-4">Toca para ver la respuesta</p>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl border border-primary/30 bg-primary/5 flex flex-col items-center justify-center p-6 text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <Badge className="mb-3 text-xs">Respuesta</Badge>
          <p className="text-sm text-foreground leading-relaxed">{back}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function Flashcards() {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [unknown, setUnknown] = useState<Set<number>>(new Set());
  const [sessionDone, setSessionDone] = useState(false);

  const weekConfig = selectedWeek ? COURSE_CONFIG.find(w => w.id === selectedWeek) : null;
  const cards = selectedWeek ? (FLASHCARDS_BY_WEEK[selectedWeek] ?? []) : [];
  const currentCard = cards[currentIndex];

  const handleMark = (correct: boolean) => {
    if (!currentCard) return;
    if (correct) setKnown(prev => new Set([...prev, currentCard.id]));
    else setUnknown(prev => new Set([...prev, currentCard.id]));

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setSessionDone(true);
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setKnown(new Set());
    setUnknown(new Set());
    setSessionDone(false);
  };

  if (!selectedWeek) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Modo Repaso</h1>
              <p className="text-sm text-muted-foreground">Flashcards de conceptos clave por semana</p>
            </div>
          </div>

          <div className="grid gap-4">
            {COURSE_CONFIG.map(week => {
              const cards = FLASHCARDS_BY_WEEK[week.id] ?? [];
              return (
                <motion.button
                  key={week.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: week.id * 0.07 }}
                  onClick={() => { setSelectedWeek(week.id); resetSession(); }}
                  className="w-full text-left rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all group"
                >
                  <div className={`bg-gradient-to-r ${WEEK_COLORS[week.id] ?? "from-gray-600 to-gray-700"} p-4`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">{week.title}</h3>
                      <Badge variant="secondary" className="bg-white/20 text-white border-0">
                        {cards.length} tarjetas
                      </Badge>
                    </div>
                    <p className="text-sm text-white/70 mt-1">{week.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (sessionDone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm w-full"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">¡Sesión completada!</h2>
          <p className="text-muted-foreground mb-6">Resultados de la semana {selectedWeek}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-4">
              <p className="text-3xl font-bold text-green-500">{known.size}</p>
              <p className="text-sm text-muted-foreground mt-1">Lo sé bien</p>
            </div>
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-3xl font-bold text-red-500">{unknown.size}</p>
              <p className="text-sm text-muted-foreground mt-1">Repasar más</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full" onClick={resetSession}>
              <RotateCcw size={16} className="mr-2" />
              Repetir esta semana
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setSelectedWeek(null)}>
              <BookOpen size={16} className="mr-2" />
              Elegir otra semana
            </Button>
            <Link href="/">
              <Button variant="ghost" className="w-full">
                <ArrowLeft size={16} className="mr-2" />
                Volver al inicio
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSelectedWeek(null)}>
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h2 className="font-semibold text-sm">{weekConfig?.title}</h2>
              <p className="text-xs text-muted-foreground">{currentIndex + 1} / {cards.length}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={resetSession} title="Reiniciar">
            <RotateCcw size={16} />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-1.5 mb-6">
          <motion.div
            className={`h-1.5 rounded-full bg-gradient-to-r ${WEEK_COLORS[selectedWeek] ?? "from-primary to-primary"}`}
            animate={{ width: `${((currentIndex) / cards.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Scores */}
        <div className="flex gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-sm text-green-500">
            <Check size={14} />
            <span>{known.size}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-red-400">
            <X size={14} />
            <span>{unknown.size}</span>
          </div>
        </div>

        {/* Card */}
        {currentCard && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
            >
              <FlipCard front={currentCard.front} back={currentCard.back} category={currentCard.category} />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1 border-red-500/50 text-red-500 hover:bg-red-500/10"
            onClick={() => handleMark(false)}
          >
            <X size={16} className="mr-2" />
            Repasar
          </Button>
          <Button
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            onClick={() => handleMark(true)}
          >
            <Check size={16} className="mr-2" />
            Lo sé
          </Button>
        </div>

        {/* Navigate */}
        <div className="flex justify-between mt-4">
          <Button
            variant="ghost"
            size="sm"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
          >
            <ChevronLeft size={16} className="mr-1" />
            Anterior
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={currentIndex >= cards.length - 1}
            onClick={() => setCurrentIndex(i => Math.min(cards.length - 1, i + 1))}
          >
            Siguiente
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const CATEGORIES = ["Excelente", "Bueno", "Promedio", "Por debajo del promedio", "Deficiente"] as const;
type Category = typeof CATEGORIES[number];

const PROFILES: {
  emoji: string;
  name: string;
  age: number;
  sport: string;
  vo2: number;
  answer: Category;
  options: Category[];
  explanation: string;
}[] = [
  {
    emoji: "🏃",
    name: "Carlos",
    age: 28,
    sport: "Corredor amateur",
    vo2: 52,
    answer: "Bueno",
    options: ["Excelente", "Bueno", "Promedio", "Deficiente"],
    explanation: "Con 52 ml/kg/min, Carlos supera el umbral promedio y se sitúa en la categoría 'Bueno' (45-55) para hombres de su edad. Refleja un entrenamiento aeróbico consistente.",
  },
  {
    emoji: "🚴‍♀️",
    name: "María",
    age: 35,
    sport: "Ciclista élite",
    vo2: 72,
    answer: "Excelente",
    options: ["Excelente", "Bueno", "Promedio", "Por debajo del promedio"],
    explanation: "72 ml/kg/min es un valor élite para mujeres (>50 = Excelente). Ciclistas de alto rendimiento pueden alcanzar valores comparables a los de los hombres con entrenamiento específico.",
  },
  {
    emoji: "💼",
    name: "Pedro",
    age: 45,
    sport: "Oficinista sedentario",
    vo2: 28,
    answer: "Deficiente",
    options: ["Promedio", "Por debajo del promedio", "Deficiente", "Bueno"],
    explanation: "28 ml/kg/min está por debajo de 30 ml/kg/min, umbral de la categoría 'Deficiente'. El sedentarismo crónico reduce la capacidad cardiorrespiratoria de forma significativa.",
  },
  {
    emoji: "🏊‍♀️",
    name: "Ana",
    age: 22,
    sport: "Nadadora universitaria",
    vo2: 47,
    answer: "Bueno",
    options: ["Excelente", "Bueno", "Promedio", "Por debajo del promedio"],
    explanation: "47 ml/kg/min cae en el rango 'Bueno' (45-55 para hombres; para mujeres jóvenes 40-50 es equivalente). Refleja la alta demanda aeróbica de la natación competitiva.",
  },
  {
    emoji: "🏅",
    name: "Roberto",
    age: 30,
    sport: "Triatleta",
    vo2: 65,
    answer: "Excelente",
    options: ["Excelente", "Bueno", "Promedio", "Por debajo del promedio"],
    explanation: "65 ml/kg/min supera claramente el umbral de 55 ml/kg/min para 'Excelente'. Los triatletas desarrollan una extraordinaria capacidad aeróbica por combinar tres disciplinas de resistencia.",
  },
  {
    emoji: "🚶‍♀️",
    name: "Laura",
    age: 50,
    sport: "Caminante recreativa",
    vo2: 35,
    answer: "Promedio",
    options: ["Bueno", "Promedio", "Por debajo del promedio", "Deficiente"],
    explanation: "35 ml/kg/min es 'Promedio' (38-45 en hombres; para mujeres de 50 años 33-38 es promedio). La caminata regular mantiene una capacidad aeróbica funcional para la vida cotidiana.",
  },
];

const CATEGORY_COLORS: Record<Category, string> = {
  "Excelente":               "bg-emerald-500 text-white border-emerald-500",
  "Bueno":                   "bg-blue-500 text-white border-blue-500",
  "Promedio":                "bg-yellow-500 text-white border-yellow-500",
  "Por debajo del promedio": "bg-orange-500 text-white border-orange-500",
  "Deficiente":              "bg-red-500 text-white border-red-500",
};

const CATEGORY_HOVER: Record<Category, string> = {
  "Excelente":               "hover:bg-emerald-50 hover:border-emerald-400 dark:hover:bg-emerald-950/30",
  "Bueno":                   "hover:bg-blue-50 hover:border-blue-400 dark:hover:bg-blue-950/30",
  "Promedio":                "hover:bg-yellow-50 hover:border-yellow-400 dark:hover:bg-yellow-950/30",
  "Por debajo del promedio": "hover:bg-orange-50 hover:border-orange-400 dark:hover:bg-orange-950/30",
  "Deficiente":              "hover:bg-red-50 hover:border-red-400 dark:hover:bg-red-950/30",
};

interface Props { weekId?: number; classId?: number; }

export default function S3C1_Dynamic3InterpretaVO2({ weekId = 3, classId = 1 }: Props) {
  const { token } = useStudent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<Category | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<{ selected: string; correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const submitMutation = trpc.dynamics.submit.useMutation({
    onSuccess: (data) => toast.success(`Completado: ${data.score}/${data.maxScore}`),
    onError: (err) => toast.error(err.message),
  });

  const current = PROFILES[currentIndex];
  const progress = ((currentIndex + (finished ? 1 : 0)) / PROFILES.length) * 100;
  const correctCount = answers.filter(a => a.correct).length;

  const handleSelect = (option: Category) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    setShowExplanation(true);
    const correct = option === current.answer;
    const newAnswers = [...answers, { selected: option, correct }];
    setAnswers(newAnswers);

    setTimeout(() => {
      setShowExplanation(false);
      setSelectedOption(null);
      if (currentIndex + 1 >= PROFILES.length) {
        setFinished(true);
        const score = newAnswers.filter(a => a.correct).length;
        if (token) {
          submitMutation.mutate({
            token, weekId, classId, dynamicId: 3,
            response: { answers: newAnswers },
            score, maxScore: PROFILES.length,
            timeSpentMs: Date.now() - startTime,
          });
        }
      } else {
        setCurrentIndex(i => i + 1);
      }
    }, 2500);
  };

  if (finished) {
    const pct = Math.round((correctCount / PROFILES.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
          <div className="text-5xl">{correctCount === PROFILES.length ? "🏆" : correctCount >= 4 ? "🎉" : "📚"}</div>
          <h2 className="text-2xl font-bold">Clasificación completada</h2>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">{pct}%</p>
            <p className="text-xs text-muted-foreground">{correctCount}/{PROFILES.length} correctas</p>
          </div>
          <p className="text-muted-foreground text-sm">
            {pct === 100 ? "¡Dominas la interpretación del VO₂ Máx!" : pct >= 60 ? "Buen trabajo. Revisa los rangos de clasificación." : "Estudia la tabla de categorías por sexo y edad."}
          </p>
        </motion.div>

        <div className="space-y-3">
          {PROFILES.map((profile, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-start gap-3 p-3 rounded-2xl ${answers[i]?.correct ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"}`}
            >
              <span className="text-2xl flex-shrink-0">{profile.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold">{profile.name}, {profile.age} años — VO₂: {profile.vo2} ml/kg/min</p>
                <p className="text-xs text-muted-foreground mt-0.5">✓ {profile.answer}</p>
                {!answers[i]?.correct && (
                  <p className="text-xs text-red-500">Tu respuesta: {answers[i]?.selected}</p>
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
        <Badge className="bg-primary/10 text-primary">Dinámica 3 — Semana 3, Clase 1</Badge>
        <h2 className="text-2xl md:text-3xl font-bold">Interpreta el VO₂ Máx</h2>
        <p className="text-sm text-muted-foreground">Clasifica a cada atleta según su capacidad aeróbica</p>
      </motion.div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Perfil {currentIndex + 1} de {PROFILES.length}</span>
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
              <div className="text-5xl">{current.emoji}</div>
              <div>
                <p className="text-lg font-bold">{current.name}, {current.age} años</p>
                <p className="text-sm text-muted-foreground">{current.sport}</p>
              </div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2">
                <span className="text-2xl font-bold">{current.vo2}</span>
                <span className="text-sm font-medium">ml/kg/min VO₂ Máx</span>
              </div>
              <p className="text-xs text-muted-foreground">¿En qué categoría clasificarías a este atleta?</p>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {current.options.map((option) => {
              const isCorrect = option === current.answer;
              const isSelected = selectedOption === option;
              let state: "default" | "correct" | "wrong" = "default";
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
                    `border-border ${CATEGORY_HOVER[option]}`
                  }`}
                >
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${
                    state === "correct" ? "bg-green-500 text-white" :
                    state === "wrong" ? "bg-red-500 text-white" :
                    CATEGORY_COLORS[option]
                  }`}>
                    {state === "correct" ? "✓" : state === "wrong" ? "✗" : option[0]}
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
                      {selectedOption === current.answer ? "¡Correcto! 🎉" : `Incorrecto — categoría: ${current.answer} 💡`}
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

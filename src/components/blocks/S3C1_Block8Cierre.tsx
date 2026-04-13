import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Flag,
  Send,
  Loader2,
  CheckCircle2,
  Sparkles,
  Wind,
  BarChart3,
  HeartPulse,
  FlaskConical,
  GraduationCap,
  Quote,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const TAKEAWAYS = [
  {
    num: "01",
    icon: FlaskConical,
    color: "text-primary",
    bgColor: "bg-primary/10",
    border: "border-t-primary",
    text: "El laboratorio de gases es el gold standard — mide el VO₂ real respiración a respiración con precisión de ±1–3%.",
  },
  {
    num: "02",
    icon: BarChart3,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    border: "border-t-emerald-500",
    text: "Los valores de referencia dependen del sexo, edad y deporte. Ciclistas élite superan los 85 ml/kg/min.",
  },
  {
    num: "03",
    icon: Wind,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    border: "border-t-amber-500",
    text: "El VO₂ Máx declina ~1% anual tras los 25 sin entrenamiento. El ejercicio puede revertirlo hasta un 25%.",
  },
  {
    num: "04",
    icon: HeartPulse,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    border: "border-t-red-500",
    text: "5 zonas de entrenamiento basadas en % VO₂ Máx permiten prescribir esfuerzo con precisión. El HIIT 4×4 es el protocolo más eficaz.",
  },
];

export default function S3C1_Block8Cierre() {
  const { token } = useStudent();
  const [reflectionText, setReflectionText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitReflection = trpc.reflection.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("¡Reflexión guardada!");
    },
    onError: (err) => {
      toast.error(err.message || "Error al enviar la reflexión");
    },
  });

  const handleSubmit = () => {
    if (!token || reflectionText.trim().length < 5) {
      toast.error("Escribe al menos una oración antes de enviar");
      return;
    }
    submitReflection.mutate({
      token,
      weekId: 3,
      classId: 1,
      text: reflectionText.trim(),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Flag size={14} />
          Bloque 8 — Cierre y Reflexión
        </div>
        <h1 className="text-3xl md:text-5xl font-bold">
          Lo que <span className="text-primary">aprendiste</span> hoy
        </h1>
      </motion.div>

      {/* Key takeaways */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TAKEAWAYS.map((item, i) => (
          <motion.div
            key={item.num}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.14, type: "spring", stiffness: 90 }}
            whileHover={{ y: -3 }}
          >
            <Card className={`h-full text-center border-t-4 ${item.border} hover:shadow-md transition-shadow`}>
              <CardContent className="p-5 space-y-3">
                <div className={`p-2 rounded-lg ${item.bgColor} w-fit mx-auto`}>
                  <item.icon className={item.color} size={24} />
                </div>
                <p className="text-xs text-muted-foreground font-mono">{item.num}</p>
                <p className="text-sm font-medium leading-snug">{item.text}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-8 md:p-12 text-center space-y-4">
            <Quote className="mx-auto text-white/25" size={44} />
            <blockquote className="text-xl md:text-2xl font-bold text-white leading-relaxed max-w-2xl mx-auto">
              "El VO₂ Máx no es el destino — es el motor. La forma en que entrenas
              ese motor determina lo lejos que puedes llegar."
            </blockquote>
            <p className="text-white/45 text-sm">— Ciencias del Ejercicio</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Technologies covered */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-center text-base">Conceptos y herramientas de esta clase</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: "Vyntus CPX", color: "bg-primary/10 text-primary border-primary/30" },
                { label: "Cosmed K5", color: "bg-primary/10 text-primary border-primary/30" },
                { label: "Protocolo Bruce", color: "bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-950/30 dark:text-violet-300" },
                { label: "RQ / VE", color: "bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950/30 dark:text-cyan-300" },
                { label: "Zonas 1–5", color: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-300" },
                { label: "Karvonen", color: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/30 dark:text-amber-300" },
                { label: "HIIT 4×4", color: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/30 dark:text-red-300" },
              ].map((tech, i) => (
                <motion.div
                  key={tech.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.05 + i * 0.08 }}
                >
                  <Badge variant="outline" className={`text-sm px-3 py-1 ${tech.color}`}>
                    {tech.label}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reflection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-primary" size={20} />
              <h3 className="font-bold">Tu reflexión</h3>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-5"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-600" size={22} />
                  <span className="font-semibold text-green-800 dark:text-green-300">
                    ¡Reflexión guardada con éxito!
                  </span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-400 mt-2 italic">
                  "{reflectionText}"
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <Textarea
                  placeholder="¿Qué fue lo que más te impactó sobre el VO₂ Máx y cómo lo aplicarías en tu práctica profesional?"
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <Button
                  onClick={handleSubmit}
                  disabled={submitReflection.isPending || reflectionText.trim().length < 5}
                  className="bg-primary hover:bg-primary/90 rounded-full"
                >
                  {submitReflection.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar reflexión
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Next class teaser */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.45 }}
        whileHover={{ y: -2 }}
      >
        <Card className="border-dashed border-primary/40 bg-primary/3">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 flex-shrink-0">
              <span className="text-2xl">❤️‍🩺</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Próxima clase</p>
              <p className="font-bold text-base">Electrocardiografía Deportiva</p>
              <p className="text-sm text-muted-foreground">
                Interpretación del ECG de reposo y esfuerzo en deportistas · Semana 3 · Clase 2
              </p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground flex-shrink-0" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Credits */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.65 }}
      >
        <Card className="border-dashed">
          <CardContent className="p-6 text-center space-y-3">
            <GraduationCap className="mx-auto text-muted-foreground" size={28} />
            <div className="space-y-1">
              <p className="text-sm font-medium">Nuevas Tecnologías en Actividad Física y Deporte</p>
              <p className="text-xs text-muted-foreground font-semibold">
                Semana 3 · Clase 1 — VO₂ Máx completada ✓
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className="text-xs">UPC</Badge>
              <span className="text-xs text-muted-foreground">
                Universidad Peruana de Ciencias Aplicadas — Lima, Perú
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

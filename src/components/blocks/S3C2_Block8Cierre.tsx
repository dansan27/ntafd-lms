import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  GraduationCap, Send, Loader2, CheckCircle2, Sparkles,
  Activity, GitBranch, Heart, Smartphone, Quote, Gamepad2, Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useStudent } from "@/contexts/StudentContext";
import { toast } from "sonner";
import S3_Dynamic4ComparaDispositivo from "../dynamics/S3_Dynamic4ComparaDispositivo";

const TAKEAWAYS = [
  {
    num: "01",
    icon: Activity,
    color: "text-primary",
    bg: "bg-primary/10",
    text: "El ECG registra la actividad eléctrica del corazón. Cada derivación es una perspectiva diferente: 12 en clínica, 1-3 en deporte.",
  },
  {
    num: "02",
    icon: GitBranch,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    text: "El tamizaje con ECG en atletas detecta el 60-70% de condiciones de riesgo de muerte súbita antes de que ocurra un evento.",
  },
  {
    num: "03",
    icon: Heart,
    color: "text-red-500",
    bg: "bg-red-500/10",
    text: "La HRV (variabilidad de FC) refleja el estado del sistema nervioso autónomo. RMSSD alto = parasimpático = recuperación.",
  },
  {
    num: "04",
    icon: Smartphone,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    text: "El ecosistema va desde el AD8232 de $10 hasta el KardiaMobile aprobado por la FDA — cada contexto tiene su herramienta.",
  },
];

const TECH_BADGES = [
  { label: "ECG / EKG", color: "bg-primary/10 text-primary border-primary/30" },
  { label: "12 Derivaciones", color: "bg-red-100 text-red-800 border-red-300" },
  { label: "HRV / RMSSD", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { label: "Polar H10", color: "bg-cyan-100 text-cyan-800 border-cyan-300" },
  { label: "AD8232", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { label: "KardiaMobile", color: "bg-violet-100 text-violet-800 border-violet-300" },
  { label: "Apple Watch ECG", color: "bg-slate-100 text-slate-800 border-slate-300" },
  { label: "Derivación II", color: "bg-orange-100 text-orange-800 border-orange-300" },
];

export default function S3C2_Block8Cierre() {
  const { token } = useStudent();
  const [reflectionText, setReflectionText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [analysis, setAnalysis] = useState<{ sentiment: string | null; keywords: string[] } | null>(null);

  // Dynamic 4 activation
  const [, params] = useRoute("/week/:week/class/:class");
  const classId = params ? parseInt(params.class, 10) : 2;
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 3, classId },
    { refetchInterval: 3000 }
  );
  const isDynamic4Active = statuses?.find((s) => s.dynamicId === 4)?.isActive ?? false;

  // Reflection submit
  const submitReflection = trpc.reflection.submit.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      setAnalysis({ sentiment: data.sentiment ?? null, keywords: data.keywords ?? [] });
      toast.success("Reflexión enviada");
    },
    onError: (err) => toast.error(err.message || "Error al enviar"),
  });

  const { data: existingReflection } = trpc.reflection.mine.useQuery(
    { token: token ?? "" },
    { enabled: !!token }
  );

  const handleSubmit = () => {
    if (!token || reflectionText.trim().length < 5) {
      toast.error("Escribe al menos una oración");
      return;
    }
    submitReflection.mutate({ token, text: reflectionText.trim() });
  };

  const hasExisting = existingReflection || submitted;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <GraduationCap size={14} />
          Bloque 8 — Cierre y Reflexión
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Lo que aprendiste{" "}
          <span className="text-primary">hoy</span>
        </h1>
      </motion.div>

      {/* Key takeaways */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TAKEAWAYS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.12 }}
            whileHover={{ y: -3 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow border-t-4 border-t-primary/20">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${item.bg}`}>
                    <item.icon className={item.color} size={20} />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{item.num}</span>
                </div>
                <p className="text-sm font-medium leading-relaxed">{item.text}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-6 md:p-10 text-center space-y-4">
            <Quote className="mx-auto text-white/20" size={36} />
            <blockquote className="text-xl md:text-2xl font-bold text-white leading-relaxed max-w-2xl mx-auto">
              "El ECG no es solo un examen — es la escritura eléctrica del corazón. En el deporte, saber leerlo puede salvar vidas."
            </blockquote>
            <p className="text-white/40 text-sm">— Cardiología del Deporte</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Technologies explored */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-primary/20">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-center">Tecnologías y conceptos explorados hoy</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {TECH_BADGES.map((tech, i) => (
                <motion.div
                  key={tech.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0 + i * 0.07 }}
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

      {/* Dynamic 4 section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05 }}
      >
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            {isDynamic4Active ? (
              <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
                <Gamepad2 size={14} /> Dinámica 4 Activa
              </Badge>
            ) : (
              <Button variant="outline" disabled className="gap-2 opacity-60">
                <Lock size={14} />
                El profesor activará esta dinámica
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isDynamic4Active && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <S3_Dynamic4ComparaDispositivo />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Reflection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-primary" size={20} />
              <h3 className="font-bold">Tu reflexión final</h3>
            </div>

            {hasExisting ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="text-green-600" size={20} />
                  <span className="font-semibold text-green-800">¡Reflexión enviada!</span>
                </div>
                {analysis && (
                  <div className="space-y-2">
                    {analysis.sentiment && (
                      <p className="text-sm text-green-700">
                        Sentimiento:{" "}
                        <Badge className="bg-green-100 text-green-800">{analysis.sentiment}</Badge>
                      </p>
                    )}
                    {analysis.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.keywords.map((kw, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-green-300 text-green-700">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {existingReflection && !analysis && (
                  <p className="text-sm text-green-700 italic">"{existingReflection.reflectionText}"</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <Textarea
                  placeholder="¿Qué te sorprendió más del ECG deportivo — la detección de riesgo cardíaco, la HRV, o la variedad de dispositivos disponibles?"
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  rows={3}
                  className="resize-none rounded-xl"
                />
                <Button
                  onClick={handleSubmit}
                  disabled={submitReflection.isPending || reflectionText.trim().length < 5}
                  className="bg-primary hover:bg-primary/90"
                >
                  {submitReflection.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analizando...
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

      {/* Credits */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <Card className="border-dashed">
          <CardContent className="p-6 text-center space-y-3">
            <GraduationCap className="mx-auto text-muted-foreground" size={28} />
            <h4 className="font-bold text-sm">Créditos</h4>
            <div className="space-y-1">
              <p className="text-sm font-medium">Nuevas Tecnologías en Actividad Física y Deporte</p>
              <p className="text-xs text-muted-foreground">Semana 3 · Clase 2 — ECG Deportivo completada</p>
              <p className="text-xs text-muted-foreground">Mg. Jose Luis Carrion</p>
            </div>
            <motion.div
              className="mt-3 p-3 rounded-2xl bg-primary/5 border border-primary/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6 }}
            >
              <p className="text-sm font-bold text-primary">¡Has completado la Semana 3 completa!</p>
              <p className="text-xs text-muted-foreground mt-1">
                Capacidad Cardiovascular · VO₂ Máx · ECG Deportivo
              </p>
            </motion.div>
            <div className="flex items-center justify-center gap-2 mt-2">
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

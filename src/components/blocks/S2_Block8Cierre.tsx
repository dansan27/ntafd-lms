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
  Scan,
  Zap,
  Ruler,
  Smartphone,
  GraduationCap,
  Quote,
} from "lucide-react";
import { motion } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function S2_Block8Cierre() {
  const { token } = useStudent();
  const [reflectionText, setReflectionText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [analysis, setAnalysis] = useState<{
    sentiment: string | null;
    keywords: string[];
  } | null>(null);

  const submitReflection = trpc.reflection.submit.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      setAnalysis({
        sentiment: data.sentiment ?? null,
        keywords: data.keywords ?? [],
      });
      toast.success("Reflexion enviada");
    },
    onError: (err) => {
      toast.error(err.message || "Error al enviar");
    },
  });

  const { data: existingReflection } = trpc.reflection.mine.useQuery(
    { token: token ?? "" },
    { enabled: !!token }
  );

  const handleSubmit = () => {
    if (!token || reflectionText.trim().length < 5) {
      toast.error("Escribe al menos una oracion");
      return;
    }
    submitReflection.mutate({ token, text: reflectionText.trim() });
  };

  const hasExisting = existingReflection || submitted;

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
          Bloque 8 — Cierre y Reflexion
        </div>
        <h1 className="text-3xl md:text-5xl font-bold">
          Cierre y <span className="text-primary">Reflexion</span>
        </h1>
      </motion.div>

      {/* Key takeaways */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            num: "01",
            icon: Ruler,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            text: "La composicion corporal va mas alla del peso: grasa, musculo, hueso y agua",
          },
          {
            num: "02",
            icon: Scan,
            color: "text-cyan-500",
            bgColor: "bg-cyan-500/10",
            text: "Metodos directos (DEXA, Bod Pod) son precisos pero costosos; los indirectos son mas accesibles",
          },
          {
            num: "03",
            icon: Zap,
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10",
            text: "La bioimpedancia (BIA) es rapida y accesible, pero sensible a la hidratacion",
          },
          {
            num: "04",
            icon: Smartphone,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
            text: "Tecnologias como ZOZOFIT democratizan la evaluacion corporal con un smartphone",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
          >
            <Card className="h-full text-center border-t-4 border-t-primary hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div
                  className={`p-2 rounded-lg ${item.bgColor} w-fit mx-auto`}
                >
                  <item.icon className={item.color} size={24} />
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  {item.num}
                </p>
                <p className="text-sm font-medium">{item.text}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Einstein Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-6 md:p-10 text-center space-y-4">
            <Quote className="mx-auto text-white/30" size={40} />
            <blockquote className="text-xl md:text-2xl font-bold text-white leading-relaxed max-w-2xl mx-auto">
              "No todo lo que se puede contar cuenta, y no todo lo que cuenta se
              puede contar."
            </blockquote>
            <p className="text-white/50 text-sm">— Albert Einstein</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Technologies summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-center text-lg">
              Tecnologias exploradas hoy
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                {
                  label: "DEXA",
                  color: "bg-purple-100 text-purple-800 border-purple-300",
                },
                {
                  label: "Bod Pod",
                  color: "bg-cyan-100 text-cyan-800 border-cyan-300",
                },
                {
                  label: "Antropometria",
                  color: "bg-amber-100 text-amber-800 border-amber-300",
                },
                {
                  label: "BIA",
                  color: "bg-yellow-100 text-yellow-800 border-yellow-300",
                },
                {
                  label: "ZOZOFIT",
                  color: "bg-emerald-100 text-emerald-800 border-emerald-300",
                },
              ].map((tech, i) => (
                <motion.div
                  key={tech.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + i * 0.1 }}
                >
                  <Badge
                    variant="outline"
                    className={`text-sm px-3 py-1 ${tech.color}`}
                  >
                    {tech.label}
                  </Badge>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Cada metodo tiene su lugar: la clave es elegir el adecuado segun
              el objetivo, el presupuesto y la poblacion.
            </p>
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
              <h3 className="font-bold">Tu reflexion</h3>
            </div>

            {hasExisting ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="text-green-600" size={20} />
                  <span className="font-semibold text-green-800">Enviada</span>
                </div>
                {analysis && (
                  <div className="space-y-2">
                    {analysis.sentiment && (
                      <p className="text-sm text-green-700">
                        Sentimiento:{" "}
                        <Badge className="bg-green-100 text-green-800">
                          {analysis.sentiment}
                        </Badge>
                      </p>
                    )}
                    {analysis.keywords && analysis.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.keywords.map((kw, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs border-green-300 text-green-700"
                          >
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {existingReflection && !analysis && (
                  <p className="text-sm text-green-700 italic">
                    "{existingReflection.reflectionText}"
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <Textarea
                  placeholder="¿Que fue lo que mas te impacto sobre la composicion corporal y las tecnologias que aprendimos hoy?"
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <Button
                  onClick={handleSubmit}
                  disabled={
                    submitReflection.isPending ||
                    reflectionText.trim().length < 5
                  }
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
                      Enviar
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
        transition={{ delay: 1.5 }}
      >
        <Card className="border-dashed">
          <CardContent className="p-6 text-center space-y-3">
            <GraduationCap
              className="mx-auto text-muted-foreground"
              size={28}
            />
            <h4 className="font-bold text-sm">Creditos</h4>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Nuevas Tecnologias en Actividad Fisica y Deporte
              </p>
              <p className="text-xs text-muted-foreground">
                Semana 2 — Composicion Corporal en el Deporte
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                UPC
              </Badge>
              <span className="text-xs text-muted-foreground">
                Universidad Peruana de Ciencias Aplicadas — Lima, Peru
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

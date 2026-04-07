import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Flag, Send, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Block8Cierre() {
  const { token } = useStudent();
  const [reflectionText, setReflectionText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [analysis, setAnalysis] = useState<{ sentiment: string | null; keywords: string[] } | null>(null);

  const submitReflection = trpc.reflection.submit.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      setAnalysis({ sentiment: data.sentiment ?? null, keywords: data.keywords ?? [] });
      toast.success("Reflexión enviada");
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
      toast.error("Escribe al menos una oración");
      return;
    }
    submitReflection.mutate({ token, text: reflectionText.trim() });
  };

  const hasExisting = existingReflection || submitted;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Flag size={14} />
          Bloque 8 — Cierre
        </div>
        <h1 className="text-3xl md:text-5xl font-bold">
          Lo que aprendimos <span className="text-primary">hoy</span>
        </h1>
      </motion.div>

      {/* 3 Key Takeaways - visual, no paragraphs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { num: "01", text: "Tecnología transforma materia, energía o información", icon: "⚡" },
          { num: "02", text: "Cada tecnología está hecha de tecnologías más pequeñas", icon: "🧩" },
          { num: "03", text: "Sin sensores no hay datos, sin datos no hay decisiones", icon: "📡" },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.15 }}>
            <Card className="h-full text-center border-t-4 border-t-primary">
              <CardContent className="p-5">
                <p className="text-3xl mb-2">{item.icon}</p>
                <p className="text-xs text-muted-foreground font-mono mb-1">{item.num}</p>
                <p className="text-sm font-medium">{item.text}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Reflection - functional, minimal text */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-primary" size={20} />
              <h3 className="font-bold">Tu reflexión</h3>
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
                        Sentimiento: <Badge className="bg-green-100 text-green-800">{analysis.sentiment}</Badge>
                      </p>
                    )}
                    {analysis.keywords && analysis.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.keywords.map((kw, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-green-300 text-green-700">{kw}</Badge>
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
                  placeholder="¿Qué fue lo que más te impactó hoy?"
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <Button
                  onClick={handleSubmit}
                  disabled={submitReflection.isPending || reflectionText.trim().length < 5}
                  className="bg-primary hover:bg-primary/90"
                >
                  {submitReflection.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analizando...</>
                  ) : (
                    <><Send className="mr-2 h-4 w-4" />Enviar</>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

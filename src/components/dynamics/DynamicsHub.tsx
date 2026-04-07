import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Cpu, Activity, Eye, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";

import Dynamic1Chronological from "./Dynamic1Chronological";
import Dynamic2HardwareSoftware from "./Dynamic2HardwareSoftware";
import Dynamic3ClassifyAction from "./Dynamic3ClassifyAction";
import Dynamic4Sensors from "./Dynamic4Sensors";

const DYNAMICS = [
  { id: 1, title: "Reto Cronológico", desc: "Ordena 5 inventos del más antiguo al más reciente", icon: Clock, color: "bg-amber-500" },
  { id: 2, title: "Hardware vs Software", desc: "Clasifica 8 elementos lo más rápido posible", icon: Cpu, color: "bg-blue-600" },
  { id: 3, title: "Clasifica la Acción", desc: "¿Actividad Física, Ejercicio o Ninguno?", icon: Activity, color: "bg-green-600" },
  { id: 4, title: "Reto de Sensores", desc: "Identifica el sensor correcto para cada descripción", icon: Eye, color: "bg-purple-600" },
];

export default function DynamicsHub() {
  const [activeDynamic, setActiveDynamic] = useState<number | null>(null);
  const { token } = useStudent();

  const { data: myResponses } = trpc.dynamics.myResponses.useQuery(
    { token: token ?? "" },
    { enabled: !!token }
  );

  const completedSet = new Set(myResponses?.map(r => r.dynamicId) ?? []);

  if (activeDynamic !== null) {
    return (
      <div>
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <Button variant="ghost" size="sm" onClick={() => setActiveDynamic(null)}>
            <ArrowLeft size={16} className="mr-1" /> Volver a dinámicas
          </Button>
        </div>
        {activeDynamic === 1 && <Dynamic1Chronological />}
        {activeDynamic === 2 && <Dynamic2HardwareSoftware />}
        {activeDynamic === 3 && <Dynamic3ClassifyAction />}
        {activeDynamic === 4 && <Dynamic4Sensors />}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold">Dinámicas Interactivas</h2>
        <p className="text-muted-foreground text-sm">
          Completa las 4 dinámicas para poner a prueba lo aprendido. Tus respuestas quedan registradas.
        </p>
        <Badge variant="outline">{completedSet.size}/4 completadas</Badge>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4">
        {DYNAMICS.map((d, i) => {
          const completed = completedSet.has(d.id);
          const response = myResponses?.find(r => r.dynamicId === d.id);
          return (
            <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <button
                type="button"
                className="w-full text-left"
                onClick={() => setActiveDynamic(d.id)}
              >
                <Card className={`cursor-pointer hover:shadow-lg transition-all ${completed ? "border-green-300 bg-green-50/50" : "hover:border-primary/50"}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg ${d.color} text-white flex items-center justify-center`}>
                        <d.icon size={20} />
                      </div>
                      {completed && <CheckCircle2 className="text-green-600" size={20} />}
                    </div>
                    <h3 className="font-bold text-sm mb-1">{d.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{d.desc}</p>
                    {completed && response && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Puntaje: {response.score}/{response.maxScore}
                      </Badge>
                    )}
                    {!completed && (
                      <Badge variant="outline" className="text-xs">Pendiente</Badge>
                    )}
                  </CardContent>
                </Card>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

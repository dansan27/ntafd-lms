import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FlaskConical,
  Lock,
  Gamepad2,
  Waves,
  Microscope,
  ScanLine,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import S2_Dynamic1MetodoClasifica from "../dynamics/S2_Dynamic1MetodoClasifica";

interface MetodoData {
  id: string;
  title: string;
  icon: typeof FlaskConical;
  tipo: "directo" | "indirecto";
  color: string;
  bgColor: string;
  borderColor: string;
  desc: string;
  principio: string;
  ventajas: string[];
  limitaciones: string[];
}

const METODOS: MetodoData[] = [
  {
    id: "diseccion",
    title: "Disección Cadavérica",
    icon: Microscope,
    tipo: "directo",
    color: "text-stone-500",
    bgColor: "bg-stone-500/10",
    borderColor: "border-stone-500/30",
    desc: "Separación física de los tejidos corporales para pesarlos individualmente.",
    principio: "Se separan y pesan directamente los tejidos: grasa, músculo, hueso, órganos. Es el único método verdaderamente directo.",
    ventajas: [
      "Máxima precisión: medición real de cada componente",
      "Sirve como referencia (gold standard) para validar otros métodos",
    ],
    limitaciones: [
      "Solo aplicable en cadáveres — no se usa en personas vivas",
      "Importancia teórica y de referencia, no práctica clínica",
    ],
  },
  {
    id: "hidro",
    title: "Pesaje Hidrostático",
    icon: Waves,
    tipo: "indirecto",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    desc: "Medición de la densidad corporal mediante inmersión en agua.",
    principio: "Basado en el Principio de Arquímedes: el cuerpo sumergido desplaza un volumen de agua igual a su volumen. Comparando el peso en aire vs. agua se calcula la densidad corporal.",
    ventajas: [
      "Alta precisión — fue considerado el gold standard durante décadas",
      "Base científica sólida y bien establecida",
      "Permite estimar porcentaje de grasa con ecuaciones validadas",
    ],
    limitaciones: [
      "Requiere inmersión completa y exhalación máxima del sujeto",
      "Equipamiento especializado: tanque de agua, báscula sumergible",
      "Incómodo para algunas personas (claustrofobia, miedo al agua)",
    ],
  },
];

export default function S2_Block4Metodos() {
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);

  // Poll dynamic status every 3 seconds
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 2, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic1Active = statuses?.find(s => s.dynamicId === 1)?.isActive ?? false;

  const toggleMethod = (id: string) => {
    setExpandedMethod(expandedMethod === id ? null : id);
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
          <FlaskConical size={14} />
          Bloque 4 — Métodos de Evaluación
        </div>
        <h1 className="text-3xl md:text-5xl font-bold">
          ¿Cómo se <span className="text-primary">mide</span> la composición corporal?
        </h1>
      </motion.div>

      {/* Direct vs Indirect visual split */}
      <AnimatePresence mode="wait">
        {!isDynamic1Active ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Directo */}
                <Card className="border-stone-500/30 border-l-4">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-stone-500/10">
                        <Microscope className="text-stone-500" size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold">Métodos Directos</h3>
                        <p className="text-xs text-muted-foreground">Medición real de tejidos</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Miden los componentes corporales de forma directa, separando físicamente los tejidos.
                      Solo es posible mediante <strong>disección cadavérica</strong>.
                    </p>
                    <Badge variant="outline" className="text-xs">
                      Referencia teórica
                    </Badge>
                  </CardContent>
                </Card>

                {/* Indirecto */}
                <Card className="border-blue-500/30 border-l-4">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <ScanLine className="text-blue-500" size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold">Métodos Indirectos</h3>
                        <p className="text-xs text-muted-foreground">Estimación mediante principios físicos</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Estiman la composición corporal a partir de propiedades físicas del cuerpo
                      (densidad, conductividad, absorción de rayos X, etc.).
                    </p>
                    <Badge variant="outline" className="text-xs text-blue-500 border-blue-500/30">
                      Uso práctico en deporte
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Arrow connector */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center"
            >
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <ArrowRight size={16} />
                <span>Explorar cada método en detalle</span>
                <ArrowRight size={16} />
              </div>
            </motion.div>

            {/* Interactive method cards */}
            <div className="space-y-3">
              {METODOS.map((metodo, i) => (
                <motion.div
                  key={metodo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                >
                  <Card
                    className={`transition-all hover:shadow-md ${
                      expandedMethod === metodo.id ? "ring-2 ring-primary/30" : ""
                    }`}
                  >
                    <CardContent className="p-0">
                      <Button
                        variant="ghost"
                        className="w-full p-5 h-auto justify-between"
                        onClick={() => toggleMethod(metodo.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${metodo.bgColor}`}>
                            <metodo.icon className={metodo.color} size={22} />
                          </div>
                          <div className="text-left">
                            <h4 className="font-bold text-base">{metodo.title}</h4>
                            <p className="text-xs text-muted-foreground font-normal">
                              {metodo.desc}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              metodo.tipo === "directo"
                                ? "text-stone-500 border-stone-500/30"
                                : "text-blue-500 border-blue-500/30"
                            }
                          >
                            {metodo.tipo === "directo" ? "Directo" : "Indirecto"}
                          </Badge>
                          {expandedMethod === metodo.id ? (
                            <ChevronUp size={18} className="text-muted-foreground" />
                          ) : (
                            <ChevronDown size={18} className="text-muted-foreground" />
                          )}
                        </div>
                      </Button>

                      <AnimatePresence>
                        {expandedMethod === metodo.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 space-y-4 border-t pt-4">
                              {/* Principio */}
                              <div className={`p-4 rounded-lg ${metodo.bgColor}`}>
                                <h5 className="text-sm font-bold mb-1">Principio:</h5>
                                <p className="text-sm">{metodo.principio}</p>
                              </div>

                              {/* Ventajas y limitaciones */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <h5 className="text-sm font-bold text-green-600">Ventajas</h5>
                                  {metodo.ventajas.map((v, j) => (
                                    <p key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <span className="text-green-500 shrink-0">+</span>
                                      {v}
                                    </p>
                                  ))}
                                </div>
                                <div className="space-y-2">
                                  <h5 className="text-sm font-bold text-red-600">Limitaciones</h5>
                                  {metodo.limitaciones.map((l, j) => (
                                    <p key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <span className="text-red-500 shrink-0">-</span>
                                      {l}
                                    </p>
                                  ))}
                                </div>
                              </div>

                              {/* Arquimedes visual for hydrostatic */}
                              {metodo.id === "hidro" && (
                                <Card className="bg-blue-500/5 border-blue-500/20">
                                  <CardContent className="p-4 text-center space-y-2">
                                    <Waves className="mx-auto text-blue-500" size={36} />
                                    <p className="text-sm font-bold">Principio de Arquímedes</p>
                                    <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                      "Todo cuerpo sumergido en un fluido experimenta un empuje vertical ascendente
                                      igual al peso del fluido desalojado."
                                    </p>
                                    <div className="flex justify-center gap-6 mt-2 text-xs">
                                      <div>
                                        <p className="font-bold">Grasa</p>
                                        <p className="text-muted-foreground">Densidad &lt; agua</p>
                                        <p className="text-blue-500 font-medium">Flota</p>
                                      </div>
                                      <div>
                                        <p className="font-bold">Músculo/Hueso</p>
                                        <p className="text-muted-foreground">Densidad &gt; agua</p>
                                        <p className="text-blue-500 font-medium">Se hunde</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Bottom note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
                <CardContent className="p-6 text-center space-y-2">
                  <p className="text-base md:text-lg font-medium italic">
                    "La elección del método de evaluación depende del objetivo, el presupuesto, y la precisión requerida."
                  </p>
                  <p className="text-xs text-muted-foreground">
                    En las próximas semanas exploraremos métodos doblemente indirectos como pliegues cutáneos y bioimpedancia.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Dynamic 1 Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            {isDynamic1Active ? (
              <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
                <Gamepad2 size={14} /> Dinámica Activa
              </Badge>
            ) : (
              <Button
                variant="outline"
                disabled
                className="gap-2 opacity-60"
              >
                <Lock size={14} />
                El profesor activará esta dinámica
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isDynamic1Active && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <S2_Dynamic1MetodoClasifica />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

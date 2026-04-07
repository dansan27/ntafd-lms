import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Zap,
  Droplets,
  Heart,
  Lock,
  Gamepad2,
  Scale,
  Dumbbell,
  ThermometerSun,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import S2_Dynamic3QuizComposicion from "../dynamics/S2_Dynamic3QuizComposicion";

interface BIAMedicion {
  id: string;
  label: string;
  icon: typeof Droplets;
  color: string;
  bgColor: string;
  desc: string;
}

const BIA_MEDICIONES: BIAMedicion[] = [
  {
    id: "aec",
    label: "Fluido Extracelular",
    icon: Droplets,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    desc: "Agua fuera de las celulas: plasma sanguineo, liquido intersticial.",
  },
  {
    id: "aic",
    label: "Fluido Intracelular",
    icon: Droplets,
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
    desc: "Agua dentro de las celulas, donde ocurren las reacciones metabolicas.",
  },
  {
    id: "at",
    label: "Agua Corporal Total",
    icon: Droplets,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    desc: "Suma del agua extra e intracelular. Representa el 60-70% del peso corporal.",
  },
  {
    id: "mg",
    label: "Masa Grasa",
    icon: Scale,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    desc: "Tejido adiposo total. La grasa conduce menos electricidad que el agua.",
  },
  {
    id: "mlg",
    label: "Masa Libre de Grasa",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    desc: "Todo lo que no es grasa: musculo, huesos, organos, agua.",
  },
  {
    id: "mm",
    label: "Masa Muscular",
    icon: Dumbbell,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    desc: "Tejido muscular esqueletico. Clave para el rendimiento deportivo.",
  },
];

export default function S2_Block6BIA() {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMedicion, setSelectedMedicion] = useState<string | null>(null);

  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 2, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic3Active =
    statuses?.find((s) => s.dynamicId === 3)?.isActive ?? false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Zap size={14} />
          Bloque 6 — Bioimpedancia Electrica
        </div>
        <h1 className="text-3xl md:text-5xl font-bold">
          <span className="text-primary">BIA</span>: Midiendo el cuerpo con
          electricidad
        </h1>
      </motion.div>

      {/* Main concept card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-6 md:p-8 text-center space-y-4">
            <Zap className="mx-auto text-yellow-400" size={48} />
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              ¿Como funciona la BIA?
            </h3>
            <p className="text-white/70 text-sm md:text-base max-w-lg mx-auto">
              Se aplica una corriente electrica de baja intensidad (imperceptible)
              a traves del cuerpo. Los tejidos con mas agua (como el musculo)
              conducen mejor la electricidad, mientras que la grasa ofrece mayor
              resistencia.
            </p>
            <div className="flex justify-center gap-8 mt-4">
              <div className="text-center">
                <div className="p-3 rounded-full bg-blue-500/20 mx-auto w-fit mb-2">
                  <Droplets className="text-blue-400" size={24} />
                </div>
                <p className="text-xs text-white font-medium">Musculo + Agua</p>
                <p className="text-[10px] text-white/50">Baja resistencia</p>
              </div>
              <div className="flex items-center">
                <div className="w-16 h-0.5 bg-yellow-400/50 relative">
                  <Zap
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-yellow-400"
                    size={16}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="p-3 rounded-full bg-yellow-500/20 mx-auto w-fit mb-2">
                  <Scale className="text-yellow-400" size={24} />
                </div>
                <p className="text-xs text-white font-medium">Grasa</p>
                <p className="text-[10px] text-white/50">Alta resistencia</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Ventajas y Limitaciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ventajas */}
          <Card className="border-l-4 border-green-500/30">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500" size={20} />
                <h3 className="font-bold">Ventajas</h3>
              </div>
              <div className="space-y-2">
                {[
                  {
                    icon: Zap,
                    text: "Rapido: resultados en menos de 1 minuto",
                  },
                  {
                    icon: Heart,
                    text: "No invasivo ni doloroso para el sujeto",
                  },
                  {
                    icon: Scale,
                    text: "Economico comparado con DEXA o Bod Pod",
                  },
                  {
                    icon: Activity,
                    text: "Portatil: equipos de mano o basculas especializadas",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <item.icon
                      size={14}
                      className="text-green-500 shrink-0 mt-0.5"
                    />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Limitaciones */}
          <Card className="border-l-4 border-amber-500/30">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-amber-500" size={20} />
                <h3 className="font-bold">Limitaciones</h3>
              </div>
              <div className="space-y-2">
                {[
                  {
                    icon: Droplets,
                    text: "Sensible al estado de hidratacion del sujeto",
                  },
                  {
                    icon: ThermometerSun,
                    text: "La temperatura corporal y ambiental afectan el resultado",
                  },
                  {
                    icon: Activity,
                    text: "El ejercicio previo puede alterar las mediciones",
                  },
                  {
                    icon: Scale,
                    text: "Menor precision que DEXA en poblaciones extremas",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <item.icon
                      size={14}
                      className="text-amber-500 shrink-0 mt-0.5"
                    />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Que mide la BIA - stacked cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-4"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            ¿Que mide la <span className="text-primary">BIA</span>?
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Selecciona cada componente para conocer mas detalles
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {BIA_MEDICIONES.map((med, i) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.08 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedMedicion === med.id
                    ? "ring-2 ring-primary/40 shadow-md"
                    : ""
                }`}
                onClick={() =>
                  setSelectedMedicion(
                    selectedMedicion === med.id ? null : med.id
                  )
                }
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${med.bgColor}`}>
                      <med.icon className={med.color} size={18} />
                    </div>
                    <h4 className="font-semibold text-sm">{med.label}</h4>
                  </div>
                  <AnimatePresence>
                    {selectedMedicion === med.id && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-muted-foreground overflow-hidden"
                      >
                        {med.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Aplicaciones en Deporte */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card>
          <CardContent className="p-0">
            <Button
              variant="ghost"
              className="w-full p-5 h-auto justify-between"
              onClick={() => setShowDetails(!showDetails)}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Dumbbell className="text-primary" size={22} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-base">
                    Aplicaciones en Fitness y Deporte
                  </h4>
                  <p className="text-xs text-muted-foreground font-normal">
                    ¿Como se usa la BIA en el mundo real?
                  </p>
                </div>
              </div>
              {showDetails ? (
                <ChevronUp size={18} className="text-muted-foreground" />
              ) : (
                <ChevronDown size={18} className="text-muted-foreground" />
              )}
            </Button>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t pt-4 space-y-3">
                    {[
                      {
                        title: "Monitoreo de hidratacion",
                        desc: "Evaluar el estado hidrico antes, durante y despues del entrenamiento.",
                        badge: "Prevencion",
                      },
                      {
                        title: "Control de masa muscular",
                        desc: "Seguimiento de ganancias o perdidas de masa muscular en programas de fuerza.",
                        badge: "Rendimiento",
                      },
                      {
                        title: "Gestion del peso competitivo",
                        desc: "En deportes con categorias de peso, ajustar la composicion corporal de forma segura.",
                        badge: "Competicion",
                      },
                      {
                        title: "Evaluacion de recuperacion",
                        desc: "Detectar cambios en la distribucion de fluidos que indiquen fatiga o sobreentrenamiento.",
                        badge: "Salud",
                      },
                    ].map((app, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        <div className="p-1.5 rounded bg-primary/10">
                          <Activity className="text-primary" size={14} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h5 className="text-sm font-semibold">
                              {app.title}
                            </h5>
                            <Badge variant="outline" className="text-[10px]">
                              {app.badge}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {app.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Protocol tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
          <CardContent className="p-6 text-center space-y-2">
            <Badge variant="outline" className="mb-2">
              Protocolo
            </Badge>
            <p className="text-base md:text-lg font-medium italic">
              "Para resultados confiables: medir en ayunas, sin ejercicio previo
              (12h), sin alcohol (24h), vejiga vacia, y en posicion supina por 5
              minutos antes de la medicion."
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dynamic 3 Section */}
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
            {isDynamic3Active ? (
              <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
                <Gamepad2 size={14} /> Dinamica Activa
              </Badge>
            ) : (
              <Button
                variant="outline"
                disabled
                className="gap-2 opacity-60"
              >
                <Lock size={14} />
                El profesor activara esta dinamica
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isDynamic3Active && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <S2_Dynamic3QuizComposicion />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

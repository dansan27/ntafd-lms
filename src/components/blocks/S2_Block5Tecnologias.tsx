import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Scan,
  Wind,
  Ruler,
  Lock,
  Gamepad2,
  ChevronDown,
  ChevronUp,
  Radiation,
  DollarSign,
  Clock,
  Target,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import S2_Dynamic2TablaComparativa from "../dynamics/S2_Dynamic2TablaComparativa";

interface TecnologiaData {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof Scan;
  color: string;
  bgColor: string;
  borderColor: string;
  desc: string;
  principio: string;
  precision: "Alto" | "Medio" | "Bajo";
  precisionColor: string;
  costo: string;
  tiempo: string;
  ventajas: string[];
  limitaciones: string[];
}

const TECNOLOGIAS: TecnologiaData[] = [
  {
    id: "dexa",
    title: "DEXA",
    subtitle: "Absorciometría de Rayos X de Energía Dual",
    icon: Radiation,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    desc: "Considerada el estándar de oro en la evaluación de composición corporal.",
    principio:
      "Utiliza dos haces de rayos X de diferente energía que atraviesan el cuerpo. Cada tejido (hueso, grasa, masa magra) absorbe la radiación de forma distinta, permitiendo diferenciar y cuantificar los tres compartimentos.",
    precision: "Alto",
    precisionColor: "bg-green-100 text-green-800 border-green-300",
    costo: "Alto",
    tiempo: "10-20 min",
    ventajas: [
      "Máxima precisión: diferencia masa ósea, grasa y magra",
      "Análisis regional: evalúa cada segmento corporal por separado",
      "Reproducible y estandarizado a nivel internacional",
    ],
    limitaciones: [
      "Alto costo del equipo y mantenimiento",
      "Exposición a radiación ionizante (baja dosis)",
      "No portátil — requiere instalación clínica",
      "El sujeto debe permanecer inmóvil durante el escaneo",
    ],
  },
  {
    id: "bodpod",
    title: "Bod Pod",
    subtitle: "Pletismografía por Desplazamiento de Aire",
    icon: Wind,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    desc: "Mide la composición corporal mediante desplazamiento de aire en una cámara cerrada.",
    principio:
      "El sujeto entra en una cámara hermética y el sistema mide los cambios de presión causados por el volumen corporal. A partir del volumen y el peso se calcula la densidad corporal, y con ecuaciones se estima el porcentaje de grasa.",
    precision: "Alto",
    precisionColor: "bg-green-100 text-green-800 border-green-300",
    costo: "Alto",
    tiempo: "5-10 min",
    ventajas: [
      "Rápido y no invasivo — sin radiación",
      "Cómodo para el sujeto (solo se sienta dentro de la cámara)",
      "Alta reproducibilidad en mediciones repetidas",
    ],
    limitaciones: [
      "Alto costo del equipo",
      "Sensible a ropa, cabello y aire atrapado",
      "Solo diferencia masa grasa vs. masa libre de grasa (2 compartimentos)",
      "Puede ser incómodo para personas con claustrofobia",
    ],
  },
  {
    id: "antropo",
    title: "Métodos Antropométricos",
    subtitle: "Pliegues Cutáneos y Circunferencias",
    icon: Ruler,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    desc: "Técnicas de campo usando calibradores y cintas métricas para estimar la composición corporal.",
    principio:
      "Se miden pliegues cutáneos en puntos anatómicos específicos y circunferencias corporales. Mediante ecuaciones de regresión validadas, se estima la densidad corporal y el porcentaje de grasa.",
    precision: "Medio",
    precisionColor: "bg-yellow-100 text-yellow-800 border-yellow-300",
    costo: "Bajo",
    tiempo: "15-20 min",
    ventajas: [
      "Económico — el equipo es accesible y portátil",
      "Puede realizarse en cualquier lugar (campo, gimnasio)",
      "No requiere electricidad ni equipo especial",
      "Permite seguimiento longitudinal con buena sensibilidad al cambio",
    ],
    limitaciones: [
      "Precisión depende de la habilidad y experiencia del evaluador",
      "Variabilidad inter-evaluador significativa",
      "Las ecuaciones pueden no ser válidas para todas las poblaciones",
      "Menos preciso en personas con obesidad severa",
    ],
  },
];

export default function S2_Block5Tecnologias() {
  const [expandedTech, setExpandedTech] = useState<string | null>(null);

  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 2, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic2Active =
    statuses?.find((s) => s.dynamicId === 2)?.isActive ?? false;

  const toggleTech = (id: string) => {
    setExpandedTech(expandedTech === id ? null : id);
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
          <Scan size={14} />
          Bloque 5 — Tecnologias Avanzadas
        </div>
        <h1 className="text-3xl md:text-5xl font-bold">
          Tecnologias de{" "}
          <span className="text-primary">Medicion Avanzada</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Desde rayos X hasta desplazamiento de aire: las herramientas que
          utilizan los profesionales para evaluar la composicion corporal con
          alta precision.
        </p>
      </motion.div>

      {/* Comparative summary cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TECNOLOGIAS.map((tech, i) => (
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Card
                className={`border-l-4 ${tech.borderColor} h-full hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => toggleTech(tech.id)}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tech.bgColor}`}>
                      <tech.icon className={tech.color} size={22} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">{tech.title}</h3>
                      <p className="text-[10px] text-muted-foreground">
                        {tech.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${tech.precisionColor}`}
                    >
                      <Target size={10} className="mr-1" />
                      Precision: {tech.precision}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      <DollarSign size={10} className="mr-1" />
                      {tech.costo}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      <Clock size={10} className="mr-1" />
                      {tech.tiempo}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Expandable detail cards */}
      <AnimatePresence mode="wait">
        {!isDynamic2Active ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {TECNOLOGIAS.map((tech, i) => (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
              >
                <Card
                  className={`transition-all hover:shadow-md ${
                    expandedTech === tech.id ? "ring-2 ring-primary/30" : ""
                  }`}
                >
                  <CardContent className="p-0">
                    <Button
                      variant="ghost"
                      className="w-full p-5 h-auto justify-between"
                      onClick={() => toggleTech(tech.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${tech.bgColor}`}>
                          <tech.icon className={tech.color} size={22} />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-base">{tech.title}</h4>
                          <p className="text-xs text-muted-foreground font-normal">
                            {tech.desc}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={tech.precisionColor}
                        >
                          {tech.precision}
                        </Badge>
                        {expandedTech === tech.id ? (
                          <ChevronUp
                            size={18}
                            className="text-muted-foreground"
                          />
                        ) : (
                          <ChevronDown
                            size={18}
                            className="text-muted-foreground"
                          />
                        )}
                      </div>
                    </Button>

                    <AnimatePresence>
                      {expandedTech === tech.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 space-y-4 border-t pt-4">
                            {/* Principio */}
                            <div className={`p-4 rounded-lg ${tech.bgColor}`}>
                              <h5 className="text-sm font-bold mb-1">
                                Principio de Funcionamiento:
                              </h5>
                              <p className="text-sm">{tech.principio}</p>
                            </div>

                            {/* Ventajas y limitaciones */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <h5 className="text-sm font-bold text-green-600">
                                  Ventajas
                                </h5>
                                {tech.ventajas.map((v, j) => (
                                  <p
                                    key={j}
                                    className="text-sm text-muted-foreground flex items-start gap-2"
                                  >
                                    <span className="text-green-500 shrink-0">
                                      +
                                    </span>
                                    {v}
                                  </p>
                                ))}
                              </div>
                              <div className="space-y-2">
                                <h5 className="text-sm font-bold text-red-600">
                                  Limitaciones
                                </h5>
                                {tech.limitaciones.map((l, j) => (
                                  <p
                                    key={j}
                                    className="text-sm text-muted-foreground flex items-start gap-2"
                                  >
                                    <span className="text-red-500 shrink-0">
                                      -
                                    </span>
                                    {l}
                                  </p>
                                ))}
                              </div>
                            </div>

                            {/* DEXA visual */}
                            {tech.id === "dexa" && (
                              <Card className="bg-purple-500/5 border-purple-500/20">
                                <CardContent className="p-4 text-center space-y-2">
                                  <Radiation
                                    className="mx-auto text-purple-500"
                                    size={36}
                                  />
                                  <p className="text-sm font-bold">
                                    3 Compartimentos que diferencia DEXA
                                  </p>
                                  <div className="flex justify-center gap-6 mt-2 text-xs">
                                    <div className="p-3 rounded-lg bg-white/80 border">
                                      <p className="font-bold">Masa Osea</p>
                                      <p className="text-muted-foreground">
                                        Minerales del hueso
                                      </p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-white/80 border">
                                      <p className="font-bold">Masa Grasa</p>
                                      <p className="text-muted-foreground">
                                        Tejido adiposo
                                      </p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-white/80 border">
                                      <p className="font-bold">Masa Magra</p>
                                      <p className="text-muted-foreground">
                                        Musculo y organos
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* Bod Pod visual */}
                            {tech.id === "bodpod" && (
                              <Card className="bg-cyan-500/5 border-cyan-500/20">
                                <CardContent className="p-4 text-center space-y-2">
                                  <Wind
                                    className="mx-auto text-cyan-500"
                                    size={36}
                                  />
                                  <p className="text-sm font-bold">
                                    Proceso del Bod Pod
                                  </p>
                                  <div className="flex justify-center items-center gap-3 mt-2 text-xs">
                                    {[
                                      "Ingreso a la camara",
                                      "Medicion de volumen",
                                      "Calculo de densidad",
                                      "Estimacion de % grasa",
                                    ].map((step, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-2"
                                      >
                                        <div className="p-2 rounded-full bg-cyan-100 text-cyan-700 font-bold w-7 h-7 flex items-center justify-center">
                                          {idx + 1}
                                        </div>
                                        <span className="text-muted-foreground text-[11px]">
                                          {step}
                                        </span>
                                        {idx < 3 && (
                                          <span className="text-cyan-400">
                                            →
                                          </span>
                                        )}
                                      </div>
                                    ))}
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

            {/* Tabla comparativa visual */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-primary/5 p-4 border-b">
                    <h3 className="font-bold text-center">
                      Tabla Comparativa de Tecnologias
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          <th className="text-left p-3 font-semibold">
                            Metodo
                          </th>
                          <th className="text-center p-3 font-semibold">
                            Precision
                          </th>
                          <th className="text-center p-3 font-semibold">
                            Costo
                          </th>
                          <th className="text-center p-3 font-semibold">
                            Tiempo
                          </th>
                          <th className="text-center p-3 font-semibold">
                            Invasivo
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            name: "DEXA",
                            precision: "Alto",
                            precColor: "bg-green-100 text-green-800",
                            costo: "Alto",
                            tiempo: "10-20 min",
                            invasivo: "Radiacion baja",
                          },
                          {
                            name: "Bod Pod",
                            precision: "Alto",
                            precColor: "bg-green-100 text-green-800",
                            costo: "Alto",
                            tiempo: "5-10 min",
                            invasivo: "No",
                          },
                          {
                            name: "Antropometria",
                            precision: "Medio",
                            precColor: "bg-yellow-100 text-yellow-800",
                            costo: "Bajo",
                            tiempo: "15-20 min",
                            invasivo: "No",
                          },
                        ].map((row, i) => (
                          <tr key={i} className="border-b last:border-b-0">
                            <td className="p-3 font-medium">{row.name}</td>
                            <td className="p-3 text-center">
                              <Badge
                                variant="outline"
                                className={`text-xs ${row.precColor}`}
                              >
                                {row.precision}
                              </Badge>
                            </td>
                            <td className="p-3 text-center text-muted-foreground">
                              {row.costo}
                            </td>
                            <td className="p-3 text-center text-muted-foreground">
                              {row.tiempo}
                            </td>
                            <td className="p-3 text-center text-muted-foreground">
                              {row.invasivo}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Dynamic 2 Section */}
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
            {isDynamic2Active ? (
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
          {isDynamic2Active && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <S2_Dynamic2TablaComparativa />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

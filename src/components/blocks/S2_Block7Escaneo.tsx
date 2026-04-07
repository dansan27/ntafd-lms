import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ScanLine,
  Smartphone,
  Shirt,
  Ruler,
  RotateCcw,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Lock,
  Gamepad2,
  CheckCircle2,
  XCircle,
  Box,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import S2_Dynamic4IdentificaTech from "../dynamics/S2_Dynamic4IdentificaTech";

interface ScanTech {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof ScanLine;
  color: string;
  bgColor: string;
  borderColor: string;
  desc: string;
  como: string;
  precision: string;
  accesibilidad: string;
}

const SCAN_TECHNOLOGIES: ScanTech[] = [
  {
    id: "zozofit",
    title: "ZOZOFIT",
    subtitle: "Escaneo 3D con Smartphone + ZOZOSUIT",
    icon: Shirt,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    desc: "Sistema accesible que usa la camara del smartphone y un traje especial con marcadores para crear un modelo 3D completo del cuerpo.",
    como: "El usuario viste el ZOZOSUIT (traje con marcadores impresos) y se escanea girando frente a la camara del smartphone. La app reconstruye un modelo 3D con medidas corporales precisas en mas de 150 puntos.",
    precision: "Medio-Alto",
    accesibilidad: "Alta (solo necesitas un smartphone)",
  },
  {
    id: "structured-light",
    title: "Escaner de Luz Estructurada",
    subtitle: "Proyeccion de patrones de luz",
    icon: ScanLine,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    desc: "Escaneres dedicados que proyectan patrones de luz sobre el cuerpo y capturan la deformacion para construir un modelo 3D.",
    como: "Se proyectan patrones de luz (franjas o puntos) sobre el sujeto. Camaras capturan como se deforman estos patrones sobre la superficie corporal, y un software reconstruye la geometria 3D en segundos.",
    precision: "Alto",
    accesibilidad: "Baja (equipo especializado)",
  },
  {
    id: "lidar",
    title: "LiDAR / Sensores de Profundidad",
    subtitle: "Tecnologia presente en smartphones modernos",
    icon: Smartphone,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    desc: "Sensores LiDAR integrados en smartphones premium permiten escaneos 3D sin accesorios adicionales.",
    como: "El sensor LiDAR emite pulsos de luz infrarroja y mide el tiempo que tardan en rebotar, creando un mapa de profundidad. Apps especializadas convierten estos datos en modelos 3D con mediciones corporales.",
    precision: "Medio",
    accesibilidad: "Media (requiere dispositivo con LiDAR)",
  },
];

export default function S2_Block7Escaneo() {
  const [expandedTech, setExpandedTech] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 2, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic4Active =
    statuses?.find((s) => s.dynamicId === 4)?.isActive ?? false;

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
          <ScanLine size={14} />
          Bloque 7 — Escaneo Corporal 3D
        </div>
        <h1 className="text-3xl md:text-5xl font-bold">
          Escaneo Corporal <span className="text-primary">3D</span> y Nuevas
          Tecnologias
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          La digitalizacion del cuerpo humano: desde escaneres dedicados hasta tu
          propio smartphone, la tecnologia 3D esta transformando la evaluacion
          corporal en el deporte.
        </p>
      </motion.div>

      {/* Main concept card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-6 md:p-8 text-center space-y-4">
            <Box className="mx-auto text-indigo-400" size={48} />
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              ¿Que es el escaneo corporal 3D?
            </h3>
            <p className="text-white/70 text-sm md:text-base max-w-lg mx-auto">
              Es la creacion de un modelo digital tridimensional del cuerpo humano
              mediante sensores opticos o de profundidad. Permite obtener medidas
              antropometricas precisas de forma rapida, no invasiva y repetible.
            </p>
            <div className="flex justify-center gap-8 mt-4">
              <div className="text-center">
                <div className="p-3 rounded-full bg-indigo-500/20 mx-auto w-fit mb-2">
                  <ShieldCheck className="text-indigo-400" size={24} />
                </div>
                <p className="text-xs text-white font-medium">No invasivo</p>
                <p className="text-[10px] text-white/50">Sin radiacion</p>
              </div>
              <div className="text-center">
                <div className="p-3 rounded-full bg-cyan-500/20 mx-auto w-fit mb-2">
                  <RotateCcw className="text-cyan-400" size={24} />
                </div>
                <p className="text-xs text-white font-medium">Repetible</p>
                <p className="text-[10px] text-white/50">Mismas condiciones</p>
              </div>
              <div className="text-center">
                <div className="p-3 rounded-full bg-emerald-500/20 mx-auto w-fit mb-2">
                  <TrendingUp className="text-emerald-400" size={24} />
                </div>
                <p className="text-xs text-white font-medium">Seguimiento</p>
                <p className="text-[10px] text-white/50">Cambios en el tiempo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ZOZOFIT Spotlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="border-l-4 border-indigo-500/50 bg-gradient-to-r from-indigo-500/5 to-transparent">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <Shirt className="text-indigo-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">ZOZOFIT</h3>
                <p className="text-xs text-muted-foreground">
                  Escaneo 3D accesible para deportistas y entrenadores
                </p>
              </div>
              <Badge
                variant="outline"
                className="ml-auto bg-indigo-100 text-indigo-800 border-indigo-300 text-[10px]"
              >
                Destacado
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="text-sm font-bold">¿Como funciona?</h4>
                <div className="space-y-2">
                  {[
                    {
                      step: "1",
                      text: "Vestir el ZOZOSUIT con marcadores impresos",
                    },
                    {
                      step: "2",
                      text: "Abrir la app y posicionarse frente a la camara",
                    },
                    {
                      step: "3",
                      text: "Girar lentamente para capturar todo el cuerpo",
                    },
                    {
                      step: "4",
                      text: "La app genera un modelo 3D con +150 medidas",
                    },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="flex items-start gap-2 text-sm"
                    >
                      <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-600 font-bold w-6 h-6 flex items-center justify-center shrink-0 text-xs">
                        {item.step}
                      </div>
                      <span className="text-muted-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-bold">Beneficios clave</h4>
                <div className="space-y-2">
                  {[
                    "Solo necesitas tu smartphone — sin equipo costoso",
                    "Mediciones en menos de 5 minutos",
                    "Seguimiento longitudinal: compara escaneos a lo largo del tiempo",
                    "Visualizacion 3D de cambios corporales reales",
                    "Ideal para deportistas que entrenan fuera de laboratorio",
                  ].map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-indigo-500 shrink-0 mt-0.5"
                      />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Scanning Technologies Explorer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            Tecnologias de <span className="text-primary">Escaneo 3D</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Explora cada tecnologia para conocer como funciona
          </p>
        </div>

        <div className="space-y-3">
          {SCAN_TECHNOLOGIES.map((tech, i) => (
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.12 }}
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
                          {tech.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {tech.accesibilidad}
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
                          <div className={`p-4 rounded-lg ${tech.bgColor}`}>
                            <h5 className="text-sm font-bold mb-1">
                              ¿Como funciona?
                            </h5>
                            <p className="text-sm">{tech.como}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              <Ruler size={10} className="mr-1" />
                              Precision: {tech.precision}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Smartphone size={10} className="mr-1" />
                              Accesibilidad: {tech.accesibilidad}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {tech.desc}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Traditional vs 3D Comparison */}
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
              onClick={() => setShowComparison(!showComparison)}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Ruler className="text-primary" size={22} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-base">
                    Mediciones Tradicionales vs. Escaneo 3D
                  </h4>
                  <p className="text-xs text-muted-foreground font-normal">
                    Compara ambos enfoques lado a lado
                  </p>
                </div>
              </div>
              {showComparison ? (
                <ChevronUp size={18} className="text-muted-foreground" />
              ) : (
                <ChevronDown size={18} className="text-muted-foreground" />
              )}
            </Button>

            <AnimatePresence>
              {showComparison && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t pt-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/30">
                            <th className="text-left p-3 font-semibold">
                              Aspecto
                            </th>
                            <th className="text-center p-3 font-semibold">
                              Tradicional
                            </th>
                            <th className="text-center p-3 font-semibold">
                              Escaneo 3D
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              aspecto: "Tiempo de medicion",
                              tradicional: "15-30 min",
                              escaneo: "1-5 min",
                              favor3d: true,
                            },
                            {
                              aspecto: "Puntos de medicion",
                              tradicional: "10-20 puntos",
                              escaneo: "150+ puntos",
                              favor3d: true,
                            },
                            {
                              aspecto: "Dependencia del evaluador",
                              tradicional: "Alta",
                              escaneo: "Baja",
                              favor3d: true,
                            },
                            {
                              aspecto: "Reproducibilidad",
                              tradicional: "Variable",
                              escaneo: "Alta",
                              favor3d: true,
                            },
                            {
                              aspecto: "Visualizacion 3D",
                              tradicional: "No disponible",
                              escaneo: "Modelo completo",
                              favor3d: true,
                            },
                            {
                              aspecto: "Costo inicial",
                              tradicional: "Bajo",
                              escaneo: "Medio-Alto",
                              favor3d: false,
                            },
                            {
                              aspecto: "Seguimiento temporal",
                              tradicional: "Manual/tablas",
                              escaneo: "Automatico/visual",
                              favor3d: true,
                            },
                          ].map((row, i) => (
                            <tr key={i} className="border-b last:border-b-0">
                              <td className="p-3 font-medium">{row.aspecto}</td>
                              <td className="p-3 text-center">
                                <span className="flex items-center justify-center gap-1 text-muted-foreground">
                                  {row.favor3d ? (
                                    <XCircle
                                      size={12}
                                      className="text-red-400"
                                    />
                                  ) : (
                                    <CheckCircle2
                                      size={12}
                                      className="text-green-500"
                                    />
                                  )}
                                  {row.tradicional}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <span className="flex items-center justify-center gap-1 text-muted-foreground">
                                  {row.favor3d ? (
                                    <CheckCircle2
                                      size={12}
                                      className="text-green-500"
                                    />
                                  ) : (
                                    <XCircle
                                      size={12}
                                      className="text-red-400"
                                    />
                                  )}
                                  {row.escaneo}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dynamic 4 Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            {isDynamic4Active ? (
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
          {isDynamic4Active && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <S2_Dynamic4IdentificaTech />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

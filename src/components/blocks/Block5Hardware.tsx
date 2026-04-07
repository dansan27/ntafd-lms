import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cpu, Gamepad2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import Dynamic2HardwareSoftware from "../dynamics/Dynamic2HardwareSoftware";
import Dynamic4Sensors from "../dynamics/Dynamic4Sensors";

const SENSOR_CATEGORIES = [
  { name: "Movimiento", icon: "🏃", sensors: ["Acelerómetros", "Giroscopios", "Proximidad"] },
  { name: "Posición", icon: "📍", sensors: ["Encoders", "GPS"] },
  { name: "Fuerza", icon: "💪", sensors: ["Dinamómetros", "Celdas de carga"] },
  { name: "Temperatura", icon: "🌡️", sensors: ["Termistores", "Termopares"] },
  { name: "Luz", icon: "💡", sensors: ["Fotodiodos", "LDR"] },
  { name: "Presión", icon: "🔵", sensors: ["Barómetros", "Manómetros"] },
  { name: "Químicos", icon: "🧪", sensors: ["Gas", "pH"] },
];

const HW_TYPES = [
  { label: "Procesamiento", items: ["CPU", "GPU", "TPU"], icon: "⚙️" },
  { label: "Almacenamiento", items: ["HDD", "SSD", "RAM", "USB"], icon: "💾" },
  { label: "Entrada/Salida", items: ["Teclado", "Pantalla", "Cámara"], icon: "🖥️" },
  { label: "Comunicación", items: ["WiFi", "Bluetooth", "NFC"], icon: "📡" },
];

export default function Block5Hardware() {
  const [activeSensor, setActiveSensor] = useState<number | null>(null);
  const [activeHw, setActiveHw] = useState<number | null>(null);

  // Poll dynamic statuses every 3 seconds
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery({ weekId: 1, classId: 1 }, {
    refetchInterval: 3000,
  });
  const isDynamic2Active = statuses?.find(s => s.dynamicId === 2)?.isActive ?? false;
  const isDynamic4Active = statuses?.find(s => s.dynamicId === 4)?.isActive ?? false;
  const anyDynamicActive = isDynamic2Active || isDynamic4Active;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Cpu size={14} />
          Bloque 5 — Hardware y Software
        </div>
        <h1 className="text-3xl md:text-5xl font-bold">
          Los componentes de la <span className="text-primary">tecnología</span>
        </h1>
      </motion.div>

      {/* Hide content when any dynamic is active */}
      <AnimatePresence mode="wait">
        {!anyDynamicActive ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-10"
          >
            {/* Body Analogy */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-sidebar text-sidebar-foreground overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-center text-white font-bold mb-6">Analogía: Cuerpo Humano</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                      { emoji: "🦴", label: "Hardware", sub: "Esqueleto y músculos", color: "bg-blue-500/20" },
                      { emoji: "🧠", label: "Software", sub: "Sistema nervioso", color: "bg-purple-500/20" },
                      { emoji: "👁️", label: "Sensores", sub: "Los 5 sentidos", color: "bg-green-500/20" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.15 }}
                        className={`${item.color} rounded-xl p-5`}
                      >
                        <p className="text-5xl mb-2">{item.emoji}</p>
                        <p className="font-bold text-white">{item.label}</p>
                        <p className="text-white/50 text-xs mt-1">{item.sub}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Hardware Types */}
            <div>
              <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Tipos de Hardware</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {HW_TYPES.map((hw, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    onClick={() => setActiveHw(activeHw === i ? null : i)}
                    className={`p-4 rounded-xl text-center transition-all ${
                      activeHw === i ? "bg-primary text-white shadow-lg scale-105" : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <p className="text-3xl mb-2">{hw.icon}</p>
                    <p className="text-xs font-semibold">{hw.label}</p>
                  </motion.button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                {activeHw !== null && (
                  <motion.div key={activeHw} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3">
                    <div className="flex flex-wrap gap-2 justify-center p-4 bg-muted/50 rounded-lg">
                      {HW_TYPES[activeHw].items.map((item, j) => (
                        <Badge key={j} className="bg-primary/10 text-primary text-sm px-3 py-1">{item}</Badge>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Software */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center">
                <CardContent className="p-5">
                  <p className="text-3xl mb-2">🖥️</p>
                  <p className="font-bold text-sm mb-2">Software de Sistema</p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {["Windows", "macOS", "iOS", "Android", "Linux"].map(s => (
                      <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <p className="text-3xl mb-2">📱</p>
                  <p className="font-bold text-sm mb-2">Software de Aplicación</p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {["Strava", "WhatsApp", "Office", "Netflix", "Photoshop"].map(s => (
                      <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sensors Grid */}
            <div>
              <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Sensores: Los sentidos de la tecnología</h3>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-3">
                {SENSOR_CATEGORIES.map((cat, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    onClick={() => setActiveSensor(activeSensor === i ? null : i)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      activeSensor === i ? "bg-primary text-white shadow-lg scale-105" : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <p className="text-2xl mb-1">{cat.icon}</p>
                    <p className="text-[10px] font-medium">{cat.name}</p>
                  </motion.button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                {activeSensor !== null && (
                  <motion.div key={activeSensor} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    <Card className="border-primary/30">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{SENSOR_CATEGORIES[activeSensor].icon}</span>
                          <h4 className="font-bold text-sm">Sensores de {SENSOR_CATEGORIES[activeSensor].name}</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {SENSOR_CATEGORIES[activeSensor].sensors.map((s, j) => (
                            <Badge key={j} className="bg-primary/10 text-primary">{s}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Smartphone fact */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/20 text-center">
                <CardContent className="p-6">
                  <p className="text-4xl mb-2">📱</p>
                  <p className="text-3xl font-bold text-primary">12-15 sensores</p>
                  <p className="text-sm text-muted-foreground mt-1">en tu bolsillo ahora mismo</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* DYNAMIC 2 - Hardware vs Software */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center">
          {isDynamic2Active ? (
            <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
              <Gamepad2 size={14} /> Reto HW/SW Activo
            </Badge>
          ) : (
            <Button variant="outline" disabled className="gap-2 opacity-60">
              <Lock size={14} />
              Reto HW/SW — El profesor lo activará
            </Button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {isDynamic2Active && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
            <Dynamic2HardwareSoftware />
          </motion.div>
        )}
      </AnimatePresence>

      {/* DYNAMIC 4 - Sensors */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center">
          {isDynamic4Active ? (
            <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
              <Gamepad2 size={14} /> Reto Sensores Activo
            </Badge>
          ) : (
            <Button variant="outline" disabled className="gap-2 opacity-60">
              <Lock size={14} />
              Reto Sensores — El profesor lo activará
            </Button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {isDynamic4Active && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
            <Dynamic4Sensors />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

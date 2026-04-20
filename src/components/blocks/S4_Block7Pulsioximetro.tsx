import { Card, CardContent } from "@/components/ui/card";
import { Heart, CheckCircle2, Lock, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BorderBeam } from "border-beam";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import S4_Dynamic3QuizPolarH10 from "../dynamics/S4_Dynamic3QuizPolarH10";

const SPECS = [
  { emoji: "⚡", label: "Electrodos", val: "2 de contacto" },
  { emoji: "📡", label: "Muestreo ECG", val: "1000 Hz" },
  { emoji: "🎯", label: "Precisión FC", val: "±1 bpm" },
  { emoji: "📶", label: "Conectividad", val: "BT + ANT+" },
  { emoji: "📊", label: "HRV", val: "R-R en ms" },
  { emoji: "💧", label: "IP", val: "IPX7" },
];

const VS = [
  { cat: "Adherencia",   polar: "Correa elástica + gel", ar: "Banda rígida",         polar_win: true  },
  { cat: "Ruido movim.", polar: "Algoritmo avanzado",    ar: "Básico",               polar_win: true  },
  { cat: "HRV preciso",  polar: "Sí — ms exactos",       ar: "Limitado",             polar_win: true  },
  { cat: "Ecosistema",   polar: "Garmin, TP, HRV4T...",  ar: "App propia",           polar_win: true  },
  { cat: "Precio",       polar: "~$100 USD",             ar: "~$65 USD",             polar_win: false },
];

const HOW = [
  { n: "1", text: "Electrodos detectan señal eléctrica sobre el pecho" },
  { n: "2", text: "Hardware interno filtra y amplifica (como AD8232)" },
  { n: "3", text: "Algoritmo identifica picos R con precisión de ms" },
  { n: "4", text: "Bluetooth transmite FC + intervalos R-R en tiempo real" },
];

export default function S4_Block7Pulsioximetro() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 4, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic3Active = statuses?.find(s => s.dynamicId === 3)?.isActive ?? false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Heart size={14} /> Bloque 7 — Polar H10
        </div>
        <h1 className="text-4xl md:text-5xl font-black">Gold <span className="text-primary">Standard</span></h1>
        <p className="text-muted-foreground text-sm">El sensor de FC más preciso para uso deportivo</p>
      </motion.div>

      {/* Device hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <BorderBeam colorVariant="ocean" strength={0.75}>
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">

              {/* Visual */}
              <div className="flex justify-center">
                <div className="space-y-4 text-center">
                  <motion.div
                    className="mx-auto w-52 h-20 bg-gradient-to-r from-blue-700 to-blue-900 rounded-full flex items-center justify-center relative shadow-2xl shadow-blue-900/60"
                    animate={{ boxShadow: ["0 0 30px rgba(37,99,235,0.3)","0 0 60px rgba(37,99,235,0.6)","0 0 30px rgba(37,99,235,0.3)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                        <Heart className="text-white" size={26} />
                      </motion.div>
                    </div>
                    <div className="absolute -left-3 w-6 h-6 bg-gray-100 rounded-full border-2 border-blue-400 shadow"/>
                    <div className="absolute -right-3 w-6 h-6 bg-gray-100 rounded-full border-2 border-blue-400 shadow"/>
                  </motion.div>
                  <p className="text-white/30 text-xs tracking-[0.25em] uppercase">Polar H10</p>
                  <div className="flex items-center justify-center gap-2">
                    <motion.div className="w-2 h-2 rounded-full bg-green-400"
                      animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.9, repeat: Infinity }}/>
                    <span className="text-green-400 text-sm font-bold">68 bpm · HRV 72 ms</span>
                  </div>
                </div>
              </div>

              {/* Specs grid */}
              <div className="grid grid-cols-2 gap-3">
                {SPECS.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.07 }}
                    className="bg-white/5 rounded-2xl p-3">
                    <span className="text-xl">{s.emoji}</span>
                    <p className="text-white/40 text-[10px] mt-1">{s.label}</p>
                    <p className="text-white font-bold text-sm">{s.val}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        </BorderBeam>
      </motion.div>

      {/* How it works */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {HOW.map((h, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.08 }}>
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-black text-sm">{h.n}</div>
                <p className="text-xs leading-relaxed">{h.text}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* VS table */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <h2 className="text-base font-bold mb-3 text-muted-foreground uppercase tracking-wider">Polar H10 vs AR12plus</h2>
        <Card>
          <CardContent className="p-4 space-y-1.5">
            <div className="grid grid-cols-3 text-[10px] text-muted-foreground uppercase tracking-wide px-2 pb-2 border-b">
              <span></span><span className="text-blue-400 font-bold">Polar H10</span><span>AR12plus</span>
            </div>
            {VS.map((row, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.06 }}
                className="grid grid-cols-3 items-center gap-2 px-2 py-2 rounded-lg bg-muted/20 text-sm">
                <span className="text-xs font-medium text-muted-foreground">{row.cat}</span>
                <span className={`text-xs font-medium flex items-center gap-1 ${row.polar_win ? "text-blue-400" : "text-muted-foreground"}`}>
                  {row.polar_win && <CheckCircle2 size={11} className="text-blue-400 flex-shrink-0"/>}
                  {row.polar}
                </span>
                <span className={`text-xs flex items-center gap-1 ${!row.polar_win ? "text-green-400 font-medium" : "text-muted-foreground"}`}>
                  {!row.polar_win && <CheckCircle2 size={11} className="text-green-400 flex-shrink-0"/>}
                  {row.ar}
                </span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Dynamic 3 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            {isDynamic3Active ? (
              <Badge className="bg-green-600 text-white gap-1 px-4 py-1.5 text-sm">
                <Gamepad2 size={14} /> Dinámica Activa
              </Badge>
            ) : (
              <Button variant="outline" disabled className="gap-2 opacity-60">
                <Lock size={14} /> El profesor activará esta dinámica
              </Button>
            )}
          </div>
        </div>
        <AnimatePresence>
          {isDynamic3Active && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
              <S4_Dynamic3QuizPolarH10 />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}

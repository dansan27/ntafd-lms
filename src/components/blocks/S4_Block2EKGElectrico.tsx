import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Lock, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BorderBeam } from "border-beam";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import S4_Dynamic1IdentificaOnda from "../dynamics/S4_Dynamic1IdentificaOnda";

const WAVES = [
  { id: "P",  color: "#60a5fa", label: "Onda P",  tag: "Aurículas se contraen",    dur: "0.08–0.12 s" },
  { id: "Q",  color: "#f87171", label: "Onda Q",  tag: "Inicio despolarización",   dur: "< 0.04 s"    },
  { id: "R",  color: "#4ade80", label: "Onda R",  tag: "Pico ventricular",          dur: "dominante"   },
  { id: "S",  color: "#fb923c", label: "Onda S",  tag: "Base ventricular",          dur: "variable"    },
  { id: "T",  color: "#a78bfa", label: "Onda T",  tag: "Ventrículos se recargan",   dur: "0.16 s"      },
];

const FACT = "FC = 300 ÷ cuadros grandes entre 2 picos R";

export default function S4_Block2EKGElectrico() {
  const [sel, setSel] = useState<string | null>("R");
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 4, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic1Active = statuses?.find(s => s.dynamicId === 1)?.isActive ?? false;
  const wave = WAVES.find(w => w.id === sel);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Activity size={14} /> Bloque 2 — El Corazón Eléctrico
        </div>
        <h1 className="text-4xl md:text-5xl font-black">Ondas <span className="text-primary">P · QRS · T</span></h1>
        <p className="text-muted-foreground text-sm">Toca cada letra para explorar la onda</p>
      </motion.div>

      {/* Interactive ECG */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <BorderBeam colorVariant="ocean" strength={0.7}>
        <Card className="bg-sidebar text-sidebar-foreground overflow-hidden">
          <CardContent className="p-6 space-y-5">
            <div className="bg-black/40 rounded-2xl p-4 overflow-hidden">
              <svg viewBox="0 0 400 110" className="w-full h-32">
                {/* Grid */}
                {Array.from({ length: 21 }, (_, i) => <line key={`v${i}`} x1={i*20} y1="0" x2={i*20} y2="110" stroke="#22c55e" strokeWidth="0.3" opacity="0.2"/>)}
                {Array.from({ length: 6 }, (_, i) => <line key={`h${i}`} x1="0" y1={i*22} x2="400" y2={i*22} stroke="#22c55e" strokeWidth="0.3" opacity="0.2"/>)}
                {/* Baseline */}
                <line x1="0" y1="68" x2="400" y2="68" stroke="#4ade80" strokeWidth="0.5" opacity="0.25"/>
                {/* ECG path */}
                <motion.path
                  d="M 0,68 L 35,68 L 44,60 L 50,75 L 58,60 L 64,68 L 90,68 L 95,72 L 99,22 L 103,82 L 107,68 L 122,68 C 130,68 135,54 140,52 C 145,56 150,68 157,68 L 200,68 L 209,60 L 215,75 L 223,60 L 229,68 L 255,68 L 260,72 L 264,22 L 268,82 L 272,68 L 287,68 C 295,68 300,54 305,52 C 310,56 315,68 322,68 L 400,68"
                  fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8 }}
                />
                {/* Wave labels — beat 1 */}
                {[
                  { id:"P", cx:51, cy:52, hx:51, hy:80 },
                  { id:"Q", cx:95, cy:78, hx:95, hy:55 },
                  { id:"R", cx:99, cy:16, hx:99, hy:90 },
                  { id:"S", cx:103, cy:88, hx:103, hy:50 },
                  { id:"T", cx:140, cy:44, hx:140, hy:80 },
                ].map(({ id, cx, cy, hx, hy }) => {
                  const w = WAVES.find(w => w.id === id)!;
                  const isActive = sel === id;
                  return (
                    <g key={id} className="cursor-pointer" onClick={() => setSel(sel === id ? null : id)}>
                      <motion.circle cx={cx} cy={cy} r={isActive ? 13 : 10}
                        fill={isActive ? w.color : `${w.color}30`}
                        animate={{ r: isActive ? 13 : 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      <text x={cx} y={cy+4} textAnchor="middle" fill={isActive ? "#000" : w.color}
                        fontSize="9" fontWeight="bold">{id}</text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Info panel */}
            <AnimatePresence mode="wait">
              {wave ? (
                <motion.div key={wave.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-4 bg-white/5 rounded-2xl px-5 py-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0"
                    style={{ background: `${wave.color}25`, color: wave.color }}>{wave.id}</div>
                  <div>
                    <p className="font-bold text-white">{wave.label}</p>
                    <p className="text-white/60 text-sm">{wave.tag}</p>
                  </div>
                  <Badge className="ml-auto flex-shrink-0 bg-white/10 text-white/60 border-0 text-xs">{wave.dur}</Badge>
                </motion.div>
              ) : (
                <p className="text-center text-white/30 text-xs">Toca una letra del trazado</p>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
        </BorderBeam>
      </motion.div>

      {/* Wave pills */}
      <div className="flex flex-wrap gap-3 justify-center">
        {WAVES.map((w, i) => (
          <motion.button key={w.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.07 }} whileHover={{ scale: 1.05 }}
            onClick={() => setSel(sel === w.id ? null : w.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
              sel === w.id ? "text-white" : "border-border text-muted-foreground"
            }`}
            style={sel === w.id ? { borderColor: w.color, background: `${w.color}20`, color: w.color } : {}}>
            <span className="font-black">{w.id}</span>
            <span className="hidden sm:inline">{w.tag}</span>
          </motion.button>
        ))}
      </div>

      {/* Key formula */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
        <Card className="border-primary/20 bg-primary/5 text-center">
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Fórmula clave</p>
            <p className="text-2xl font-black text-primary">{FACT}</p>
            <p className="text-sm text-muted-foreground mt-1">Ej: 4 cuadros → 300 ÷ 4 = <strong>75 bpm</strong></p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dynamic 1 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
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
              <Button variant="outline" disabled className="gap-2 opacity-60">
                <Lock size={14} /> El profesor activará esta dinámica
              </Button>
            )}
          </div>
        </div>
        <AnimatePresence>
          {isDynamic1Active && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
              <S4_Dynamic1IdentificaOnda />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}

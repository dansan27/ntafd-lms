import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, Lock, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import S4_Dynamic2ClasificaEquipo from "../dynamics/S4_Dynamic2ClasificaEquipo";

const ELECTRODES = [
  { id: "RA", label: "RA", fullName: "Right Arm",  color: "#ef4444", desc: "Brazo derecho" },
  { id: "LA", label: "LA", fullName: "Left Arm",   color: "#eab308", desc: "Brazo izquierdo" },
  { id: "LL", label: "LL", fullName: "Left Leg",   color: "#22c55e", desc: "Pierna izquierda" },
];

const AD8232_STEPS = [
  { n: "1", label: "Amplificación", sub: "×100 — eleva 0.1–2 mV a nivel legible", color: "bg-yellow-500/20 text-yellow-500" },
  { n: "2", label: "Filtro Paso Alto", sub: "0.5 Hz — elimina deriva por movimiento", color: "bg-blue-500/20 text-blue-500" },
  { n: "3", label: "Filtro Paso Bajo", sub: "40–100 Hz — elimina ruido muscular", color: "bg-purple-500/20 text-purple-500" },
  { n: "4", label: "Salida analógica", sub: "0–3.3 V → pin A0 de Arduino", color: "bg-green-500/20 text-green-500" },
];

const CHAIN = ["RA / LA / LL", "AD8232", "Arduino", "Serial / BT", "App"];

export default function S4_Block3SenalEKG() {
  const { data: statuses } = trpc.dynamics.activeStatuses.useQuery(
    { weekId: 4, classId: 1 },
    { refetchInterval: 3000 }
  );
  const isDynamic2Active = statuses?.find(s => s.dynamicId === 2)?.isActive ?? false;
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Cpu size={14} /> Bloque 3 — Señal EKG
        </div>
        <h1 className="text-4xl md:text-5xl font-black">Módulo <span className="text-primary">AD8232</span></h1>
        <p className="text-muted-foreground text-sm">3 electrodos → señal limpia → microcontrolador</p>
      </motion.div>

      {/* Body + electrodes */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">

              {/* SVG body */}
              <div className="flex justify-center">
                <svg viewBox="0 0 140 200" className="w-48 h-64">
                  {/* Body */}
                  <ellipse cx="70" cy="24" rx="20" ry="22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
                  <rect x="42" y="46" width="56" height="70" rx="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
                  <line x1="42" y1="56" x2="10" y2="105" stroke="rgba(255,255,255,0.12)" strokeWidth="10" strokeLinecap="round"/>
                  <line x1="98" y1="56" x2="130" y2="105" stroke="rgba(255,255,255,0.12)" strokeWidth="10" strokeLinecap="round"/>
                  <line x1="54" y1="116" x2="50" y2="185" stroke="rgba(255,255,255,0.12)" strokeWidth="10" strokeLinecap="round"/>
                  <line x1="86" y1="116" x2="90" y2="185" stroke="rgba(255,255,255,0.12)" strokeWidth="10" strokeLinecap="round"/>

                  {/* Dashed lines to heart */}
                  <line x1="10" y1="80" x2="60" y2="80" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,3" opacity="0.6"/>
                  <line x1="130" y1="80" x2="80" y2="80" stroke="#eab308" strokeWidth="1" strokeDasharray="4,3" opacity="0.6"/>
                  <line x1="90" y1="175" x2="76" y2="92" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,3" opacity="0.6"/>

                  {/* Heart */}
                  <motion.path
                    d="M70,88 C70,88 55,78 55,68 C55,62 61,58 65,58 C67,58 69,60 70,62 C71,60 73,58 75,58 C79,58 85,62 85,68 C85,78 70,88 70,88Z"
                    fill="rgba(248,113,113,0.25)" stroke="#f87171" strokeWidth="1.5"
                    animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                  />

                  {/* Electrode dots */}
                  {[
                    { cx: 10, cy: 80, color: "#ef4444", label: "RA" },
                    { cx: 130, cy: 80, color: "#eab308", label: "LA" },
                    { cx: 90, cy: 175, color: "#22c55e", label: "LL" },
                  ].map(({ cx, cy, color, label }) => (
                    <g key={label}>
                      <motion.circle cx={cx} cy={cy} r={9} fill={color} opacity={0.85}
                        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.6, repeat: Infinity, delay: label === "LA" ? 0.5 : label === "LL" ? 1 : 0 }}/>
                      <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">{label}</text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Electrode list */}
              <div className="space-y-3">
                {ELECTRODES.map((el) => (
                  <div key={el.id} className="flex items-center gap-4 bg-white/5 rounded-2xl px-4 py-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white"
                      style={{ background: `${el.color}40`, border: `1px solid ${el.color}60` }}>
                      {el.id}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{el.fullName}</p>
                      <p className="text-white/50 text-xs">{el.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AD8232 pipeline */}
      <div>
        <h2 className="text-base font-bold mb-3 text-muted-foreground uppercase tracking-wider">Dentro del AD8232</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {AD8232_STEPS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${s.color}`}>{s.n}</div>
                  <p className="font-bold text-sm">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Signal chain */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium">
              {CHAIN.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-primary font-bold">{item}</span>
                  {i < CHAIN.length - 1 && <span className="text-muted-foreground">→</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dynamic 2 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            {isDynamic2Active ? (
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
          {isDynamic2Active && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
              <S4_Dynamic2ClasificaEquipo />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}

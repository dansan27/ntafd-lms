import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, Monitor, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageLightbox } from "@/components/ui/ImageLightbox";

type Tab = "12lead" | "sport";

// Full 12-lead electrodes
const LEADS_12 = [
  // Limb leads — color red/yellow/green/black
  { id: "RA", label: "RA", x: 105, y: 72, color: "#ef4444", group: "limb", desc: "Brazo derecho" },
  { id: "LA", label: "LA", x: 175, y: 72, color: "#eab308", group: "limb", desc: "Brazo izquierdo" },
  { id: "LL", label: "LL", x: 168, y: 200, color: "#22c55e", group: "limb", desc: "Pierna izquierda" },
  { id: "RL", label: "RL", x: 112, y: 200, color: "#64748b", group: "limb", desc: "Pierna derecha (tierra)" },
  // Precordial V1-V6
  { id: "V1", label: "V1", x: 128, y: 108, color: "#a855f7", group: "precordial", desc: "4° EIC derecho del esternón" },
  { id: "V2", label: "V2", x: 138, y: 112, color: "#9333ea", group: "precordial", desc: "4° EIC izquierdo del esternón" },
  { id: "V3", label: "V3", x: 148, y: 122, color: "#7c3aed", group: "precordial", desc: "Entre V2 y V4" },
  { id: "V4", label: "V4", x: 155, y: 132, color: "#6d28d9", group: "precordial", desc: "5° EIC línea medioclavicular" },
  { id: "V5", label: "V5", x: 163, y: 132, color: "#5b21b6", group: "precordial", desc: "Línea axilar anterior" },
  { id: "V6", label: "V6", x: 170, y: 133, color: "#4c1d95", group: "precordial", desc: "Línea axilar media" },
];

// Simplified sport leads
const LEADS_SPORT = [
  { id: "RA", label: "RA", x: 105, y: 72, color: "#ef4444", desc: "Brazo derecho / bajo clavícula" },
  { id: "LA", label: "LA", x: 175, y: 72, color: "#eab308", desc: "Brazo izquierdo / bajo clavícula" },
  { id: "LL", label: "LL", x: 168, y: 200, color: "#22c55e", desc: "Pierna izquierda / bajo pectoral" },
];

const COMPARISON = [
  { feature: "Electrodos", clinical: "10 electrodos", sport: "2–3 electrodos" },
  { feature: "Derivaciones", clinical: "12 vistas", sport: "1 derivación (DII)" },
  { feature: "Diagnóstico", clinical: "Clínico completo", sport: "FC y HRV" },
  { feature: "Movilidad", clinical: "Laboratorio/clínica", sport: "Campo, 24 h" },
  { feature: "Ejemplo", clinical: "ECG 12D / Holter", sport: "Polar H10 / AD8232" },
];

// Simple torso silhouette path
const TORSO_PATH = "M140,30 C120,30 108,45 105,60 L102,68 L105,215 L175,215 L178,68 L175,60 C172,45 160,30 140,30 Z";
// Arms
const ARM_L = "M105,70 L80,120 L85,122 L112,75 Z";
const ARM_R = "M175,70 L200,120 L195,122 L168,75 Z";
// Head
const HEAD_PATH = "M140,28 m-16,0 a16,18 0 1,0 32,0 a16,18 0 1,0 -32,0";

export default function S3C2_Block4Derivaciones() {
  const [activeTab, setActiveTab] = useState<Tab>("12lead");
  const [hoveredLead, setHoveredLead] = useState<string | null>(null);

  const currentLeads = activeTab === "12lead" ? LEADS_12 : LEADS_SPORT;
  const hoveredData = currentLeads.find((l) => l.id === hoveredLead);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <GitBranch size={14} />
          Bloque 4 — Sistemas de Derivaciones
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          12 ojos sobre el{" "}
          <span className="text-primary">corazón</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Cada derivación es una perspectiva diferente de la actividad eléctrica cardíaca.
        </p>
      </motion.div>

      {/* Tab selector */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center gap-2"
      >
        <Button
          variant={activeTab === "12lead" ? "default" : "outline"}
          onClick={() => setActiveTab("12lead")}
          className="rounded-full gap-2"
        >
          <Monitor size={14} />
          12 Derivaciones (Clínico)
        </Button>
        <Button
          variant={activeTab === "sport" ? "default" : "outline"}
          onClick={() => setActiveTab("sport")}
          className="rounded-full gap-2"
        >
          <Radio size={14} />
          Simplificado (Deporte)
        </Button>
      </motion.div>

      {/* Body silhouette + electrode placement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* SVG body */}
              <div className="flex justify-center">
                <svg viewBox="70 0 140 240" className="w-52 h-64">
                  {/* Body outline */}
                  <path d={HEAD_PATH} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                  <path d={TORSO_PATH} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                  <path d={ARM_L} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <path d={ARM_R} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                  {/* Electrode dots with staggered animation */}
                  <AnimatePresence mode="wait">
                    {currentLeads.map((lead, i) => (
                      <motion.g
                        key={`${activeTab}-${lead.id}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ delay: i * 0.07, type: "spring", stiffness: 260 }}
                        onMouseEnter={() => setHoveredLead(lead.id)}
                        onMouseLeave={() => setHoveredLead(null)}
                        style={{ cursor: "pointer" }}
                      >
                        {/* Pulse ring on hover */}
                        {hoveredLead === lead.id && (
                          <motion.circle
                            cx={lead.x}
                            cy={lead.y}
                            r="10"
                            fill="none"
                            stroke={lead.color}
                            strokeWidth="1.5"
                            animate={{ r: [8, 14], opacity: [0.8, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                          />
                        )}
                        <circle
                          cx={lead.x}
                          cy={lead.y}
                          r={hoveredLead === lead.id ? 7 : 5}
                          fill={lead.color}
                          opacity={0.9}
                          style={{ transition: "r 0.15s" }}
                        />
                        <text
                          x={lead.x}
                          y={lead.y - 8}
                          textAnchor="middle"
                          fill="white"
                          fontSize="6.5"
                          fontWeight="bold"
                        >
                          {lead.label}
                        </text>
                      </motion.g>
                    ))}
                  </AnimatePresence>
                </svg>
              </div>

              {/* Lead legend */}
              <div className="space-y-3">
                <AnimatePresence mode="wait">
                  {hoveredData ? (
                    <motion.div
                      key={hoveredData.id}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="p-3 rounded-2xl bg-white/10 mb-3"
                    >
                      <p className="text-white font-bold text-sm">{hoveredData.label}</p>
                      <p className="text-white/60 text-xs">{hoveredData.desc}</p>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="hint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-white/40 text-xs mb-3"
                    >
                      Pasa el cursor sobre los electrodos para ver su posición
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  {activeTab === "12lead" ? (
                    <>
                      <p className="text-white/60 text-xs uppercase tracking-widest font-medium">Derivaciones de miembros</p>
                      <div className="flex flex-wrap gap-1.5">
                        {["DI", "DII", "DIII", "aVR", "aVL", "aVF"].map((d) => (
                          <Badge key={d} className="bg-red-500/20 text-red-300 text-xs">{d}</Badge>
                        ))}
                      </div>
                      <p className="text-white/60 text-xs uppercase tracking-widest font-medium mt-3">Derivaciones precordiales</p>
                      <div className="flex flex-wrap gap-1.5">
                        {["V1", "V2", "V3", "V4", "V5", "V6"].map((d) => (
                          <Badge key={d} className="bg-purple-500/20 text-purple-300 text-xs">{d}</Badge>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      {[
                        { name: "AD8232 (DIY)", desc: "3 electrodos → derivación II. Ideal para prácticas con Arduino." },
                        { name: "Polar H10", desc: "2 electrodos en cinturón pectoral → ECG simplificado + intervalos RR." },
                      ].map((d, i) => (
                        <motion.div
                          key={d.name}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.1 }}
                          className="p-3 rounded-2xl bg-white/10"
                        >
                          <p className="text-white font-semibold text-sm">{d.name}</p>
                          <p className="text-white/60 text-xs mt-1">{d.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Comparison table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-bold text-center flex items-center justify-center gap-2">
              <GitBranch size={16} className="text-primary" />
              ECG Clínico vs Deportivo — Comparativa
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Característica</th>
                    <th className="text-center py-2 px-3 text-primary font-medium">Clínico (12D)</th>
                    <th className="text-center py-2 px-3 text-emerald-600 font-medium">Deportivo</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <motion.tr
                      key={row.feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.08 }}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-medium text-muted-foreground">{row.feature}</td>
                      <td className="py-2.5 px-3 text-center">{row.clinical}</td>
                      <td className="py-2.5 px-3 text-center">{row.sport}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Real electrode placement photo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid md:grid-cols-2 gap-4 items-center"
      >
        <ImageLightbox
          src="/images/electrodos-ekg-1.png"
          alt="Colocación real de electrodos ECG en deportista"
          caption="Electrodos en atleta real — configuración deportiva. Clic para ampliar"
        />
        <div className="space-y-3">
          <h3 className="font-bold text-base">Del diagrama a la práctica</h3>
          <p className="text-sm text-muted-foreground">La colocación precisa de los electrodos determina la calidad de la señal. En el deporte se priorizan configuraciones que minimicen los artefactos de movimiento.</p>
          <div className="space-y-2">
            {[
              { color: "bg-red-500", label: "RA — Bajo clavícula derecha" },
              { color: "bg-yellow-500", label: "LA — Bajo clavícula izquierda" },
              { color: "bg-green-500", label: "LL — Flanco izquierdo, bajo pectoral" },
            ].map((e, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + i * 0.1 }}
                className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${e.color} flex-shrink-0`} />
                <span className="text-muted-foreground">{e.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* View angle explainer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { color: "text-red-500", bg: "bg-red-500/10", title: "Vista Frontal", leads: "DI, DII, DIII, aVR, aVL, aVF", desc: "Las derivaciones de miembros ven el corazón desde el plano frontal" },
          { color: "text-purple-500", bg: "bg-purple-500/10", title: "Vista Horizontal", leads: "V1 → V6", desc: "Las precordiales rodean el pecho y ven el corazón en sección transversal" },
          { color: "text-emerald-500", bg: "bg-emerald-500/10", title: "Derivación II (Deporte)", leads: "RA → LL", desc: "La más usada en monitoreo deportivo. Eje paralelo al corazón → amplitud máxima" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.12 }}
            whileHover={{ y: -3 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-2">
                <div className={`p-2 rounded-xl ${item.bg} w-fit`}>
                  <span className={`text-xs font-mono font-bold ${item.color}`}>{item.leads}</span>
                </div>
                <h4 className="font-bold text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Eye, Heart } from "lucide-react";

// ── Physics constants ─────────────────────────────────────────────────────────
const HEART_RATE_BPM = 72;
const PERIOD_MS = (60 / HEART_RATE_BPM) * 1000; // 833 ms / beat
const WAVEFORM_MS = 4000; // 4 seconds of history shown

// ── Helpers ───────────────────────────────────────────────────────────────────

// Realistic PPG waveform shape (phase 0→1 = one heartbeat)
function ppgShape(phase: number): number {
  const p = ((phase % 1) + 1) % 1;
  const systolic  = Math.exp(-30 * (p - 0.20) ** 2);            // main peak
  const dicrotic  = Math.exp(-80 * (p - 0.46) ** 2) * 0.22;     // dicrotic notch
  const decay     = p > 0.20 ? Math.exp(-4 * (p - 0.20)) * 0.10 : 0;
  return Math.max(0, Math.min(1, systolic + dicrotic + decay));
}

// Interpolate two hex colors
function lerpColor(hex1: string, hex2: string, t: number): string {
  const parse = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(hex1);
  const [r2, g2, b2] = parse(hex2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

// Generate SVG path for a scrolling PPG channel
// channelAbsorption: how much this wavelength is absorbed by blood (0→1)
// → larger absorption = larger AC pulsatile signal seen at detector
function makePPGPath(w: number, h: number, nowMs: number, channelAbsorption: number): string {
  const mt = 8, mb = 8;
  const plotH = h - mt - mb;
  const n = 120;
  const parts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * w;
    const sampleT = nowMs - WAVEFORM_MS + (i / n) * WAVEFORM_MS;
    const phase = (sampleT % PERIOD_MS) / PERIOD_MS;
    const amp = ppgShape(phase) * channelAbsorption;
    const y = mt + plotH - amp * plotH;
    parts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return parts.join(" ");
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function S5_SimuladorPulsioximetro() {
  const [spo2, setSpo2] = useState(98);

  // SVG element refs — updated directly by rAF loop (no React re-renders)
  const bloodRef      = useRef<SVGEllipseElement>(null);
  const ledRedGlow    = useRef<SVGCircleElement>(null);
  const ledIRGlow     = useRef<SVGCircleElement>(null);
  const beamRed       = useRef<SVGLineElement>(null);
  const beamIR        = useRef<SVGLineElement>(null);
  const photoRect     = useRef<SVGRectElement>(null);
  const pathRed       = useRef<SVGPathElement>(null);
  const pathIR        = useRef<SVGPathElement>(null);
  const spo2Ref       = useRef(spo2);
  const animId        = useRef(0);

  // Keep ref in sync with slider state
  useEffect(() => { spo2Ref.current = spo2; }, [spo2]);

  // 60 fps animation loop — all DOM writes bypass React
  useEffect(() => {
    function tick() {
      const now = Date.now();
      const s = spo2Ref.current;
      const norm = (s - 70) / 30;          // 0 at SpO2=70 %, 1 at SpO2=100 %

      // Absorption coefficients (Beer–Lambert approximation)
      // HHb absorbs red → redAbsorb HIGH when SpO2 LOW
      // HbO₂ absorbs IR  → irAbsorb  HIGH when SpO2 HIGH
      const redAbsorb = 0.85 - norm * 0.70;
      const irAbsorb  = 0.15 + norm * 0.70;

      // Beat phase & pulse shape
      const phase    = (now % PERIOD_MS) / PERIOD_MS;
      const pulse    = ppgShape(phase);
      const isRedLED = phase < 0.5;         // LEDs alternate each half-period
      const ledPulse = ppgShape(isRedLED ? phase * 2 : (phase - 0.5) * 2);

      // ── Blood vessel ──────────────────────────────────────────────────────
      if (bloodRef.current) {
        bloodRef.current.setAttribute("fill", lerpColor("#4c0519", "#ef4444", norm));
        bloodRef.current.setAttribute("opacity", (0.55 + pulse * 0.40).toFixed(3));
        // Vessel expands slightly each beat (systole)
        const rx = (26 + pulse * 5).toFixed(1);
        const ry = (36 + pulse * 6).toFixed(1);
        bloodRef.current.setAttribute("rx", rx);
        bloodRef.current.setAttribute("ry", ry);
      }

      // ── LED glows ─────────────────────────────────────────────────────────
      if (ledRedGlow.current) {
        const on = isRedLED;
        ledRedGlow.current.setAttribute("opacity", on ? (0.35 + ledPulse * 0.65).toFixed(2) : "0.10");
        ledRedGlow.current.setAttribute("r",       on ? (9  + ledPulse * 7).toFixed(1)  : "9");
      }
      if (ledIRGlow.current) {
        const on = !isRedLED;
        ledIRGlow.current.setAttribute("opacity", on ? (0.35 + ledPulse * 0.65).toFixed(2) : "0.10");
        ledIRGlow.current.setAttribute("r",       on ? (9  + ledPulse * 7).toFixed(1)  : "9");
      }

      // ── Light beams (transmission = 1 − absorption) ──────────────────────
      const redTx = (1 - redAbsorb); // high when SpO2 high (less red absorbed)
      const irTx  = (1 - irAbsorb);  // high when SpO2 low  (less IR absorbed)

      if (beamRed.current) {
        const op = redTx * (isRedLED ? 0.30 + ledPulse * 0.70 : 0.04);
        beamRed.current.setAttribute("opacity",      op.toFixed(3));
        beamRed.current.setAttribute("stroke-width", (1 + redTx * 3).toFixed(1));
      }
      if (beamIR.current) {
        const op = irTx * (!isRedLED ? 0.30 + ledPulse * 0.70 : 0.04);
        beamIR.current.setAttribute("opacity",      op.toFixed(3));
        beamIR.current.setAttribute("stroke-width", (1 + irTx * 3).toFixed(1));
      }

      // ── Photodetector flash ───────────────────────────────────────────────
      if (photoRect.current) {
        const signal = isRedLED
          ? redTx * (0.2 + ledPulse * 0.8)
          : irTx  * (0.2 + ledPulse * 0.8);
        photoRect.current.setAttribute(
          "fill",
          lerpColor("#1e293b", isRedLED ? "#dc2626" : "#7c3aed", Math.min(1, signal * 1.2))
        );
      }

      // ── PPG waveforms ─────────────────────────────────────────────────────
      if (pathRed.current)
        pathRed.current.setAttribute("d", makePPGPath(400, 80, now, redAbsorb));
      if (pathIR.current)
        pathIR.current.setAttribute("d", makePPGPath(400, 80, now, irAbsorb));

      animId.current = requestAnimationFrame(tick);
    }
    animId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId.current);
  }, []);

  // ── Derived display values (re-render only on slider change) ──────────────
  const norm           = (spo2 - 70) / 30;
  const redAbsorbPct   = Math.round((0.85 - norm * 0.70) * 100);
  const irAbsorbPct    = Math.round((0.15 + norm * 0.70) * 100);
  const ratio          = (redAbsorbPct / irAbsorbPct).toFixed(3);
  const spo2Color      = spo2 >= 95 ? "text-green-400" : spo2 >= 90 ? "text-yellow-400" : "text-red-400";
  const statusLabel    = spo2 >= 95 ? "Normal"         : spo2 >= 90 ? "Hipoxia leve"    : "Emergencia";
  const statusCls      = spo2 >= 95
    ? "bg-green-500/20 text-green-300 border-green-500/30"
    : spo2 >= 90
    ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    : "bg-red-500/20 text-red-300 border-red-500/30";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Eye size={14} /> Simulador Interactivo
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight">
          Pulsioxímetro en <span className="text-primary">tiempo real</span>
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Ajusta la saturación de O₂ y observa cómo cambian los LEDs, la absorción de luz y la señal PPG.
        </p>
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ── Finger SVG ───────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-sidebar text-sidebar-foreground h-full">
            <CardContent className="p-6 flex flex-col items-center gap-3">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Sección transversal — dedo</p>

              <svg viewBox="0 0 180 310" className="w-44 h-72">
                <defs>
                  <radialGradient id="skinGrad" cx="50%" cy="60%">
                    <stop offset="0%"   stopColor="#fde68a" stopOpacity="0.9" />
                    <stop offset="60%"  stopColor="#fb923c" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#c2410c" stopOpacity="0.5" />
                  </radialGradient>
                  <filter id="glow4">
                    <feGaussianBlur stdDeviation="4" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="glow8">
                    <feGaussianBlur stdDeviation="8" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* Finger body */}
                <rect x="18" y="28" width="144" height="210" rx="72" fill="url(#skinGrad)" />
                <rect x="18" y="28" width="144" height="210" rx="72" fill="none" stroke="#fdba74" strokeWidth="1.5" opacity="0.5" />

                {/* Fingernail */}
                <ellipse cx="90" cy="42" rx="38" ry="14" fill="#fef9c3" opacity="0.35" />
                <ellipse cx="90" cy="38" rx="30" ry="9"  fill="none" stroke="#fef08a" strokeWidth="1" opacity="0.3" />

                {/* Capillary vessel — animated via ref */}
                <ellipse ref={bloodRef} cx="90" cy="148" rx="26" ry="36" fill="#ef4444" opacity="0.7" />
                {/* Inner vessel ring */}
                <ellipse cx="90" cy="148" rx="14" ry="20" fill="none" stroke="white" strokeWidth="1.5" opacity="0.12" />

                {/* Light beam — Red */}
                <line ref={beamRed}
                  x1="57" y1="244" x2="90" y2="44"
                  stroke="#ef4444" strokeWidth="2" opacity="0.25"
                  strokeDasharray="5 4" strokeLinecap="round" />

                {/* Light beam — IR */}
                <line ref={beamIR}
                  x1="123" y1="244" x2="90" y2="44"
                  stroke="#7c3aed" strokeWidth="2" opacity="0.25"
                  strokeDasharray="5 4" strokeLinecap="round" />

                {/* Photodetector */}
                <rect ref={photoRect}
                  x="54" y="30" width="72" height="20" rx="6"
                  fill="#1e293b" stroke="#4b5563" strokeWidth="1" />
                <text x="90" y="43" textAnchor="middle" fill="white" fontSize="7.5"
                  fontFamily="monospace" fontWeight="bold" opacity="0.8">DETECTOR</text>

                {/* Tissue texture dots */}
                {[[42,90],[138,80],[35,145],[145,160],[50,200],[130,195]].map(([cx,cy],i) => (
                  <circle key={i} cx={cx} cy={cy} r="2" fill="#fb923c" opacity="0.18" />
                ))}

                {/* LED Red — glow + core */}
                <circle ref={ledRedGlow} cx="57" cy="255" r="9" fill="#ef4444" opacity="0.4" filter="url(#glow8)" />
                <circle cx="57" cy="255" r="7" fill="#ef4444" />
                <circle cx="57" cy="253" r="2.5" fill="#fca5a5" opacity="0.8" />
                <text x="57" y="272" textAnchor="middle" fill="#fca5a5" fontSize="7" fontWeight="bold">660 nm</text>
                <text x="57" y="281" textAnchor="middle" fill="#fca5a5" fontSize="6.5">ROJO</text>

                {/* LED IR — glow + core */}
                <circle ref={ledIRGlow} cx="123" cy="255" r="9" fill="#7c3aed" opacity="0.4" filter="url(#glow8)" />
                <circle cx="123" cy="255" r="7" fill="#7c3aed" />
                <circle cx="123" cy="253" r="2.5" fill="#c4b5fd" opacity="0.8" />
                <text x="123" y="272" textAnchor="middle" fill="#c4b5fd" fontSize="7" fontWeight="bold">940 nm</text>
                <text x="123" y="281" textAnchor="middle" fill="#c4b5fd" fontSize="6.5">IR</text>

                {/* Bottom label */}
                <text x="90" y="300" textAnchor="middle" fill="#6b7280" fontSize="7">Modo transmisión</text>
              </svg>

              {/* LED legend */}
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
                  <span className="text-muted-foreground">LED Rojo — alterna</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-violet-500 shadow-sm shadow-violet-500/50" />
                  <span className="text-muted-foreground">LED IR — alterna</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Controls ─────────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-4">

          {/* SpO2 big display */}
          <Card className="bg-sidebar text-sidebar-foreground">
            <CardContent className="p-6 text-center space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Saturación de O₂</p>
              <div className={`text-8xl font-black tabular-nums leading-none ${spo2Color}`}>
                {spo2}<span className="text-4xl">%</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Badge className={`text-sm px-4 py-1 border ${statusCls}`}>{statusLabel}</Badge>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Heart size={14} className="text-rose-400 animate-pulse" />
                <span>{HEART_RATE_BPM} bpm — ritmo sinusal</span>
              </div>
            </CardContent>
          </Card>

          {/* Slider */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ajustar SpO₂</p>
              <input
                type="range"
                min={70} max={100} step={1}
                value={spo2}
                onChange={e => setSpo2(Number(e.target.value))}
                className="w-full h-4 rounded-full appearance-none cursor-pointer outline-none"
                style={{
                  background: `linear-gradient(to right,
                    #ef4444 0%,
                    #f97316 15%,
                    #eab308 35%,
                    #22c55e 65%,
                    #22c55e 100%
                  )`,
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="text-red-400 font-medium">70% — Emergencia</span>
                <span className="text-yellow-400 font-medium">90%</span>
                <span className="text-green-400 font-medium">100% — Óptimo</span>
              </div>
            </CardContent>
          </Card>

          {/* R/IR ratio */}
          <Card>
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ratio R/IR</p>
                <Badge className="font-mono text-sm bg-primary/20 text-primary">{ratio}</Badge>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400"
                  animate={{ width: `${(parseFloat(ratio) / 3) * 100}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {spo2 >= 95
                  ? "Ratio bajo → sangre bien oxigenada (HbO₂ domina)"
                  : spo2 >= 85
                  ? "Ratio medio → hipoxia leve"
                  : "Ratio alto → sangre desoxigenada (HHb domina)"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Absorption bars ────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <Card>
          <CardContent className="p-6 space-y-5">
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Absorción de luz por la hemoglobina
            </p>

            {/* Red 660 nm */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow shadow-red-500/40" />
                  <span className="font-medium">LED Rojo — 660 nm</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    absorbido por HHb (desoxigenada)
                  </span>
                </div>
                <span className="font-black text-red-400 tabular-nums">{redAbsorbPct}%</span>
              </div>
              <div className="h-5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 flex items-center pl-3"
                  animate={{ width: `${redAbsorbPct}%` }}
                  transition={{ duration: 0.25 }}
                >
                  {redAbsorbPct > 30 && (
                    <span className="text-white text-[9px] font-bold opacity-80">ABSORCIÓN ALTA</span>
                  )}
                </motion.div>
              </div>
            </div>

            {/* IR 940 nm */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-violet-500 shadow shadow-violet-500/40" />
                  <span className="font-medium">LED Infrarrojo — 940 nm</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    absorbido por HbO₂ (oxigenada)
                  </span>
                </div>
                <span className="font-black text-violet-400 tabular-nums">{irAbsorbPct}%</span>
              </div>
              <div className="h-5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-violet-700 via-violet-500 to-violet-400 flex items-center pl-3"
                  animate={{ width: `${irAbsorbPct}%` }}
                  transition={{ duration: 0.25 }}
                >
                  {irAbsorbPct > 30 && (
                    <span className="text-white text-[9px] font-bold opacity-80">ABSORCIÓN ALTA</span>
                  )}
                </motion.div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs space-y-0.5">
                <p className="font-bold text-red-400">SpO₂ baja → rojo ↑</p>
                <p className="text-muted-foreground">Más HHb = más absorción roja</p>
              </div>
              <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-3 text-xs space-y-0.5">
                <p className="font-bold text-violet-400">SpO₂ alta → IR ↑</p>
                <p className="text-muted-foreground">Más HbO₂ = más absorción IR</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── PPG Waveforms ──────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Señal PPG — Fotopletismografía
              </p>
              <Badge className="bg-green-500/20 text-green-300 text-xs">En vivo</Badge>
            </div>

            {/* Red channel */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-medium text-red-400">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Canal Rojo — 660 nm
                <span className="text-muted-foreground font-normal ml-1">
                  (amplitud alta cuando SpO₂ baja)
                </span>
              </div>
              <div className="bg-black/40 rounded-xl p-2 overflow-hidden border border-red-500/10">
                <svg viewBox="0 0 400 80" className="w-full h-16" preserveAspectRatio="none">
                  {[20, 40, 60].map(y => (
                    <line key={y} x1="0" y1={y} x2="400" y2={y}
                      stroke="#1f2937" strokeWidth="0.8" />
                  ))}
                  {[100, 200, 300].map(x => (
                    <line key={x} x1={x} y1="0" x2={x} y2="80"
                      stroke="#1f2937" strokeWidth="0.8" />
                  ))}
                  <path ref={pathRed} d="" fill="none"
                    stroke="#ef4444" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* IR channel */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-medium text-violet-400">
                <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                Canal Infrarrojo — 940 nm
                <span className="text-muted-foreground font-normal ml-1">
                  (amplitud alta cuando SpO₂ sube)
                </span>
              </div>
              <div className="bg-black/40 rounded-xl p-2 overflow-hidden border border-violet-500/10">
                <svg viewBox="0 0 400 80" className="w-full h-16" preserveAspectRatio="none">
                  {[20, 40, 60].map(y => (
                    <line key={y} x1="0" y1={y} x2="400" y2={y}
                      stroke="#1f2937" strokeWidth="0.8" />
                  ))}
                  {[100, 200, 300].map(x => (
                    <line key={x} x1={x} y1="0" x2={x} y2="80"
                      stroke="#1f2937" strokeWidth="0.8" />
                  ))}
                  <path ref={pathIR} d="" fill="none"
                    stroke="#7c3aed" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              💡 Prueba: baja SpO₂ al <span className="text-red-400 font-medium">70%</span> — el canal rojo
              se amplifica y el infrarrojo se achica. Sube al{" "}
              <span className="text-green-400 font-medium">100%</span> y los roles se invierten.
              El <span className="text-primary font-medium">ratio R/IR</span> entre estas amplitudes es
              exactamente lo que el sensor convierte en SpO₂.
            </p>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
}

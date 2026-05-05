import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

const HR = 72;
const PERIOD_MS = (60 / HR) * 1000;
const HISTORY = 220;
const VW = 500;
const VH = 110;

function ppgShape(phase: number): number {
  const p = ((phase % 1) + 1) % 1;
  const systolic = Math.exp(-30 * (p - 0.20) ** 2);
  const dicrotic = Math.exp(-80 * (p - 0.46) ** 2) * 0.22;
  const decay = p > 0.20 ? Math.exp(-4 * (p - 0.20)) * 0.10 : 0;
  return Math.max(0, Math.min(1, systolic + dicrotic + decay));
}

function buildPath(hist: number[], yCenter: number, amplitude: number): string {
  return hist
    .map((v, i) => {
      const x = (i / (HISTORY - 1)) * VW;
      const y = yCenter - v * amplitude;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function S5_ComparadorSmartVsOxi() {
  const greenCircleRef = useRef<SVGCircleElement>(null);
  const redRectRef    = useRef<SVGRectElement>(null);
  const irRectRef     = useRef<SVGRectElement>(null);
  const greenPathRef  = useRef<SVGPathElement>(null);
  const redPathRef    = useRef<SVGPathElement>(null);
  const irPathRef     = useRef<SVGPathElement>(null);
  const animId        = useRef(0);

  useEffect(() => {
    const gh: number[] = new Array(HISTORY).fill(0);
    const rh: number[] = new Array(HISTORY).fill(0);
    const ih: number[] = new Array(HISTORY).fill(0);

    function tick() {
      const now   = Date.now();
      const phase = (now % PERIOD_MS) / PERIOD_MS;
      const pulse = ppgShape(phase);

      gh.shift(); gh.push(pulse);
      rh.shift(); rh.push(pulse);
      ih.shift(); ih.push(pulse);

      // Green LED pulse
      const gr = (22 + pulse * 18).toFixed(1);
      if (greenCircleRef.current) {
        greenCircleRef.current.setAttribute("r", gr);
        greenCircleRef.current.style.filter = `drop-shadow(0 0 ${(4 + pulse * 14).toFixed(0)}px rgba(74,222,128,0.85))`;
      }

      // Red / IR LEDs alternate at 2× heart rate
      const ledPhase = (now % (PERIOD_MS * 0.5)) / (PERIOD_MS * 0.5);
      const isRed    = ledPhase < 0.5;
      const activeA  = (0.5 + pulse * 0.5).toFixed(3);
      const passiveA = "0.14";

      if (redRectRef.current) {
        redRectRef.current.setAttribute("opacity", isRed ? activeA : passiveA);
        redRectRef.current.style.filter = isRed
          ? `drop-shadow(0 0 ${(5 + pulse * 12).toFixed(0)}px rgba(239,68,68,0.85))`
          : "none";
      }
      if (irRectRef.current) {
        irRectRef.current.setAttribute("opacity", isRed ? passiveA : activeA);
        irRectRef.current.style.filter = !isRed
          ? `drop-shadow(0 0 ${(5 + pulse * 12).toFixed(0)}px rgba(168,85,247,0.85))`
          : "none";
      }

      // Waveform paths
      if (greenPathRef.current)
        greenPathRef.current.setAttribute("d", buildPath(gh, VH * 0.65, VH * 0.56));
      if (redPathRef.current)
        redPathRef.current.setAttribute("d", buildPath(rh, VH * 0.52, VH * 0.42));
      if (irPathRef.current)
        irPathRef.current.setAttribute("d", buildPath(ih, VH * 0.78, VH * 0.42));

      animId.current = requestAnimationFrame(tick);
    }

    animId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId.current);
  }, []);

  return (
    <Card className="border-primary/20 overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">

          {/* ── LEFT: Smartwatch ── */}
          <div className="p-5 space-y-4 bg-green-500/5">
            {/* Header */}
            <div className="flex items-center gap-3">
              <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="26" fill="#052e16" />
                <circle ref={greenCircleRef} cx="26" cy="26" r="20" fill="#4ade80" />
              </svg>
              <div>
                <p className="font-bold text-green-400 text-base">⌚ Smartwatch</p>
                <p className="text-xs text-green-500/70 font-mono">LED Verde · 520 nm</p>
              </div>
            </div>

            {/* Spectrum bar */}
            <div className="space-y-1.5">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Longitud de onda</p>
              <div className="relative h-2.5 rounded-full overflow-visible"
                style={{ background: "linear-gradient(to right,#7c3aed,#2563eb,#0ea5e9,#16a34a,#ca8a04,#ea580c,#dc2626)" }}>
                <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-green-400"
                  style={{ left: "34%", boxShadow: "0 0 8px #4ade80" }} />
              </div>
              <div className="flex justify-between text-[9px] text-muted-foreground">
                <span>380 nm</span>
                <span className="text-green-400 font-bold">▲ 520 nm</span>
                <span>700 nm</span>
              </div>
            </div>

            {/* Waveform */}
            <div className="rounded-lg overflow-hidden" style={{ background: "#050d08" }}>
              <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ height: 88 }}>
                <text x="6" y="13" fill="#4ade80" fontSize="9" opacity="0.5" fontFamily="monospace">PPG Canal Verde</text>
                <path ref={greenPathRef} stroke="#4ade80" strokeWidth="2.2" fill="none"
                  style={{ filter: "drop-shadow(0 0 3px rgba(74,222,128,0.5))" }} />
              </svg>
            </div>

            {/* Properties */}
            <ul className="text-xs space-y-1.5 text-muted-foreground">
              <li>📍 Penetra <strong className="text-foreground">~1–2 mm</strong> — epidermis y dermis superficial</li>
              <li>✅ Cómodo · pantalla continua · GPS integrado</li>
              <li>⚠️ Artefactos de movimiento en alta intensidad</li>
              <li>🎯 Preciso en reposo y baja-moderada intensidad</li>
            </ul>
          </div>

          {/* ── RIGHT: Pulsioxímetro ── */}
          <div className="p-5 space-y-4 bg-red-500/5">
            {/* Header */}
            <div className="flex items-center gap-3">
              <svg width="52" height="52" viewBox="0 0 52 52">
                <rect x="0" y="0" width="52" height="52" rx="6" fill="#1c0505" />
                <rect ref={redRectRef} x="4" y="8" width="20" height="36" rx="5" fill="#ef4444" />
                <rect ref={irRectRef}  x="28" y="8" width="20" height="36" rx="5" fill="#a855f7" />
              </svg>
              <div>
                <p className="font-bold text-red-400 text-base">🫀 Pulsioxímetro</p>
                <p className="text-xs font-mono">
                  <span className="text-red-400">Rojo 660 nm</span>
                  <span className="text-muted-foreground"> + </span>
                  <span className="text-purple-400">IR 940 nm</span>
                </p>
              </div>
            </div>

            {/* Spectrum bar */}
            <div className="space-y-1.5">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Longitud de onda</p>
              <div className="relative h-2.5 rounded-full overflow-visible"
                style={{ background: "linear-gradient(to right,#7c3aed,#2563eb,#0ea5e9,#16a34a,#ca8a04,#ea580c,#dc2626,#7f1d1d,#3b0764)" }}>
                <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-red-400"
                  style={{ left: "73%", boxShadow: "0 0 8px #ef4444" }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-purple-400"
                  style={{ left: "94%", boxShadow: "0 0 8px #a855f7" }} />
              </div>
              <div className="flex justify-between text-[9px] text-muted-foreground">
                <span>380 nm</span>
                <span className="text-red-400 font-bold">▲ 660</span>
                <span className="text-purple-400 font-bold">940 ▲ IR</span>
              </div>
            </div>

            {/* Waveforms */}
            <div className="rounded-lg overflow-hidden" style={{ background: "#0d0508" }}>
              <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ height: 88 }}>
                <text x="6"       y="13" fill="#ef4444" fontSize="9" opacity="0.5" fontFamily="monospace">PPG Rojo 660nm</text>
                <text x={VW / 2}  y="13" fill="#a855f7" fontSize="9" opacity="0.5" fontFamily="monospace">PPG IR 940nm</text>
                <path ref={redPathRef} stroke="#ef4444" strokeWidth="2.2" fill="none"
                  style={{ filter: "drop-shadow(0 0 3px rgba(239,68,68,0.5))" }} />
                <path ref={irPathRef}  stroke="#a855f7" strokeWidth="1.8" fill="none"
                  strokeDasharray="5 3" style={{ filter: "drop-shadow(0 0 3px rgba(168,85,247,0.5))" }} />
              </svg>
            </div>

            {/* Properties */}
            <ul className="text-xs space-y-1.5 text-muted-foreground">
              <li>📍 Penetra <strong className="text-foreground">~5–10 mm</strong> — arteriolas y vénulas</li>
              <li>✅ SpO₂ preciso · certificado FDA/CE</li>
              <li>⚠️ Solo dedo · requiere buena perfusión</li>
              <li>🎯 Ratio R/IR determina la saturación de O₂</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-border bg-muted/20 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            Onda de pulso arterial en tiempo real · <strong>{HR} bpm</strong>
          </span>
          <span className="text-[11px] text-muted-foreground font-mono">
            R/IR ratio → SpO₂
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

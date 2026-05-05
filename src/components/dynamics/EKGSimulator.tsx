import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Activity, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EKGParams {
  hr: number;       // bpm 40-180
  amplitude: number; // 0.5 - 2.0
  prInterval: number; // 100-220 ms
  qtcInterval: number; // 350-500 ms
  rhythm: "sinusal" | "bradicardia" | "taquicardia" | "fibrilacion";
}

const WAVE_LABELS = [
  { name: "Onda P", desc: "Despolarización auricular", color: "#60a5fa" },
  { name: "Complejo QRS", desc: "Despolarización ventricular", color: "#4ade80" },
  { name: "Onda T", desc: "Repolarización ventricular", color: "#fb923c" },
  { name: "Intervalo PR", desc: "Conducción AV", color: "#a78bfa" },
];

function buildEKGPath(params: EKGParams, width: number, height: number): string {
  const { hr, amplitude, prInterval, rhythm } = params;
  const beatDuration = 60000 / hr; // ms per beat
  const pixelsPerMs = width / (beatDuration * 2.5); // show ~2.5 beats
  const baseline = height * 0.6;
  const scale = amplitude * (height * 0.18);

  const pts: string[] = [];

  const drawBeat = (startX: number) => {
    if (rhythm === "fibrilacion") {
      // Irregular fibrillation pattern
      for (let i = 0; i < 80; i++) {
        const x = startX + i * (beatDuration * pixelsPerMs / 80);
        const y = baseline + (Math.random() - 0.5) * scale * 0.4;
        pts.push(`${i === 0 ? "M" : "L"} ${x},${y}`);
      }
      return;
    }

    const bw = beatDuration * pixelsPerMs;
    const x0 = startX;

    // Isoelectric line start
    pts.push(`M ${x0},${baseline}`);
    pts.push(`L ${x0 + bw * 0.08},${baseline}`);

    // P wave
    const prX = x0 + (prInterval * pixelsPerMs);
    const pPeak = baseline - scale * 0.25;
    pts.push(`C ${x0 + bw * 0.10},${pPeak} ${x0 + bw * 0.12},${pPeak} ${x0 + bw * 0.14},${baseline}`);
    pts.push(`L ${prX},${baseline}`);

    // QRS complex
    const qrsStart = prX;
    pts.push(`L ${qrsStart + bw * 0.01},${baseline + scale * 0.1}`); // Q
    pts.push(`L ${qrsStart + bw * 0.02},${baseline - scale * 1.2}`); // R peak
    pts.push(`L ${qrsStart + bw * 0.03},${baseline + scale * 0.15}`); // S
    pts.push(`L ${qrsStart + bw * 0.05},${baseline}`);

    // ST segment
    pts.push(`L ${qrsStart + bw * 0.12},${baseline}`);

    // T wave
    const tStart = qrsStart + bw * 0.12;
    const tPeak = baseline - scale * 0.45;
    pts.push(`C ${tStart + bw * 0.06},${tPeak} ${tStart + bw * 0.10},${tPeak} ${tStart + bw * 0.16},${baseline}`);

    // TP segment
    pts.push(`L ${x0 + bw},${baseline}`);
  };

  for (let i = 0; i < 3; i++) {
    drawBeat(i * beatDuration * pixelsPerMs);
  }

  return pts.join(" ");
}

export default function EKGSimulator() {
  const [params, setParams] = useState<EKGParams>({
    hr: 70,
    amplitude: 1.0,
    prInterval: 160,
    qtcInterval: 400,
    rhythm: "sinusal",
  });
  const [animOffset, setAnimOffset] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const animRef = useRef<number>(0);

  const W = 700;
  const H = 160;

  useEffect(() => {
    let lastTime = 0;
    const step = (t: number) => {
      if (lastTime !== 0) {
          setAnimOffset(prev => (prev + (t - lastTime) * 0.04) % W);
      }
      lastTime = t;
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [params.hr]);

  const path = buildEKGPath(params, W * 2, H);

  const getRhythmLabel = () => {
    const { hr } = params;
    if (hr < 60) return { label: "Bradicardia", color: "bg-blue-500" };
    if (hr > 100) return { label: "Taquicardia", color: "bg-red-500" };
    return { label: "Ritmo Sinusal", color: "bg-green-500" };
  };

  const rhythmInfo = getRhythmLabel();

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Activity size={18} className="text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold">Simulador de ECG</h3>
            <p className="text-xs text-muted-foreground">Ajusta los parámetros y observa el trazo</p>
          </div>
        </div>
        <Badge className={`${rhythmInfo.color} text-white border-0 text-xs`}>
          {rhythmInfo.label} · {params.hr} bpm
        </Badge>
      </div>

      {/* ECG Display */}
      <div className="bg-[#0a1a0a] rounded-xl p-3 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(#00ff00 1px, transparent 1px), linear-gradient(90deg, #00ff00 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: H }}
        >
          <defs>
            <clipPath id="ecg-clip">
              <rect x="0" y="0" width={W} height={H} />
            </clipPath>
          </defs>
          <g clipPath="url(#ecg-clip)">
            <motion.path
              d={path}
              fill="none"
              stroke="#00ff88"
              strokeWidth="2"
              style={{ transform: `translateX(${-animOffset}px)` }}
            />
            {/* Glowing trail */}
            <motion.path
              d={path}
              fill="none"
              stroke="#00ff88"
              strokeWidth="4"
              opacity="0.2"
              style={{ transform: `translateX(${-animOffset}px)` }}
            />
          </g>
          {/* Baseline */}
          <line x1="0" y1={H * 0.6} x2={W} y2={H * 0.6} stroke="#00ff0020" strokeWidth="1" />
        </svg>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
            Frecuencia Cardíaca
            <span className="text-foreground font-semibold">{params.hr} bpm</span>
          </label>
          <input
            type="range" min="40" max="180" value={params.hr}
            onChange={e => setParams(p => ({ ...p, hr: +e.target.value }))}
            className="w-full accent-green-500"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>40 bpm</span><span>180 bpm</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
            Amplitud del QRS
            <span className="text-foreground font-semibold">{params.amplitude.toFixed(1)}×</span>
          </label>
          <input
            type="range" min="5" max="20" value={params.amplitude * 10}
            onChange={e => setParams(p => ({ ...p, amplitude: +e.target.value / 10 }))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>0.5× (pequeño)</span><span>2.0× (grande)</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
            Intervalo PR
            <span className={`font-semibold ${params.prInterval > 200 ? "text-red-400" : "text-foreground"}`}>
              {params.prInterval} ms
            </span>
          </label>
          <input
            type="range" min="100" max="280" value={params.prInterval}
            onChange={e => setParams(p => ({ ...p, prInterval: +e.target.value }))}
            className="w-full accent-purple-500"
          />
          <p className="text-[10px] text-muted-foreground">
            {params.prInterval > 200 ? "⚠️ Bloqueo AV de 1° grado (>200ms)" : "Normal: 120-200 ms"}
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
            Ritmo
            <span className="text-foreground font-semibold capitalize">{params.rhythm}</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {(["sinusal", "bradicardia", "taquicardia", "fibrilacion"] as const).map(r => (
              <button
                key={r}
                onClick={() => {
                  const hrMap = { sinusal: 70, bradicardia: 48, taquicardia: 130, fibrilacion: 110 };
                  setParams(p => ({ ...p, rhythm: r, hr: hrMap[r] }));
                }}
                className={`text-xs px-2 py-1.5 rounded-lg border transition-colors capitalize ${
                  params.rhythm === r
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-muted"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wave labels */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {WAVE_LABELS.map(w => (
          <div key={w.name} className="rounded-lg bg-muted/50 p-2 text-center border border-border">
            <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: w.color }} />
            <p className="text-[11px] font-semibold">{w.name}</p>
            <p className="text-[9px] text-muted-foreground leading-tight">{w.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 rounded-xl p-3">
        <Info size={13} className="mt-0.5 shrink-0" />
        <p>Este simulador es educativo. Los trazados reales requieren interpretación médica especializada.</p>
      </div>
    </div>
  );
}

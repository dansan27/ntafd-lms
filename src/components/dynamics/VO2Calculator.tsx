import { useState } from "react";
import { motion } from "framer-motion";
import { Wind, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Inputs {
  age: number;
  restingHR: number;
  maxHR: number;
  gender: "male" | "female";
  cooperDistance: number; // meters in 12 min
}

interface Formula {
  name: string;
  author: string;
  vo2: number;
  description: string;
  inputs: string[];
}

function calculateVO2(inputs: Inputs): Formula[] {
  const { age, restingHR, maxHR, gender, cooperDistance } = inputs;
  const results: Formula[] = [];

  // Cooper test
  if (cooperDistance > 0) {
    const vo2 = (cooperDistance - 504.9) / 44.73;
    results.push({
      name: "Test de Cooper",
      author: "Kenneth Cooper (1968)",
      vo2: Math.max(0, vo2),
      description: "Basado en la distancia recorrida en 12 minutos de carrera",
      inputs: ["Distancia en 12 min"],
    });
  }

  // Fox formula (HR-based)
  if (restingHR > 0 && maxHR > 0) {
    const hrr = maxHR / restingHR;
    const vo2 = 15 * hrr;
    results.push({
      name: "Fórmula de Fox",
      author: "Fox et al. (1971)",
      vo2: Math.max(0, vo2),
      description: "Usa la relación FC máx / FC reposo (simple pero menos preciso)",
      inputs: ["FC máxima", "FC reposo"],
    });
  }

  // Åstrand-Ryhming (submaximal, estimated)
  if (restingHR > 0 && maxHR > 0) {
    const vo2 = gender === "male"
      ? 3.542 + (0.0461 * maxHR) - (0.0217 * age)
      : 2.847 + (0.0387 * maxHR) - (0.0172 * age);
    results.push({
      name: "Åstrand-Ryhming",
      author: "Åstrand & Ryhming (1954)",
      vo2: Math.max(0, vo2),
      description: "Estimación basada en FC submáxima, edad y sexo",
      inputs: ["FC máxima", "Edad", "Sexo"],
    });
  }

  // Uth-Sørensen-Overgaard-Pedersen
  if (restingHR > 0 && maxHR > 0) {
    const vo2 = 15.3 * (maxHR / restingHR);
    results.push({
      name: "Uth-Sørensen",
      author: "Uth et al. (2004)",
      vo2: Math.max(0, vo2),
      description: "Fórmula simple validada para adultos, muy usada con pulsómetros",
      inputs: ["FC máxima", "FC reposo"],
    });
  }

  return results;
}

function getVO2Category(vo2: number, _age: number, gender: "male" | "female") {
  const maleCutoffs = [
    { min: 55, label: "Excelente", color: "text-green-500" },
    { min: 47, label: "Muy bueno", color: "text-teal-500" },
    { min: 39, label: "Bueno", color: "text-blue-500" },
    { min: 31, label: "Normal", color: "text-yellow-500" },
    { min: 0, label: "Por mejorar", color: "text-red-400" },
  ];
  const femaleCutoffs = [
    { min: 49, label: "Excelente", color: "text-green-500" },
    { min: 41, label: "Muy bueno", color: "text-teal-500" },
    { min: 33, label: "Bueno", color: "text-blue-500" },
    { min: 25, label: "Normal", color: "text-yellow-500" },
    { min: 0, label: "Por mejorar", color: "text-red-400" },
  ];
  const cutoffs = gender === "male" ? maleCutoffs : femaleCutoffs;
  return cutoffs.find(c => vo2 >= c.min) ?? cutoffs[cutoffs.length - 1];
}

export default function VO2Calculator() {
  const [inputs, setInputs] = useState<Inputs>({
    age: 22,
    restingHR: 65,
    maxHR: 0,
      gender: "male",
    cooperDistance: 0,
  });
  const [calculated, setCalculated] = useState(false);
  const [showFormulas, setShowFormulas] = useState(false);

  const hrmaxEstimated = 208 - 0.7 * inputs.age;
  const effectiveMaxHR = inputs.maxHR || hrmaxEstimated;

  const results = calculateVO2({ ...inputs, maxHR: effectiveMaxHR });
  const avgVO2 = results.length > 0
    ? results.reduce((s, r) => s + r.vo2, 0) / results.length
    : 0;

  const category = getVO2Category(avgVO2, inputs.age, inputs.gender);

  const update = (key: keyof Inputs, val: number | string) =>
    setInputs(p => ({ ...p, [key]: val }));

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center">
          <Wind size={18} className="text-cyan-500" />
        </div>
        <div>
          <h3 className="font-semibold">Calculadora de VO₂ máx</h3>
          <p className="text-xs text-muted-foreground">Estima tu capacidad aeróbica máxima</p>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Edad (años)</label>
          <input
            type="number" min="15" max="80" value={inputs.age}
            onChange={e => update("age", +e.target.value)}
            className="w-full text-sm bg-muted rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Sexo</label>
          <div className="grid grid-cols-2 gap-1.5">
            {(["male", "female"] as const).map(g => (
              <button
                key={g}
                onClick={() => update("gender", g)}
                className={`text-xs px-2 py-2 rounded-xl border transition-colors ${
                  inputs.gender === g ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
                }`}
              >
                {g === "male" ? "Masculino" : "Femenino"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">FC en reposo (bpm)</label>
          <input
            type="number" min="40" max="100" value={inputs.restingHR}
            onChange={e => update("restingHR", +e.target.value)}
            className="w-full text-sm bg-muted rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
            FC máxima (bpm)
            <span className="text-[10px] text-muted-foreground">
              Estimada: {hrmaxEstimated} bpm
            </span>
          </label>
          <input
            type="number" min="0" max="220"
            value={inputs.maxHR || ""}
            placeholder={`${hrmaxEstimated} (auto)`}
            onChange={e => update("maxHR", e.target.value ? +e.target.value : 0)}
            className="w-full text-sm bg-muted rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="col-span-2 space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
            Distancia Test Cooper (metros en 12 min)
            <span className="text-[10px] text-muted-foreground">Opcional</span>
          </label>
          <input
            type="number" min="0" max="5000"
            value={inputs.cooperDistance || ""}
            placeholder="Ej: 2400 metros"
            onChange={e => update("cooperDistance", e.target.value ? +e.target.value : 0)}
            className="w-full text-sm bg-muted rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50"
          />
          {inputs.cooperDistance > 0 && (
            <p className="text-[10px] text-muted-foreground">
              {inputs.cooperDistance}m → ~{(inputs.cooperDistance / 1000).toFixed(2)} km | Pace: {Math.round(12 * 60 * 1000 / inputs.cooperDistance)}" /km
            </p>
          )}
        </div>
      </div>

      <Button className="w-full" onClick={() => setCalculated(true)}>
        Calcular VO₂ máx
      </Button>

      {/* Results */}
      {calculated && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Main result */}
          <div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 p-5 text-center">
            <p className="text-xs text-muted-foreground mb-1">VO₂ máx estimado (promedio)</p>
            <p className="text-4xl font-bold text-cyan-400">{avgVO2.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">ml · kg⁻¹ · min⁻¹</p>
            <Badge className={`mt-3 ${category.color.replace("text-", "bg-").replace("-500", "-500/20")} ${category.color} border-0 text-xs`}>
              {category.label}
            </Badge>
          </div>

          {/* Comparison */}
          <div className="rounded-xl bg-muted/30 border border-border p-3">
            <p className="text-xs font-medium mb-2">Referencia ACSM para {inputs.gender === "male" ? "hombres" : "mujeres"} ({inputs.age} años)</p>
            <div className="space-y-1.5">
              {[
                { label: "Excelente", range: inputs.gender === "male" ? ">55" : ">49", color: "bg-green-500" },
                { label: "Muy bueno", range: inputs.gender === "male" ? "47-54" : "41-48", color: "bg-teal-500" },
                { label: "Bueno", range: inputs.gender === "male" ? "39-46" : "33-40", color: "bg-blue-500" },
                { label: "Normal", range: inputs.gender === "male" ? "31-38" : "25-32", color: "bg-yellow-500" },
                { label: "Por mejorar", range: inputs.gender === "male" ? "<31" : "<25", color: "bg-red-400" },
              ].map(cat => (
                <div key={cat.label} className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                  <span className="text-muted-foreground w-24">{cat.label}</span>
                  <span>{cat.range} ml/kg/min</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual formulas */}
          <div>
            <button
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowFormulas(v => !v)}
            >
              {showFormulas ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              Ver por fórmula ({results.length} métodos)
            </button>
            {showFormulas && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 space-y-2"
              >
                {results.map(r => (
                  <div key={r.name} className="rounded-xl border border-border bg-card p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">{r.name}</p>
                        <p className="text-[10px] text-muted-foreground">{r.author}</p>
                      </div>
                      <span className="text-lg font-bold text-cyan-400">{r.vo2.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{r.description}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 rounded-xl p-3">
            <Info size={12} className="mt-0.5 shrink-0" />
            <p>Las estimaciones tienen ±10-15% de error. Para valores precisos se requiere ergoespirometría en laboratorio.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

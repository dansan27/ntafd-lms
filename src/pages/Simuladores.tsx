import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Activity, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import EKGSimulator from "@/components/dynamics/EKGSimulator";
import VO2Calculator from "@/components/dynamics/VO2Calculator";

const TOOLS = [
  {
    id: "ekg",
    label: "Simulador ECG",
    icon: Activity,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    description: "Visualiza el trazo ECG en tiempo real ajustando FC, amplitud e intervalo PR",
  },
  {
    id: "vo2",
    label: "Calculadora VO₂ máx",
    icon: Wind,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    description: "Estima la capacidad aeróbica máxima con múltiples fórmulas validadas",
  },
];

export default function Simuladores() {
  const [active, setActive] = useState<"ekg" | "vo2">("ekg");

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Herramientas Interactivas</h1>
            <p className="text-sm text-muted-foreground">Simuladores y calculadoras de fisiología deportiva</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-3 mb-6">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isActive = active === tool.id;
            return (
              <motion.button
                key={tool.id}
                onClick={() => setActive(tool.id as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 rounded-2xl border p-4 text-left transition-all ${
                  isActive
                    ? `${tool.bg} ${tool.border}`
                    : "border-border hover:border-border/80 bg-muted/20"
                }`}
              >
                <div className={`flex items-center gap-2 mb-1 ${isActive ? tool.color : "text-muted-foreground"}`}>
                  <Icon size={16} />
                  <span className="text-sm font-semibold">{tool.label}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-snug">{tool.description}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Tool content */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {active === "ekg" && <EKGSimulator />}
          {active === "vo2" && <VO2Calculator />}
        </motion.div>
      </div>
    </div>
  );
}

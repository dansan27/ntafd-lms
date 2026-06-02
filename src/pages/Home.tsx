import { useStudent } from "@/contexts/StudentContext";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Zap, Target, Heart, Activity,
  Layers, PlayCircle, Lock, ArrowRight, ChevronDown,
  BarChart2, BarChart3, Radio, Smartphone, BookOpen, Trophy, Dumbbell,
  Clock, StickyNote, Star, CheckCircle2, ArrowUpRight
} from "lucide-react";
import { COURSE_CONFIG, isClassAvailable } from "@/data/courseConfig";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

// ── ECG background path (9 beats × 160px = 1440px wide, baseline y=65) ─────
function buildECGPath(): string {
  const beats = 9, bw = 160, by = 65;
  const pts: string[] = [`M 0,${by}`];
  for (let i = 0; i < beats; i++) {
    const x = i * bw;
    pts.push(
      `L ${x + bw * 0.12},${by}`,
      `C ${x + bw * 0.16},${by} ${x + bw * 0.19},${by - 14} ${x + bw * 0.22},${by - 16}`,
      `C ${x + bw * 0.25},${by - 14} ${x + bw * 0.28},${by} ${x + bw * 0.34},${by}`,
      `L ${x + bw * 0.46},${by}`,
      `L ${x + bw * 0.50},${by + 8}`,
      `L ${x + bw * 0.54},${by - 42}`,
      `L ${x + bw * 0.58},${by + 9}`,
      `L ${x + bw * 0.68},${by}`,
      `C ${x + bw * 0.72},${by} ${x + bw * 0.76},${by - 16} ${x + bw * 0.80},${by - 18}`,
      `C ${x + bw * 0.84},${by - 16} ${x + bw * 0.88},${by} ${x + bw},${by}`,
    );
  }
  return pts.join(" ");
}
const ECG_PATH = buildECGPath();

// Helper to format time in ms
function formatTime(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}


// ── Floating metric chip ──────────────────────────────────────────────────────
function FloatingChip({ label, value, unit, color, x, y, delay }: {
  label: string; value: string; unit: string;
  color: string; x: string; y: string; delay: number;
}) {
  return (
    <motion.div
      className={`absolute hidden lg:flex flex-col gap-0.5 px-3.5 py-2 rounded-2xl backdrop-blur-md border ${color} select-none pointer-events-none`}
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1, y: [0, -7, 0] }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale: { delay, duration: 0.5 },
        y: { delay, duration: 3 + delay, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <span className="text-[10px] uppercase tracking-widest text-white/40 font-medium">{label}</span>
      <span className="text-lg font-bold text-white leading-none">{value} <span className="text-xs font-normal text-white/50">{unit}</span></span>
    </motion.div>
  );
}

// ── Week color themes mapped by ID ─────────────────────────────────────────────
const WEEK_THEMES: Record<number, {
  gradient: string;
  border: string;
  accent: string;
  glow: string;
  badge: string;
  icon: any;
  iconColor: string;
  tagColor: string;
  tags: string[];
}> = {
  1: {
    gradient: "from-amber-500/15 to-orange-500/5",
    border: "border-amber-500/20 hover:border-amber-500/40",
    accent: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    glow: "shadow-amber-500/10",
    badge: "Semana 1",
    icon: Zap,
    iconColor: "text-amber-400",
    tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    tags: ["Hardware & Software", "Sensores", "Gamificación"],
  },
  2: {
    gradient: "from-cyan-500/15 to-blue-500/5",
    border: "border-cyan-500/20 hover:border-cyan-500/40",
    accent: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    glow: "shadow-cyan-500/10",
    badge: "Semana 2",
    icon: Layers,
    iconColor: "text-cyan-400",
    tagColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    tags: ["DEXA · BIA", "Escaneo 3D", "Bod Pod"],
  },
  3: {
    gradient: "from-rose-500/15 to-red-500/5",
    border: "border-rose-500/20 hover:border-rose-500/40",
    accent: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    glow: "shadow-rose-500/10",
    badge: "Semana 3",
    icon: Heart,
    iconColor: "text-rose-400",
    tagColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    tags: ["VO₂ Máx", "ECG Fisiología", "Gases Lab"],
  },
  4: {
    gradient: "from-green-500/15 to-emerald-500/5",
    border: "border-green-500/20 hover:border-green-500/40",
    accent: "bg-green-500/10 text-green-400 border-green-500/20",
    glow: "shadow-green-500/10",
    badge: "Semana 4",
    icon: Radio,
    iconColor: "text-green-400",
    tagColor: "bg-green-500/10 text-green-400 border-green-500/20",
    tags: ["EKG / ECG", "Módulo AD8232", "Pulsioxímetro"],
  },
  5: {
    gradient: "from-violet-500/15 to-purple-500/5",
    border: "border-violet-500/20 hover:border-violet-500/40",
    accent: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    glow: "shadow-violet-500/10",
    badge: "Semana 5",
    icon: Smartphone,
    iconColor: "text-violet-400",
    tagColor: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    tags: ["PPG Óptico", "Error SpO₂", "Smartwatches"],
  },
  6: {
    gradient: "from-pink-500/15 to-fuchsia-500/5",
    border: "border-pink-500/20 hover:border-pink-500/40",
    accent: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    glow: "shadow-pink-500/10",
    badge: "Semana 6",
    icon: Dumbbell,
    iconColor: "text-pink-400",
    tagColor: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    tags: ["Celda de Carga", "Dinamometría", "EMG & Fibras"],
  },
  9: {
    gradient: "from-teal-500/15 to-emerald-500/5",
    border: "border-teal-500/20 hover:border-teal-500/40",
    accent: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    glow: "shadow-teal-500/10",
    badge: "Semana 9",
    icon: Activity,
    iconColor: "text-teal-400",
    tagColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    tags: ["ECNT & Wearables", "Diabetes & MCG", "Rehabilitación RV"],
  }
};

// ── Modules Grouping ──────────────────────────────────────────────────────────
const MODULES = [
  { id: "modulo-1", name: "I. Fundamentos e Ingeniería Corporal", weeks: [1, 2], icon: Zap },
  { id: "modulo-2", name: "II. Monitoreo Cardiovascular", weeks: [3, 4, 5], icon: Heart },
  { id: "modulo-3", name: "III. Fuerza y Salud Crónica", weeks: [6, 9], icon: Dumbbell },
  { id: "modulo-4", name: "IV. Sensores Cinemáticos y Machine Learning", weeks: [10], icon: BarChart2 },
];

// ── Login Page ────────────────────────────────────────────────────────────────
function LoginPage() {
  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center overflow-hidden relative px-4 py-8">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-blue-600/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-emerald-500/6 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/4 rounded-full blur-[160px] pointer-events-none" />

      {/* ECG line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden opacity-20">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-24">
          <motion.path
            d={ECG_PATH} fill="none" stroke="#06b6d4" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
          />
        </svg>
      </div>

      {/* Floating chips — desktop only */}
      <FloatingChip label="VO₂ Máx" value="97.5" unit="ml/kg/min" color="border-cyan-500/20 bg-cyan-500/8" x="6%" y="20%" delay={0.4} />
      <FloatingChip label="Frecuencia Cardíaca" value="142" unit="bpm" color="border-rose-500/20 bg-rose-500/8" x="78%" y="16%" delay={0.7} />
      <FloatingChip label="HRV" value="78" unit="ms" color="border-emerald-500/20 bg-emerald-500/8" x="5%" y="60%" delay={1.0} />
      <FloatingChip label="Masa Grasa" value="12.4" unit="%" color="border-amber-500/20 bg-amber-500/8" x="80%" y="56%" delay={1.2} />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center space-y-6">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 90 }}
          className="relative inline-flex"
        >
          <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <Activity className="w-9 h-9 text-cyan-400 animate-pulse" />
          </div>
          <motion.div
            className="absolute inset-0 rounded-3xl border border-cyan-400/20"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 3.0, repeat: Infinity }}
          />
        </motion.div>

        {/* UPC Logo */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <img src="/logo-upc.png" alt="UPC" className="h-10 mx-auto opacity-90" />
        </motion.div>

        {/* Course Badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/8 text-white/50 text-[10px] font-bold uppercase tracking-widest px-4.5 py-1.5 rounded-full"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          NTAFD · Innovación en Deporte
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="space-y-3"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
            Guía Interactiva Web
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              Nuevas Tecnologías
            </span>
          </h1>
          <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
            Plataforma de aprendizaje interactiva sobre fisiología del ejercicio, sensores de rendimiento y telemetría de salud.
          </p>
        </motion.div>

        {/* Access options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 85 }}
          className="w-full flex flex-col gap-3.5 pt-4"
        >
          {/* Student Entrance */}
          <Link href="/login">
            <motion.div
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.99 }}
              className="group cursor-pointer rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/25 hover:border-cyan-400/50 p-5 text-left transition-all duration-300 shadow-md hover:shadow-cyan-500/5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center">
                    <Target className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">ALUMNO</span>
                    <h3 className="text-white font-bold text-base">Ingresar al curso</h3>
                    <p className="text-white/40 text-xs mt-0.5">Accede a las clases dinámicas y mide tu progreso</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>

          {/* Professor Entrance */}
          <Link href="/profesor">
            <motion.div
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.99 }}
              className="group cursor-pointer rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/25 hover:border-violet-400/50 p-5 text-left transition-all duration-300 shadow-md hover:shadow-violet-500/5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider block">DOCENTE</span>
                    <h3 className="text-white font-bold text-base">Panel del profesor</h3>
                    <p className="text-white/40 text-xs mt-0.5">Monitorea dinámicas activas y respuestas en vivo</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-violet-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Quick Stats footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-10 pt-4"
        >
          {[
            { value: "3 Módulos", label: "Contenido" },
            { value: "7 Semanas", label: "Cronograma" },
            { value: "10+ Temas", label: "Fisiología" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-sm font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ── Dashboard (logged in) ─────────────────────────────────────────────────────
export default function Home() {
  const { student, loading, logout } = useStudent();
  const [classProgress, setClassProgress] = useState<Record<string, { completed: number; total: number; updatedAt: number }>>({});
  const [stats, setStats] = useState({ totalDynamics: 0, totalClasses: 0, completionPercent: 0, recentClass: null as any });
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [activeModule, setActiveModule] = useState<string>("modulo-1");

  // Fetch student stats directly from tRPC
  const statsQuery = trpc.student.stats.useQuery();

  useEffect(() => {
    if (!student) return;
    
    const fetchAllProgress = async () => {
      try {
        const promises: Promise<any>[] = [];
        const classKeys: { weekId: number; classId: number; title: string; total: number }[] = [];
        
        for (const week of COURSE_CONFIG) {
          for (const cls of week.classes) {
            if (isClassAvailable(week.id, cls.id)) {
              classKeys.push({
                weekId: week.id,
                classId: cls.id,
                title: cls.title,
                total: cls.dynamics.length
              });
              
              promises.push(
                fetch("/api/trpc/student.getProgress", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ json: { weekId: week.id, classId: cls.id } }),
                }).then(res => res.json())
              );
            }
          }
        }
        
        const results = await Promise.all(promises);
        const progressMap: Record<string, { completed: number; total: number; updatedAt: number }> = {};
        let totalCompleted = 0;
        let classesAccessed = 0;
        const allProgressData: any[] = [];
        
        results.forEach((res, index) => {
          const progress = res?.result?.data;
          const keyInfo = classKeys[index];
          if (progress) {
            const completedList = (progress.completedDynamics as number[] | null) ?? [];
            const completedCount = completedList.length;
            
            progressMap[`${keyInfo.weekId}-${keyInfo.classId}`] = {
              completed: completedCount,
              total: keyInfo.total,
              updatedAt: progress.updatedAt ? new Date(progress.updatedAt).getTime() : 0
            };
            
            if (completedCount > 0) {
              classesAccessed++;
              totalCompleted += completedCount;
              allProgressData.push({
                week: keyInfo.weekId,
                class: keyInfo.classId,
                classTitle: keyInfo.title,
                completed: completedCount,
                total: keyInfo.total,
                updatedAt: progress.updatedAt ? new Date(progress.updatedAt).getTime() : 0
              });
            }
          }
        });
        
        setClassProgress(progressMap);
        
        const totalAvailable = COURSE_CONFIG.reduce((acc, w) =>
          acc + w.classes.filter(c => isClassAvailable(w.id, c.id)).reduce((s, c) => s + c.dynamics.length, 0), 0);
        
        const mostRecent = allProgressData.length > 0 
          ? allProgressData.sort((a, b) => b.updatedAt - a.updatedAt)[0] 
          : null;
          
        setStats({
          totalDynamics: totalCompleted,
          totalClasses: classesAccessed,
          completionPercent: totalAvailable > 0 ? Math.round((totalCompleted / totalAvailable) * 100) : 0,
          recentClass: mostRecent
        });
      } catch (err) {
        console.error("Error fetching course progress:", err);
      }
    };
    
    fetchAllProgress();
  }, [student]);

  // Focus active module based on recent class activity
  useEffect(() => {
    if (stats.recentClass) {
      const wId = stats.recentClass.week;
      const foundModule = MODULES.find(m => m.weeks.includes(wId));
      if (foundModule) {
        setActiveModule(foundModule.id);
      }
    }
  }, [stats.recentClass]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712]">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full" />
    </div>
  );

  if (!student) return <LoginPage />;

  const levelMap = [
    { min: 0, label: "Explorador", color: "text-slate-400", bg: "bg-slate-400/10 border-slate-400/20" },
    { min: 25, label: "Aprendiz", color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/20" },
    { min: 50, label: "Experto", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
    { min: 75, label: "Maestro", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  ];
  const level = [...levelMap].reverse().find(l => stats.completionPercent >= l.min) ?? levelMap[0];
  const firstName = student.fullName.split(" ")[0];

  // Filter weeks by the selected module
  const activeModuleWeeks = COURSE_CONFIG.filter(week => {
    const currentMod = MODULES.find(m => m.id === activeModule);
    return currentMod?.weeks.includes(week.id);
  });

  // Calculate completion percentage of a single week
  const getWeekProgress = (weekId: number) => {
    const week = COURSE_CONFIG.find(w => w.id === weekId);
    if (!week) return { completed: 0, total: 0, percent: 0 };
    let completed = 0;
    let total = 0;
    week.classes.forEach(c => {
      if (isClassAvailable(weekId, c.id)) {
        const prog = classProgress[`${weekId}-${c.id}`];
        completed += prog?.completed ?? 0;
        total += c.dynamics.length;
      }
    });
    return {
      completed,
      total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  return (
    <div className="min-h-screen bg-[#030712] overflow-x-hidden text-white font-sans">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Sticky header */}
      <header className="sticky top-0 z-50 border-b border-white/6 bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <img src="/logo-upc.png" alt="UPC" className="h-7 opacity-90" />
            <div className="h-5 w-px bg-white/10" />
            <div>
              <p className="font-bold text-white text-sm leading-tight">NTAFD</p>
              <p className="text-[10px] text-white/40">Tecnología en Deporte</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${level.bg} ${level.color}`}>
                {level.label}
              </span>
              <span className="text-white/60 text-sm font-semibold">{firstName}</span>
            </div>
            <button onClick={logout} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-colors">
              <LogOut size={17} />
            </button>
          </motion.div>
        </div>
      </header>

      {/* Two column split grid layout */}
      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: Greeting, Modules, and Learning route */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Greeting block with ECG graphic overlay */}
            <section className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-r from-blue-950/20 to-cyan-950/10 p-6 md:p-8">
              <div className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden opacity-10">
                <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-16">
                  <motion.path d={ECG_PATH} fill="none" stroke="#22c55e" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
                  />
                </svg>
              </div>

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Sesión activa
                </div>
                
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
                  Hola, <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-300">{firstName}</span>
                </h1>
                
                <p className="text-white/50 text-base max-w-md leading-relaxed">
                  Continúa aprendiendo a medir e interpretar los datos del rendimiento fisiológico de tus deportistas.
                </p>

                {stats.recentClass && (
                  <div className="pt-2">
                    <Link href={`/week/${stats.recentClass.week}/class/${stats.recentClass.class}`}>
                      <motion.div whileHover={{ scale: 1.015, x: 4 }} whileTap={{ scale: 0.985 }}
                        className="inline-flex items-center gap-3.5 bg-cyan-500/10 hover:bg-cyan-500/15 border border-cyan-500/25 rounded-2xl px-5 py-3 transition-colors cursor-pointer">
                        <PlayCircle className="text-cyan-400" size={20} />
                        <div className="text-left">
                          <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Retomar clase anterior</p>
                          <p className="text-sm font-semibold text-white">{stats.recentClass.classTitle.split(":")[1]?.trim() ?? stats.recentClass.classTitle}</p>
                        </div>
                        <ArrowRight className="text-cyan-400 ml-2" size={16} />
                      </motion.div>
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* Modules navigation tabs */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-white/40">Módulos de Aprendizaje</h2>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-white/4 border border-white/8 rounded-2xl">
                {MODULES.map((m) => {
                  const Icon = m.icon;
                  const isActive = activeModule === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setActiveModule(m.id);
                        setExpandedWeek(null);
                      }}
                      className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/15"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon size={15} />
                      <span>{m.name.split(".")[0]}</span>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-white/40 italic pl-1">
                {MODULES.find(m => m.id === activeModule)?.name}
              </p>
            </section>

            {/* Active module weeks list */}
            <section className="space-y-4">
              {activeModuleWeeks.map((week) => {
                const theme = WEEK_THEMES[week.id] ?? WEEK_THEMES[1];
                const WeekIcon = theme.icon;
                const isExpanded = expandedWeek === week.id;
                const weekProg = getWeekProgress(week.id);

                return (
                  <motion.div key={week.id} className="relative overflow-hidden">
                    {/* Week header card */}
                    <div
                      onClick={() => setExpandedWeek(isExpanded ? null : week.id)}
                      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-r ${theme.gradient} ${theme.border} p-5 cursor-pointer transition-all duration-300 hover:shadow-lg`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-xl ${theme.accent} flex items-center justify-center flex-shrink-0`}>
                            <WeekIcon size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.iconColor}`}>{theme.badge}</span>
                              {weekProg.percent > 0 && (
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/60 border border-white/10 font-bold">
                                  {weekProg.percent}% COMPLETADO
                                </span>
                              )}
                            </div>
                            <h3 className="text-white font-bold text-base leading-snug">{week.title}</h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0">
                          {/* Radial progress for the individual week */}
                          {weekProg.percent > 0 && (
                            <div className="relative w-8 h-8 flex items-center justify-center">
                              <svg width="32" height="32" viewBox="0 0 32 32" className="-rotate-90">
                                <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
                                <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" className={theme.iconColor}
                                  strokeWidth="3" strokeDasharray={2 * Math.PI * 13}
                                  strokeDashoffset={2 * Math.PI * 13 * (1 - weekProg.percent / 100)}
                                />
                              </svg>
                              <span className="absolute text-[8px] font-bold text-white/70">{weekProg.percent}%</span>
                            </div>
                          )}
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-white/30"
                          >
                            <ChevronDown size={18} />
                          </motion.div>
                        </div>
                      </div>

                      {/* Pill tags */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {theme.tags.map(tag => (
                          <span key={tag} className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${theme.tagColor}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Classes list inside the expanded week */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 pb-2 grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                            {week.classes.map((cls, _ci) => {
                              const avail = isClassAvailable(week.id, cls.id);
                              const classProg = classProgress[`${week.id}-${cls.id}`];
                              const isCompleted = classProg && classProg.completed >= classProg.total && classProg.total > 0;

                              return (
                                <div key={cls.id}
                                  className={`relative rounded-xl border bg-white/2 p-4 transition-all duration-300 ${
                                    avail 
                                      ? "border-white/10 hover:border-white/20 hover:bg-white/4" 
                                      : "border-white/5 opacity-50"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className={`p-1.5 rounded-lg ${isCompleted ? "bg-green-500/10 text-green-400" : avail ? "bg-cyan-500/10 text-cyan-400" : "bg-white/5 text-white/30"}`}>
                                        {isCompleted ? <CheckCircle2 size={15} /> : <PlayCircle size={15} />}
                                      </div>
                                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
                                        Clase {cls.id}
                                      </span>
                                    </div>
                                    <span className="text-[9px] text-white/30 font-medium bg-white/5 px-2 py-0.5 rounded-md">
                                      {classProg ? `${classProg.completed}/${cls.dynamics.length}` : `0/${cls.dynamics.length}`} dinámicas
                                    </span>
                                  </div>

                                  <h4 className="text-white font-bold text-sm mb-1">{cls.title}</h4>
                                  <p className="text-white/40 text-xs mb-4 line-clamp-2 leading-relaxed">{cls.description}</p>
                                  
                                  {avail ? (
                                    <Link href={`/week/${week.id}/class/${cls.id}`}>
                                      <motion.button
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${
                                          isCompleted 
                                            ? "from-emerald-500/80 to-green-500/80" 
                                            : "from-cyan-500/80 to-blue-500/80"
                                        } hover:brightness-110 transition-all`}
                                      >
                                        {isCompleted ? "Repasar clase" : "Comenzar clase"} <ArrowRight size={13} />
                                      </motion.button>
                                    </Link>
                                  ) : (
                                    <div className="w-full py-2 rounded-lg text-center text-xs text-white/20 bg-white/3 border border-white/5 font-bold cursor-not-allowed">
                                      <Lock size={12} className="inline mr-1 -mt-0.5" /> Bloqueada
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </section>

          </div>

          {/* RIGHT COLUMN: Profile, Real Statistics & Tools */}
          <div className="space-y-6 lg:sticky lg:top-24">
            
            {/* Profile & Radial Level Card */}
            <section className="rounded-3xl border border-white/8 bg-gradient-to-b from-white/5 to-transparent p-6 text-center space-y-4">
              <div className="flex flex-col items-center gap-3">
                {/* Custom circular progress widget */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
                    <defs>
                      <linearGradient id="glowgrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <circle cx="72" cy="72" r="58" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                    <motion.circle cx="72" cy="72" r="58" fill="none" stroke="url(#glowgrad)"
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 58}
                      initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - stats.completionPercent / 100) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  
                  {/* Inside metrics */}
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-white leading-none">
                      {stats.completionPercent}%
                    </span>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest mt-1">PROGRESO</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">{student.fullName}</h3>
                  <p className="text-xs text-white/40 font-mono">{student.email}</p>
                </div>

                <div className="pt-1">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border ${level.bg} ${level.color}`}>
                    Nivel: {level.label}
                  </span>
                </div>
              </div>
            </section>

            {/* Real Stats Dashboard Panel */}
            <section className="rounded-3xl border border-white/8 bg-gradient-to-b from-white/5 to-transparent p-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <BarChart3 size={15} className="text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Métricas Reales</h3>
              </div>

              {statsQuery.isLoading ? (
                <div className="text-center py-6 text-xs text-white/30">Cargando métricas...</div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { 
                      icon: Star, 
                      label: "Puntaje Total", 
                      value: `${statsQuery.data?.totalScore ?? 0} pts`, 
                      color: "text-amber-400" 
                    },
                    { 
                      icon: Target, 
                      label: "Precisión", 
                      value: `${statsQuery.data && statsQuery.data.totalMax > 0 ? Math.round((statsQuery.data.totalScore / statsQuery.data.totalMax) * 100) : 0}%`, 
                      color: "text-emerald-400" 
                    },
                    { 
                      icon: Zap, 
                      label: "Actividades", 
                      value: statsQuery.data?.totalDynamicsCompleted ?? 0, 
                      color: "text-cyan-400" 
                    },
                    { 
                      icon: Clock, 
                      label: "Tiempo", 
                      value: formatTime(statsQuery.data?.totalTimeMs ?? 0), 
                      color: "text-rose-400" 
                    },
                    { 
                      icon: BookOpen, 
                      label: "Clases", 
                      value: `${statsQuery.data?.classesAttempted ?? 0} iniciadas`, 
                      color: "text-violet-400" 
                    },
                    { 
                      icon: StickyNote, 
                      label: "Notas", 
                      value: `${statsQuery.data?.notesCount ?? 0} tomadas`, 
                      color: "text-teal-400" 
                    },
                  ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div key={i} className="bg-white/2 border border-white/6 rounded-xl p-3 flex flex-col justify-between">
                        <Icon size={14} className={`${s.color} mb-2`} />
                        <div>
                          <p className="text-sm font-bold text-white leading-none">{s.value}</p>
                          <p className="text-[9px] text-white/40 uppercase tracking-wide mt-1.5 leading-none">{s.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Quick Tools */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5">
                <Trophy size={14} className="text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Herramientas</h3>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  {
                    href: "/mi-progreso",
                    icon: Trophy,
                    title: "Mi Progreso Completo",
                    desc: "Logros desbloqueados y bitácora",
                    color: "from-amber-500/10 to-orange-500/5 hover:border-amber-500/40 border-amber-500/20 text-amber-400"
                  },
                  {
                    href: "/flashcards",
                    icon: BookOpen,
                    title: "Modo Repaso",
                    desc: "Tarjetas de conceptos por semana",
                    color: "from-blue-500/10 to-indigo-500/5 hover:border-blue-500/40 border-blue-500/20 text-blue-400"
                  },
                  {
                    href: "/simuladores",
                    icon: Activity,
                    title: "Simulador Clínico",
                    desc: "Generador de ECG e inclinómetro",
                    color: "from-green-500/10 to-emerald-500/5 hover:border-green-500/40 border-green-500/20 text-green-400"
                  }
                ].map((t, i) => {
                  const ToolIcon = t.icon;
                  return (
                    <Link key={i} href={t.href}>
                      <motion.div
                        whileHover={{ scale: 1.015, x: 2 }}
                        whileTap={{ scale: 0.985 }}
                        className={`rounded-2xl border bg-gradient-to-br ${t.color} p-4 flex items-center justify-between cursor-pointer transition-all duration-300 shadow-sm`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                            <ToolIcon size={16} />
                          </div>
                          <div className="text-left">
                            <h4 className="text-white font-bold text-xs leading-none">{t.title}</h4>
                            <p className="text-white/40 text-[10px] mt-1.5 leading-none">{t.desc}</p>
                          </div>
                        </div>
                        <ArrowUpRight size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </section>

          </div>

        </div>
      </main>
    </div>
  );
}

import { useStudent } from "@/contexts/StudentContext";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, TrendingUp, Zap, Target, Heart, Activity,
  Layers, PlayCircle, Lock, ArrowRight, ChevronDown,
  BarChart3, Radio, Smartphone, BookOpen, Trophy,
} from "lucide-react";
import { COURSE_CONFIG, isClassAvailable } from "@/data/courseConfig";
import { useEffect, useState } from "react";

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

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let frame = 0;
    const total = 60;
    const id = setInterval(() => {
      frame++;
      setV(Math.round((frame / total) * to));
      if (frame >= total) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [to]);
  return <>{v}{suffix}</>;
}

// ── Floating metric chip ──────────────────────────────────────────────────────
function FloatingChip({ label, value, unit, color, x, y, delay }: {
  label: string; value: string; unit: string;
  color: string; x: string; y: string; delay: number;
}) {
  return (
    <motion.div
      className={`absolute hidden lg:flex flex-col gap-0.5 px-3 py-2 rounded-2xl backdrop-blur-md border ${color} select-none pointer-events-none`}
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

// ── Week color themes ─────────────────────────────────────────────────────────
const WEEK_THEMES = [
  {
    gradient: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/20 hover:border-amber-500/40",
    accent: "bg-amber-500/20 text-amber-400",
    glow: "shadow-amber-500/10",
    badge: "Semana 1",
    icon: Zap,
    iconColor: "text-amber-400",
    tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    tags: ["Hardware & Software", "Sensores", "Gamificación"],
  },
  {
    gradient: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/20 hover:border-cyan-500/40",
    accent: "bg-cyan-500/20 text-cyan-400",
    glow: "shadow-cyan-500/10",
    badge: "Semana 2",
    icon: Layers,
    iconColor: "text-cyan-400",
    tagColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    tags: ["DEXA · BIA", "Escaneo 3D", "Bod Pod"],
  },
  {
    gradient: "from-rose-500/20 to-red-500/10",
    border: "border-rose-500/20 hover:border-rose-500/40",
    accent: "bg-rose-500/20 text-rose-400",
    glow: "shadow-rose-500/10",
    badge: "Semana 3",
    icon: Heart,
    iconColor: "text-rose-400",
    tagColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    tags: ["VO₂ Máx", "ECG Deportivo", "Polar H10"],
  },
  {
    gradient: "from-green-500/20 to-emerald-500/10",
    border: "border-green-500/20 hover:border-green-500/40",
    accent: "bg-green-500/20 text-green-400",
    glow: "shadow-green-500/10",
    badge: "Semana 4",
    icon: Radio,
    iconColor: "text-green-400",
    tagColor: "bg-green-500/10 text-green-400 border-green-500/20",
    tags: ["EKG / ECG", "Polar H10", "Pulsioxímetro"],
  },
  {
    gradient: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20 hover:border-violet-500/40",
    accent: "bg-violet-500/20 text-violet-400",
    glow: "shadow-violet-500/10",
    badge: "Semana 5",
    icon: Smartphone,
    iconColor: "text-violet-400",
    tagColor: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    tags: ["Pulsioxímetro", "Smartwatch", "SpO₂"],
  },
];


// ── Login Page ────────────────────────────────────────────────────────────────
function LoginPage() {
  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center overflow-hidden relative px-4">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-blue-600/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-emerald-500/6 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/4 rounded-full blur-[160px] pointer-events-none" />

      {/* ECG line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden opacity-15">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-20">
          <motion.path
            d={ECG_PATH} fill="none" stroke="#22c55e" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
          />
        </svg>
      </div>

      {/* Floating chips — desktop only */}
      <FloatingChip label="VO₂ Máx" value="97.5" unit="ml/kg/min" color="border-blue-500/20 bg-blue-500/8" x="4%" y="22%" delay={0.5} />
      <FloatingChip label="Frecuencia Cardíaca" value="142" unit="bpm" color="border-rose-500/20 bg-rose-500/8" x="76%" y="18%" delay={0.8} />
      <FloatingChip label="HRV" value="78" unit="ms" color="border-emerald-500/20 bg-emerald-500/8" x="3%" y="62%" delay={1.1} />
      <FloatingChip label="Masa Grasa" value="12.4" unit="%" color="border-cyan-500/20 bg-cyan-500/8" x="79%" y="58%" delay={1.3} />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center space-y-8">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 90 }}
          className="relative inline-flex"
        >
          <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <Activity className="w-9 h-9 text-blue-400" />
          </div>
          <motion.div
            className="absolute inset-0 rounded-3xl border border-blue-400/25"
            animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </motion.div>

        {/* UPC Logo */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <img src="/logo-upc.png" alt="Universidad Peruana de Ciencias Aplicadas" className="h-10 mx-auto opacity-90" />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/50 text-[11px] font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          NTAFD · UPC · 2026
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="space-y-2"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Nuevas Tecnologías
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
              en el Deporte
            </span>
          </h1>
          <p className="text-white/40 text-base md:text-lg max-w-sm mx-auto">
            Ciencia aplicada al rendimiento deportivo — sensores, biomarcadores y análisis en tiempo real.
          </p>
        </motion.div>

        {/* Access cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 80 }}
          className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
        >
          {/* Student */}
          <Link href="/login">
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group cursor-pointer rounded-3xl bg-gradient-to-br from-blue-500/15 to-blue-600/5 border border-blue-500/25 hover:border-blue-400/50 p-6 text-left transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-4">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-1">Alumno</p>
              <h3 className="text-white font-bold text-lg mb-1">Ingresar al curso</h3>
              <p className="text-white/40 text-sm">Accede a las clases, dinámicas y tu progreso personal.</p>
              <div className="mt-4 flex items-center gap-1 text-blue-400 text-sm font-medium">
                Entrar <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>

          {/* Professor */}
          <Link href="/profesor">
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group cursor-pointer rounded-3xl bg-gradient-to-br from-violet-500/15 to-purple-600/5 border border-violet-500/25 hover:border-violet-400/50 p-6 text-left transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10"
            >
              <div className="w-11 h-11 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5 text-violet-400" />
              </div>
              <p className="text-xs text-violet-400 font-semibold uppercase tracking-widest mb-1">Docente</p>
              <h3 className="text-white font-bold text-lg mb-1">Panel del profesor</h3>
              <p className="text-white/40 text-sm">Controla las dinámicas y visualiza el progreso en tiempo real.</p>
              <div className="mt-4 flex items-center gap-1 text-violet-400 text-sm font-medium">
                Acceder <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="flex items-center gap-8 pt-2"
        >
          {[
            { value: "3", label: "Semanas" },
            { value: "5", label: "Clases" },
            { value: "15+", label: "Dinámicas" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-[11px] text-white/30 uppercase tracking-widest">{s.label}</p>
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
  const [stats, setStats] = useState({ totalDynamics: 0, totalClasses: 0, completionPercent: 0, recentClass: null as any });
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  useEffect(() => {
    if (!student?.sessionToken) return;
    const fetchStats = async () => {
      try {
        let totalDynamicsCompleted = 0, classesAccessed = 0;
        const allProgressData: any[] = [];
        for (const week of COURSE_CONFIG) {
          for (const cls of week.classes) {
            if (isClassAvailable(week.id, cls.id)) {
              const res = await fetch("/api/trpc/student.getProgress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ json: { token: student.sessionToken!, weekId: week.id, classId: cls.id } }),
              });
              const data = await res.json();
              const progress = data.result?.data;
              if (progress) {
                const completed = (progress.completedDynamics as number[] | null) ?? [];
                if (completed.length > 0) {
                  classesAccessed++;
                  totalDynamicsCompleted += completed.length;
                  allProgressData.push({ week: week.id, class: cls.id, classTitle: cls.title, completed: completed.length, total: cls.dynamics.length, updatedAt: progress.updatedAt });
                }
              }
            }
          }
        }
        const totalAvailable = COURSE_CONFIG.reduce((acc, w) =>
          acc + w.classes.filter(c => isClassAvailable(w.id, c.id)).reduce((s, c) => s + c.dynamics.length, 0), 0);
        const mostRecent = allProgressData.length > 0 ? allProgressData.sort((a, b) => (b.updatedAt as any) - (a.updatedAt as any))[0] : null;
        setStats({ totalDynamics: totalDynamicsCompleted, totalClasses: classesAccessed, completionPercent: totalAvailable > 0 ? Math.round((totalDynamicsCompleted / totalAvailable) * 100) : 0, recentClass: mostRecent });
      } catch {}
    };
    fetchStats();
  }, [student?.sessionToken]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712]">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-2 border-blue-400/20 border-t-blue-400 rounded-full" />
    </div>
  );

  if (!student) return <LoginPage />;

  const levelMap = [
    { min: 0, label: "Explorador", color: "text-slate-400", bg: "bg-slate-400/10 border-slate-400/20" },
    { min: 25, label: "Aprendiz", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
    { min: 50, label: "Experto", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
    { min: 75, label: "Maestro", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  ];
  const level = [...levelMap].reverse().find(l => stats.completionPercent >= l.min) ?? levelMap[0];
  const firstName = student.fullName.split(" ")[0];

  return (
    <div className="min-h-screen bg-[#030712] overflow-x-hidden">
      {/* ── Ambient glow spots ── */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[130px] pointer-events-none" />

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-50 border-b border-white/6 bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <img src="/logo-upc.png" alt="UPC" className="h-7 opacity-90" />
            <div className="h-5 w-px bg-white/10" />
            <div>
              <p className="font-bold text-white text-sm leading-tight">NTAFD</p>
              <p className="text-[11px] text-white/40">Nuevas Tecnologías en el Deporte</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${level.bg} ${level.color}`}>
                {level.label}
              </span>
              <span className="text-white/50 text-sm">{firstName}</span>
            </div>
            <button onClick={logout} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-colors">
              <LogOut size={17} />
            </button>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* ── Hero greeting ── */}
        <section className="relative py-16 md:py-20">
          {/* Background ECG line */}
          <div className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden opacity-8">
            <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-16">
              <motion.path d={ECG_PATH} fill="none" stroke="#22c55e" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
              />
            </svg>
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
            {/* Left: greeting */}
            <div className="space-y-5">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 text-xs font-medium uppercase tracking-widest px-4 py-1.5 rounded-full">
                <motion.span className="w-1.5 h-1.5 rounded-full bg-green-400"
                  animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                Sesión activa
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                Hola,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                  {firstName}
                </span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-white/50 text-lg leading-relaxed max-w-sm">
                Continúa dominando las tecnologías del rendimiento deportivo.
              </motion.p>

              {stats.recentClass && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Link href={`/week/${stats.recentClass.week}/class/${stats.recentClass.class}`}>
                    <motion.div whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-3 bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 rounded-2xl px-5 py-3 transition-colors cursor-pointer">
                      <PlayCircle className="text-blue-400" size={18} />
                      <div>
                        <p className="text-xs text-white/40">Continuar donde quedaste</p>
                        <p className="text-sm font-semibold text-white">{stats.recentClass.classTitle.split(":")[1]?.trim() ?? stats.recentClass.classTitle}</p>
                      </div>
                      <ArrowRight className="text-blue-400 ml-2" size={16} />
                    </motion.div>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Right: stats ring + metrics */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: "spring" }}
              className="flex flex-col items-center gap-6">
              {/* Circular progress */}
              <div className="relative flex items-center justify-center">
                <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
                  <defs>
                    <linearGradient id="cpg" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                  <circle cx="90" cy="90" r="72" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <motion.circle cx="90" cy="90" r="72" fill="none" stroke="url(#cpg)"
                    strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 72}
                    initial={{ strokeDashoffset: 2 * Math.PI * 72 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 72 * (1 - stats.completionPercent / 100) }}
                    transition={{ duration: 1.8, delay: 0.6, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span className="text-4xl font-bold text-white"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                    {stats.completionPercent}%
                  </motion.span>
                  <span className="text-xs text-white/40 mt-0.5">completado</span>
                </div>
              </div>

              {/* Stat chips */}
              <div className="grid grid-cols-3 gap-3 w-full">
                {[
                  { icon: Zap, label: "Dinámicas", value: stats.totalDynamics, color: "text-blue-400", bg: "bg-blue-400/10" },
                  { icon: Target, label: "Clases", value: stats.totalClasses, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                  { icon: TrendingUp, label: "Nivel", value: level.label, color: level.color, bg: level.bg.split(" ")[0] },
                ].map((s, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-white/4 border border-white/8">
                    <div className={`p-1.5 rounded-xl ${s.bg}`}><s.icon size={14} className={s.color} /></div>
                    <span className={`text-base font-bold ${s.color}`}>{typeof s.value === "number" ? <Counter to={s.value} /> : s.value}</span>
                    <span className="text-[10px] text-white/40">{s.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Quick tools ── */}
        <section className="pb-10">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white">Herramientas</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                href: "/mi-progreso",
                icon: Trophy,
                label: "Mi Progreso",
                desc: "Logros, puntuación, tiempo y notas",
                gradient: "from-yellow-500/15 to-orange-500/15",
                border: "border-yellow-500/20",
                color: "text-yellow-400",
              },
              {
                href: "/flashcards",
                icon: BookOpen,
                label: "Modo Repaso",
                desc: "Flashcards de conceptos clave por semana",
                gradient: "from-blue-500/15 to-indigo-500/15",
                border: "border-blue-500/20",
                color: "text-blue-400",
              },
              {
                href: "/simuladores",
                icon: Activity,
                label: "Simuladores",
                desc: "ECG interactivo y calculadora VO₂ máx",
                gradient: "from-green-500/15 to-cyan-500/15",
                border: "border-green-500/20",
                color: "text-green-400",
              },
            ].map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.div key={tool.href}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <Link href={tool.href}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className={`rounded-2xl border bg-gradient-to-br ${tool.gradient} ${tool.border} p-5 cursor-pointer transition-all hover:brightness-110`}>
                      <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3 ${tool.color}`}>
                        <Icon size={20} />
                      </div>
                      <h3 className="text-white font-semibold mb-1">{tool.label}</h3>
                      <p className="text-white/40 text-xs leading-relaxed">{tool.desc}</p>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Course weeks ── */}
        <section className="pb-24">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white">Ruta de aprendizaje</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
          </motion.div>

          <div className="space-y-4">
            {COURSE_CONFIG.map((week, wi) => {
              const theme = WEEK_THEMES[wi] ?? WEEK_THEMES[0];
              const WeekIcon = theme.icon;
              const isExpanded = expandedWeek === week.id;
              const availableClasses = week.classes.filter(c => isClassAvailable(week.id, c.id)).length;

              return (
                <motion.div key={week.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: wi * 0.1 }}>

                  {/* Week header card */}
                  <motion.div
                    onClick={() => setExpandedWeek(isExpanded ? null : week.id)}
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.998 }}
                    className={`relative overflow-hidden rounded-3xl border bg-gradient-to-r ${theme.gradient} ${theme.border} p-5 md:p-6 cursor-pointer transition-all`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${theme.accent} flex-shrink-0`}>
                        <WeekIcon size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-xs font-bold uppercase tracking-widest ${theme.iconColor}`}>{theme.badge}</span>
                          {availableClasses > 0 && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${theme.tagColor} border`}>
                              {availableClasses} {availableClasses === 1 ? "clase disponible" : "clases disponibles"}
                            </span>
                          )}
                        </div>
                        <h3 className="text-white font-bold text-lg leading-tight truncate">{week.title}</h3>
                        <p className="text-white/50 text-sm mt-0.5 line-clamp-1">{week.description}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="hidden md:flex gap-1.5">
                          {theme.tags.map(tag => (
                            <span key={tag} className={`text-[11px] px-2.5 py-1 rounded-full border ${theme.tagColor}`}>{tag}</span>
                          ))}
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                          className="text-white/40"
                        >
                          <ChevronDown size={20} />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Expanded classes */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {week.classes.map((cls, ci) => {
                            const avail = isClassAvailable(week.id, cls.id);
                            return (
                              <motion.div key={cls.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: ci * 0.07 }}
                                className={`group relative overflow-hidden rounded-2xl border bg-white/3 backdrop-blur-sm p-5 transition-all ${avail ? `${theme.border} hover:bg-white/5` : "border-white/6 opacity-60"}`}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className={`p-2.5 rounded-xl ${avail ? theme.accent : "bg-white/8"}`}>
                                    {avail ? <PlayCircle size={18} className={theme.iconColor} /> : <Lock size={18} className="text-white/30" />}
                                  </div>
                                  <span className="text-[10px] text-white/30 font-medium">{cls.dynamics.length} dinámicas</span>
                                </div>
                                <h4 className="text-white font-semibold mb-1 text-sm leading-snug">{cls.title}</h4>
                                <p className="text-white/40 text-xs mb-4 line-clamp-2">{cls.description}</p>
                                {avail ? (
                                  <Link href={`/week/${week.id}/class/${cls.id}`}>
                                    <motion.button
                                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                      className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${wi === 0 ? "from-amber-500 to-orange-500" : wi === 1 ? "from-cyan-500 to-blue-500" : "from-rose-500 to-red-500"} opacity-90 hover:opacity-100 transition-opacity`}
                                    >
                                      Comenzar clase <ArrowRight size={15} />
                                    </motion.button>
                                  </Link>
                                ) : (
                                  <div className="w-full py-2 rounded-xl text-center text-xs text-white/25 bg-white/4 border border-white/8 font-medium">
                                    Próximamente
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}

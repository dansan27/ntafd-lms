import { useState, useMemo, Suspense } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Users, BarChart3, MessageSquare, Cloud, RefreshCw, ArrowLeft,
  CheckCircle2, Activity, Gamepad2, Lock, Unlock, Power, KeyRound, Eye, EyeOff,
  ChevronLeft, ChevronRight, PanelLeftOpen, Presentation, Home, LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { toast } from "sonner";
import { COURSE_CONFIG, getClassConfig } from "@/data/courseConfig";
import { getBlockComponent } from "@/components/blocks/blockRegistry";

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  title, value, subtitle, icon: Icon, gradient, delay = 0,
}: {
  title: string; value: string | number; subtitle?: string; icon: any;
  gradient: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
    >
      <div className={`rounded-2xl p-4 bg-gradient-to-br ${gradient} border border-white/5 backdrop-blur-sm`}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] text-white/50 uppercase tracking-widest font-medium">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {subtitle && <p className="text-[11px] text-white/40">{subtitle}</p>}
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Icon size={18} className="text-white/80" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function ProfessorLogin({ onLogin }: { onLogin: (password: string) => void }) {
  const [password, setPassword] = useState("profesor2026");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = trpc.professor.login.useMutation({
    onSuccess: () => { onLogin(password); },
    onError: (err) => {
      console.error("Login error:", err);
      setError("Contraseña incorrecta. Intenta de nuevo.");
      setPassword("");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#030712] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="rounded-3xl bg-[#0d0d0f]/80 border border-white/8 backdrop-blur-xl shadow-2xl p-8 space-y-8">
          <div className="text-center space-y-3">
            <img src="/logo-upc.png" alt="UPC" className="h-9 mx-auto opacity-90" />
            <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto">
              <KeyRound size={28} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Panel del Profesor</h2>
              <p className="text-sm text-white/40 mt-1">NTAFD · UPC — Acceso restringido</p>
            </div>
          </div>

          <form
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              if (password.trim()) { setError(""); loginMutation.mutate({ password }); }
            }}
            className="space-y-4"
          >
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value); setError("");
                }}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl pr-10 h-11 focus:border-primary/60 focus:ring-0"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-red-400 text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold"
              disabled={loginMutation.isPending || !password.trim()}
            >
              {loginMutation.isPending
                ? <RefreshCw size={14} className="animate-spin mr-2" />
                : null}
              Ingresar
            </Button>
          </form>

          <div className="text-center">
            <Link href="/">
              <button className="text-xs text-white/30 hover:text-white/60 transition-colors inline-flex items-center gap-1.5">
                <ArrowLeft size={12} /> Volver al inicio
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Presentation View ────────────────────────────────────────────────────────
function PresentationView({
  weekId, classId, currentBlock, setCurrentBlock, onBackToDashboard,
}: {
  weekId: number; classId: number; currentBlock: number;
  setCurrentBlock: (b: number) => void; onBackToDashboard: () => void;
}) {
  const classConfig = getClassConfig(weekId, classId);
  const blocks = classConfig?.blocks ?? [];
  const totalBlocks = blocks.length;
  const currentBlockConfig = blocks.find(b => b.id === currentBlock);
  const BlockComponent = currentBlockConfig ? getBlockComponent(currentBlockConfig.componentName) : null;

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col">
      <header className="sticky top-0 z-40 bg-[#1C1C1E]/95 backdrop-blur border-b border-white/8">
        <div className="flex items-center justify-between h-12 px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
            >
              <PanelLeftOpen size={14} /> Panel
            </button>
            <div className="h-4 w-px bg-white/15" />
            <span className="text-sm font-medium text-white/80">
              Bloque {currentBlock}: {currentBlockConfig?.title ?? ""}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <div className="hidden md:flex items-center gap-1 mr-2">
              {blocks.map(b => (
                <button
                  key={b.id}
                  onClick={() => setCurrentBlock(b.id)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    b.id === currentBlock
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-white/8 text-white/50 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {b.id}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentBlock(Math.max(1, currentBlock - 1))}
              disabled={currentBlock <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/8 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs text-white/40 w-10 text-center">{currentBlock}/{totalBlocks}</span>
            <button
              onClick={() => setCurrentBlock(Math.min(totalBlocks, currentBlock + 1))}
              disabled={currentBlock >= totalBlocks}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/8 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <RefreshCw size={24} className="animate-spin text-primary" />
          </div>
        }>
          {BlockComponent ? <BlockComponent /> : (
            <div className="flex items-center justify-center h-64 text-white/40">Bloque no encontrado</div>
          )}
        </Suspense>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ProfessorDashboard() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState<string | null>(() => {
    if (typeof window !== "undefined") return sessionStorage.getItem("profPassword");
    return null;
  });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [view, setView] = useState<"dashboard" | "presentation">("dashboard");
  const [presentationBlock, setPresentationBlock] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedClass, setSelectedClass] = useState(1);

  const handleLogin = (pwd: string) => {
    setPassword(pwd);
    sessionStorage.setItem("profPassword", pwd);
  };

  const handleLogout = () => {
    setPassword(null);
    sessionStorage.removeItem("profPassword");
    setLocation("/");
  };

  if (!password) return <ProfessorLogin onLogin={handleLogin} />;

  if (view === "presentation") {
    return (
      <PresentationView
        weekId={selectedWeek}
        classId={selectedClass}
        currentBlock={presentationBlock}
        setCurrentBlock={setPresentationBlock}
        onBackToDashboard={() => setView("dashboard")}
      />
    );
  }

  return (
    <DashboardContent
      password={password}
      autoRefresh={autoRefresh}
      setAutoRefresh={setAutoRefresh}
      selectedWeek={selectedWeek}
      selectedClass={selectedClass}
      onSelectClass={(w, c) => { setSelectedWeek(w); setSelectedClass(c); }}
      onLogout={handleLogout}
      onPresentation={(block) => { setPresentationBlock(block); setView("presentation"); }}
    />
  );
}

// ─── Dashboard Content ────────────────────────────────────────────────────────
function DashboardContent({
  password, autoRefresh, setAutoRefresh, selectedWeek, selectedClass, onSelectClass, onLogout, onPresentation,
}: {
  password: string; autoRefresh: boolean; setAutoRefresh: (v: boolean) => void;
  selectedWeek: number; selectedClass: number;
  onSelectClass: (w: number, c: number) => void;
  onLogout: () => void; onPresentation: (block: number) => void;
}) {
  const [activeTab, setActiveTab] = useState<"students" | "reflections" | "wordcloud">("students");

  const classConfig = getClassConfig(selectedWeek, selectedClass);
  const dynamics = classConfig?.dynamics ?? [];
  const blocks = classConfig?.blocks ?? [];

  const { data: stats, refetch: refetchStats } = trpc.professor.stats.useQuery(
    { password, weekId: selectedWeek, classId: selectedClass },
    { refetchInterval: autoRefresh ? 5000 : false, retry: false, onError: () => onLogout() } as any
  );
  const { data: students, refetch: refetchStudents } = trpc.professor.students.useQuery(
    { password },
    { refetchInterval: autoRefresh ? 5000 : false, retry: false } as any
  );
  const { data: allResponses } = trpc.professor.allResponses.useQuery(
    { password, weekId: selectedWeek, classId: selectedClass },
    { refetchInterval: autoRefresh ? 5000 : false }
  );
  const { data: reflections } = trpc.professor.allReflections.useQuery(
    { password, weekId: selectedWeek, classId: selectedClass },
    { refetchInterval: autoRefresh ? 5000 : false }
  );
  const { data: wordCloud } = trpc.professor.wordCloud.useQuery(
    { password, weekId: selectedWeek, classId: selectedClass },
    { refetchInterval: autoRefresh ? 10000 : false }
  );
  const { data: dynamicStatuses, refetch: refetchStatuses } = trpc.professor.dynamicStatuses.useQuery(
    { password },
    { refetchInterval: autoRefresh ? 3000 : false }
  );

  const toggleDynamic = trpc.professor.toggleDynamic.useMutation({
    onSuccess: (data) => {
      refetchStatuses();
      const dynConfig = dynamics.find(d => d.id === data.dynamicId);
      toast.success(`${dynConfig?.name ?? `D${data.dynamicId}`} ${data.isActive ? "ACTIVADA" : "DESACTIVADA"}`);
    },
    onError: () => toast.error("Error al cambiar estado de la dinámica"),
  });

  const refreshAll = () => { refetchStats(); refetchStudents(); refetchStatuses(); };

  const isDynamicActive = (dynamicId: number) => {
    const status = dynamicStatuses?.find((s: any) =>
      s.dynamicId === dynamicId && s.weekId === selectedWeek && s.classId === selectedClass
    );
    return !!status?.isActive;
  };

  const studentTableData = useMemo(() => {
    if (!students || !allResponses) return [];
    return students.map((s: any) => {
      const responses = allResponses.filter((r: any) => r.studentId === s.id);
      const dynamicScores: Record<number, any> = {};
      for (const d of dynamics) {
        dynamicScores[d.id] = responses.find((r: any) => r.dynamicId === d.id);
      }
      const completedCount = dynamics.filter(d => dynamicScores[d.id]).length;
      return { ...s, dynamicScores, completedCount };
    });
  }, [students, allResponses, dynamics]);

  const classTitle = classConfig?.title ?? `Semana ${selectedWeek} Clase ${selectedClass}`;

  const selectedKey = `${selectedWeek}-${selectedClass}`;

  const TABS = [
    { id: "students" as const, label: "Alumnos", icon: Users },
    { id: "reflections" as const, label: "Reflexiones", icon: MessageSquare },
    { id: "wordcloud" as const, label: "Nube", icon: Cloud },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[700px] h-[400px] rounded-full bg-primary/8 blur-[140px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#030712]/80 backdrop-blur-xl border-b border-white/8">
        <div className="container flex items-center justify-between h-14 gap-3">
          {/* Left: logo + class selector */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                <BarChart3 size={14} className="text-primary" />
              </div>
              <span className="font-bold text-sm hidden sm:inline">Panel del Profesor</span>
            </div>

            <div className="h-5 w-px bg-white/10 hidden sm:block" />

            {/* Class selector dropdown */}
            <select
              value={selectedKey}
              onChange={(e) => {
                const [w, c] = e.target.value.split("-").map(Number);
                onSelectClass(w, c);
              }}
              className="bg-white/8 border border-white/10 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-primary/60 cursor-pointer appearance-none pr-7 relative"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
            >
              {COURSE_CONFIG.map(week => (
                <optgroup key={week.id} label={week.title} style={{ background: "#1c1c1e", color: "rgba(255,255,255,0.5)" }}>
                  {week.classes.map(cls => {
                    const available = cls.available && cls.blocks.length > 0;
                    return (
                      <option
                        key={`${week.id}-${cls.id}`}
                        value={`${week.id}-${cls.id}`}
                        disabled={!available}
                        style={{ background: "#1c1c1e", color: available ? "white" : "rgba(255,255,255,0.3)" }}
                      >
                        S{week.id}C{cls.id} — {cls.title}
                      </option>
                    );
                  })}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {blocks.length > 0 && (
              <button
                onClick={() => onPresentation(blocks[0]?.id ?? 1)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary text-xs font-medium transition-all"
              >
                <Presentation size={13} />
                <span className="hidden sm:inline">Presentar</span>
              </button>
            )}

            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                autoRefresh ? "bg-green-500/20 text-green-400" : "bg-white/8 text-white/50 hover:bg-white/15"
              }`}
              title={autoRefresh ? "Auto-actualización activada" : "Auto-actualización desactivada"}
            >
              <RefreshCw size={13} className={autoRefresh ? "animate-spin" : ""} />
            </button>

            <button
              onClick={refreshAll}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/8 text-white/50 hover:bg-white/15 hover:text-white transition-all"
              title="Actualizar"
            >
              <RefreshCw size={13} />
            </button>

            <Link href="/">
              <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/8 text-white/50 hover:bg-white/15 hover:text-white transition-all">
                <Home size={13} />
              </button>
            </Link>

            <button
              onClick={onLogout}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/8 text-white/50 hover:bg-red-500/20 hover:text-red-400 transition-all"
              title="Cerrar sesión"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </header>

      <div className="container py-6 space-y-6 relative z-10">

        {/* ── Presentation quick-access ── */}
        {blocks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="rounded-2xl bg-[#0d0d0f]/60 border border-white/8 p-5 space-y-3 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Presentation size={14} className="text-blue-400" />
                  </div>
                  <span className="text-sm font-semibold">{classTitle}</span>
                  <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/20 text-[10px] ml-1">
                    {blocks.length} bloques
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {blocks.map((b, i) => (
                  <motion.button
                    key={b.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.04 }}
                    onClick={() => onPresentation(b.id)}
                    className="p-2.5 rounded-xl border border-white/8 hover:border-primary/40 hover:bg-primary/10 transition-all text-center group"
                  >
                    <span className="text-xs block font-bold text-white/40 group-hover:text-primary">B{b.id}</span>
                    <span className="text-[9px] text-white/30 group-hover:text-primary/70 truncate block leading-tight mt-0.5">
                      {b.title}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Dynamic controls ── */}
        {dynamics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="rounded-2xl bg-[#0d0d0f]/60 border border-white/8 p-5 space-y-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Gamepad2 size={14} className="text-primary" />
                  </div>
                  <span className="text-sm font-semibold">Control de Dinámicas</span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[10px] font-medium">
                    <Power size={9} /> LIVE
                  </span>
                </div>
                <p className="text-[11px] text-white/30 hidden sm:block">
                  Activa para que los alumnos puedan responder
                </p>
              </div>

              <div className={`grid grid-cols-1 sm:grid-cols-2 ${dynamics.length <= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-3`}>
                {dynamics.map((dyn, i) => {
                  const active = isDynamicActive(dyn.id);
                  const dynStats = stats?.dynamicStats?.find((ds: any) => ds.dynamicId === dyn.id);
                  const blockConfig = blocks.find(b => b.id === dyn.blockId);
                  return (
                    <motion.div
                      key={dyn.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 + i * 0.06 }}
                      className={`rounded-2xl border-2 p-4 transition-all duration-300 ${
                        active
                          ? "border-green-500/60 bg-green-500/8 shadow-lg shadow-green-500/10"
                          : "border-white/8 bg-white/3 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl">{dyn.icon}</span>
                        <Switch
                          checked={active}
                          onCheckedChange={(checked: boolean) => {
                            toggleDynamic.mutate({
                              password, weekId: selectedWeek, classId: selectedClass,
                              dynamicId: dyn.id, isActive: checked,
                            });
                          }}
                          disabled={toggleDynamic.isPending}
                        />
                      </div>
                      <p className="font-semibold text-sm text-white">{dyn.name}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">
                        {blockConfig ? `Bloque ${blockConfig.id}: ${blockConfig.title}` : `Bloque ${dyn.blockId}`}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        {active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-medium">
                            <Unlock size={9} /> Activa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/8 text-white/30 text-[10px] font-medium">
                            <Lock size={9} /> Bloqueada
                          </span>
                        )}
                        <span className="text-[10px] text-white/30">
                          {dynStats?.totalResponses ?? 0} resp.
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            title="Alumnos conectados" value={stats?.totalStudents ?? 0}
            icon={Users} gradient="from-blue-600/20 to-blue-600/5" delay={0.2}
          />
          <StatCard
            title="Completaron todo" value={stats?.completedAll ?? 0}
            subtitle={`de ${stats?.totalStudents ?? 0}`}
            icon={CheckCircle2} gradient="from-green-600/20 to-green-600/5" delay={0.25}
          />
          <StatCard
            title="Reflexiones" value={stats?.totalReflections ?? 0}
            icon={MessageSquare} gradient="from-purple-600/20 to-purple-600/5" delay={0.3}
          />
          <StatCard
            title="Sentimiento"
            value={`${stats?.sentimentCounts?.positivo ?? 0}+ / ${stats?.sentimentCounts?.neutro ?? 0}= / ${stats?.sentimentCounts?.negativo ?? 0}-`}
            icon={Activity} gradient="from-amber-500/20 to-amber-500/5" delay={0.35}
          />
        </div>

        {/* ── Dynamic stats ── */}
        {stats?.dynamicStats && stats.dynamicStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`grid grid-cols-2 ${stats.dynamicStats.length <= 4 ? "md:grid-cols-4" : "md:grid-cols-3"} gap-3`}
          >
            {stats.dynamicStats.map((ds: any) => {
              const dynConfig = dynamics.find(d => d.id === ds.dynamicId);
              return (
                <div key={ds.dynamicId} className="rounded-2xl bg-[#0d0d0f]/60 border border-white/8 p-4 backdrop-blur-sm">
                  <p className="text-[11px] text-white/40 uppercase tracking-widest mb-1">
                    {dynConfig?.name ?? `Dinámica ${ds.dynamicId}`}
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">{ds.totalResponses}</p>
                      <p className="text-[10px] text-white/30">respuestas</p>
                    </div>
                    <span className="text-xs text-white/50 bg-white/8 px-2 py-0.5 rounded-full">
                      Prom: {ds.avgScore}
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* ── Tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="space-y-4"
        >
          {/* Pill tab switcher */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/5 w-fit">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-[#030712] shadow-sm"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Students tab */}
            {activeTab === "students" && (
              <motion.div
                key="students"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-2xl bg-[#0d0d0f]/60 border border-white/8 overflow-hidden backdrop-blur-sm">
                  <div className="flex items-center gap-2 px-5 py-4 border-b border-white/8">
                    <Users size={16} className="text-white/50" />
                    <span className="font-semibold text-sm">Tabla de Alumnos y Respuestas</span>
                  </div>
                  <ScrollArea className="w-full">
                    <div className="min-w-[700px]">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/8 bg-white/3">
                            <th className="text-left p-4 font-medium text-white/50 text-xs uppercase tracking-widest">Alumno</th>
                            <th className="text-left p-4 font-medium text-white/50 text-xs uppercase tracking-widest">Código</th>
                            {dynamics.map(d => (
                              <th key={d.id} className="text-center p-4 font-medium text-white/50 text-xs uppercase tracking-widest">
                                {d.icon} D{d.id}
                              </th>
                            ))}
                            <th className="text-center p-4 font-medium text-white/50 text-xs uppercase tracking-widest">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentTableData.map((s: any) => (
                            <tr key={s.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                              <td className="p-4 font-medium text-white">{s.fullName}</td>
                              <td className="p-4 text-white/40">{s.studentCode}</td>
                              {dynamics.map(d => {
                                const resp = s.dynamicScores[d.id];
                                return (
                                  <td key={d.id} className="p-4 text-center">
                                    {resp ? (
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                        resp.score === resp.maxScore
                                          ? "bg-green-500/15 text-green-400"
                                          : "bg-amber-500/15 text-amber-400"
                                      }`}>
                                        {resp.score}/{resp.maxScore}
                                      </span>
                                    ) : (
                                      <span className="text-white/20">—</span>
                                    )}
                                  </td>
                                );
                              })}
                              <td className="p-4 text-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  s.completedCount === dynamics.length
                                    ? "bg-green-500/15 text-green-400"
                                    : "bg-white/8 text-white/50"
                                }`}>
                                  {s.completedCount}/{dynamics.length}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {studentTableData.length === 0 && (
                            <tr>
                              <td colSpan={2 + dynamics.length + 1} className="p-10 text-center text-white/25">
                                Aún no hay alumnos conectados
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </ScrollArea>
                </div>
              </motion.div>
            )}

            {/* Reflections tab */}
            {activeTab === "reflections" && (
              <motion.div
                key="reflections"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-2xl bg-[#0d0d0f]/60 border border-white/8 overflow-hidden backdrop-blur-sm">
                  <div className="flex items-center gap-2 px-5 py-4 border-b border-white/8">
                    <MessageSquare size={16} className="text-white/50" />
                    <span className="font-semibold text-sm">Reflexiones de los Alumnos</span>
                  </div>
                  <div className="p-5 space-y-3">
                    {reflections && reflections.length > 0 ? (
                      reflections.map((r: any, i: number) => {
                        const student = (students as any[])?.find((s: any) => s.id === r.studentId);
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="p-4 rounded-2xl bg-white/5 border border-white/8 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-white">{student?.fullName ?? "Alumno"}</span>
                              {r.sentiment && (
                                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                                  r.sentiment === "positivo"
                                    ? "bg-green-500/15 text-green-400"
                                    : r.sentiment === "negativo"
                                      ? "bg-red-500/15 text-red-400"
                                      : "bg-white/8 text-white/50"
                                }`}>
                                  {r.sentiment}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-white/50">{r.reflectionText}</p>
                            {r.keywords && (r.keywords as string[]).length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {(r.keywords as string[]).map((kw: string, j: number) => (
                                  <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-white/8 text-white/40">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        );
                      })
                    ) : (
                      <p className="text-center text-white/25 py-10">Aún no hay reflexiones</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Word cloud tab */}
            {activeTab === "wordcloud" && (
              <motion.div
                key="wordcloud"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-2xl bg-[#0d0d0f]/60 border border-white/8 overflow-hidden backdrop-blur-sm">
                  <div className="flex items-center gap-2 px-5 py-4 border-b border-white/8">
                    <Cloud size={16} className="text-white/50" />
                    <span className="font-semibold text-sm">Nube de Palabras — Conceptos Clave</span>
                  </div>
                  <div className="p-8">
                    {wordCloud && wordCloud.length > 0 ? (
                      <div className="flex flex-wrap gap-3 justify-center items-center min-h-[200px]">
                        {wordCloud.map((item: { word: string; count: number }, i: number) => {
                          const maxCount = wordCloud[0]?.count ?? 1;
                          const scale = 0.75 + (item.count / maxCount) * 1.5;
                          const opacity = 0.45 + (item.count / maxCount) * 0.55;
                          const colors = [
                            "text-primary", "text-blue-400", "text-purple-400",
                            "text-emerald-400", "text-amber-400", "text-cyan-400",
                          ];
                          return (
                            <motion.span
                              key={item.word}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity, scale }}
                              transition={{ delay: i * 0.05, type: "spring", stiffness: 120 }}
                              className={`font-bold ${colors[i % colors.length]} cursor-default select-none`}
                              style={{ fontSize: `${scale}rem` }}
                              title={`${item.word}: ${item.count} menciones`}
                            >
                              {item.word}
                            </motion.span>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-center text-white/25 py-10">
                        La nube se generará cuando los alumnos envíen sus reflexiones
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

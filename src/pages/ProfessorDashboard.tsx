import { useState, useMemo, Suspense, useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { BorderBeam } from "border-beam";
import {
  Users, BarChart3, MessageSquare, Cloud, RefreshCw,
  CheckCircle2, Activity, Gamepad2, Lock, Unlock, Power,
  ChevronLeft, ChevronRight, PanelLeftOpen, Presentation, Home, LogOut, Trophy,
  ImageIcon, Search, Copy, Check, ChevronLeft as ChevLeft, ChevronRight as ChevRight,
  BookOpen, Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { toast } from "sonner";
import { COURSE_CONFIG, getClassConfig } from "@/data/courseConfig";
import { getBlockComponent } from "@/components/blocks/blockRegistry";

// Helper to generate initials from a name
const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

// Helper to generate consistent gradient class based on student name
const getAvatarGradient = (name: string) => {
  const colors = [
    "from-blue-500 to-indigo-500",
    "from-purple-500 to-pink-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-amber-500",
    "from-cyan-500 to-blue-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

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
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#0d0d0f]/60 to-[#030712]/40 backdrop-blur-sm p-4 transition-all duration-300 group hover:border-white/10"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-300`} />
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">{title}</p>
          <p className="text-2xl font-black text-white tracking-tight">{value}</p>
          {subtitle && <p className="text-[10px] text-white/35 font-medium leading-none">{subtitle}</p>}
        </div>
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
          <Icon size={16} className="text-white/70" />
        </div>
      </div>
    </motion.div>
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

  // Key navigation effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setCurrentBlock(Math.min(totalBlocks, currentBlock + 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentBlock(Math.max(1, currentBlock - 1));
      } else if (e.key === "Escape") {
        onBackToDashboard();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentBlock, totalBlocks, setCurrentBlock, onBackToDashboard]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-accent"
            >
              <PanelLeftOpen size={14} /> Panel
            </button>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium">
                Bloque {currentBlock}: {currentBlockConfig?.title ?? ""}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="hidden md:flex items-center gap-1 mr-2">
              {blocks.map(b => (
                <button
                  key={b.id}
                  onClick={() => setCurrentBlock(b.id)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all relative ${
                    b.id === currentBlock
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "bg-accent text-muted-foreground hover:bg-accent/80 hover:text-foreground"
                  }`}
                >
                  {b.id}
                  {b.id === currentBlock && (
                    <BorderBeam colorVariant="colorful" strength={0.6}>{null}</BorderBeam>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentBlock(Math.max(1, currentBlock - 1))}
              disabled={currentBlock <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs text-muted-foreground w-10 text-center">{currentBlock}/{totalBlocks}</span>
            <button
              onClick={() => setCurrentBlock(Math.min(totalBlocks, currentBlock + 1))}
              disabled={currentBlock >= totalBlocks}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 transition-all"
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
            <div className="flex items-center justify-center h-64 text-muted-foreground">Bloque no encontrado</div>
          )}
        </Suspense>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ProfessorDashboard() {
  const [, setLocation] = useLocation();
  const { signOut } = useClerk();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [view, setView] = useState<"dashboard" | "presentation">("dashboard");
  const [presentationBlock, setPresentationBlock] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedClass, setSelectedClass] = useState(1);

  const handleLogout = () => {
    signOut(() => setLocation("/"));
  };

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
      autoRefresh={autoRefresh}
      setAutoRefresh={setAutoRefresh}
      selectedWeek={selectedWeek}
      selectedClass={selectedClass}
      onSelectClass={(w, c) => { setSelectedWeek(w); setSelectedClass(c); }}
      onLogout={handleLogout}
      onPresentation={(block) => { setPresentationBlock(block); setView("presentation"); }}
      presentationBlock={presentationBlock}
    />
  );
}

// ─── Dashboard Content ────────────────────────────────────────────────────────
function DashboardContent({
  autoRefresh, setAutoRefresh, selectedWeek, selectedClass, onSelectClass, onLogout, onPresentation, presentationBlock,
}: {
  autoRefresh: boolean; setAutoRefresh: (v: boolean) => void;
  selectedWeek: number; selectedClass: number;
  onSelectClass: (w: number, c: number) => void;
  onLogout: () => void; onPresentation: (block: number) => void;
  presentationBlock: number;
}) {
  const [activeTab, setActiveTab] = useState<"students" | "reflections" | "wordcloud" | "leaderboard" | "images">("students");
  const [imageQuery, setImageQuery] = useState("");
  const [imageSearch, setImageSearch] = useState("");
  const [imagePage, setImagePage] = useState(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Search & filter states
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [reflectionSentimentFilter, setReflectionSentimentFilter] = useState<"all" | "positivo" | "neutro" | "negativo">("all");
  const [selectedKeywordFilter, setSelectedKeywordFilter] = useState<string | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const classConfig = getClassConfig(selectedWeek, selectedClass);
  const dynamics = classConfig?.dynamics ?? [];
  const blocks = classConfig?.blocks ?? [];

  const { data: stats, refetch: refetchStats } = trpc.professor.stats.useQuery(
    { weekId: selectedWeek, classId: selectedClass },
    { refetchInterval: autoRefresh ? 5000 : false, retry: false, onError: () => onLogout() } as any
  );
  const { data: students, refetch: refetchStudents } = trpc.professor.students.useQuery(
    undefined,
    { refetchInterval: autoRefresh ? 5000 : false, retry: false } as any
  );
  const { data: allResponses } = trpc.professor.allResponses.useQuery(
    { weekId: selectedWeek, classId: selectedClass },
    { refetchInterval: autoRefresh ? 5000 : false }
  );
  const { data: reflections } = trpc.professor.allReflections.useQuery(
    { weekId: selectedWeek, classId: selectedClass },
    { refetchInterval: autoRefresh ? 5000 : false }
  );
  const { data: wordCloud } = trpc.professor.wordCloud.useQuery(
    { weekId: selectedWeek, classId: selectedClass },
    { refetchInterval: autoRefresh ? 10000 : false }
  );
  const { data: dynamicStatuses, refetch: refetchStatuses } = trpc.professor.dynamicStatuses.useQuery(
    undefined,
    { refetchInterval: autoRefresh ? 3000 : false }
  );
  const { data: leaderboard } = trpc.professor.leaderboard.useQuery(
    undefined,
    { refetchInterval: autoRefresh ? 10000 : false }
  );
  const { data: imageResults, isFetching: imagesFetching } = trpc.images.search.useQuery(
    { query: imageSearch, page: imagePage },
    { enabled: imageSearch.length > 0 }
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
    
    // First map all student dynamics scores
    const mapped = students.map((s: any) => {
      const responses = allResponses.filter((r: any) => r.studentId === s.id);
      const dynamicScores: Record<number, any> = {};
      for (const d of dynamics) {
        dynamicScores[d.id] = responses.find((r: any) => r.dynamicId === d.id);
      }
      const completedCount = dynamics.filter(d => dynamicScores[d.id]).length;
      return { ...s, dynamicScores, completedCount };
    });

    // Filter by student search query if present
    if (!studentSearchQuery) return mapped;
    const q = studentSearchQuery.toLowerCase();
    return mapped.filter((s: any) =>
      s.fullName.toLowerCase().includes(q) || s.studentCode.toLowerCase().includes(q)
    );
  }, [students, allResponses, dynamics, studentSearchQuery]);

  const classTitle = classConfig?.title ?? `Semana ${selectedWeek} Clase ${selectedClass}`;

  const TABS = [
    { id: "students" as const, label: "Alumnos", icon: Users },
    { id: "reflections" as const, label: "Reflexiones", icon: MessageSquare },
    { id: "wordcloud" as const, label: "Nube", icon: Cloud },
    { id: "leaderboard" as const, label: "Ranking", icon: Trophy },
    { id: "images" as const, label: "Imágenes", icon: ImageIcon },
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
          {/* Left: logo + premium class selector */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                <BarChart3 size={14} className="text-primary" />
              </div>
              <span className="font-bold text-sm hidden sm:inline">Panel del Profesor</span>
            </div>

            <div className="h-5 w-px bg-white/10 hidden sm:block" />

            {/* Custom dropdown styled trigger */}
            <div className="relative">
              <button
                onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs rounded-xl px-3.5 py-1.5 font-medium transition-all cursor-pointer select-none"
              >
                <span className="text-primary-foreground/90 bg-primary/20 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
                  S{selectedWeek}C{selectedClass}
                </span>
                <span className="truncate max-w-[140px] sm:max-w-[200px] text-white/90">{classTitle}</span>
                <motion.div
                  animate={{ rotate: isSelectorOpen ? 180 : 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-white/40 shrink-0"
                >
                  <ChevronRight size={11} className="rotate-90" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isSelectorOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSelectorOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute left-0 mt-2 w-80 max-h-96 overflow-y-auto bg-[#0d0d0f]/95 border border-white/10 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-xl scrollbar-thin"
                    >
                      {COURSE_CONFIG.map(week => (
                        <div key={week.id} className="mb-2">
                          <p className="px-3 py-1 text-[9px] font-bold text-white/30 uppercase tracking-widest border-b border-white/5 mb-1">
                            {week.title}
                          </p>
                          <div className="space-y-0.5">
                            {week.classes.map(cls => {
                              const available = cls.available && cls.blocks.length > 0;
                              const isCurrent = selectedWeek === week.id && selectedClass === cls.id;
                              return (
                                <button
                                  key={cls.id}
                                  disabled={!available}
                                  onClick={() => {
                                    onSelectClass(week.id, cls.id);
                                    setIsSelectorOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                                    isCurrent
                                      ? "bg-primary/20 text-primary font-semibold"
                                      : available
                                      ? "text-white/70 hover:bg-white/5 hover:text-white"
                                      : "text-white/20 cursor-not-allowed"
                                  }`}
                                >
                                  <span className="truncate max-w-[200px]">C{cls.id} — {cls.title}</span>
                                  {isCurrent && <Check size={11} className="text-primary shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
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
                autoRefresh ? "bg-green-500/20 text-green-400 border border-green-500/10" : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
              title={autoRefresh ? "Auto-actualización activada" : "Auto-actualización desactivada"}
            >
              <RefreshCw size={13} className={autoRefresh ? "animate-spin" : ""} />
            </button>

            <button
              onClick={refreshAll}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5 transition-all"
              title="Actualizar"
            >
              <RefreshCw size={13} />
            </button>

            <Link href="/">
              <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5 transition-all">
                <Home size={13} />
              </button>
            </Link>

            <button
              onClick={onLogout}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-white/50 hover:bg-red-500/20 hover:text-red-400 border border-white/5 transition-all"
              title="Cerrar sesión"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </header>

      <div className="container py-6 space-y-6 relative z-10">

        {/* ─── DUAL COLUMN GRID LAYOUT ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
          
          {/* LEFT COLUMN: Controls (6/10) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Presentation quick-access */}
            {blocks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-2xl bg-[#0d0d0f]/60 border border-white/8 p-5 space-y-4 backdrop-blur-sm shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/10">
                    <Presentation size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{classTitle}</h3>
                    <p className="text-[10px] text-white/30">Haga clic en un bloque para presentarlo directamente</p>
                  </div>
                  <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/20 text-[10px] ml-auto">
                    {blocks.length} bloques
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {blocks.map((b, i) => {
                    const isCurrent = presentationBlock === b.id;
                    return (
                      <motion.button
                        key={b.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.03 }}
                        onClick={() => onPresentation(b.id)}
                        className={`relative p-2.5 rounded-xl border text-center group transition-all duration-300 ${
                          isCurrent
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/5"
                            : "border-white/5 bg-white/2 hover:border-white/15 hover:bg-white/5"
                        }`}
                      >
                        {isCurrent && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-ping" />
                        )}
                        <span className={`text-[10px] block font-bold transition-colors ${isCurrent ? "text-primary" : "text-white/40 group-hover:text-primary"}`}>
                          B{b.id}
                        </span>
                        <span className={`text-[9px] truncate block leading-tight mt-0.5 transition-colors ${isCurrent ? "text-white font-medium" : "text-white/30 group-hover:text-white/60"}`}>
                          {b.title}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Dynamic controls */}
            {dynamics.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl bg-[#0d0d0f]/60 border border-white/8 p-5 space-y-4 backdrop-blur-sm shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/10">
                      <Gamepad2 size={14} className="text-primary" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold">Control de Dinámicas</span>
                      <p className="text-[10px] text-white/30 mt-0.5">Habilita dinámicas interactivas para los alumnos</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-bold tracking-wider">
                    <Power size={8} className="animate-pulse" /> LIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dynamics.map((dyn, i) => {
                    const active = isDynamicActive(dyn.id);
                    const dynStats = stats?.dynamicStats?.find((ds: any) => ds.dynamicId === dyn.id);
                    const blockConfig = blocks.find(b => b.id === dyn.blockId);
                    
                    const responses = dynStats?.totalResponses ?? 0;
                    const totalStudents = stats?.totalStudents ?? 0;
                    const pctParticipation = totalStudents > 0 ? Math.min(100, Math.round((responses / totalStudents) * 100)) : 0;

                    return (
                      <motion.div
                        key={dyn.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 + i * 0.05 }}
                        className="relative rounded-2xl overflow-hidden group"
                      >
                        {active && <BorderBeam colorVariant="colorful" strength={0.8}>{null}</BorderBeam>}
                        <div className={`rounded-2xl border-2 p-4 transition-all duration-300 h-full flex flex-col justify-between ${
                          active
                            ? "border-green-500/60 bg-green-500/8 shadow-lg shadow-green-500/5"
                            : "border-white/5 bg-white/2 hover:border-white/10"
                        }`}>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-2xl">{dyn.icon}</span>
                              <Switch
                                checked={active}
                                onCheckedChange={(checked: boolean) => {
                                  toggleDynamic.mutate({
                                    weekId: selectedWeek, classId: selectedClass,
                                    dynamicId: dyn.id, isActive: checked,
                                  });
                                }}
                                disabled={toggleDynamic.isPending}
                              />
                            </div>
                            <p className="font-bold text-xs text-white leading-tight">{dyn.name}</p>
                            <p className="text-[9px] text-white/30 mt-0.5 truncate">
                              {blockConfig ? `Bloque ${blockConfig.id}: ${blockConfig.title}` : `Bloque ${dyn.blockId}`}
                            </p>
                          </div>

                          <div className="mt-4 space-y-1.5">
                            <div className="flex items-center justify-between text-[9px]">
                              {active ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-bold animate-pulse">
                                  <Unlock size={8} /> LIVE
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-white/40 font-medium">
                                  <Lock size={8} /> Bloqueado
                                </span>
                              )}
                              <span className="text-white/40 font-medium">
                                {responses}/{totalStudents} ({pctParticipation}%)
                              </span>
                            </div>
                            
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pctParticipation}%` }}
                                transition={{ duration: 0.5 }}
                                className={`h-full rounded-full ${active ? "bg-green-400" : "bg-white/20"}`}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT COLUMN: Stats & Real-time Analytics (4/10) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Stats row (2x2 grid) */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                title="Alumnos" value={stats?.totalStudents ?? 0}
                icon={Users} gradient="from-blue-600/30 to-blue-600/5" delay={0.1}
              />
              <StatCard
                title="Completo" value={stats?.completedAll ?? 0}
                subtitle={`de ${stats?.totalStudents ?? 0}`}
                icon={CheckCircle2} gradient="from-green-600/30 to-green-600/5" delay={0.15}
              />
              <StatCard
                title="Reflexiones" value={stats?.totalReflections ?? 0}
                icon={MessageSquare} gradient="from-purple-600/30 to-purple-600/5" delay={0.2}
              />
              <StatCard
                title="Sentimiento"
                value={`${stats?.sentimentCounts?.positivo ?? 0}+ / ${stats?.sentimentCounts?.negativo ?? 0}-`}
                subtitle={`${stats?.sentimentCounts?.neutro ?? 0} neutros`}
                icon={Activity} gradient="from-amber-500/30 to-amber-500/5" delay={0.25}
              />
            </div>

            {/* Sentiment Gauge Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-[#0d0d0f]/60 border border-white/8 p-5 backdrop-blur-sm space-y-4 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/10">
                  <Activity size={14} className="text-amber-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Sentiment Analytics</span>
              </div>

              {(() => {
                const pos = stats?.sentimentCounts?.positivo ?? 0;
                const neu = stats?.sentimentCounts?.neutro ?? 0;
                const neg = stats?.sentimentCounts?.negativo ?? 0;
                const total = pos + neu + neg;
                const pctPos = total > 0 ? (pos / total) * 100 : 0;
                const pctNeu = total > 0 ? (neu / total) * 100 : 0;
                const pctNeg = total > 0 ? (neg / total) * 100 : 0;

                return (
                  <div className="space-y-4">
                    <div className="h-3 w-full rounded-full flex overflow-hidden bg-white/5 border border-white/5 p-[1px]">
                      {total > 0 ? (
                        <>
                          {pos > 0 && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pctPos}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-emerald-500 to-green-400"
                              title={`Positivo: ${Math.round(pctPos)}%`}
                            />
                          )}
                          {neu > 0 && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pctNeu}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-slate-400 to-slate-500"
                              title={`Neutro: ${Math.round(pctNeu)}%`}
                            />
                          )}
                          {neg > 0 && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pctNeg}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-red-400 to-rose-500"
                              title={`Negativo: ${Math.round(pctNeg)}%`}
                            />
                          )}
                        </>
                      ) : (
                        <div className="w-full text-center text-[9px] text-white/20 flex items-center justify-center font-medium">
                          Sin respuestas de reflexión aún
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="space-y-0.5">
                        <p className="text-white/40 flex items-center justify-center gap-1 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                          Positivo
                        </p>
                        <p className="font-extrabold text-white text-sm">{pos}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-white/40 flex items-center justify-center gap-1 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
                          Neutro
                        </p>
                        <p className="font-extrabold text-white text-sm">{neu}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-white/40 flex items-center justify-center gap-1 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                          Negativo
                        </p>
                        <p className="font-extrabold text-white text-sm">{neg}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>

            {/* Dynamic average scores list */}
            {stats?.dynamicStats && stats.dynamicStats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="rounded-2xl bg-[#0d0d0f]/60 border border-white/8 p-5 backdrop-blur-sm space-y-4 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/10">
                    <Trophy size={14} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-white/80">Puntajes Promedio</h4>
                    <p className="text-[9px] text-white/30">Calificaciones acumuladas de dinámicas</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {stats.dynamicStats.map((ds: any) => {
                    const dynConfig = dynamics.find(d => d.id === ds.dynamicId);
                    const avgVal = parseFloat(ds.avgScore) || 0;
                    // Let's assume maximum score is 5 for progress percent bar
                    const pctVal = Math.min(100, (avgVal / 5) * 100);

                    return (
                      <div key={ds.dynamicId} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white/80 truncate max-w-[160px]">
                            {dynConfig?.name ?? `Dinámica ${ds.dynamicId}`}
                          </span>
                          <span className="text-[10px] text-white/40">
                            {ds.totalResponses} respuestas
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pctVal}%` }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                          <span className="text-[10px] font-bold text-primary shrink-0 w-8 text-right">
                            {ds.avgScore}/5
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ─── BOTTOM SECTION: TABS (100% width) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 pt-2"
        >
          {/* Premium Pill tab switcher with motion indicator */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white/5 w-fit border border-white/5">
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors duration-200 z-10 cursor-pointer ${
                    isActive ? "text-[#030712]" : "text-white/60 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-white rounded-xl -z-10 shadow-lg shadow-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <tab.icon size={13} className={isActive ? "text-[#030712]" : "text-white/40"} />
                  {tab.label}
                </button>
              );
            })}
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
                <div className="rounded-2xl bg-[#0d0d0f]/60 border border-white/8 overflow-hidden backdrop-blur-sm shadow-xl">
                  {/* Search bar inside header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-white/8 bg-white/2">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-white/50" />
                      <span className="font-semibold text-sm">Alumnos Conectados</span>
                    </div>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={13} />
                      <Input
                        value={studentSearchQuery}
                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                        placeholder="Buscar por nombre o código..."
                        className="pl-9 h-8 bg-white/5 border-white/10 text-xs rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary/50 text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  <ScrollArea className="w-full">
                    <div className="min-w-[700px]">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/[0.01]">
                            <th className="text-left p-4 font-bold text-white/40 text-[10px] uppercase tracking-wider">Alumno</th>
                            <th className="text-left p-4 font-bold text-white/40 text-[10px] uppercase tracking-wider">Código</th>
                            {dynamics.map(d => (
                              <th key={d.id} className="text-center p-4 font-bold text-white/40 text-[10px] uppercase tracking-wider">
                                {d.icon} D{d.id}
                              </th>
                            ))}
                            <th className="text-center p-4 font-bold text-white/40 text-[10px] uppercase tracking-wider">Avance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {studentTableData.map((s: any) => (
                            <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="p-4 font-semibold text-white">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarGradient(s.fullName)} flex items-center justify-center text-[10px] font-bold text-white shadow-inner shrink-0`}>
                                    {getInitials(s.fullName)}
                                  </div>
                                  <span className="truncate max-w-[180px]">{s.fullName}</span>
                                </div>
                              </td>
                              <td className="p-4 text-white/40 font-mono text-xs">{s.studentId}</td>
                              {dynamics.map(d => {
                                const resp = s.dynamicScores[d.id];
                                return (
                                  <td key={d.id} className="p-4 text-center">
                                    {resp ? (
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                        resp.score === resp.maxScore
                                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                      }`}>
                                        {resp.score}/{resp.maxScore}
                                      </span>
                                    ) : (
                                      <span className="text-white/10 font-bold">—</span>
                                    )}
                                  </td>
                                );
                              })}
                              <td className="p-4 text-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  s.completedCount === dynamics.length
                                    ? "bg-green-500/15 text-green-400 border-green-500/25 shadow-lg shadow-green-500/5 animate-pulse"
                                    : "bg-white/5 text-white/40 border-white/5"
                                }`}>
                                  {s.completedCount}/{dynamics.length}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {studentTableData.length === 0 && (
                            <tr>
                              <td colSpan={2 + dynamics.length + 1} className="p-12 text-center text-white/20 text-xs font-semibold">
                                No se encontraron alumnos conectados
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
                <div className="rounded-2xl bg-[#0d0d0f]/60 border border-white/8 overflow-hidden backdrop-blur-sm shadow-xl">
                  
                  {/* Tabs header with sentiment filter */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-white/8 bg-white/2">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} className="text-white/50" />
                      <span className="font-semibold text-sm">Reflexiones de los Alumnos</span>
                    </div>

                    {/* Sentiment filter pills */}
                    <div className="flex items-center gap-1.5 p-0.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold w-fit">
                      {(["all", "positivo", "neutro", "negativo"] as const).map((sent) => (
                        <button
                          key={sent}
                          onClick={() => setReflectionSentimentFilter(sent)}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            reflectionSentimentFilter === sent
                              ? "bg-white text-[#030712]"
                              : "text-white/55 hover:text-white"
                          }`}
                        >
                          {sent === "all" ? "Todas" : sent.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active keyword filter banner */}
                  {selectedKeywordFilter && (
                    <div className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 border-b border-white/5 text-xs text-primary font-medium">
                      <span>Filtrando por palabra clave: <strong>{selectedKeywordFilter}</strong></span>
                      <button
                        onClick={() => setSelectedKeywordFilter(null)}
                        className="underline hover:text-white ml-auto cursor-pointer"
                      >
                        Limpiar filtro
                      </button>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin">
                    {(() => {
                      let list = reflections ?? [];
                      if (reflectionSentimentFilter !== "all") {
                        list = list.filter((r: any) => r.sentiment === reflectionSentimentFilter);
                      }
                      if (selectedKeywordFilter) {
                        list = list.filter((r: any) => (r.keywords as string[])?.includes(selectedKeywordFilter));
                      }

                      return list.length > 0 ? (
                        list.map((r: any, i: number) => {
                          const student = (students as any[])?.find((s: any) => s.id === r.studentId);
                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.03 }}
                              className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-2 hover:border-white/10 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${student ? getAvatarGradient(student.fullName) : "from-slate-400 to-slate-500"} flex items-center justify-center text-[9px] font-bold text-white shadow-inner shrink-0`}>
                                    {student ? getInitials(student.fullName) : "?"}
                                  </div>
                                  <span className="text-xs font-semibold text-white/95">
                                    {student?.fullName ?? "Alumno"}
                                  </span>
                                </div>
                                {r.sentiment && (
                                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${
                                    r.sentiment === "positivo"
                                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                                      : r.sentiment === "negativo"
                                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                                        : "bg-white/5 text-white/40 border-white/5"
                                  }`}>
                                    {r.sentiment.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-white/60 leading-relaxed font-medium">{r.reflectionText}</p>
                              {r.keywords && (r.keywords as string[]).length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {(r.keywords as string[]).map((kw: string, j: number) => {
                                    const isSelected = selectedKeywordFilter === kw;
                                    return (
                                      <button
                                        key={j}
                                        onClick={() => setSelectedKeywordFilter(isSelected ? null : kw)}
                                        className={`text-[9px] px-2 py-0.5 rounded-full transition-all border font-semibold cursor-pointer ${
                                          isSelected
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-white/5 text-white/40 border-white/5 hover:border-white/15 hover:text-white"
                                        }`}
                                      >
                                        #{kw}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </motion.div>
                          );
                        })
                      ) : (
                        <p className="text-center text-white/20 py-12 text-xs font-semibold">Sin reflexiones coincidentes</p>
                      );
                    })()}
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
                <div className="rounded-2xl bg-[#0d0d0f]/60 border border-white/8 overflow-hidden backdrop-blur-sm shadow-xl">
                  <div className="flex items-center gap-2 px-5 py-4 border-b border-white/8 bg-white/2">
                    <Cloud size={16} className="text-white/50" />
                    <span className="font-semibold text-sm">Nube de Palabras — Conceptos Clave</span>
                  </div>
                  <div className="p-8">
                    {wordCloud && wordCloud.length > 0 ? (
                      <div className="flex flex-wrap gap-3.5 justify-center items-center min-h-[220px]">
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
                              transition={{ delay: i * 0.04, type: "spring", stiffness: 120 }}
                              className={`font-black ${colors[i % colors.length]} cursor-pointer select-none`}
                              style={{ fontSize: `${scale}rem` }}
                              onClick={() => {
                                setSelectedKeywordFilter(item.word);
                                setActiveTab("reflections");
                                toast.info(`Filtrando reflexiones por #${item.word}`);
                              }}
                              title={`${item.word}: ${item.count} menciones (Pulse para filtrar)`}
                            >
                              {item.word}
                            </motion.span>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-center text-white/25 py-12 text-xs font-semibold">
                        La nube se generará cuando los alumnos envíen sus reflexiones
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Leaderboard tab */}
            {activeTab === "leaderboard" && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-2xl bg-[#0d0d0f]/60 border border-white/8 overflow-hidden backdrop-blur-sm shadow-xl">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-white/2">
                    <div className="flex items-center gap-2">
                      <Trophy size={16} className="text-yellow-400" />
                      <span className="font-semibold text-sm">Ranking de Alumnos</span>
                    </div>
                    <span className="text-[10px] text-white/30 font-semibold">POR PUNTUACIÓN ACUMULADA</span>
                  </div>

                  <div className="p-5">
                    {leaderboard && leaderboard.length > 0 ? (
                      <div className="space-y-6">
                        {/* Podium for top 3 */}
                        <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-2xl mx-auto pt-6 pb-2 items-end">
                          {/* 2nd Place */}
                          {leaderboard[1] && (
                            <motion.div
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1, duration: 0.5 }}
                              className="flex flex-col items-center"
                            >
                              <div className="text-2xl mb-1">🥈</div>
                              <div className="w-full rounded-t-2xl border border-b-0 border-white/10 bg-gradient-to-b from-slate-400/10 to-slate-400/2 p-4 text-center space-y-2 pt-6 pb-4">
                                <div className="w-12 h-12 rounded-full mx-auto bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-slate-400/10 shrink-0">
                                  {getInitials(leaderboard[1].fullName)}
                                </div>
                                <div className="space-y-0.5">
                                  <p className="font-semibold text-[11px] text-white truncate max-w-full" title={leaderboard[1].fullName}>
                                    {leaderboard[1].fullName.split(" ")[0]}
                                  </p>
                                  <p className="text-[9px] text-white/30 font-mono">{leaderboard[1].studentId}</p>
                                </div>
                                <div className="bg-white/5 border border-white/5 py-1 rounded-xl">
                                  <p className="text-xs font-bold text-slate-300">{leaderboard[1].totalScore} pts</p>
                                  <p className="text-[9px] text-white/30">{leaderboard[1].completedDynamics} act.</p>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* 1st Place */}
                          {leaderboard[0] && (
                            <motion.div
                              initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                              className="flex flex-col items-center z-10"
                            >
                              <div className="text-3xl mb-1 filter drop-shadow-[0_0_8px_rgba(234,179,8,0.3)] animate-bounce">👑</div>
                              <div className="relative w-full rounded-t-2xl border border-b-0 border-yellow-500/30 bg-gradient-to-b from-yellow-500/15 via-yellow-500/5 to-yellow-500/2 p-4 text-center space-y-2 pt-8 pb-6 shadow-[0_-15px_30px_rgba(234,179,8,0.08)]">
                                <div className="absolute inset-0 bg-yellow-500/5 blur-2xl rounded-full -z-10 pointer-events-none" />
                                <div className="w-16 h-16 rounded-full mx-auto bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center font-black text-white text-sm shadow-xl shadow-yellow-500/20 ring-2 ring-yellow-400/40 shrink-0">
                                  {getInitials(leaderboard[0].fullName)}
                                </div>
                                <div className="space-y-0.5">
                                  <p className="font-bold text-xs text-white truncate max-w-full" title={leaderboard[0].fullName}>
                                    {leaderboard[0].fullName.split(" ")[0]}
                                  </p>
                                  <p className="text-[9px] text-yellow-400/50 font-mono font-medium">{leaderboard[0].studentId}</p>
                                </div>
                                <div className="bg-yellow-500/10 border border-yellow-500/20 py-1.5 rounded-xl">
                                  <p className="text-sm font-extrabold text-yellow-400">{leaderboard[0].totalScore} pts</p>
                                  <p className="text-[9px] text-yellow-300/40 font-semibold">{leaderboard[0].completedDynamics} act.</p>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* 3rd Place */}
                          {leaderboard[2] && (
                            <motion.div
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2, duration: 0.5 }}
                              className="flex flex-col items-center"
                            >
                              <div className="text-2xl mb-1">🥉</div>
                              <div className="w-full rounded-t-2xl border border-b-0 border-white/10 bg-gradient-to-b from-amber-700/10 to-amber-700/2 p-4 text-center space-y-2 pt-5 pb-3">
                                <div className="w-12 h-12 rounded-full mx-auto bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-amber-700/10 shrink-0">
                                  {getInitials(leaderboard[2].fullName)}
                                </div>
                                <div className="space-y-0.5">
                                  <p className="font-semibold text-[11px] text-white truncate max-w-full" title={leaderboard[2].fullName}>
                                    {leaderboard[2].fullName.split(" ")[0]}
                                  </p>
                                  <p className="text-[9px] text-white/30 font-mono">{leaderboard[2].studentId}</p>
                                </div>
                                <div className="bg-white/5 border border-white/5 py-1 rounded-xl">
                                  <p className="text-xs font-bold text-amber-500">{leaderboard[2].totalScore} pts</p>
                                  <p className="text-[9px] text-white/30">{leaderboard[2].completedDynamics} act.</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* List for the rest of the players */}
                        <div className="border border-white/8 rounded-2xl overflow-hidden bg-white/2 divide-y divide-white/5">
                          {leaderboard.map((entry: any, i: number) => {
                            if (i < 3) return null; // skip podium
                            const pct = entry.totalMax > 0 ? Math.round((entry.totalScore / entry.totalMax) * 100) : 0;
                            return (
                              <motion.div
                                key={entry.studentId}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (i - 3) * 0.03 }}
                                className="flex items-center gap-4 p-3.5 hover:bg-white/5 transition-colors"
                              >
                                <span className="text-xs font-bold text-white/40 w-6 text-center">
                                  #{i + 1}
                                </span>
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-white/10 to-white/2 flex items-center justify-center text-[9px] font-bold text-white/70 border border-white/10 shrink-0">
                                  {getInitials(entry.fullName)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-xs text-white truncate">{entry.fullName}</p>
                                  <p className="text-[9px] text-white/40">{entry.studentId} · {entry.completedDynamics} actividades</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-xs font-bold text-white">{entry.totalScore} <span className="text-[9px] text-white/30">pts</span></p>
                                  <p className="text-[9px] text-white/45">{pct}% precisión</p>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-white/25 py-12 text-xs font-semibold">Aún no hay datos de ranking</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Images tab */}
            {activeTab === "images" && (
              <motion.div
                key="images"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="rounded-2xl bg-[#0d0d0f]/60 border border-white/8 overflow-hidden backdrop-blur-sm shadow-xl">
                  <div className="flex items-center gap-2 px-5 py-4 border-b border-white/8 bg-white/2">
                    <ImageIcon size={16} className="text-blue-400" />
                    <span className="font-semibold text-sm">Buscador de Imágenes — Pexels</span>
                    <span className="text-xs text-white/35 ml-auto">Pasa el cursor sobre la imagen para copiar su enlace</span>
                  </div>
                  <div className="p-5 space-y-5">
                    {/* Search bar */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setImageSearch(imageQuery);
                        setImagePage(1);
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        value={imageQuery}
                        onChange={e => setImageQuery(e.target.value)}
                        placeholder="Ej: fuerza muscular, fibras musculares, laboratorio deportivo..."
                        className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary/50 text-xs rounded-xl"
                      />
                      <Button type="submit" className="gap-2 shrink-0 rounded-xl cursor-pointer" disabled={imagesFetching}>
                        <Search size={14} />
                        {imagesFetching ? "Buscando..." : "Buscar"}
                      </Button>
                    </form>

                    {/* Results grid */}
                    {imageResults && imageResults.photos.length > 0 && (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {imageResults.photos.map((photo: { id: number; photographer: string; alt: string; src: { medium: string; large: string } }) => (
                            <div key={photo.id} className="group relative rounded-xl overflow-hidden border border-white/5 aspect-video bg-white/5">
                              <img
                                src={photo.src.medium}
                                alt={photo.alt || photo.photographer}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center p-3 gap-2">
                                <p className="text-[9px] text-white/80 font-medium truncate max-w-full text-center mb-1">
                                  {photo.alt || `De: ${photo.photographer}`}
                                </p>
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(photo.src.large);
                                      setCopiedId(photo.id * 10 + 1);
                                      toast.success("URL copiada");
                                      setTimeout(() => setCopiedId(null), 2000);
                                    }}
                                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all text-[9px] flex items-center gap-1 font-semibold border border-white/5 cursor-pointer"
                                  >
                                    {copiedId === photo.id * 10 + 1 ? (
                                      <>
                                        <Check size={10} className="text-green-400" />
                                        <span>URL</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy size={10} />
                                        <span>URL</span>
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(`![${photo.alt || "Imagen"}](${photo.src.large})`);
                                      setCopiedId(photo.id * 10 + 2);
                                      toast.success("Markdown copiado");
                                      setTimeout(() => setCopiedId(null), 2000);
                                    }}
                                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all text-[9px] flex items-center gap-1 font-semibold border border-white/5 cursor-pointer"
                                  >
                                    {copiedId === photo.id * 10 + 2 ? (
                                      <>
                                        <Check size={10} className="text-green-400" />
                                        <span>MD</span>
                                      </>
                                    ) : (
                                      <>
                                        <BookOpen size={10} />
                                        <span>MD</span>
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(`<img src="${photo.src.large}" alt="${photo.alt || "Imagen"}" className="rounded-xl w-full" />`);
                                      setCopiedId(photo.id * 10 + 3);
                                      toast.success("HTML copiado");
                                      setTimeout(() => setCopiedId(null), 2000);
                                    }}
                                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all text-[9px] flex items-center gap-1 font-semibold border border-white/5 cursor-pointer"
                                  >
                                    {copiedId === photo.id * 10 + 3 ? (
                                      <>
                                        <Check size={10} className="text-green-400" />
                                        <span>HTML</span>
                                      </>
                                    ) : (
                                      <>
                                        <Cpu size={10} />
                                        <span>HTML</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/60 text-[8px] text-white/50 group-hover:hidden">
                                📷 {photo.photographer}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between pt-2">
                          <p className="text-[10px] text-white/30 font-medium">
                            {imageResults.totalResults.toLocaleString()} resultados · Página {imageResults.page}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={imagePage <= 1 || imagesFetching}
                              onClick={() => setImagePage(p => p - 1)}
                              className="border-white/10 text-white/60 hover:text-white gap-1 rounded-xl text-xs"
                            >
                              <ChevLeft size={13} /> Anterior
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={imagesFetching || imageResults.photos.length < 20}
                              onClick={() => setImagePage(p => p + 1)}
                              className="border-white/10 text-white/60 hover:text-white gap-1 rounded-xl text-xs"
                            >
                              Siguiente <ChevRight size={13} />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {imageSearch && !imagesFetching && imageResults?.photos.length === 0 && (
                      <p className="text-center text-white/20 py-12 text-xs font-semibold">Sin resultados para "{imageSearch}"</p>
                    )}

                    {!imageSearch && (
                      <div className="text-center py-12 space-y-2">
                        <ImageIcon size={32} className="mx-auto text-white/10" />
                        <p className="text-white/40 text-xs font-semibold">Escribe un término para buscar imágenes</p>
                        <p className="text-white/20 text-[10px] font-medium max-w-sm mx-auto leading-relaxed">
                          Sugerencias: "fuerza muscular" · "plataforma de fuerza" · "electromiografía" · "atleta laboratorio"
                        </p>
                      </div>
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

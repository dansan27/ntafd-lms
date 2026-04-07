import { useState, useMemo, Suspense } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Users, BarChart3, MessageSquare, Cloud, RefreshCw, ArrowLeft,
  CheckCircle2, Activity, Gamepad2, Lock, Unlock, Power, KeyRound, Eye, EyeOff,
  Monitor, ChevronLeft, ChevronRight, PanelLeftOpen, Presentation, Home
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { toast } from "sonner";
import { COURSE_CONFIG, getClassConfig } from "@/data/courseConfig";
import { getBlockComponent } from "@/components/blocks/blockRegistry";

function StatCard({ title, value, subtitle, icon: Icon, color }: { title: string; value: string | number; subtitle?: string; icon: any; color: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          <div className={`w-10 h-10 rounded-lg ${color} text-white flex items-center justify-center`}>
            <Icon size={20} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfessorLogin({ onLogin }: { onLogin: (password: string) => void }) {
  const [password, setPassword] = useState("profesor2026");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const loginMutation = trpc.professor.login.useMutation({
    onSuccess: () => { onLogin(password); },
    onError: (err) => {
      console.error("Login error:", err);
      setError("Error al acceder. Por favor intenta de nuevo.");
      setPassword("profesor2026");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-sm w-full">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <KeyRound size={28} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold">Panel del Profesor</h2>
            <p className="text-sm text-muted-foreground">Contraseña: <strong>profesor2026</strong></p>
          </div>
          <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); if (password.trim()) { setError(""); loginMutation.mutate({ password }); } }} className="space-y-4">
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} placeholder="Contraseña" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); setError(""); }} className="pr-10" autoFocus />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full" disabled={loginMutation.isPending || !password.trim()}>
              {loginMutation.isPending ? <RefreshCw size={14} className="animate-spin mr-2" /> : null}
              Ingresar
            </Button>
          </form>
          <div className="text-center">
            <Link href="/"><Button variant="ghost" size="sm" className="text-muted-foreground"><ArrowLeft size={14} className="mr-1" /> Volver al inicio</Button></Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ========== PRESENTATION VIEW ==========
function PresentationView({ weekId, classId, currentBlock, setCurrentBlock, onBackToDashboard }: {
  weekId: number; classId: number; currentBlock: number; setCurrentBlock: (b: number) => void; onBackToDashboard: () => void;
}) {
  const classConfig = getClassConfig(weekId, classId);
  const blocks = classConfig?.blocks ?? [];
  const totalBlocks = blocks.length;
  const currentBlockConfig = blocks.find(b => b.id === currentBlock);
  const BlockComponent = currentBlockConfig ? getBlockComponent(currentBlockConfig.componentName) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-sidebar/95 backdrop-blur text-white border-b border-white/10">
        <div className="flex items-center justify-between h-12 px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBackToDashboard} className="text-white/70 hover:text-white h-8 px-2">
              <PanelLeftOpen size={16} className="mr-1" /> Panel
            </Button>
            <div className="h-5 w-px bg-white/20" />
            <span className="text-sm font-medium">
              Bloque {currentBlock}: {currentBlockConfig?.title ?? ""}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <div className="hidden md:flex items-center gap-1 mr-2">
              {blocks.map(b => (
                <button
                  key={b.id}
                  onClick={() => setCurrentBlock(b.id)}
                  className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${
                    b.id === currentBlock
                      ? "bg-primary text-white shadow-lg"
                      : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {b.id}
                </button>
              ))}
            </div>

            <Button
              variant="ghost" size="sm"
              onClick={() => setCurrentBlock(Math.max(1, currentBlock - 1))}
              disabled={currentBlock <= 1}
              className="text-white/70 hover:text-white h-8 w-8 p-0"
            >
              <ChevronLeft size={18} />
            </Button>
            <span className="text-xs text-white/60 w-10 text-center">{currentBlock}/{totalBlocks}</span>
            <Button
              variant="ghost" size="sm"
              onClick={() => setCurrentBlock(Math.min(totalBlocks, currentBlock + 1))}
              disabled={currentBlock >= totalBlocks}
              className="text-white/70 hover:text-white h-8 w-8 p-0"
            >
              <ChevronRight size={18} />
            </Button>
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

// ========== MAIN EXPORT ==========
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

// ========== DASHBOARD CONTENT ==========
function DashboardContent({ password, autoRefresh, setAutoRefresh, selectedWeek, selectedClass, onSelectClass, onLogout, onPresentation }: {
  password: string; autoRefresh: boolean; setAutoRefresh: (v: boolean) => void;
  selectedWeek: number; selectedClass: number; onSelectClass: (w: number, c: number) => void;
  onLogout: () => void; onPresentation: (block: number) => void;
}) {
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

  // Build class selector options
  const classOptions = COURSE_CONFIG.flatMap(week =>
    week.classes.map(cls => ({
      key: `${week.id}-${cls.id}`,
      weekId: week.id,
      classId: cls.id,
      label: `S${week.id} - ${cls.title}`,
      available: cls.available && cls.blocks.length > 0,
    }))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-sidebar text-white border-b">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <BarChart3 size={20} />
            <h1 className="font-bold text-sm md:text-base">Panel del Profesor</h1>
            <div className="h-5 w-px bg-white/20" />
            <select
              value={`${selectedWeek}-${selectedClass}`}
              onChange={(e) => {
                const [w, c] = e.target.value.split("-").map(Number);
                onSelectClass(w, c);
              }}
              className="bg-white/10 text-white text-xs rounded-md px-2 py-1 border border-white/20 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {classOptions.map(opt => (
                <option key={opt.key} value={opt.key} className="text-black">
                  {opt.label} {!opt.available ? "(pendiente)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            {blocks.length > 0 && (
              <Button
                variant="ghost" size="sm"
                onClick={() => onPresentation(blocks[0]?.id ?? 1)}
                className="text-white/70 hover:text-white text-xs bg-primary/30 hover:bg-primary/50"
              >
                <Presentation size={14} className="mr-1" />
                <span className="hidden sm:inline">Presentar</span>
              </Button>
            )}
            <div className="h-5 w-px bg-white/20 hidden sm:block" />
            <Button
              variant="ghost" size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`text-white/70 hover:text-white text-xs ${autoRefresh ? "bg-green-600/30" : ""}`}
            >
              <RefreshCw size={14} className={`mr-1 ${autoRefresh ? "animate-spin" : ""}`} />
              {autoRefresh ? "Auto" : "Manual"}
            </Button>
            <Button variant="ghost" size="sm" onClick={refreshAll} className="text-white/70 hover:text-white">
              <RefreshCw size={14} />
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white text-xs">
                <Home size={14} className="mr-1" />
                <span className="hidden sm:inline">Inicio</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-white/70 hover:text-white text-xs">
              Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6 space-y-6">
        {/* QUICK PRESENTATION ACCESS */}
        {blocks.length > 0 && (
          <Card className="border-blue-500/30 bg-gradient-to-r from-blue-500/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Monitor size={18} className="text-blue-500" />
                <span className="font-semibold text-sm">Vista de Presentación — {classTitle}</span>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {blocks.map(b => (
                  <button
                    key={b.id}
                    onClick={() => onPresentation(b.id)}
                    className="p-2 rounded-lg border border-border hover:border-blue-500 hover:bg-blue-500/10 transition-all text-center group"
                  >
                    <span className="text-sm block font-medium text-muted-foreground group-hover:text-blue-500">B{b.id}</span>
                    <span className="text-[10px] text-muted-foreground group-hover:text-blue-500 truncate block">
                      {b.title}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CONTROL DE DINÁMICAS */}
        {dynamics.length > 0 && (
          <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Gamepad2 size={18} className="text-primary" />
                Control de Dinámicas en Tiempo Real
                <Badge variant="outline" className="ml-2 text-[10px]">
                  <Power size={10} className="mr-1" /> LIVE
                </Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Activa o desactiva cada dinámica. Los alumnos solo pueden responder cuando está activa.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${dynamics.length <= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-3`}>
                {dynamics.map(dyn => {
                  const active = isDynamicActive(dyn.id);
                  const dynStats = stats?.dynamicStats?.find((ds: any) => ds.dynamicId === dyn.id);
                  const blockConfig = blocks.find(b => b.id === dyn.blockId);
                  return (
                    <div key={dyn.id} className={`p-4 rounded-lg border-2 transition-all ${active ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/10" : "border-muted bg-muted/30"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg">{dyn.icon}</span>
                        <Switch
                          checked={active}
                          onCheckedChange={(checked: boolean) => {
                            toggleDynamic.mutate({ password, weekId: selectedWeek, classId: selectedClass, dynamicId: dyn.id, isActive: checked });
                          }}
                          disabled={toggleDynamic.isPending}
                        />
                      </div>
                      <p className="font-semibold text-sm">{dyn.name}</p>
                      <p className="text-[10px] text-muted-foreground">{blockConfig ? `Bloque ${blockConfig.id}: ${blockConfig.title}` : `Bloque ${dyn.blockId}`}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {active ? (
                          <Badge className="bg-green-600 text-white text-[10px]"><Unlock size={10} className="mr-1" /> Activa</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground"><Lock size={10} className="mr-1" /> Bloqueada</Badge>
                        )}
                        <span className="text-[10px] text-muted-foreground">{dynStats?.totalResponses ?? 0} resp.</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Alumnos conectados" value={stats?.totalStudents ?? 0} icon={Users} color="bg-blue-600" />
          <StatCard title="Completaron todo" value={stats?.completedAll ?? 0} subtitle={`de ${stats?.totalStudents ?? 0}`} icon={CheckCircle2} color="bg-green-600" />
          <StatCard title="Reflexiones" value={stats?.totalReflections ?? 0} icon={MessageSquare} color="bg-purple-600" />
          <StatCard title="Sentimiento" value={`${stats?.sentimentCounts?.positivo ?? 0}+ / ${stats?.sentimentCounts?.neutro ?? 0}= / ${stats?.sentimentCounts?.negativo ?? 0}-`} icon={Activity} color="bg-amber-500" />
        </div>

        {/* Dynamic Stats */}
        {stats?.dynamicStats && stats.dynamicStats.length > 0 && (
          <div className={`grid grid-cols-2 ${stats.dynamicStats.length <= 4 ? "md:grid-cols-4" : "md:grid-cols-3"} gap-4`}>
            {stats.dynamicStats.map((ds: any) => {
              const dynConfig = dynamics.find(d => d.id === ds.dynamicId);
              return (
                <Card key={ds.dynamicId}>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{dynConfig?.name ?? `Dinámica ${ds.dynamicId}`}</p>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xl font-bold">{ds.totalResponses}</p>
                        <p className="text-[10px] text-muted-foreground">respuestas</p>
                      </div>
                      <Badge variant="outline" className="text-xs">Prom: {ds.avgScore}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="students">Alumnos</TabsTrigger>
            <TabsTrigger value="reflections">Reflexiones</TabsTrigger>
            <TabsTrigger value="wordcloud">Nube de Palabras</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Users size={18} /> Tabla de Alumnos y Respuestas</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="w-full">
                  <div className="min-w-[700px]">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-3 font-medium">Alumno</th>
                          <th className="text-left p-3 font-medium">Código</th>
                          {dynamics.map(d => (
                            <th key={d.id} className="text-center p-3 font-medium">{d.icon} D{d.id}</th>
                          ))}
                          <th className="text-center p-3 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentTableData.map((s: any) => (
                          <tr key={s.id} className="border-b hover:bg-muted/30">
                            <td className="p-3 font-medium">{s.fullName}</td>
                            <td className="p-3 text-muted-foreground">{s.studentCode}</td>
                            {dynamics.map(d => {
                              const resp = s.dynamicScores[d.id];
                              return (
                                <td key={d.id} className="p-3 text-center">
                                  {resp ? (
                                    <Badge className={`text-xs ${resp.score === resp.maxScore ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{resp.score}/{resp.maxScore}</Badge>
                                  ) : (
                                    <span className="text-muted-foreground/40">—</span>
                                  )}
                                </td>
                              );
                            })}
                            <td className="p-3 text-center">
                              <Badge variant={s.completedCount === dynamics.length ? "default" : "outline"} className={s.completedCount === dynamics.length ? "bg-green-600" : ""}>{s.completedCount}/{dynamics.length}</Badge>
                            </td>
                          </tr>
                        ))}
                        {studentTableData.length === 0 && (
                          <tr><td colSpan={2 + dynamics.length + 1} className="p-8 text-center text-muted-foreground">Aún no hay alumnos conectados</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reflections">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><MessageSquare size={18} /> Reflexiones de los Alumnos</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {reflections && reflections.length > 0 ? (
                  reflections.map((r: any, i: number) => {
                    const student = (students as any[])?.find((s: any) => s.id === r.studentId);
                    return (
                      <div key={i} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{student?.fullName ?? "Alumno"}</span>
                          {r.sentiment && (
                            <Badge className={`text-xs ${r.sentiment === "positivo" ? "bg-green-100 text-green-800" : r.sentiment === "negativo" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>{r.sentiment}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{r.reflectionText}</p>
                        {r.keywords && (r.keywords as string[]).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(r.keywords as string[]).map((kw: string, j: number) => (
                              <Badge key={j} variant="outline" className="text-[10px]">{kw}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-muted-foreground py-8">Aún no hay reflexiones</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wordcloud">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Cloud size={18} /> Nube de Palabras — Conceptos Clave</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {wordCloud && wordCloud.length > 0 ? (
                  <div className="flex flex-wrap gap-2 justify-center items-center min-h-[200px]">
                    {wordCloud.map((item: { word: string; count: number }, i: number) => {
                      const maxCount = wordCloud[0]?.count ?? 1;
                      const scale = 0.7 + (item.count / maxCount) * 1.3;
                      const opacity = 0.5 + (item.count / maxCount) * 0.5;
                      const colors = ["text-primary", "text-blue-600", "text-purple-600", "text-green-600", "text-amber-600", "text-cyan-600"];
                      return (
                        <motion.span key={item.word} initial={{ opacity: 0, scale: 0 }} animate={{ opacity, scale }} transition={{ delay: i * 0.05 }} className={`font-bold ${colors[i % colors.length]} cursor-default`} style={{ fontSize: `${scale}rem` }} title={`${item.word}: ${item.count} menciones`}>
                          {item.word}
                        </motion.span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">La nube de palabras se generará cuando los alumnos envíen sus reflexiones</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

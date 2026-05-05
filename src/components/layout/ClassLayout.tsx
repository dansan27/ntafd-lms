import { useState, useMemo, Suspense, useEffect, useRef } from "react";
import { useStudent } from "@/contexts/StudentContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft, ChevronRight, Menu, X, LogOut, Gamepad2, Loader2, Home,
  Flame, Trophy,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { getClassConfig, COURSE_CONFIG } from "@/data/courseConfig";
import { getBlockComponent } from "@/components/blocks/blockRegistry";
import ChatBot from "@/components/ChatBot";
import NotesPanel from "@/components/NotesPanel";
import { ACHIEVEMENTS } from "@/data/achievements";

export default function ClassLayout({ weekId = 1, classId = 1 }: { weekId?: number; classId?: number }) {
  const { student, token, logout } = useStudent();
  const [currentBlock, setCurrentBlock] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const awardedRef = useRef<Set<string>>(new Set());

  const classConfig = getClassConfig(weekId, classId);
  const blocks = classConfig?.blocks ?? [];
  const dynamics = classConfig?.dynamics ?? [];
  const totalBlocks = blocks.length;

  const weekConfig = COURSE_CONFIG.find(w => w.id === weekId);
  const weekTitle = weekConfig?.title ?? `Semana ${weekId}`;

  const { data: progressInfo } = trpc.student.getProgress.useQuery(
    { token: token ?? "", weekId, classId },
    { enabled: !!token }
  );

  const updateBlockMutation = trpc.student.updateBlock.useMutation();

  const { data: myResponses } = trpc.dynamics.myResponses.useQuery(
    { token: token ?? "", weekId, classId },
    { enabled: !!token }
  );

  const { data: myAchievements, refetch: refetchAchievements } = trpc.achievements.mine.useQuery(
    { token: token ?? "" },
    { enabled: !!token }
  );

  const { data: statsData } = trpc.stats.mine.useQuery(
    { token: token ?? "" },
    { enabled: !!token }
  );

  const awardMutation = trpc.achievements.award.useMutation({
    onSuccess: (data, vars) => {
      if (data.isNew) {
        const def = ACHIEVEMENTS.find(a => a.id === vars.achievementId);
        if (def) {
          toast.success(`¡Logro desbloqueado! ${def.icon} ${def.name}`, {
            description: def.description,
            duration: 4000,
          });
          refetchAchievements();
        }
      }
    },
  });

  const completedDynamics = useMemo(() => {
    if (!myResponses) return new Set<number>();
    return new Set(myResponses.map(r => r.dynamicId));
  }, [myResponses]);

  const earnedIds = useMemo(() => new Set((myAchievements ?? []).map(a => a.achievementId)), [myAchievements]);

  // Check and award achievements when responses change
  useEffect(() => {
    if (!token || !myResponses) return;
    const totalDynamics = statsData?.totalDynamicsCompleted ?? myResponses.length;

    const tryAward = (id: string, name: string) => {
      if (!earnedIds.has(id) && !awardedRef.current.has(id)) {
        awardedRef.current.add(id);
        awardMutation.mutate({ token, achievementId: id, achievementName: name });
      }
    };

    if (myResponses.length > 0) tryAward("primera_dinamica", "Primer Paso");
    if (myResponses.length >= dynamics.length && dynamics.length > 0) tryAward("clase_completa", "Clase Completa");
    if (myResponses.some(r => r.score > 0 && r.score === r.maxScore)) tryAward("perfecto", "Perfección");
    if (myResponses.some(r => (r.timeSpentMs ?? 999999) < 45000 && r.score > 0)) tryAward("rapido", "Relámpago");
    if (totalDynamics >= 10) tryAward("maratonista", "Maratonista");
  }, [myResponses, statsData, earnedIds, token, dynamics.length]);

  const streak = statsData?.classesAttempted ?? 0;

  const goToBlock = (block: number) => {
    setCurrentBlock(block);
    if (token) updateBlockMutation.mutate({ token, weekId, classId, block });
    setSidebarOpen(false);
  };

  useMemo(() => {
    if (progressInfo && progressInfo.currentBlock && currentBlock === 1) {
      setCurrentBlock(progressInfo.currentBlock);
    }
  }, [progressInfo]);

  const progress = totalBlocks > 0 ? (currentBlock / totalBlocks) * 100 : 0;
  const currentBlockConfig = blocks.find(b => b.id === currentBlock);
  const BlockComponent = currentBlockConfig ? getBlockComponent(currentBlockConfig.componentName) : null;
  const classTitle = classConfig?.title ?? `Semana ${weekId} Clase ${classId}`;
  const classSubtitle = classConfig?.description ?? "";

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-sidebar text-sidebar-foreground z-50 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} flex flex-col`}>
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-white/90">NTAFD - {classTitle}</h2>
              <p className="text-xs text-white/50 mt-0.5">{classSubtitle}</p>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden text-white/70" onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </Button>
          </div>
        </div>

        {/* Student info */}
        <div className="px-4 py-3 border-b border-sidebar-border space-y-2">
          <div>
            <p className="text-xs text-white/40">Alumno</p>
            <p className="text-sm font-medium text-white/90 truncate">{student?.fullName}</p>
            <p className="text-xs text-white/50">{student?.studentCode}</p>
          </div>
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 rounded-lg px-2 py-1">
                <Flame size={12} className="text-orange-400" />
                <span className="text-xs font-semibold text-orange-300">{streak}</span>
                <span className="text-[10px] text-orange-400/70">clases</span>
              </div>
            )}
            {(myAchievements?.length ?? 0) > 0 && (
              <Link href="/mi-progreso">
                <div className="flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-2 py-1 cursor-pointer hover:bg-yellow-500/30 transition-colors">
                  <Trophy size={12} className="text-yellow-400" />
                  <span className="text-xs font-semibold text-yellow-300">{myAchievements!.length}</span>
                  <span className="text-[10px] text-yellow-400/70">logros</span>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-white/50">Progreso</span>
            <span className="text-xs font-medium text-white/70">{currentBlock}/{totalBlocks}</span>
          </div>
          <Progress value={progress} className="h-1.5" />
          {dynamics.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {dynamics.map(d => (
                <Badge
                  key={d.id}
                  variant={completedDynamics.has(d.id) ? "default" : "outline"}
                  className={`text-[10px] px-1.5 py-0 ${completedDynamics.has(d.id) ? "bg-green-600 text-white border-green-600" : "text-white/40 border-white/20"}`}
                >
                  D{d.id} {completedDynamics.has(d.id) ? "✓" : ""}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2">
          <nav className="space-y-0.5 px-2">
            {blocks.map((block) => {
              const Icon = block.icon;
              const isActive = currentBlock === block.id;
              return (
                <button
                  key={block.id}
                  onClick={() => goToBlock(block.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                    isActive
                      ? "bg-sidebar-accent text-white"
                      : "text-white/60 hover:text-white/90 hover:bg-sidebar-accent/50"
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                    isActive ? "bg-primary text-primary-foreground" : "bg-white/10 text-white/50"
                  }`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${isActive ? "text-white" : ""}`}>{block.title}</p>
                    <p className="text-[10px] text-white/40 truncate">{block.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {block.hasDynamic && <Gamepad2 size={10} className="text-white/30" />}
                    <span className="text-[10px] text-white/30">{block.time}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          <Link href="/mi-progreso">
            <Button variant="ghost" className="w-full justify-start text-white/50 hover:text-white hover:bg-sidebar-accent/50 text-sm">
              <Trophy size={16} className="mr-2" />
              Mi Progreso
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-white/50 hover:text-white hover:bg-sidebar-accent/50 text-sm">
              <Home size={16} className="mr-2" />
              Menú Principal
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-white/50 hover:text-white hover:bg-sidebar-accent/50 text-sm"
            onClick={() => { logout(); toast.info("Sesión cerrada"); }}
          >
            <LogOut size={16} className="mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu size={20} />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium">
                  Bloque {currentBlock}: {currentBlockConfig?.title ?? ""}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline" size="sm"
                onClick={() => goToBlock(Math.max(1, currentBlock - 1))}
                disabled={currentBlock <= 1}
                className="h-8"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline ml-1">Anterior</span>
              </Button>
              <Button
                variant="default" size="sm"
                onClick={() => goToBlock(Math.min(totalBlocks, currentBlock + 1))}
                disabled={currentBlock >= totalBlocks}
                className="h-8 bg-primary hover:bg-primary/90"
              >
                <span className="hidden sm:inline mr-1">Siguiente</span>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          }>
            {BlockComponent ? <BlockComponent /> : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Bloque no encontrado
              </div>
            )}
          </Suspense>
          {token && <NotesPanel weekId={weekId} classId={classId} blockId={currentBlock} />}
        </div>
      </main>

      {token && (
        <ChatBot
          weekId={weekId}
          classId={classId}
          blockId={currentBlock}
          blockTitle={currentBlockConfig?.title ?? ""}
          weekTitle={weekTitle}
        />
      )}
    </div>
  );
}

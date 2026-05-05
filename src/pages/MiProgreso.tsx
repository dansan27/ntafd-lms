import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Trophy, Zap, Clock, BookOpen, StickyNote, Star, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { useStudent } from "@/contexts/StudentContext";
import { ACHIEVEMENTS } from "@/data/achievements";

function formatTime(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: any; label: string; value: string | number; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-4 bg-gradient-to-br ${color} border border-white/10`}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <Icon size={16} className="text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-white/60 mt-0.5">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function MiProgreso() {
  const { student, token } = useStudent();

  const statsQuery = trpc.stats.mine.useQuery(
    { token: token ?? "" },
    { enabled: !!token }
  );

  const achievementsQuery = trpc.achievements.mine.useQuery(
    { token: token ?? "" },
    { enabled: !!token }
  );

  const notesQuery = trpc.notes.allMine.useQuery(
    { token: token ?? "" },
    { enabled: !!token }
  );

  const stats = statsQuery.data;
  const achievements = achievementsQuery.data ?? [];
  const notes = notesQuery.data ?? [];
  const earnedIds = new Set(achievements.map(a => a.achievementId));

  const scorePercent = stats && stats.totalMax > 0
    ? Math.round((stats.totalScore / stats.totalMax) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Mi Progreso</h1>
            <p className="text-sm text-muted-foreground">{student?.fullName} · {student?.studentCode}</p>
          </div>
        </div>

        {statsQuery.isLoading ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            Cargando datos...
          </div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <StatCard
                icon={Star}
                label="Puntuación total"
                value={`${stats?.totalScore ?? 0} pts`}
                color="from-yellow-500/80 to-orange-500/80"
              />
              <StatCard
                icon={Target}
                label="Precisión"
                value={`${scorePercent}%`}
                color="from-green-500/80 to-emerald-500/80"
              />
              <StatCard
                icon={Zap}
                label="Actividades completadas"
                value={stats?.totalDynamicsCompleted ?? 0}
                color="from-blue-500/80 to-indigo-500/80"
              />
              <StatCard
                icon={Clock}
                label="Tiempo invertido"
                value={formatTime(stats?.totalTimeMs ?? 0)}
                color="from-purple-500/80 to-pink-500/80"
              />
              <StatCard
                icon={BookOpen}
                label="Clases iniciadas"
                value={stats?.classesAttempted ?? 0}
                color="from-cyan-500/80 to-blue-500/80"
              />
              <StatCard
                icon={StickyNote}
                label="Bloques con notas"
                value={stats?.notesCount ?? 0}
                color="from-teal-500/80 to-green-500/80"
              />
            </div>

            {/* Achievements */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy size={18} className="text-yellow-500" />
                Logros
                <Badge variant="secondary">{achievements.length}/{ACHIEVEMENTS.length}</Badge>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ACHIEVEMENTS.map((def, i) => {
                  const earned = earnedIds.has(def.id);
                  const earnedData = achievements.find(a => a.achievementId === def.id);
                  return (
                    <motion.div
                      key={def.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className={`rounded-2xl p-3 border text-center transition-all ${
                        earned
                          ? `bg-gradient-to-br ${def.color} border-transparent`
                          : "border-border bg-muted/30 opacity-40 grayscale"
                      }`}
                    >
                      <div className="text-2xl mb-1.5">{def.icon}</div>
                      <p className={`text-xs font-semibold leading-tight ${earned ? "text-white" : "text-foreground"}`}>
                        {def.name}
                      </p>
                      <p className={`text-[10px] mt-0.5 leading-tight ${earned ? "text-white/70" : "text-muted-foreground"}`}>
                        {def.description}
                      </p>
                      {earned && earnedData && (
                        <p className="text-[9px] text-white/50 mt-1">
                          {new Date(earnedData.earnedAt).toLocaleDateString("es", { day: "numeric", month: "short" })}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            {notes.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <StickyNote size={18} className="text-teal-500" />
                  Mis Notas
                  <Badge variant="secondary">{notes.length}</Badge>
                </h2>
                <ScrollArea className="h-64">
                  <div className="space-y-3 pr-2">
                    {notes.map((note, i) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-xl border border-border bg-card p-3"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge variant="outline" className="text-[10px]">
                            S{note.weekId} · Clase {note.classId} · Bloque {note.blockId}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground ml-auto">
                            {new Date(note.updatedAt).toLocaleDateString("es", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{note.noteText}</p>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

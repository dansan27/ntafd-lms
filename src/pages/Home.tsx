import { useStudent } from "@/contexts/StudentContext";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, LogOut, TrendingUp, Zap, Clock, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COURSE_CONFIG, isClassAvailable } from "@/data/courseConfig";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AnimatedCard } from "@/components/ui/animated-card";
import { ClassCard } from "@/components/ui/class-card";

export default function Home() {
  const { student, loading, logout } = useStudent();
  const [stats, setStats] = useState({ totalDynamics: 0, totalClasses: 0, completionPercent: 0, recentClass: null as any });

  useEffect(() => {
    if (!student?.sessionToken) return;

    const fetchStats = async () => {
      try {
        let totalDynamicsCompleted = 0;
        let classesAccessed = 0;
        const allProgressData = [];

        for (const week of COURSE_CONFIG) {
          for (const cls of week.classes) {
            if (isClassAvailable(week.id, cls.id)) {
              const res = await fetch("/api/trpc/student.getProgress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  json: { token: student.sessionToken!, weekId: week.id, classId: cls.id }
                }),
              });
              const data = await res.json();
              const progress = data.result?.data;

              if (progress) {
                const completed = (progress.completedDynamics as number[] | null) ?? [];
                if (completed.length > 0) {
                  classesAccessed++;
                  totalDynamicsCompleted += completed.length;
                  allProgressData.push({
                    week: week.id,
                    class: cls.id,
                    classTitle: cls.title,
                    completed: completed.length,
                    total: cls.dynamics.length,
                    updatedAt: progress.updatedAt,
                  });
                }
              }
            }
          }
        }

        const totalDynamicsInCourse = COURSE_CONFIG.reduce((acc, w) =>
          acc + w.classes.filter(c => isClassAvailable(w.id, c.id)).reduce((sum, c) => sum + c.dynamics.length, 0), 0
        );

        const mostRecent = allProgressData.length > 0
          ? allProgressData.sort((a, b) => (b.updatedAt as any) - (a.updatedAt as any))[0]
          : null;

        setStats({
          totalDynamics: totalDynamicsCompleted,
          totalClasses: classesAccessed,
          completionPercent: totalDynamicsInCourse > 0 ? Math.round((totalDynamicsCompleted / totalDynamicsInCourse) * 100) : 0,
          recentClass: mostRecent,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, [student?.sessionToken]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full" />
    </div>
  );

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/40 to-slate-800/20 backdrop-blur-xl p-8 shadow-2xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-white text-center mb-2">Bienvenido</h1>
            <p className="text-center text-white/60 mb-8">Inicia sesión con tu código de alumno para continuar tu aprendizaje.</p>
            <Link href="/login">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 h-12 text-base">
                Ingresar
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const level = stats.completionPercent < 25 ? "Novato" : stats.completionPercent < 50 ? "Aprendiz" : stats.completionPercent < 75 ? "Experto" : "Maestro";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="font-bold text-white">Nuevas Tecnologías</h1>
              <p className="text-xs text-white/60">Hola, {student.fullName.split(' ')[0]}</p>
            </div>
          </motion.div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 mt-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Bienvenido de vuelta, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">{student.fullName.split(' ')[0]}</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl">
            Continúa tu viaje de aprendizaje en nuevas tecnologías aplicadas al deporte. ¡Sigue progresando!
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={Zap}
            label="Dinámicas Completadas"
            value={stats.totalDynamics}
            description="actividades interactivas"
            color="blue"
            delay={0.1}
          />
          <StatCard
            icon={Target}
            label="Clases Iniciadas"
            value={stats.totalClasses}
            description="en progreso"
            color="green"
            delay={0.15}
          />
          <StatCard
            icon={TrendingUp}
            label="Progreso Total"
            value={`${stats.completionPercent}%`}
            description="del curso completado"
            color="purple"
            delay={0.2}
          />
          <StatCard
            icon={Sparkles}
            label="Tu Nivel"
            value={level}
            description="en el curso"
            color="orange"
            delay={0.25}
          />
        </div>

        {/* Progress Section */}
        <AnimatedCard className="mb-12 p-8" delay={0.3}>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Progreso del Curso</h3>
          </div>
          <ProgressBar
            percentage={stats.completionPercent}
            showPercentage={true}
            animated={true}
          />
          <p className="text-sm text-white/60 mt-4">
            Has completado <span className="text-blue-400 font-semibold">{stats.totalDynamics}</span> dinámicas de las disponibles
          </p>
        </AnimatedCard>

        {/* Recent Activity */}
        {stats.recentClass && (
          <AnimatedCard className="mb-12 p-8" delay={0.35}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Actividad Reciente</h3>
                <p className="text-white/80 font-medium mb-1">{stats.recentClass.classTitle}</p>
                <p className="text-sm text-white/60">
                  Completaste {stats.recentClass.completed} de {stats.recentClass.total} dinámicas
                </p>
              </div>
              <Link href={`/week/${stats.recentClass.week}/class/${stats.recentClass.class}`}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0">
                    Continuar →
                  </Button>
                </motion.div>
              </Link>
            </div>
          </AnimatedCard>
        )}

        {/* Course Structure */}
        <div className="mb-10">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white mb-8"
          >
            Tu Ruta de Aprendizaje
          </motion.h2>
          <div className="space-y-8">
            {COURSE_CONFIG.map((week, weekIdx) => (
              <motion.div
                key={week.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + weekIdx * 0.1 }}
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{week.title}</h3>
                  <p className="text-white/60">{week.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {week.classes.map((cls, classIdx) => {
                    const available = isClassAvailable(week.id, cls.id);
                    return (
                      <ClassCard
                        key={cls.id}
                        weekId={week.id}
                        classId={cls.id}
                        title={cls.title}
                        description={cls.description}
                        available={available}
                        delay={0.5 + weekIdx * 0.1 + classIdx * 0.05}
                      />
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

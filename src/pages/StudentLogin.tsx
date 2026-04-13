import { useState } from "react";
import { useStudent } from "@/contexts/StudentContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { GlassInput } from "@/components/ui/glass-input";
import { Loader2, User, Code, Zap, Cpu, Activity, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function StudentLogin() {
  const { login } = useStudent();
  const [, setLocation] = useLocation();
  const [fullName, setFullName] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({ fullName: "", studentCode: "" });

  const validateForm = () => {
    const newErrors = { fullName: "", studentCode: "" };
    if (!fullName.trim()) newErrors.fullName = "El nombre es requerido";
    if (!studentCode.trim()) newErrors.studentCode = "El código de alumno es requerido";
    setErrors(newErrors);
    return !newErrors.fullName && !newErrors.studentCode;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await login(fullName.trim(), studentCode.trim());
      toast.success("¡Ingreso exitoso! Bienvenido al curso");
      setLocation("/");
    } catch (err: any) {
      toast.error(err?.message || "Error al iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Floating icons */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-[15%] left-[10%] text-white/10"
      >
        <Cpu size={48} />
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        className="absolute top-[25%] right-[15%] text-white/10"
      >
        <Zap size={36} />
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        className="absolute bottom-[20%] left-[20%] text-white/10"
      >
        <Activity size={42} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <img src="/logo-upc.png" alt="UPC" className="h-10 mx-auto mb-6 opacity-90" />
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/10 backdrop-blur-sm"
          >
            <GraduationCap size={16} />
            Portal del Estudiante
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Nuevas Tecnologías
          </h1>
          <p className="text-lg text-white/70">Cursos Interactivos</p>
          <p className="text-sm text-white/40 mt-2">LMS Integrado - NTAFD · UPC</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/40 to-slate-800/20 backdrop-blur-xl shadow-2xl p-8 space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Bienvenido</h2>
            <p className="text-white/60">Ingresa para continuar tu aprendizaje</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <GlassInput
              label="Nombre Completo"
              icon={User}
              placeholder="Ej: Juan Pérez García"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors({ ...errors, fullName: "" });
              }}
              error={errors.fullName}
              disabled={submitting}
              required
            />

            <GlassInput
              label="Código de Alumno UPC"
              icon={Code}
              placeholder="Ej: U202112345"
              value={studentCode}
              onChange={(e) => {
                setStudentCode(e.target.value);
                if (errors.studentCode) setErrors({ ...errors, studentCode: "" });
              }}
              error={errors.studentCode}
              disabled={submitting}
              required
            />

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold h-12 text-base border-0"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  "Ingresar a la clase"
                )}
              </Button>
            </motion.div>
          </form>

          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-white/40 text-center">
              Plataforma educativa interactiva - NTAFD 2026
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

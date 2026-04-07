import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  helperText?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, icon: Icon, error, helperText, className = "", ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full space-y-2"
      >
        {label && (
          <label className="block text-sm font-medium text-white/90">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative group">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm pointer-events-none" />
          <div className="relative flex items-center">
            {Icon && (
              <Icon className="absolute left-3 w-5 h-5 text-white/40 pointer-events-none group-focus-within:text-white/60 transition-colors" />
            )}
            <input
              ref={ref}
              className={`w-full px-4 ${Icon ? "pl-10" : ""} py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm ${error ? "border-red-500/50" : ""} ${className}`}
              {...props}
            />
          </div>
        </div>
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400">
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p className="text-xs text-white/40">{helperText}</p>
        )}
      </motion.div>
    );
  }
);

GlassInput.displayName = "GlassInput";

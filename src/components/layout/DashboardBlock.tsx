import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MetricCard {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  color?: string;            // e.g. "from-blue-500/20 to-blue-600/10 border-blue-500/30"
  textColor?: string;        // e.g. "text-blue-400"
  description?: string;
  alert?: string;            // warning text shown below
}

export interface DashboardSection {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  metrics?: MetricCard[];
  content?: React.ReactNode;
  columns?: 2 | 3 | 4;
  table?: {
    headers: string[];
    rows: (string | React.ReactNode)[][];
    highlight?: number;      // column index to highlight
  };
  tabs?: {
    label: string;
    content: React.ReactNode;
  }[];
  callout?: {
    type: "info" | "warning" | "tip" | "clinical";
    text: string | React.ReactNode;
  };
}

interface Props {
  title: string;
  subtitle?: string;
  accentColor?: string;       // primary accent for the block (e.g. "from-orange-500 to-red-500")
  headerIcon?: React.ReactNode;
  sections: DashboardSection[];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Metric({ m, i }: { m: MetricCard; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.07, type: "spring", stiffness: 100 }}
      className={`relative rounded-2xl border p-5 bg-gradient-to-br ${m.color ?? "from-white/5 to-white/3 border-white/10"} overflow-hidden`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <p className="text-[11px] text-white/40 uppercase tracking-widest font-medium">{m.label}</p>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-3xl font-bold ${m.textColor ?? "text-white"}`}>{m.value}</span>
            {m.unit && <span className="text-sm text-white/30">{m.unit}</span>}
          </div>
          {m.description && <p className="text-xs text-white/40 leading-snug">{m.description}</p>}
          {m.alert && (
            <p className="text-[11px] text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded-md mt-1 inline-block">
              ⚠ {m.alert}
            </p>
          )}
        </div>
        {m.icon && (
          <div className={`shrink-0 w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center ${m.textColor ?? "text-white/60"}`}>
            {m.icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CalloutBox({ callout }: { callout: NonNullable<DashboardSection["callout"]> }) {
  const styles = {
    info:     { bg: "bg-blue-500/10 border-blue-500/25",   text: "text-blue-300",   prefix: "ℹ" },
    warning:  { bg: "bg-amber-500/10 border-amber-500/25", text: "text-amber-300",  prefix: "⚠" },
    tip:      { bg: "bg-green-500/10 border-green-500/25", text: "text-green-300",  prefix: "💡" },
    clinical: { bg: "bg-red-500/10 border-red-500/25",     text: "text-red-300",    prefix: "🏥" },
  };
  const st = styles[callout.type];
  return (
    <div className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${st.bg}`}>
      <span className="text-sm mt-0.5">{st.prefix}</span>
      <p className={`text-sm leading-relaxed ${st.text}`}>{callout.text}</p>
    </div>
  );
}

function DataTable({ table }: { table: NonNullable<DashboardSection["table"]> }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/3">
            {table.headers.map((h, i) => (
              <th key={i} className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-widest ${
                i === table.highlight ? "text-blue-400" : "text-white/40"
              }`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className="border-b border-white/6 hover:bg-white/3 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className={`px-4 py-3 ${
                  ci === table.highlight ? "text-blue-400 font-semibold" : "text-white/70"
                } ${ci === 0 ? "font-medium text-white" : ""}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TabbedSection({ tabs }: { tabs: NonNullable<DashboardSection["tabs"]> }) {
  const [active, setActive] = useState(0);
  return (
    <div className="space-y-4">
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
        {tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              active === i ? "bg-white text-[#030712]" : "text-white/50 hover:text-white/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {tabs[active].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function DashboardBlock({ title, subtitle, accentColor, headerIcon, sections }: Props) {
  const colClass: Record<number, string> = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[600px] h-[300px] rounded-full bg-blue-600/4 blur-[130px]" />
      </div>

      {/* Block header */}
      <div className="relative max-w-5xl mx-auto px-6 pt-14 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80 }}
          className="space-y-3"
        >
          {headerIcon && (
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${accentColor ?? "from-blue-500/30 to-cyan-500/20"} mb-2`}>
              {headerIcon}
            </div>
          )}
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="text-white/50 text-lg max-w-2xl leading-relaxed">{subtitle}</p>}
        </motion.div>

        {/* Divider line with gradient */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className={`h-px mt-8 bg-gradient-to-r ${accentColor ?? "from-blue-500/50 to-cyan-500/20"} to-transparent origin-left`}
        />
      </div>

      {/* Sections */}
      <div className="relative max-w-5xl mx-auto px-6 pb-16 space-y-14">
        {sections.map((section) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.1, type: "spring", stiffness: 80 }}
            className="space-y-6"
          >
            {/* Section header */}
            <div className="flex items-center gap-3">
              {section.icon && (
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${accentColor ?? "from-blue-500/30 to-cyan-500/20"} flex items-center justify-center shrink-0`}>
                  {section.icon}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                {section.subtitle && <p className="text-sm text-white/40">{section.subtitle}</p>}
              </div>
              <div className="flex-1 h-px bg-white/6 ml-4" />
            </div>

            {/* Metrics grid */}
            {section.metrics && section.metrics.length > 0 && (
              <div className={`grid gap-4 ${colClass[section.columns ?? (section.metrics.length <= 2 ? 2 : section.metrics.length === 3 ? 3 : 4)]}`}>
                {section.metrics.map((m, mi) => (
                  <Metric key={mi} m={m} i={mi} />
                ))}
              </div>
            )}

            {/* Callout */}
            {section.callout && <CalloutBox callout={section.callout} />}

            {/* Table */}
            {section.table && <DataTable table={section.table} />}

            {/* Tabs */}
            {section.tabs && <TabbedSection tabs={section.tabs} />}

            {/* Free content */}
            {section.content && (
              <div className="text-white/60 leading-relaxed">
                {section.content}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

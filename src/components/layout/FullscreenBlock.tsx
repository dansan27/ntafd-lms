import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FullscreenSection {
  id: string;
  bg?: string;               // Tailwind gradient class, e.g. "from-[#0a0f1e] to-[#0d1526]"
  badge?: string;
  badgeColor?: string;       // e.g. "bg-blue-500/20 text-blue-300 border-blue-500/30"
  eyebrow?: string;          // small text above title
  title: string | React.ReactNode;
  titleGradient?: string;    // e.g. "from-blue-400 to-cyan-300"
  subtitle?: string | React.ReactNode;
  body?: string | React.ReactNode;
  visual?: React.ReactNode;  // right-side visual (chart, image, widget)
  accentColor?: string;      // e.g. "text-blue-400"
  fullVisual?: boolean;      // visual fills entire background
  centered?: boolean;        // center all content instead of left-align
}

interface Props {
  sections: FullscreenSection[];
}

// ─── Single section ───────────────────────────────────────────────────────────

function Section({ s, index, total }: { s: FullscreenSection; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const isLast = index === total - 1;
  const bg = s.bg ?? "from-[#030712] to-[#0a0f1e]";

  return (
    <div
      ref={ref}
      className={`relative min-h-screen flex items-center bg-gradient-to-br ${bg} overflow-hidden`}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-cyan-600/5 blur-[100px]" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className={`relative z-10 w-full max-w-6xl mx-auto px-6 py-20 ${
          s.visual
            ? "grid lg:grid-cols-2 gap-12 items-center"
            : s.centered
              ? "flex flex-col items-center text-center max-w-3xl mx-auto"
              : "flex flex-col max-w-3xl"
        }`}
      >
        {/* Text side */}
        <div className="space-y-6">
          {s.badge && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border ${s.badgeColor ?? "bg-white/8 text-white/60 border-white/15"}`}>
                {s.badge}
              </span>
            </motion.div>
          )}

          {s.eyebrow && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`text-sm font-medium uppercase tracking-widest ${s.accentColor ?? "text-blue-400"}`}
            >
              {s.eyebrow}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
          >
            {typeof s.title === "string" ? (
              <h2 className={`text-4xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight`}>
                {s.titleGradient ? (
                  <span className={`bg-clip-text text-transparent bg-gradient-to-r ${s.titleGradient}`}>
                    {s.title}
                  </span>
                ) : s.title}
              </h2>
            ) : s.title}
          </motion.div>

          {s.subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-xl text-white/60 leading-relaxed"
            >
              {s.subtitle}
            </motion.div>
          )}

          {s.body && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-base text-white/50 leading-relaxed space-y-3"
            >
              {s.body}
            </motion.div>
          )}
        </div>

        {/* Visual side */}
        {s.visual && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring", stiffness: 70 }}
            className="flex items-center justify-center"
          >
            {s.visual}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator — only on non-last sections */}
      {!isLast && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/20" />
          <ChevronDown size={16} className="text-white/25" />
        </motion.div>
      )}

      {/* Section number */}
      <div className="absolute top-8 right-8 text-xs font-mono text-white/15 select-none">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function FullscreenBlock({ sections }: Props) {
  return (
    <div className="w-full">
      {sections.map((s, i) => (
        <Section key={s.id} s={s} index={i} total={sections.length} />
      ))}
    </div>
  );
}

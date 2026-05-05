import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNote, ChevronDown, ChevronUp, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useStudent } from "@/contexts/StudentContext";

interface Props {
  weekId: number;
  classId: number;
  blockId: number;
}

export default function NotesPanel({ weekId, classId, blockId }: Props) {
  const { token } = useStudent();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const noteQuery = trpc.notes.get.useQuery(
    { token: token ?? "", weekId, classId, blockId },
    { enabled: !!token && open }
  );

  const saveMutation = trpc.notes.save.useMutation({
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  useEffect(() => {
    if (noteQuery.data) {
      setText(noteQuery.data.noteText ?? "");
    }
  }, [noteQuery.data]);

  // Auto-save after 1.5s of inactivity
  const handleChange = (val: string) => {
    setText(val);
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (token) {
        saveMutation.mutate({ token, weekId, classId, blockId, noteText: val });
      }
    }, 1500);
  };

  const handleManualSave = () => {
    if (token) {
      saveMutation.mutate({ token, weekId, classId, blockId, noteText: text });
    }
  };

  return (
    <div className="border-t border-border bg-background">
      {/* Toggle bar */}
      <button
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/50 transition-colors group"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          <StickyNote size={14} />
          <span>Mis notas de este bloque</span>
          {text.trim() && <span className="w-2 h-2 rounded-full bg-primary" />}
        </div>
        {open ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronUp size={14} className="text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <textarea
                className="w-full h-28 text-sm bg-muted rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground resize-none"
                placeholder="Escribe tus apuntes, ideas o dudas sobre este bloque..."
                value={text}
                onChange={e => handleChange(e.target.value)}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-muted-foreground">
                  {saved ? (
                    <span className="text-green-500 flex items-center gap-1"><Check size={11} /> Guardado</span>
                  ) : saveMutation.isPending ? (
                    "Guardando..."
                  ) : (
                    "Auto-guardado activado"
                  )}
                </span>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={handleManualSave}>
                  <Save size={11} />
                  Guardar
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

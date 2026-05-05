import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { useStudent } from "@/contexts/StudentContext";
import { toast } from "sonner";

interface Props {
  weekId: number;
  classId: number;
  blockId: number;
  blockTitle: string;
  weekTitle: string;
}

export default function ChatBot({ weekId, classId, blockId, blockTitle, weekTitle }: Props) {
  const { token } = useStudent();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const historyQuery = trpc.chat.history.useQuery(
    { token: token ?? "", weekId, classId, blockId },
    { enabled: !!token && open }
  );

  const askMutation = trpc.chat.ask.useMutation({
    onSuccess: () => {
      historyQuery.refetch();
    },
    onError: () => {
      toast.error("El asistente no está disponible ahora");
    },
  });

  const clearMutation = trpc.chat.clear.useMutation({
    onSuccess: () => {
      historyQuery.refetch();
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [historyQuery.data, askMutation.isPending]);

  const handleSend = () => {
    const msg = input.trim();
    if (!msg || !token || askMutation.isPending) return;
    setInput("");
    askMutation.mutate({ token, weekId, classId, blockId, blockTitle, weekTitle, message: msg });
  };

  const messages = historyQuery.data ?? [];

  return (
    <>
      {/* FAB */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center"
        style={{ display: open ? "none" : "flex" }}
        title="Preguntar al asistente IA"
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-5rem)] rounded-2xl bg-background border border-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground shrink-0">
              <div className="flex items-center gap-2">
                <Bot size={18} />
                <div>
                  <p className="text-sm font-semibold">Asistente IA</p>
                  <p className="text-[10px] opacity-70 truncate max-w-[200px]">{blockTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10"
                    onClick={() => {
                      if (token) clearMutation.mutate({ token, weekId, classId, blockId });
                    }}
                    title="Borrar conversación"
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  <X size={16} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef as any}>
              {messages.length === 0 && !askMutation.isPending && (
                <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground">
                  <Bot size={32} className="mb-2 opacity-30" />
                  <p className="text-sm">¿Tienes dudas sobre <strong>{blockTitle}</strong>?</p>
                  <p className="text-xs mt-1 opacity-60">Pregúntame lo que quieras</p>
                </div>
              )}
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs mt-0.5 ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      {msg.role === "user" ? <User size={12} /> : <Bot size={12} />}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {askMutation.isPending && (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                      <Bot size={12} />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2 flex items-center gap-1">
                      <Loader2 size={12} className="animate-spin" />
                      <span className="text-xs text-muted-foreground">Pensando...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="px-3 py-3 border-t border-border shrink-0">
              <div className="flex gap-2">
                <input
                  className="flex-1 text-sm bg-muted rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                  placeholder="Escribe tu pregunta..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  disabled={askMutation.isPending}
                />
                <Button
                  size="icon"
                  className="h-9 w-9 rounded-xl shrink-0"
                  onClick={handleSend}
                  disabled={!input.trim() || askMutation.isPending}
                >
                  <Send size={14} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

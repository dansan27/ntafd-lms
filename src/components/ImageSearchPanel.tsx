import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, X, Search, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ImageSearchPanel() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const { data, isFetching } = trpc.images.search.useQuery(
    { query: search, page },
    { enabled: search.length > 0 }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(query);
    setPage(1);
  };

  const copyUrl = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("URL copiada");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40 flex items-center justify-center transition-colors"
        title="Buscar imágenes"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={18} /></motion.span>
            : <motion.span key="img" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><ImageIcon size={18} /></motion.span>
          }
        </AnimatePresence>
      </motion.button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-40 right-6 z-50 w-80 sm:w-96 rounded-2xl border border-white/15 bg-[#0d0d12]/95 backdrop-blur-xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
            style={{ maxHeight: "70vh" }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 shrink-0">
              <ImageIcon size={14} className="text-indigo-400" />
              <span className="text-sm font-semibold text-white">Buscar imágenes</span>
              <span className="text-[10px] text-white/30 ml-auto">Pexels · clic para copiar URL</span>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-2 p-3 border-b border-white/8 shrink-0">
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ej: fuerza muscular, fibras..."
                className="flex-1 h-8 text-xs bg-white/8 border-white/15 text-white placeholder:text-white/30 focus-visible:ring-indigo-500/50"
              />
              <Button type="submit" size="sm" className="h-8 px-3 gap-1.5 bg-indigo-600 hover:bg-indigo-500 shrink-0" disabled={isFetching}>
                <Search size={12} />
                {isFetching ? "..." : "Ir"}
              </Button>
            </form>

            {/* Results */}
            <div className="overflow-y-auto flex-1 p-3 space-y-3">
              {!search && (
                <div className="text-center py-8 space-y-2">
                  <ImageIcon size={24} className="mx-auto text-white/15" />
                  <p className="text-xs text-white/30">Busca imágenes para tus bloques</p>
                </div>
              )}

              {search && !isFetching && data?.photos.length === 0 && (
                <p className="text-center text-xs text-white/30 py-8">Sin resultados para "{search}"</p>
              )}

              {data && data.photos.length > 0 && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    {data.photos.map((photo: { id: number; photographer: string; alt: string; src: { medium: string; large: string } }) => (
                      <div
                        key={photo.id}
                        onClick={() => copyUrl(photo.id, photo.src.large)}
                        className="group relative rounded-lg overflow-hidden border border-white/10 aspect-video cursor-pointer"
                      >
                        <img
                          src={photo.src.medium}
                          alt={photo.alt || photo.photographer}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1">
                            {copiedId === photo.id
                              ? <Check size={16} className="text-green-400" />
                              : <Copy size={16} className="text-white" />}
                            <span className="text-[9px] text-white/80">
                              {copiedId === photo.id ? "¡Copiada!" : "Copiar URL"}
                            </span>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[8px] text-white/50 truncate">📷 {photo.photographer}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[10px] text-white/25">Pág. {data.page} · {data.totalResults.toLocaleString()} resultados</p>
                    <div className="flex gap-1">
                      <button
                        disabled={page <= 1 || isFetching}
                        onClick={() => setPage(p => p - 1)}
                        className="p-1 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/25 disabled:opacity-30 transition-colors"
                      >
                        <ChevronLeft size={12} />
                      </button>
                      <button
                        disabled={isFetching || data.photos.length < 20}
                        onClick={() => setPage(p => p + 1)}
                        className="p-1 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/25 disabled:opacity-30 transition-colors"
                      >
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

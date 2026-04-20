import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Activity } from "lucide-react";
import { motion } from "framer-motion";
import ZoomableImage from "@/components/ui/ZoomableImage";

const DEVICES = [
  {
    emoji: "📱",
    name: "EMAY Portable ECG",
    tag: "Portátil",
    tagColor: "bg-blue-500/10 text-blue-400",
    specs: [
      { label: "Derivaciones", val: "1 (Lead I)" },
      { label: "Pantalla",     val: "Integrada"  },
      { label: "Batería",      val: "AAA ×2"     },
      { label: "App",          val: "No requiere" },
    ],
    pro: "Sin configuración — enciendes y mides",
    con: "Solo 1 derivación",
    img: null,
  },
  {
    emoji: "📲",
    name: "KardiaMobile (AliveCor)",
    tag: "FDA Aprobado",
    tagColor: "bg-emerald-500/10 text-emerald-400",
    specs: [
      { label: "Derivaciones", val: "1 ó 6"        },
      { label: "Precisión FA", val: "> 98%"         },
      { label: "Plataforma",   val: "iOS & Android" },
      { label: "Cloud",        val: "Historial + médico" },
    ],
    pro: "Detección automática de arritmias",
    con: "Requiere suscripción",
    img: "/images/semana%204/KM_phone_noHands_V2_copy_800x.webp",
  },
];

const CALC_EXAMPLES = [
  { cuadros: 3, bpm: 100, label: "Taquicardia", color: "text-orange-500" },
  { cuadros: 4, bpm: 75,  label: "Normal",       color: "text-green-500"  },
  { cuadros: 5, bpm: 60,  label: "Normal bajo",  color: "text-blue-400"   },
  { cuadros: 6, bpm: 50,  label: "Atleta",       color: "text-purple-400" },
];

export default function S4_Block6PolarH10() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
          <Smartphone size={14} /> Bloque 6 — Equipos EKG
        </div>
        <h1 className="text-4xl md:text-5xl font-black">Leer un <span className="text-primary">ECG</span></h1>
        <p className="text-muted-foreground text-sm">Dispositivos portátiles y cómo calcular la FC directamente del papel</p>
      </motion.div>

      {/* Device cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {DEVICES.map((d, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }} whileHover={{ y: -3 }}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  {d.img ? (
                    <ZoomableImage src={d.img!} alt={d.name} className="h-14 w-14 object-contain rounded-lg" />
                  ) : (
                    <span className="text-5xl">{d.emoji}</span>
                  )}
                  <div>
                    <p className="font-bold">{d.name}</p>
                    <Badge className={`text-[10px] mt-1 border-0 ${d.tagColor}`}>{d.tag}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {d.specs.map((s, j) => (
                    <div key={j} className="bg-muted/40 rounded-xl p-2.5">
                      <p className="text-[10px] text-muted-foreground">{s.label}</p>
                      <p className="text-sm font-bold">{s.val}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-green-500">✓ {d.pro}</p>
                <p className="text-xs text-muted-foreground">✗ {d.con}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Formula + ECG strip */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="bg-sidebar text-sidebar-foreground">
          <CardContent className="p-6 space-y-5">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="text-center space-y-2">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Fórmula</p>
                <p className="text-3xl font-black text-white">FC = 300 ÷ cuadros R-R</p>
                <p className="text-white/50 text-xs mt-1">Cuadros grandes (5 mm = 0.2 s) entre 2 picos R consecutivos</p>
              </div>
              <div className="flex justify-center">
                <ZoomableImage
                  src="/images/semana%204/Captura%20de%20pantalla%202026-04-20%20153131.png"
                  alt="Tira de ECG — cuadros R-R marcados"
                  className="rounded-xl max-h-36 object-contain"
                />
              </div>
            </div>

            {/* Examples */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CALC_EXAMPLES.map((ex, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.07 }}
                  className="bg-white/5 rounded-2xl p-3 text-center">
                  <p className="text-white/40 text-[10px] mb-1">{ex.cuadros} cuadros</p>
                  <p className={`text-2xl font-black ${ex.color}`}>{ex.bpm}</p>
                  <p className="text-white/40 text-[10px]">bpm</p>
                  <p className={`text-[10px] mt-1 font-medium ${ex.color}`}>{ex.label}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Regularity tip */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5 flex items-center gap-4">
            <Activity className="text-primary flex-shrink-0" size={28} />
            <div>
              <p className="font-bold">Ritmo regular vs irregular</p>
              <p className="text-sm text-muted-foreground mt-0.5">Intervalos R-R iguales = sinusal normal · Intervalos variables = posible fibrilación auricular</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
}

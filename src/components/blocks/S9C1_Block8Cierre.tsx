import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S9C1_Block8Cierre() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "cierre-c1",
          bg: "from-[#030f0f] to-[#001a12]",
          badge: "Semana 9 · ECNT",
          badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
          eyebrow: "Cierre — Clase 1",
          centered: true,
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.05] tracking-tight">
              La tecnología{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">
                potencia
              </span>{" "}
              el ejercicio en ECNT
            </h2>
          ),
          subtitle: (
            <p className="text-white/60 max-w-xl mx-auto">
              Wearables, apps de actividad física y telemedicina no reemplazan al profesional
              — lo <strong className="text-teal-300">complementan</strong>. Permiten mayor
              adherencia, monitoreo continuo y evidencia clínica para ajustar los tratamientos.
            </p>
          ),
          body: (
            <div className="space-y-3 max-w-xl mx-auto text-sm text-white/40">
              <p className="font-semibold text-white/60 text-base">Próxima clase:</p>
              <p>
                Profundizamos en diabetes (MCG: FreeStyle Libre y Dexcom), ejercicio en
                oncología, realidad virtual en rehabilitación y las tendencias futuras:
                IA, IoT y medicina de precisión.
              </p>
            </div>
          ),
          accentColor: "text-teal-400",
        },
      ]}
    />
  );
}

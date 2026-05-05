import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S6C1_Block2Puente() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "puente-fuerza-numero",
          bg: "from-[#0d0a00] to-[#1a1000]",
          eyebrow: "El Puente",
          title: (
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              La fuerza tiene{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
                un número
              </span>
            </h2>
          ),
          subtitle: "De la sensación subjetiva a la medición objetiva en Newtons.",
          body: (
            <div className="space-y-4 text-white/50 text-base leading-relaxed">
              <p>
                Hasta hace poco, la fuerza muscular se evaluaba con pruebas funcionales:
                cuántas repeticiones, cuánto peso máximo. Hoy, los <strong className="text-amber-300">transductores de fuerza</strong> —
                galgas extensométricas, piezoeléctricos y sensores ópticos — capturan cada
                componente vectorial en tiempo real.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { label: "Resolución", value: "±0.1 N", color: "text-orange-400" },
                  { label: "Frecuencia", value: "1000 Hz", color: "text-amber-400" },
                  { label: "Ejes", value: "Fx · Fy · Fz", color: "text-yellow-400" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                    <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">{item.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-white/40">
                En esta clase conocerás los 4 grandes instrumentos de medición de fuerza:
                celda de carga, dinamómetro, plataforma de fuerza, FlexiForce y EMG.
              </p>
            </div>
          ),
          accentColor: "text-amber-400",
        },
      ]}
    />
  );
}

import FullscreenBlock from "@/components/layout/FullscreenBlock";
import ZoomableImage from "@/components/ui/ZoomableImage";

export default function S9C1_Block1Gancho() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "gancho-ecnt",
          bg: "from-[#030f0f] to-[#001a12]",
          badge: "Semana 9 · ECNT",
          badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
          eyebrow: "El Gancho",
          title: (
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              El{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">
                71%
              </span>{" "}
              de las muertes mundiales tiene nombre.
            </h2>
          ),
          subtitle: (
            <p>
              Según la OMS, las{" "}
              <strong className="text-teal-300">Enfermedades Crónicas No Transmisibles</strong>{" "}
              matan a más de 41 millones de personas cada año. No son accidentes ni infecciones:
              son condiciones que se desarrollan lentamente y que la tecnología puede{" "}
              <em>prevenir, detectar y tratar</em>.
            </p>
          ),
          body: (
            <div className="space-y-3 text-white/50 text-base">
              <p>
                Hoy veremos cómo wearables, apps, sensores de glucosa y plataformas de
                telemedicina están transformando la vida de pacientes con HTA, obesidad, diabetes
                y cáncer.
              </p>
              <p className="text-teal-400/70 font-medium">
                La tecnología ya no es un lujo — es una herramienta de salud pública.
              </p>
            </div>
          ),
          visual: (
            <div className="w-full max-w-lg">
              <ZoomableImage
                src="/images/semana 9/slide_1.png"
                alt="Portada: Tecnología en ECNT"
                className="rounded-2xl border border-white/10 shadow-2xl w-full object-contain"
              />
            </div>
          ),
          accentColor: "text-teal-400",
        },
      ]}
    />
  );
}

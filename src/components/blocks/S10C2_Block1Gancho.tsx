import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S10C2_Block1Gancho() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "gancho-clustering",
          bg: "from-[#0d0718] to-[#1a0a2e]",
          badge: "Semana 10 · Machine Learning",
          badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
          eyebrow: "El Gancho",
          title: (
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              ¿Puede una IA identificar tu{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-400">
                perfil de atleta
              </span>{" "}
              sin que le digas nada?
            </h2>
          ),
          subtitle: (
            <p>
              El{" "}
              <strong className="text-violet-300">
                aprendizaje no supervisado
              </strong>{" "}
              analiza tus datos de FC, VO₂máx, potencia y velocidad — y te
              ubica automáticamente en un grupo de atletas similares sin
              necesitar etiquetas previas. Sin decirle si eres sprinter o
              fondista.
            </p>
          ),
          body: (
            <div className="space-y-3 text-white/50 text-base">
              <p>
                Esta clase veremos el{" "}
                <strong className="text-violet-300">clustering</strong> — la
                técnica de Machine Learning que encuentra grupos ocultos en
                datos deportivos y permite clasificar atletas, detectar
                patrones de lesión y personalizar el entrenamiento.
              </p>
              <p className="text-violet-400/70 font-medium">
                De los datos de tu wearable al perfil de rendimiento
                automatizado.
              </p>
            </div>
          ),
          accentColor: "text-violet-400",
        },
      ]}
    />
  );
}

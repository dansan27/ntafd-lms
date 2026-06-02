import FullscreenBlock from "@/components/layout/FullscreenBlock";

export default function S10C2_Block7Limitaciones() {
  return (
    <FullscreenBlock
      sections={[
        {
          id: "limitaciones",
          bg: "from-[#0d0718] to-[#1a0a2e]",
          badge: "Semana 10 · Limitaciones",
          badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
          eyebrow: "Pensamiento Crítico",
          title: (
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Limitaciones del{" "}
              <span className="text-violet-400">Clustering</span>
            </h2>
          ),
          subtitle: (
            <p>
              Ningún algoritmo es perfecto. Conocer sus limitaciones es tan
              importante como saber usarlo — especialmente en contextos
              deportivos y clínicos.
            </p>
          ),
          body: (
            <div className="space-y-2 text-xs">
              {[
                [
                  "Sin ground truth",
                  "No sabemos si los clusters son 'correctos' — no hay etiquetas de referencia.",
                ],
                [
                  "Sensible a escala",
                  "Variables con diferente escala distorsionan distancias — normalización obligatoria.",
                ],
                [
                  "K-Means asume esférico",
                  "No detecta clusters de forma irregular o de densidad variable.",
                ],
                [
                  "DBSCAN sensible a ε",
                  "El parámetro épsilon (radio de vecindad) requiere ajuste manual cuidadoso.",
                ],
                [
                  "Overfitting",
                  "Los clusters reflejan los datos de entrenamiento — puede no generalizar.",
                ],
              ].map(([t, d]) => (
                <div
                  key={t}
                  className="rounded-xl border border-violet-500/15 bg-violet-500/5 p-3 flex gap-3"
                >
                  <span className="text-violet-300 font-bold w-40 shrink-0">
                    {t}
                  </span>
                  <span className="text-white/50">{d}</span>
                </div>
              ))}
            </div>
          ),
          accentColor: "text-violet-400",
        },
        {
          id: "etica-practica",
          bg: "from-[#1a0a2e] to-[#0d0718]",
          badge: "Ética y Práctica",
          badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
          eyebrow: "Consideraciones Clave",
          title: (
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Uso{" "}
              <span className="text-purple-400">Responsable</span> del ML en
              AFD
            </h2>
          ),
          subtitle: (
            <p>
              Los datos biométricos de atletas son sensibles. El uso de ML en
              deporte conlleva responsabilidades éticas y clínicas que no
              pueden ignorarse.
            </p>
          ),
          body: (
            <div className="space-y-2 text-xs">
              {[
                [
                  "Privacidad de datos",
                  "Los datos biométricos son datos de salud — requieren protección GDPR/LOPD.",
                ],
                [
                  "Sesgos en datos",
                  "Subrepresentación de atletas femeninas en datasets históricos.",
                ],
                [
                  "Validación clínica",
                  "Necesaria antes de tomar decisiones médicas o de entrenamiento basadas en clusters.",
                ],
                [
                  "Transparencia",
                  "Los atletas deben saber cómo y para qué se usan sus datos.",
                ],
              ].map(([t, d]) => (
                <div
                  key={t}
                  className="rounded-xl border border-purple-500/15 bg-purple-500/5 p-3 flex gap-3"
                >
                  <span className="text-purple-300 font-bold w-40 shrink-0">
                    {t}
                  </span>
                  <span className="text-white/50">{d}</span>
                </div>
              ))}
            </div>
          ),
          accentColor: "text-purple-400",
        },
      ]}
    />
  );
}

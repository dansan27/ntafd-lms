export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "primera_dinamica",
    name: "Primer Paso",
    description: "Completaste tu primera actividad interactiva",
    icon: "🚀",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "clase_completa",
    name: "Clase Completa",
    description: "Completaste todas las dinámicas de una clase",
    icon: "🎯",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "semana_completa",
    name: "Semana Dominada",
    description: "Completaste todas las clases de una semana",
    icon: "🏆",
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "perfecto",
    name: "Perfección",
    description: "Obtuviste puntuación perfecta en una dinámica",
    icon: "⭐",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "reflexivo",
    name: "Mente Reflexiva",
    description: "Escribiste tu primera reflexión de clase",
    icon: "💭",
    color: "from-indigo-500 to-blue-500",
  },
  {
    id: "rapido",
    name: "Relámpago",
    description: "Completaste una dinámica en menos de 45 segundos",
    icon: "⚡",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    id: "notas",
    name: "Buen Anotador",
    description: "Guardaste notas en 3 bloques diferentes",
    icon: "📝",
    color: "from-teal-500 to-green-500",
  },
  {
    id: "curioso",
    name: "Curioso Digital",
    description: "Hiciste tu primera pregunta al asistente IA",
    icon: "🤖",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "racha_3",
    name: "En Racha",
    description: "Completaste dinámicas en 3 clases distintas",
    icon: "🔥",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "maratonista",
    name: "Maratonista",
    description: "Completaste 10 dinámicas en total",
    icon: "🏅",
    color: "from-red-500 to-pink-500",
  },
];

export function getAchievement(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

// Flashcard data per week
export interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
}

export const FLASHCARDS_BY_WEEK: Record<number, Flashcard[]> = {
  1: [
    { id: 1, front: "¿Qué es tecnología según Bunge (1985)?", back: "Conjunto de conocimientos científicos y técnicos aplicados al diseño, desarrollo y mantenimiento de artefactos o procedimientos para resolver problemas humanos.", category: "Fundamentos" },
    { id: 2, front: "¿Cuál es la diferencia entre hardware y software?", back: "Hardware: componentes físicos y tangibles (sensores, chips, dispositivos). Software: programas y sistemas intangibles que procesan datos y controlan el hardware.", category: "Tecnología" },
    { id: 3, front: "¿Qué es Actividad Física según la ACSM?", back: "Cualquier movimiento corporal producido por los músculos esqueléticos que resulta en gasto energético por encima del reposo.", category: "ACSM" },
    { id: 4, front: "¿Diferencia entre Actividad Física y Ejercicio?", back: "Ejercicio es actividad física planificada, estructurada y repetitiva con el objetivo de mejorar o mantener la aptitud física. La actividad física es más amplia e incluye cualquier movimiento.", category: "ACSM" },
    { id: 5, front: "¿Qué es un sensor en el contexto deportivo?", back: "Dispositivo que detecta y convierte señales físicas (movimiento, presión, temperatura, luz) en datos digitales procesables por un sistema informático.", category: "Sensores" },
    { id: 6, front: "¿Qué fue el primer wearable deportivo comercial?", back: "El Polar PE2000 (1982), primer monitor de FC inalámbrico que permitía medir la frecuencia cardíaca sin cables durante el entrenamiento.", category: "Historia" },
    { id: 7, front: "¿Qué es la gamificación en el deporte?", back: "Aplicación de elementos y mecánicas de juego (puntos, retos, niveles, recompensas) en contextos deportivos para aumentar la motivación y el engagement.", category: "Gamificación" },
    { id: 8, front: "¿Qué significa IoT en el deporte?", back: "Internet of Things (Internet de las Cosas): red de dispositivos conectados que recopilan y comparten datos en tiempo real, como relojes inteligentes, GPS y sensores de equipamiento.", category: "Tecnología" },
  ],
  2: [
    { id: 1, front: "¿Qué es la composición corporal?", back: "Proporción de los diferentes componentes del cuerpo humano: masa grasa, masa muscular (magra), masa ósea, agua y otros tejidos.", category: "Composición" },
    { id: 2, front: "¿Qué mide el método DEXA?", back: "Absorciometría de Rayos X de Energía Dual. Mide con alta precisión la densidad mineral ósea, masa grasa y masa magra por regiones corporales. Considerado gold standard.", category: "Métodos" },
    { id: 3, front: "¿Qué es el Bod Pod?", back: "Pletismógrafo de desplazamiento de aire que mide la composición corporal calculando el volumen corporal mediante diferencias de presión de aire en una cámara cerrada.", category: "Métodos" },
    { id: 4, front: "¿Cómo funciona la Bioimpedancia (BIA)?", back: "Envía una corriente eléctrica de baja intensidad por el cuerpo. La grasa resiste más la corriente que el agua/músculo. Calcula composición corporal según la impedancia medida.", category: "BIA" },
    { id: 5, front: "¿Qué es el escaneo corporal 3D (ZOZOFIT)?", back: "Tecnología que usa cámara de smartphone para crear un modelo tridimensional del cuerpo, midiendo circunferencias y estimando composición corporal sin radiación.", category: "Tecnología 3D" },
    { id: 6, front: "¿Cuál es la diferencia entre métodos directos e indirectos?", back: "Directos: disección cadavérica, análisis químico (gold standard pero no aplicables in vivo). Indirectos: predicen composición usando ecuaciones validadas (DEXA, BIA, pliegues).", category: "Métodos" },
    { id: 7, front: "¿Qué son los pliegues cutáneos?", back: "Método indirecto que usa un calibrador (plicómetro) para medir el grosor de la grasa subcutánea en puntos estandarizados del cuerpo. Ecuaciones de Durnin-Womersley o Jackson-Pollock.", category: "Métodos" },
    { id: 8, front: "¿Por qué es importante la composición corporal en el deporte?", back: "Influye en la potencia, velocidad, resistencia y salud. Cada deporte tiene un perfil óptimo (p.ej. gimnasia: mínima grasa; lucha: categorías por peso).", category: "Aplicación" },
  ],
  3: [
    { id: 1, front: "¿Qué es el VO₂ máx?", back: "Volumen máximo de oxígeno que el organismo puede consumir, transportar y utilizar por minuto. Indica la capacidad aeróbica máxima. Unidad: ml/kg/min.", category: "VO₂ máx" },
    { id: 2, front: "¿Qué es la frecuencia cardíaca máxima (FCmáx)?", back: "Número máximo de latidos por minuto que puede alcanzar el corazón. Fórmula clásica: 220 - edad. Fórmula más precisa (Tanaka): 208 - 0.7 × edad.", category: "Cardio" },
    { id: 3, front: "¿Qué es el ECG / EKG?", back: "Electrocardiograma: registro de la actividad eléctrica del corazón mediante electrodos en la piel. Muestra ondas P (despolarización auricular), QRS (ventricular) y T (repolarización).", category: "ECG" },
    { id: 4, front: "¿Qué es la HRV (Heart Rate Variability)?", back: "Variabilidad de la Frecuencia Cardíaca: variación en el tiempo entre latidos consecutivos (intervalos R-R). Mayor HRV = mejor recuperación y adaptación del sistema nervioso autónomo.", category: "HRV" },
    { id: 5, front: "¿Qué mide el umbral anaeróbico?", back: "Intensidad de ejercicio a la que la producción de lactato supera su eliminación. Por encima de este umbral el esfuerzo no es sostenible aeróbicamente. Se expresa como % FCmáx o VO₂máx.", category: "Fisiología" },
    { id: 6, front: "¿Cuáles son los métodos para medir VO₂ máx?", back: "Directo: ergoespirometría en laboratorio (gold standard). Indirecto: test de Cooper (12 min corriendo), test de Åstrand en bicicleta, fórmulas de Polar basadas en HRV.", category: "VO₂ máx" },
    { id: 7, front: "¿Qué es el consumo de oxígeno en reposo (VO₂ reposo)?", back: "Aproximadamente 3.5 ml/kg/min = 1 MET (Equivalente Metabólico). Sirve como referencia para calcular la intensidad relativa de ejercicio.", category: "Fisiología" },
    { id: 8, front: "¿Para qué sirve el Polar H10 en el deporte?", back: "Monitor de FC profesional con correa pectoral. Mide FC con alta precisión (electrodo ECG), HRV en tiempo real, y transmite datos vía Bluetooth/ANT+ a relojes o apps.", category: "Dispositivos" },
  ],
  4: [
    { id: 1, front: "¿Cuáles son las ondas del ECG y qué representan?", back: "P: despolarización auricular. QRS: despolarización ventricular (contracción). T: repolarización ventricular. Intervalo PR: conducción AV. QT: sístole eléctrica total.", category: "ECG" },
    { id: 2, front: "¿Cómo funciona el pulsioxímetro?", back: "Usa dos LEDs (rojo 660nm e infrarrojo 940nm). La oxihemoglobina absorbe más IR y la desoxihemoglobina más rojo. La relación entre absorbancias calcula el SpO₂.", category: "Pulsioximetría" },
    { id: 3, front: "¿Qué es el SpO₂?", back: "Saturación de oxígeno en sangre periférica medida por pulsioximetría. Normal: 95-100%. Hipoxemia leve: 90-94%. Hipoxemia severa: <90%. En altura puede bajar fisiológicamente.", category: "Pulsioximetría" },
    { id: 4, front: "¿Cuáles son las fuentes de error del pulsioxímetro?", back: "Movimiento (artefacto), mala perfusión periférica, esmalte de uñas oscuro, luz ambiental intensa, hipotermia, anemia severa, carboxihemoglobinemia.", category: "Errores" },
    { id: 5, front: "¿Qué filtra el filtro de paso alto en ECG?", back: "Elimina deriva de la línea base (movimiento, respiración). Frecuencia de corte típica: 0.05-0.5 Hz. El filtro de paso bajo elimina artefactos de alta frecuencia (>35-150 Hz).", category: "Procesamiento ECG" },
    { id: 6, front: "¿Qué es el intervalo RR en ECG?", back: "Tiempo entre dos ondas R consecutivas. Inversamente proporcional a la FC (FC = 60/RR en segundos). Base para calcular HRV. El Polar H10 mide RR con precisión de 1 ms.", category: "ECG" },
    { id: 7, front: "¿Cuándo usar un pulsioxímetro vs un ECG en deporte?", back: "Pulsioxímetro: monitoreo de SpO₂ en altitud, durante ejercicio de resistencia, deportes de hipoxia. ECG/Holter: diagnóstico arritmias, evaluación pre-participación, HRV avanzado.", category: "Aplicación" },
    { id: 8, front: "¿Qué ventajas tiene el Polar H10 sobre un smartwatch?", back: "Mayor precisión en FC y HRV (electrodo ECG vs óptico). Menor latencia. Mejor en movimientos bruscos. Permite análisis RR raw. Desventaja: no tiene pantalla ni GPS.", category: "Dispositivos" },
  ],
  5: [
    { id: 1, front: "¿Cómo mide el SpO₂ un smartwatch?", back: "Usa LEDs verdes, rojos e infrarrojos en la muñeca. Menos preciso que el pulsioxímetro de dedo por mayor movimiento, menor perfusión y geometría irregular.", category: "Smartwatch" },
    { id: 2, front: "¿Cuándo el SpO₂ es clínicamente preocupante?", back: "SpO₂ < 95% en reposo a nivel del mar es hipoxemia. < 90% requiere intervención. En ejercicio máximo puede llegar a 91-93% en atletas de élite (hipoxemia inducida por ejercicio).", category: "Clínica" },
    { id: 3, front: "¿Qué es la hipoxia de altitud y cómo afecta el SpO₂?", back: "A mayor altitud hay menos presión parcial de O₂. A 3000m el SpO₂ puede bajar a 90-92%. A 5000m a 80-85%. El cuerpo se adapta aumentando la ventilación y producción de eritropoyetina.", category: "Altitud" },
    { id: 4, front: "¿En qué deportes es más útil el pulsioxímetro?", back: "Alpinismo/escalada (hipoxia altitud), apnea/buceo (hipoxia), ciclismo de resistencia (umbral), deporte en altitud, rehabilitación cardiopulmonar.", category: "Aplicación" },
    { id: 5, front: "¿Por qué el LED verde del smartwatch es diferente al rojo/IR del pulsioxímetro?", back: "El verde (530nm) es mejor absorbido por la hemoglobina en superficie. Es más resistente al movimiento pero menos preciso para SpO₂. El rojo/IR penetra más tejido.", category: "Física óptica" },
    { id: 6, front: "¿Qué es la fotopletismografía (PPG)?", back: "Técnica óptica que detecta cambios de volumen sanguíneo en tejidos. La onda PPG refleja el pulso cardíaco. Base tecnológica de todos los sensores ópticos de FC y SpO₂.", category: "PPG" },
    { id: 7, front: "¿Cuál es la precisión típica de SpO₂ en smartwatch vs pulsioxímetro?", back: "Pulsioxímetro clínico: ±2% (ISO 80601). Smartwatch: ±3-4% según marca y condiciones. La FDA exige validación clínica para uso médico.", category: "Precisión" },
    { id: 8, front: "¿Qué es la apnea del sueño y cómo la detectan los wearables?", back: "Pausas en la respiración durante el sueño. Wearables avanzados (Apple Watch, Fitbit) detectan descensos en SpO₂ nocturno (<90%) y variaciones del patrón de movimiento.", category: "Salud" },
  ],
};

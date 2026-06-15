import {
  Zap, Rocket, Lightbulb, Clock, Cpu, Activity, Gamepad2, Flag,
  Heart, BookOpen, Layers, FlaskConical, Wifi, Smartphone, GraduationCap,
  BarChart2, TrendingUp, Radio, Eye, Dumbbell,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ===== Types =====

export interface DynamicConfig {
  id: number;
  name: string;
  description: string;
  icon: string;         // emoji para dashboard
  blockId: number;      // bloque donde aparece
  componentName: string;
}

export interface BlockConfig {
  id: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  time: string;
  hasDynamic?: boolean;
  componentName: string;
}

export interface ClassConfig {
  id: number;
  title: string;
  description: string;
  available: boolean;
  blocks: BlockConfig[];
  dynamics: DynamicConfig[];
}

export interface WeekConfig {
  id: number;
  title: string;
  description: string;
  classes: ClassConfig[];
}

// ===== Configuración del Curso =====

export const COURSE_CONFIG: WeekConfig[] = [
  {
    id: 1,
    title: "Semana 1: Fundamentos",
    description: "Introducción a las tecnologías aplicadas al deporte.",
    classes: [
      {
        id: 1,
        title: "Clase 1: Evolución Humana y Tecnología",
        description: "Introducción a los conceptos",
        available: true,
        blocks: [
          { id: 1, title: "El Gancho", subtitle: "Apertura impactante", icon: Zap, time: "0-5 min", componentName: "Block1Gancho" },
          { id: 2, title: "El Puente", subtitle: "¿Por qué importa?", icon: Rocket, time: "5-8 min", componentName: "Block2Puente" },
          { id: 3, title: "¿Qué es Tecnología?", subtitle: "Definiciones y principios", icon: Lightbulb, time: "8-20 min", componentName: "Block3Tecnologia" },
          { id: 4, title: "Evolución Tecnológica", subtitle: "De la piedra a la IA", icon: Clock, time: "20-32 min", hasDynamic: true, componentName: "Block4Evolucion" },
          { id: 5, title: "Hardware y Software", subtitle: "Sensores y sistemas", icon: Cpu, time: "32-45 min", hasDynamic: true, componentName: "Block5Hardware" },
          { id: 6, title: "Actividad Física", subtitle: "Definiciones ACSM", icon: Activity, time: "45-53 min", hasDynamic: true, componentName: "Block6ActividadFisica" },
          { id: 7, title: "Gamificación", subtitle: "Esto o Aquello", icon: Gamepad2, time: "53-57 min", componentName: "Block7Gamificacion" },
          { id: 8, title: "Cierre", subtitle: "Reflexión final", icon: Flag, time: "57-60 min", componentName: "Block8Cierre" },
        ],
        dynamics: [
          { id: 1, name: "Reto Cronológico", description: "Ordena 5 inventos del más antiguo al más reciente", icon: "⏳", blockId: 4, componentName: "Dynamic1Chronological" },
          { id: 2, name: "Hardware vs Software", description: "Clasifica 8 elementos lo más rápido posible", icon: "💻", blockId: 5, componentName: "Dynamic2HardwareSoftware" },
          { id: 3, name: "Clasifica la Acción", description: "¿Actividad Física, Ejercicio o Ninguno?", icon: "🏃", blockId: 6, componentName: "Dynamic3ClassifyAction" },
          { id: 4, name: "Reto de Sensores", description: "Identifica el sensor correcto para cada descripción", icon: "📡", blockId: 5, componentName: "Dynamic4Sensors" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Semana 2: Composición Corporal",
    description: "Análisis de la composición corporal y tecnologías de medición en el deporte.",
    classes: [
      {
        id: 1,
        title: "Clase 1: Composición Corporal en el Deporte",
        description: "Métodos y tecnologías para el análisis de la composición corporal",
        available: true,
        blocks: [
          { id: 1, title: "El Gancho", subtitle: "¿Cuánto conoces tu cuerpo?", icon: Heart, time: "0-5 min", componentName: "S2_Block1Gancho" },
          { id: 2, title: "Conceptos Clave", subtitle: "Definición y pilares", icon: BookOpen, time: "5-12 min", componentName: "S2_Block2Conceptos" },
          { id: 3, title: "Componentes Corporales", subtitle: "Masa grasa, magra y más", icon: Layers, time: "12-22 min", componentName: "S2_Block3Componentes" },
          { id: 4, title: "Métodos de Medición", subtitle: "Directos e indirectos", icon: FlaskConical, time: "22-32 min", hasDynamic: true, componentName: "S2_Block4Metodos" },
          { id: 5, title: "Tecnologías Avanzadas", subtitle: "DEXA, Bod Pod y más", icon: Cpu, time: "32-42 min", hasDynamic: true, componentName: "S2_Block5Tecnologias" },
          { id: 6, title: "Bioimpedancia (BIA)", subtitle: "Tecnología accesible", icon: Wifi, time: "42-50 min", hasDynamic: true, componentName: "S2_Block6BIA" },
          { id: 7, title: "Escaneo Corporal 3D", subtitle: "ZOZOFIT y el futuro", icon: Smartphone, time: "50-57 min", hasDynamic: true, componentName: "S2_Block7Escaneo" },
          { id: 8, title: "Cierre", subtitle: "Reflexión final", icon: GraduationCap, time: "57-60 min", componentName: "S2_Block8Cierre" },
        ],
        dynamics: [
          { id: 1, name: "Clasifica el Método", description: "¿Directo o indirecto? Clasifica los métodos de medición", icon: "🔬", blockId: 4, componentName: "S2_Dynamic1MetodoClasifica" },
          { id: 2, name: "Tabla Comparativa", description: "Compara características de las tecnologías de medición", icon: "📊", blockId: 5, componentName: "S2_Dynamic2TablaComparativa" },
          { id: 3, name: "Quiz Composición", description: "Pon a prueba tus conocimientos sobre composición corporal", icon: "🧠", blockId: 6, componentName: "S2_Dynamic3QuizComposicion" },
          { id: 4, name: "Identifica la Tecnología", description: "¿Qué tecnología se describe en cada escenario?", icon: "🔍", blockId: 7, componentName: "S2_Dynamic4IdentificaTech" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Semana 3: Capacidad Cardiovascular",
    description: "VO₂ Máx, ECG y tecnologías para medir la capacidad cardiovascular en el deporte.",
    classes: [
      {
        id: 1,
        title: "Clase 1: VO₂ Máx — Fisiología y Medición",
        description: "Fundamentos de la capacidad aeróbica, métodos de medición y prescripción de ejercicio",
        available: true,
        blocks: [
          { id: 1, title: "El Gancho", subtitle: "El límite del oxígeno", icon: Zap, time: "0-5 min", componentName: "S3_Block1Gancho" },
          { id: 2, title: "Capacidad Cardiovascular", subtitle: "Corazón, pulmones y músculos", icon: Heart, time: "5-12 min", componentName: "S3_Block2ConceptosCV" },
          { id: 3, title: "Fisiología del VO₂ Máx", subtitle: "ATP, mitocondrias y ecuación de Fick", icon: Layers, time: "12-22 min", componentName: "S3_Block3FisiologiaVO2" },
          { id: 4, title: "Métodos de Medición", subtitle: "Cooper, Bruce, gases y lactato", icon: FlaskConical, time: "22-32 min", hasDynamic: true, componentName: "S3_Block4MetodosMedicion" },
          { id: 5, title: "Laboratorio de Gases", subtitle: "Equipamiento y protocolo directo", icon: Cpu, time: "32-42 min", hasDynamic: true, componentName: "S3C1_Block5Laboratorio" },
          { id: 6, title: "Valores de Referencia", subtitle: "VO₂ Máx por edad, sexo y deporte", icon: BarChart2, time: "42-50 min", hasDynamic: true, componentName: "S3C1_Block6Valores" },
          { id: 7, title: "Prescripción de Ejercicio", subtitle: "Zonas de entrenamiento aeróbico", icon: TrendingUp, time: "50-57 min", hasDynamic: true, componentName: "S3C1_Block7Prescripcion" },
          { id: 8, title: "Cierre", subtitle: "Reflexión final", icon: GraduationCap, time: "57-60 min", componentName: "S3C1_Block8Cierre" },
        ],
        dynamics: [
          { id: 1, name: "Clasifica el Test", description: "¿Directo o indirecto? ¿Máximo o submáximo?", icon: "🧪", blockId: 4, componentName: "S3_Dynamic1ClasificaMetodo" },
          { id: 2, name: "Identifica el Equipo", description: "¿Para qué sirve cada componente del laboratorio?", icon: "🔬", blockId: 5, componentName: "S3C1_Dynamic2EquipoLab" },
          { id: 3, name: "Interpreta el VO₂", description: "Clasifica al atleta según su VO₂ Máx", icon: "📊", blockId: 6, componentName: "S3C1_Dynamic3InterpretaVO2" },
          { id: 4, name: "Zonas de Entrenamiento", description: "¿A qué zona corresponde esta intensidad?", icon: "🏃", blockId: 7, componentName: "S3C1_Dynamic4ZonasTren" },
        ],
      },
      {
        id: 2,
        title: "Clase 2: Electrocardiografía Deportiva",
        description: "ECG, procesamiento de señal y dispositivos cardíacos en el deporte",
        available: true,
        blocks: [
          { id: 1, title: "El Gancho", subtitle: "Tu corazón habla en eléctrico", icon: Zap, time: "0-5 min", componentName: "S3C2_Block1Gancho" },
          { id: 2, title: "El ECG / EKG", subtitle: "Ondas P, QRS y T", icon: Activity, time: "5-15 min", hasDynamic: true, componentName: "S3_Block5ECG" },
          { id: 3, title: "Procesamiento de Señal", subtitle: "Filtros y módulo AD8232", icon: Cpu, time: "15-25 min", hasDynamic: true, componentName: "S3_Block6Procesamiento" },
          { id: 4, title: "Derivaciones ECG", subtitle: "12 derivaciones vs simplificado", icon: Wifi, time: "25-35 min", componentName: "S3C2_Block4Derivaciones" },
          { id: 5, title: "Dispositivos: Polar H10", subtitle: "Gold standard deportivo", icon: Smartphone, time: "35-45 min", hasDynamic: true, componentName: "S3_Block7Dispositivos" },
          { id: 6, title: "Variabilidad de FC (HRV)", subtitle: "El marcador de recuperación", icon: Heart, time: "45-52 min", componentName: "S3C2_Block6HRV" },
          { id: 7, title: "Apps y Plataformas", subtitle: "Ecosistema de monitoreo cardíaco", icon: Layers, time: "52-57 min", componentName: "S3C2_Block7Apps" },
          { id: 8, title: "Cierre", subtitle: "Reflexión final", icon: GraduationCap, time: "57-60 min", componentName: "S3C2_Block8Cierre" },
        ],
        dynamics: [
          { id: 1, name: "Identifica la Onda", description: "Reconoce los componentes del ECG", icon: "📈", blockId: 2, componentName: "S3_Dynamic2IdentificaOnda" },
          { id: 2, name: "Quiz ECG y Señal", description: "Pon a prueba tus conocimientos", icon: "🧠", blockId: 3, componentName: "S3_Dynamic3QuizVO2" },
          { id: 3, name: "Clasifica el Dispositivo", description: "¿Clínico o deportivo? Elige el correcto", icon: "⌚", blockId: 5, componentName: "S3C2_Dynamic3ClasificaDispositivo" },
          { id: 4, name: "Elige el Dispositivo", description: "¿Qué tecnología usar para cada atleta?", icon: "🏆", blockId: 7, componentName: "S3_Dynamic4ComparaDispositivo" },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Semana 4: Capacidad Cardiovascular",
    description: "EKG/ECG, Polar H10 y Pulsioxímetro — tecnologías para medir la capacidad cardiovascular en el deporte.",
    classes: [
      {
        id: 1,
        title: "Clase 1: EKG, Polar H10 y Pulsioxímetro",
        description: "Métodos de aplicación tecnológica para monitorear el sistema cardiovascular deportivo",
        available: true,
        blocks: [
          { id: 1, title: "El Gancho", subtitle: "Capacidad cardiovascular", icon: Zap, time: "0-5 min", componentName: "S4_Block1Gancho" },
          { id: 2, title: "El Corazón Eléctrico", subtitle: "Ondas P, QRS y T", icon: Activity, time: "5-15 min", hasDynamic: true, componentName: "S4_Block2EKGElectrico" },
          { id: 3, title: "Señal EKG", subtitle: "Electrodos y módulo AD8232", icon: Cpu, time: "15-25 min", hasDynamic: true, componentName: "S4_Block3SenalEKG" },
          { id: 4, title: "Módulo AD8232", subtitle: "Pines, circuito y cadena de señal", icon: Cpu, time: "25-35 min", componentName: "S4_Block4FiltradoEKG" },
          { id: 5, title: "Filtrado de Señales", subtitle: "Paso alto, bajo, notch y bandas", icon: Radio, time: "35-45 min", componentName: "S4_Block5EquiposEKG" },
          { id: 6, title: "Equipos EKG", subtitle: "EMAY, KardiaMobile y lectura ECG", icon: Smartphone, time: "45-52 min", componentName: "S4_Block6PolarH10" },
          { id: 7, title: "Polar H10", subtitle: "Gold standard deportivo", icon: Heart, time: "52-57 min", hasDynamic: true, componentName: "S4_Block7Pulsioximetro" },
          { id: 8, title: "Pulsioxímetro", subtitle: "SpO₂, espectro de color y reflexión", icon: Eye, time: "57-60 min", hasDynamic: true, componentName: "S4_Block8Cierre" },
        ],
        dynamics: [
          { id: 1, name: "Identifica la Onda", description: "¿Qué onda del ECG es esta? Demuestra que conoces el ciclo eléctrico", icon: "📈", blockId: 2, componentName: "S4_Dynamic1IdentificaOnda" },
          { id: 2, name: "Clasifica el Equipo", description: "¿Clínico o deportivo? Clasifica cada dispositivo de monitoreo", icon: "⌚", blockId: 3, componentName: "S4_Dynamic2ClasificaEquipo" },
          { id: 3, name: "Quiz Polar H10", description: "Pon a prueba tus conocimientos sobre el sensor de referencia", icon: "🫀", blockId: 7, componentName: "S4_Dynamic3QuizPolarH10" },
          { id: 4, name: "Test Pulsioxímetro", description: "Escenarios clínicos de SpO₂ y pulsioximetría deportiva", icon: "💡", blockId: 8, componentName: "S4_Dynamic4TestPulsioximetro" },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Semana 5: Capacidad Cardiovascular - Métodos de Aplicación II",
    description: "Pulsioxímetro en profundidad, Smartwatch como sensor cardíaco y aplicaciones en ciclismo y levantamiento de pesas.",
    classes: [
      {
        id: 1,
        title: "Clase 1: Pulsioxímetro y Smartwatch",
        description: "Principio óptico, factores de error, comparativa tecnológica y uso en deporte",
        available: true,
        blocks: [
          { id: 1, title: "El Gancho", subtitle: "¿Tu smartwatch te miente?", icon: Eye, time: "0-5 min", componentName: "S5_Block1Gancho" },
          { id: 2, title: "Pulsioxímetro: Principio Óptico", subtitle: "LED rojo (660 nm) e infrarrojo (940 nm)", icon: Eye, time: "5-15 min", hasDynamic: true, componentName: "S5_Block2Pulsioximetro" },
          { id: 3, title: "SpO₂ y Pulso", subtitle: "Del fotón al porcentaje", icon: Activity, time: "15-25 min", componentName: "S5_Block3SpO2Pulso" },
          { id: 4, title: "Factores que Alteran la Medición", subtitle: "8 causas de error del pulsioxímetro", icon: Radio, time: "25-35 min", hasDynamic: true, componentName: "S5_Block4ErroresMedicion" },
          { id: 5, title: "Smartwatch vs Pulsioxímetro", subtitle: "LED verde, PPG y fotopletismografía", icon: Smartphone, time: "35-45 min", hasDynamic: true, componentName: "S5_Block5Smartwatch" },
          { id: 6, title: "¿Cuál Smartwatch?", subtitle: "Comparativa de modelos deportivos", icon: BarChart2, time: "45-52 min", componentName: "S5_Block6ComparativaSmartwatch" },
          { id: 7, title: "Smartwatch en el Deporte", subtitle: "Ciclismo indoor, outdoor y pesas", icon: TrendingUp, time: "52-57 min", hasDynamic: true, componentName: "S5_Block7DeporteSmart" },
          { id: 8, title: "Cierre", subtitle: "Síntesis y reflexión final", icon: GraduationCap, time: "57-60 min", componentName: "S5_Block8Cierre" },
          { id: 9, title: "Simulador Pulsioxímetro", subtitle: "Animación interactiva LED rojo/IR y SpO₂", icon: Activity, time: "Bonus", componentName: "S5_SimuladorPulsioximetro" },
        ],
        dynamics: [
          { id: 1, name: "¿Qué Longitud de Onda?", description: "Identifica el LED y su función en la oximetría", icon: "🔴", blockId: 2, componentName: "S5_Dynamic1LuzSpO2" },
          { id: 2, name: "¿Qué Falla?", description: "Dado un escenario, identifica el factor que altera la lectura", icon: "⚠️", blockId: 4, componentName: "S5_Dynamic2ErrorPulso" },
          { id: 3, name: "Smartwatch vs Pulsioxímetro", description: "¿Cuándo usar cada uno? Quiz comparativo", icon: "⌚", blockId: 5, componentName: "S5_Dynamic3SmartvsOxi" },
          { id: 4, name: "Elige el Dispositivo", description: "Para cada deporte y escenario, ¿qué sensor usar?", icon: "🏆", blockId: 7, componentName: "S5_Dynamic4EligeDispositivo" },
        ],
      },
    ],
  },
  {
    id: 6,
    title: "Semana 6: Fuerza Muscular",
    description: "Métodos de medición de la fuerza muscular: celdas de carga, dinamómetros, plataforma de fuerza, FlexiForce y EMG.",
    classes: [
      {
        id: 1,
        title: "Clase 1: Métodos de Aplicación",
        description: "Instrumentos para medir fuerza: galgas extensométricas, dinamómetros isométrico/isocinético, plataforma de fuerza Kistler, FlexiForce y electromiografía",
        available: true,
        blocks: [
          { id: 1, title: "El Gancho", subtitle: "¿Cuánta fuerza genera un atleta?", icon: Zap, time: "0-5 min", componentName: "S6C1_Block1Gancho" },
          { id: 2, title: "La fuerza tiene un número", subtitle: "De la sensación subjetiva a los Newtons", icon: Dumbbell, time: "5-10 min", componentName: "S6C1_Block2Puente" },
          { id: 3, title: "Celda de Carga (Load Cell)", subtitle: "Galga extensométrica y puente de Wheatstone", icon: Cpu, time: "10-22 min", hasDynamic: true, componentName: "S6C1_Block3LoadCell" },
          { id: 4, title: "Dinamómetros", subtitle: "Isométrico (Jamar), isotónico y isocinético (Biodex)", icon: Activity, time: "22-34 min", hasDynamic: true, componentName: "S6C1_Block4Dinamometros" },
          { id: 5, title: "Plataforma de Fuerza", subtitle: "6 canales Kistler: Fx, Fy, Fz, Mx, My, Mz", icon: Layers, time: "34-46 min", componentName: "S6C1_Block5Plataforma" },
          { id: 6, title: "FlexiForce y EMG", subtitle: "Sensor piezoresistivo y electromiografía", icon: Radio, time: "46-55 min", hasDynamic: true, componentName: "S6C1_Block6EMG" },
          { id: 7, title: "Reflexión", subtitle: "¿Qué otra forma hay de medir la fuerza?", icon: Lightbulb, time: "55-58 min", componentName: "S6C1_Block7Reflexion" },
          { id: 8, title: "Cierre", subtitle: "Síntesis y reflexión final", icon: GraduationCap, time: "58-60 min", componentName: "S6C1_Block8Cierre" },
        ],
        dynamics: [
          { id: 1, name: "Identifica el Sensor", description: "Dado un escenario deportivo, ¿qué instrumento de medición de fuerza usarías?", icon: "⚖️", blockId: 3, componentName: "S6C1_Dynamic1IdentificaSensor" },
          { id: 2, name: "Clasifica el Dinamómetro", description: "¿Isométrico, isotónico o isocinético? Clasifica el escenario", icon: "🦾", blockId: 4, componentName: "S6C1_Dynamic2ClasificaDinamometro" },
          { id: 3, name: "Quiz Fuerza Muscular", description: "Pon a prueba tus conocimientos sobre los instrumentos de fuerza", icon: "🧠", blockId: 6, componentName: "S6C1_Dynamic3QuizFuerza" },
        ],
      },
      {
        id: 2,
        title: "Clase 2: Fisiología de la Fuerza Muscular",
        description: "Definición de fuerza muscular, sistemas de contracción y tipos de fibras musculares (Type I, IIa, IIx)",
        available: true,
        blocks: [
          { id: 1, title: "El Gancho", subtitle: "¿Qué formas tenemos de medir la fuerza?", icon: Zap, time: "0-5 min", componentName: "S6C2_Block1Gancho" },
          { id: 2, title: "Fuerza Muscular", subtitle: "Definición y sistemas de contracción", icon: Dumbbell, time: "5-15 min", componentName: "S6C2_Block2Definicion" },
          { id: 3, title: "Tipos de Fibras Musculares", subtitle: "Type I · Type IIa · Type IIx", icon: Layers, time: "15-30 min", hasDynamic: true, componentName: "S6C2_Block3FibrasTipos" },
          { id: 4, title: "¿Cómo medimos la fuerza?", subtitle: "Dinamometría, plataformas, MMT y evaluación funcional", icon: Activity, time: "30-45 min", hasDynamic: true, componentName: "S6C2_Block4MedicionFuerza" },
          { id: 5, title: "Fibras y Rendimiento", subtitle: "Genética, entrenamiento y distribución Z-score", icon: BarChart2, time: "45-55 min", componentName: "S6C2_Block5QuizFibras" },
          { id: 6, title: "Cierre", subtitle: "Síntesis y reflexión final", icon: GraduationCap, time: "55-60 min", componentName: "S6C2_Block6Cierre" },
        ],
        dynamics: [
          { id: 1, name: "Clasifica la Fibra", description: "Dado un escenario deportivo, identifica qué tipo de fibra muscular predomina", icon: "🧬", blockId: 4, componentName: "S6C2_Dynamic1ClasificaFibra" },
          { id: 2, name: "Quiz Fibras Musculares", description: "Pon a prueba tus conocimientos sobre Type I, IIa e IIx", icon: "🧠", blockId: 5, componentName: "S6C2_Dynamic2QuizFibras" },
        ],
      },
    ],
  },
  {
    id: 9,
    title: "Semana 9: Tecnología en ECNT",
    description: "Tecnología aplicada en la prevención y tratamiento de Enfermedades Crónicas No Transmisibles: HTA, obesidad, diabetes y cáncer.",
    classes: [
      {
        id: 1,
        title: "Clase 1: ECNT, HTA y Obesidad",
        description: "Introducción a las ECNT, rol de la tecnología en salud, wearables, apps y telemedicina para HTA y obesidad",
        available: true,
        blocks: [
          { id: 1, title: "El Gancho", subtitle: "71% de muertes mundiales son ECNT", icon: Zap, time: "0-5 min", componentName: "S9C1_Block1Gancho" },
          { id: 2, title: "¿Qué son las ECNT?", subtitle: "Tipos, estadísticas y factores de riesgo", icon: Heart, time: "5-15 min", hasDynamic: true, componentName: "S9C1_Block2ECNT" },
          { id: 3, title: "Tecnología en Salud", subtitle: "Prevención, detección temprana y monitoreo", icon: Cpu, time: "15-23 min", componentName: "S9C1_Block3TecnologiaSalud" },
          { id: 4, title: "HTA y Obesidad", subtitle: "Definición, causas e importancia del ejercicio", icon: Activity, time: "23-35 min", hasDynamic: true, componentName: "S9C1_Block4HTAObesidad" },
          { id: 5, title: "Apps y Wearables", subtitle: "MyFitnessPal, Runtastic y smartwatches", icon: Smartphone, time: "35-43 min", componentName: "S9C1_Block5Wearables" },
          { id: 6, title: "Telemedicina", subtitle: "Consultas virtuales y seguimiento remoto", icon: Wifi, time: "43-52 min", hasDynamic: true, componentName: "S9C1_Block6Telemedicina" },
          { id: 7, title: "Reflexión", subtitle: "¿Qué tecnología elegirías para tu paciente?", icon: Lightbulb, time: "52-57 min", componentName: "S9C1_Block7Reflexion" },
          { id: 8, title: "Cierre", subtitle: "Síntesis y reflexión final", icon: GraduationCap, time: "57-60 min", componentName: "S9C1_Block8Cierre" },
        ],
        dynamics: [
          { id: 1, name: "Clasifica la ECNT", description: "¿Cuál de estas condiciones es una ECNT? Identifica factores de riesgo", icon: "🫀", blockId: 2, componentName: "S9C1_Dynamic1ClasificaECNT" },
          { id: 2, name: "Elige la Tecnología", description: "Para este paciente con HTA u obesidad, ¿qué tecnología usarías?", icon: "📱", blockId: 4, componentName: "S9C1_Dynamic2EligeDispositivo" },
          { id: 3, name: "Quiz HTA y Wearables", description: "Pon a prueba tus conocimientos sobre tecnología para ECNT", icon: "🧠", blockId: 6, componentName: "S9C1_Dynamic3QuizHTA" },
        ],
      },
      {
        id: 2,
        title: "Clase 2: Diabetes, Cáncer y Tendencias Futuras",
        description: "MCG para diabetes, ejercicio en oncología, realidad virtual en rehabilitación e IA aplicada a ECNT",
        available: true,
        blocks: [
          { id: 1, title: "El Gancho", subtitle: "¿El ejercicio controla la glucosa?", icon: Zap, time: "0-5 min", componentName: "S9C2_Block1Gancho" },
          { id: 2, title: "Diabetes y Glucemia", subtitle: "Tipos I, II, gestacional y rol del ejercicio", icon: Activity, time: "5-15 min", hasDynamic: true, componentName: "S9C2_Block2Diabetes" },
          { id: 3, title: "Monitoreo Continuo de Glucosa", subtitle: "FreeStyle Libre y Dexcom G7", icon: Cpu, time: "15-25 min", componentName: "S9C2_Block3MCG" },
          { id: 4, title: "Educación Digital en Diabetes", subtitle: "Plataformas, coaching y comunidades virtuales", icon: BookOpen, time: "25-33 min", componentName: "S9C2_Block4EducacionDigital" },
          { id: 5, title: "Ejercicio en Cáncer", subtitle: "Beneficios, fatiga y función inmunológica", icon: Heart, time: "33-43 min", hasDynamic: true, componentName: "S9C2_Block5Cancer" },
          { id: 6, title: "Realidad Virtual en Rehabilitación", subtitle: "VR Health y Karuna VR", icon: Layers, time: "43-51 min", componentName: "S9C2_Block6RVRehabilitacion" },
          { id: 7, title: "Limitaciones y Tendencias", subtitle: "Brecha digital, IA, IoT y medicina de precisión", icon: TrendingUp, time: "51-57 min", hasDynamic: true, componentName: "S9C2_Block7Tendencias" },
          { id: 8, title: "Cierre", subtitle: "Conclusiones y llamado a la acción", icon: GraduationCap, time: "57-60 min", componentName: "S9C2_Block8Cierre" },
        ],
        dynamics: [
          { id: 1, name: "MCG en Acción", description: "¿FreeStyle Libre o Dexcom? Elige el dispositivo para cada escenario", icon: "💉", blockId: 2, componentName: "S9C2_Dynamic1QuizMCG" },
          { id: 2, name: "Ejercicio y Cáncer", description: "¿Verdadero o falso? Beneficios del ejercicio en pacientes oncológicos", icon: "🏃", blockId: 5, componentName: "S9C2_Dynamic2EjercicioCancer" },
          { id: 3, name: "Tecnologías del Futuro", description: "Identifica la tendencia tecnológica para cada escenario clínico", icon: "🤖", blockId: 7, componentName: "S9C2_Dynamic3TendenciasFuturas" },
        ],
      },
    ],
  },
  {
    id: 10,
    title: "Semana 10: Sensores Cinemáticos y Clustering",
    description: "IMUs, potenciómetros y encoders para análisis de movimiento; Machine Learning no supervisado para perfilado de atletas.",
    classes: [
      {
        id: 1,
        title: "Clase 1: Sensores Cinemáticos — IMUs, Potenciómetros y Encoders",
        description: "Fundamentos de cinemática, fusión sensorial en IMUs, goniometría electrónica y encoders rotativos aplicados al deporte",
        available: true,
        blocks: [
          { id: 1, title: "El Gancho", subtitle: "¿Cómo sabe tu smartphone cuándo girar la pantalla?", icon: Zap, time: "0-5 min", componentName: "S10C1_Block1Gancho" },
          { id: 2, title: "Sensores Cinemáticos", subtitle: "Cinemática, tipos de sensores y variables de movimiento", icon: Radio, time: "5-15 min", hasDynamic: true, componentName: "S10C1_Block2SensoresCinematicos" },
          { id: 3, title: "IMU — Unidad de Medición Inercial", subtitle: "Acelerómetro + giroscopio + magnetómetro y fusión sensorial", icon: Cpu, time: "15-27 min", componentName: "S10C1_Block3IMU" },
          { id: 4, title: "Potenciómetros", subtitle: "Goniometría electrónica para medición articular", icon: Activity, time: "27-38 min", hasDynamic: true, componentName: "S10C1_Block4Potenciometros" },
          { id: 5, title: "Encoders", subtitle: "Ópticos, magnéticos y cuadratura — velocidad rotacional", icon: Layers, time: "38-48 min", componentName: "S10C1_Block5Encoders" },
          { id: 6, title: "Aplicaciones en Deporte", subtitle: "Análisis de marcha, gesto técnico y biomecánica de campo", icon: Rocket, time: "48-55 min", hasDynamic: true, componentName: "S10C1_Block6AplicacionesDeporte" },
          { id: 7, title: "Reflexión", subtitle: "¿Qué sensor usarías para monitorear a tu atleta?", icon: Lightbulb, time: "55-58 min", componentName: "S10C1_Block7Reflexion" },
          { id: 8, title: "Cierre", subtitle: "Síntesis y conexión con clustering", icon: GraduationCap, time: "58-60 min", componentName: "S10C1_Block8Cierre" },
        ],
        dynamics: [
          { id: 1, name: "Identifica el Sensor", description: "Dado el escenario deportivo, ¿qué sensor cinemático usarías?", icon: "📡", blockId: 2, componentName: "S10C1_Dynamic1IdentificaSensor" },
          { id: 2, name: "Quiz IMUs", description: "Pon a prueba tus conocimientos sobre fusión sensorial y acelerómetros", icon: "🧠", blockId: 4, componentName: "S10C1_Dynamic2QuizIMU" },
          { id: 3, name: "Cinemático o No", description: "Clasifica si el sensor mide variables cinemáticas o de otro tipo", icon: "🔬", blockId: 6, componentName: "S10C1_Dynamic3ClasificaSensor" },
        ],
      },
      {
        id: 2,
        title: "Clase 2: Clustering para AFD",
        description: "Aprendizaje no supervisado, K-Means, DBSCAN y clustering jerárquico aplicados al perfilado de atletas",
        available: true,
        blocks: [
          { id: 1, title: "El Gancho", subtitle: "¿Puede una IA identificar tu perfil de atleta sin etiquetas?", icon: Zap, time: "0-5 min", componentName: "S10C2_Block1Gancho" },
          { id: 2, title: "¿Qué es el Clustering?", subtitle: "Aprendizaje no supervisado y agrupamiento por similitud", icon: BookOpen, time: "5-15 min", hasDynamic: true, componentName: "S10C2_Block2QueClustering" },
          { id: 3, title: "Algoritmos de Clustering", subtitle: "K-Means, DBSCAN y clustering jerárquico", icon: Cpu, time: "15-27 min", componentName: "S10C2_Block3AlgoritmosML" },
          { id: 4, title: "Variables en AFD", subtitle: "VO2max, FC, potencia y normalización Z-score", icon: BarChart2, time: "27-37 min", componentName: "S10C2_Block4VariablesAFD" },
          { id: 5, title: "Aplicaciones en AFD", subtitle: "Perfiles de atletas, riesgo de lesión y zonas de entrenamiento", icon: Activity, time: "37-47 min", hasDynamic: true, componentName: "S10C2_Block5AplicacionesAFD" },
          { id: 6, title: "Interpretación de Resultados", subtitle: "PCA, dendrogramas y Silhouette Score", icon: TrendingUp, time: "47-54 min", hasDynamic: true, componentName: "S10C2_Block6Interpretacion" },
          { id: 7, title: "Limitaciones y Ética", subtitle: "Overfitting, privacidad de datos biométricos y sesgos", icon: Lightbulb, time: "54-58 min", componentName: "S10C2_Block7Limitaciones" },
          { id: 8, title: "Cierre", subtitle: "Síntesis del módulo de sensores y análisis de datos", icon: GraduationCap, time: "58-60 min", componentName: "S10C2_Block8Cierre" },
        ],
        dynamics: [
          { id: 1, name: "Clasifica el Atleta", description: "Asigna cada perfil de atleta al cluster correcto (sprint/mixto/resistencia)", icon: "🏃", blockId: 2, componentName: "S10C2_Dynamic1ClasificaAtleta" },
          { id: 2, name: "Quiz Clustering", description: "K-Means, DBSCAN y métricas de validación — ¿cuánto sabes?", icon: "🤖", blockId: 5, componentName: "S10C2_Dynamic2QuizClustering" },
          { id: 3, name: "Elige el Algoritmo", description: "Para este escenario deportivo, ¿qué algoritmo de clustering usarías?", icon: "🧬", blockId: 6, componentName: "S10C2_Dynamic3IdentificaAlgoritmo" },
        ],
      },
    ],
  },
  {
    id: 11,
    title: "Semana 11: Encoders y Potencia Muscular",
    description: "Sensores cinemáticos — encoders: definición, tecnologías, tipos lineal/rotatorio y métodos absoluto/incremental; tecnología aplicada en la valoración y análisis de la potencia muscular.",
    classes: [
      {
        id: 1,
        title: "Clase 1: Sensores Cinemáticos — Encoders",
        description: "¿Qué es un encoder?, tecnologías (óptico/magnético/resistivo), tipos lineal y rotatorio, métodos de medición absolutos e incrementales, y aplicaciones deportivas",
        available: true,
        blocks: [
          { id: 1, title: "El Gancho", subtitle: "¿Qué tienen en común un ascensor, un robot y un ciclómetro deportivo?", icon: Zap, time: "0-5 min", componentName: "S11C1_Block1Gancho" },
          { id: 2, title: "¿Qué es un Encoder?", subtitle: "Definición, variables que mide y tecnologías: óptico, magnético, resistivo, mecánico", icon: Cpu, time: "5-15 min", hasDynamic: true, componentName: "S11C1_Block2QueEsEncoder" },
          { id: 3, title: "Tipos de Encoder", subtitle: "Encoder lineal y rotatorio — principio y aplicaciones deportivas", icon: Layers, time: "15-27 min", componentName: "S11C1_Block3TiposEncoder" },
          { id: 4, title: "Métodos de Medición", subtitle: "Encoders absolutos e incrementales — diferencias clave y cuándo usar cada uno", icon: Activity, time: "27-38 min", hasDynamic: true, componentName: "S11C1_Block4MetodosMedicion" },
          { id: 5, title: "Aplicaciones en el Deporte", subtitle: "Cicloergómetro, isocinético, análisis de marcha y ergometría", icon: Rocket, time: "38-48 min", componentName: "S11C1_Block5AplicacionesDeporte" },
          { id: 6, title: "Integración en el Sistema de Medición", subtitle: "Cadena encoder → DAQ → software: cuadratura y detección de dirección", icon: TrendingUp, time: "48-55 min", hasDynamic: true, componentName: "S11C1_Block6IntegracionSistemas" },
          { id: 7, title: "Reflexión", subtitle: "¿Qué encoder elegirías para medir la velocidad angular de rodilla en campo?", icon: Lightbulb, time: "55-58 min", componentName: "S11C1_Block7Reflexion" },
          { id: 8, title: "Cierre", subtitle: "Síntesis de encoders como sensores cinemáticos de precisión", icon: GraduationCap, time: "58-60 min", componentName: "S11C1_Block8Cierre" },
        ],
        dynamics: [
          { id: 1, name: "Identifica la Tecnología", description: "¿Qué tecnología de encoder se describe en este escenario deportivo?", icon: "🔌", blockId: 2, componentName: "S11C1_Dynamic1IdentificaTecnologia" },
          { id: 2, name: "Absoluto o Incremental", description: "Para este caso de uso, ¿qué método de medición es más adecuado?", icon: "🎯", blockId: 4, componentName: "S11C1_Dynamic2AbsolutoIncremental" },
          { id: 3, name: "Encoder en el Deporte", description: "Dado el gesto deportivo, ¿qué tipo de encoder y variable mediría?", icon: "⚙️", blockId: 6, componentName: "S11C1_Dynamic3EncoderDeporte" },
        ],
      },
      {
        id: 2,
        title: "Clase 2: Tecnología para la Valoración de la Potencia Muscular",
        description: "Fundamentos físicos (velocidad, fuerza, torque, potencia), fisiología muscular, tecnologías de evaluación (MoCap, plataformas de fuerza, IMUs, dinamómetros) y metodologías de test",
        available: true,
        blocks: [
          { id: 1, title: "El Gancho", subtitle: "Usain Bolt genera más de 2600 W en sus primeros pasos — ¿cómo se mide?", icon: Zap, time: "0-5 min", componentName: "S11C2_Block1Gancho" },
          { id: 2, title: "Velocidad, Fuerza y Potencia", subtitle: "Conceptos físicos: v, F, torque, trabajo y P = F × v con ejemplos deportivos", icon: Zap, time: "5-15 min", hasDynamic: true, componentName: "S11C2_Block2FundamentosFisicos" },
          { id: 3, title: "¿Por qué es importante la Potencia?", subtitle: "Velocidad, fuerza, explosividad y agilidad — los 4 pilares del rendimiento explosivo", icon: Rocket, time: "15-25 min", componentName: "S11C2_Block3ImportanciaPotencia" },
          { id: 4, title: "Fisiología del Ejercicio", subtitle: "Fibras Tipo I, IIa, IIx; metabolismo ATP-PC y láctico; relación F-V", icon: Cpu, time: "25-38 min", hasDynamic: true, componentName: "S11C2_Block4FisiologiaPotencia" },
          { id: 5, title: "Tecnologías de Evaluación", subtitle: "Cámaras 3D, plataformas de fuerza, IMUs y dinamómetros isocinéticos", icon: BarChart2, time: "38-48 min", componentName: "S11C2_Block5TecnologiasEvaluacion" },
          { id: 6, title: "Metodologías de Evaluación", subtitle: "Test de saltos, sprint con fotocélulas y evaluaciones isocinéticas", icon: TrendingUp, time: "48-55 min", hasDynamic: true, componentName: "S11C2_Block6MetodologiasEvaluacion" },
          { id: 7, title: "Reflexión", subtitle: "¿Qué tecnologías combinarías para evaluar potencia en un equipo de saltos?", icon: Lightbulb, time: "55-58 min", componentName: "S11C2_Block7Reflexion" },
          { id: 8, title: "Cierre", subtitle: "Síntesis de tecnología para la valoración de la potencia muscular", icon: GraduationCap, time: "58-60 min", componentName: "S11C2_Block8Cierre" },
        ],
        dynamics: [
          { id: 1, name: "Identifica el Concepto Físico", description: "¿Estamos hablando de velocidad, fuerza, trabajo o potencia en este ejemplo deportivo?", icon: "⚡", blockId: 2, componentName: "S11C2_Dynamic1ConceptoFisico" },
          { id: 2, name: "Fibras en Acción", description: "Para este gesto deportivo, ¿qué tipo de fibras musculares y sistema energético predominan?", icon: "🧬", blockId: 4, componentName: "S11C2_Dynamic2FibrasAccion" },
          { id: 3, name: "Elige la Tecnología", description: "Para evaluar la potencia en este contexto deportivo, ¿qué dispositivo usarías?", icon: "🔬", blockId: 6, componentName: "S11C2_Dynamic3EligeTecnologia" },
        ],
      },
    ],
  },
  {
    id: 12,
    title: "Semana 12: Velocidad y Agilidad",
    description: "Tecnología aplicada en la valoración y análisis de la velocidad y agilidad: fundamentos físicos, indicadores de evaluación y tecnologías de medición",
    classes: [
      {
        id: 1,
        title: "Clase 1: Tecnología Aplicada en la Valoración y Análisis de la Velocidad y Agilidad",
        description: "Velocidad lineal y angular, fundamentos de la agilidad, elementos del rendimiento explosivo, indicadores de evaluación (T-test, Illinois, AI, CODT, AFI) y tecnologías: cámaras 3D, plataformas de fuerza, IMUs y fotocélulas",
        available: true,
        blocks: [
          { id: 1, title: "El Gancho", subtitle: "Un defensa tiene menos de 0.3 segundos para reaccionar y cambiar de dirección", icon: Zap, time: "0-5 min", componentName: "S12C1_Block1Gancho" },
          { id: 2, title: "Velocidad Lineal y Angular", subtitle: "v = d/t y ω = θ/t — definiciones, fórmulas y ejemplos deportivos", icon: Activity, time: "5-15 min", hasDynamic: true, componentName: "S12C1_Block2VelocidadLinealAngular" },
          { id: 3, title: "Agilidad", subtitle: "COD + percepción — definición, importancia y diferencia con agilidad reactiva", icon: Rocket, time: "15-25 min", componentName: "S12C1_Block3Agilidad" },
          { id: 4, title: "Elementos del Rendimiento Explosivo", subtitle: "Los cuatro pilares: velocidad, fuerza, explosividad y agilidad", icon: TrendingUp, time: "25-37 min", hasDynamic: true, componentName: "S12C1_Block4RendimientoExplosivo" },
          { id: 5, title: "Evaluación de la Agilidad I", subtitle: "T-test, Illinois Agility Test, Índice de Agilidad y CODT", icon: BarChart2, time: "37-47 min", componentName: "S12C1_Block5EvaluacionAgilidadI" },
          { id: 6, title: "Evaluación de la Agilidad II y Tecnologías", subtitle: "AFI, Índice de Desaceleración, Fuerza Lateral — cámaras 3D, plataformas, IMUs y fotocélulas", icon: Eye, time: "47-55 min", hasDynamic: true, componentName: "S12C1_Block6EvaluacionAgilidadII" },
          { id: 7, title: "Reflexión", subtitle: "¿Qué protocolo y tecnología combinarías para evaluar velocidad y agilidad en fútbol sala?", icon: Lightbulb, time: "55-58 min", componentName: "S12C1_Block7Reflexion" },
          { id: 8, title: "Cierre", subtitle: "Síntesis de tecnología para la valoración de la velocidad y la agilidad", icon: GraduationCap, time: "58-60 min", componentName: "S12C1_Block8Cierre" },
        ],
        dynamics: [
          { id: 1, name: "¿Velocidad Lineal o Angular?", description: "Dado este movimiento deportivo, ¿qué tipo de velocidad se describe?", icon: "⚡", blockId: 2, componentName: "S12C1_Dynamic1VelocidadOAngular" },
          { id: 2, name: "¿Qué Elemento del Rendimiento?", description: "Para este test o gesto deportivo, ¿qué capacidad se evalúa principalmente?", icon: "💥", blockId: 4, componentName: "S12C1_Dynamic2RendimientoExplosivo" },
          { id: 3, name: "Elige la Tecnología", description: "Para este objetivo de evaluación, ¿qué tecnología es la más adecuada?", icon: "🔬", blockId: 6, componentName: "S12C1_Dynamic3TecnologiaAgilidad" },
        ],
      },
    ],
  },
];

// ===== Helpers =====

export function getClassConfig(weekId: number, classId: number): ClassConfig | undefined {
  const week = COURSE_CONFIG.find(w => w.id === weekId);
  return week?.classes.find(c => c.id === classId);
}

export function getWeekConfig(weekId: number): WeekConfig | undefined {
  return COURSE_CONFIG.find(w => w.id === weekId);
}

export function isClassAvailable(weekId: number, classId: number): boolean {
  const cls = getClassConfig(weekId, classId);
  return cls?.available === true && cls.blocks.length > 0;
}

import {
  Zap, Rocket, Lightbulb, Clock, Cpu, Activity, Gamepad2, Flag,
  Heart, BookOpen, Layers, FlaskConical, Wifi, Smartphone, GraduationCap,
  BarChart2, TrendingUp,
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

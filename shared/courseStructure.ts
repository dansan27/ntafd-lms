/**
 * Estructura del curso compartida entre server y client.
 * NO importar dependencias de React aquí (sin Lucide icons, etc).
 */

export interface DynamicStructure {
  id: number;
  name: string;
  blockId: number;
}

export interface ClassStructure {
  title: string;
  description: string;
  blockCount: number;
  dynamics: DynamicStructure[];
}

// Keyed by "weekId-classId"
const CLASS_STRUCTURES: Record<string, ClassStructure> = {
  "1-1": {
    title: "Clase 1: Evolución Humana y Tecnología",
    description: "Introducción a los conceptos",
    blockCount: 8,
    dynamics: [
      { id: 1, name: "Reto Cronológico", blockId: 4 },
      { id: 2, name: "Hardware vs Software", blockId: 5 },
      { id: 3, name: "Clasifica la Acción", blockId: 6 },
      { id: 4, name: "Reto de Sensores", blockId: 5 },
    ],
  },
  "2-1": {
    title: "Clase 1: Composición Corporal en el Deporte",
    description: "Métodos y tecnologías para el análisis de la composición corporal",
    blockCount: 8,
    dynamics: [
      { id: 1, name: "Clasifica el Método", blockId: 4 },
      { id: 2, name: "Tabla Comparativa", blockId: 5 },
      { id: 3, name: "Quiz Composición", blockId: 6 },
      { id: 4, name: "Identifica la Tecnología", blockId: 7 },
    ],
  },
  "3-1": {
    title: "Clase 1: VO₂ Máx — Fisiología y Medición",
    description: "Fundamentos de la capacidad aeróbica, métodos de medición y prescripción de ejercicio",
    blockCount: 8,
    dynamics: [
      { id: 1, name: "Clasifica el Test", blockId: 4 },
      { id: 2, name: "Identifica el Equipo", blockId: 5 },
      { id: 3, name: "Interpreta el VO₂", blockId: 6 },
      { id: 4, name: "Zonas de Entrenamiento", blockId: 7 },
    ],
  },
  "3-2": {
    title: "Clase 2: Electrocardiografía Deportiva",
    description: "ECG, procesamiento de señal y dispositivos cardíacos en el deporte",
    blockCount: 8,
    dynamics: [
      { id: 1, name: "Identifica la Onda", blockId: 2 },
      { id: 2, name: "Quiz ECG y Señal", blockId: 3 },
      { id: 3, name: "Clasifica el Dispositivo", blockId: 5 },
      { id: 4, name: "Elige el Dispositivo", blockId: 7 },
    ],
  },
  "4-1": {
    title: "Clase 1: EKG, Polar H10 y Pulsioxímetro",
    description: "Métodos de aplicación tecnológica para monitorear el sistema cardiovascular deportivo",
    blockCount: 8,
    dynamics: [
      { id: 1, name: "Identifica la Onda", blockId: 2 },
      { id: 2, name: "Clasifica el Equipo", blockId: 3 },
      { id: 3, name: "Quiz Polar H10", blockId: 6 },
      { id: 4, name: "Test Pulsioxímetro", blockId: 7 },
    ],
  },
};

export function getClassStructure(weekId: number, classId: number): ClassStructure | undefined {
  return CLASS_STRUCTURES[`${weekId}-${classId}`];
}

export function getDynamicIds(weekId: number, classId: number): number[] {
  const structure = getClassStructure(weekId, classId);
  return structure?.dynamics.map(d => d.id) ?? [];
}

export function getDynamicNames(weekId: number, classId: number): Record<number, string> {
  const structure = getClassStructure(weekId, classId);
  const map: Record<number, string> = {};
  structure?.dynamics.forEach(d => { map[d.id] = d.name; });
  return map;
}

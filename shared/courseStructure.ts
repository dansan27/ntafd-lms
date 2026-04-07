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

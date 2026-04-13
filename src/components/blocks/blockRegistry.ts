import { lazy, type ComponentType } from "react";

type LazyBlock = React.LazyExoticComponent<ComponentType<any>>;

/**
 * Registro central de componentes de bloques.
 * Cada key corresponde al `componentName` en courseConfig.
 * Para agregar una nueva clase, solo agregar entries aquí.
 */
const BLOCK_REGISTRY: Record<string, LazyBlock> = {
  // Semana 1, Clase 1
  Block1Gancho: lazy(() => import("./Block1Gancho")),
  Block2Puente: lazy(() => import("./Block2Puente")),
  Block3Tecnologia: lazy(() => import("./Block3Tecnologia")),
  Block4Evolucion: lazy(() => import("./Block4Evolucion")),
  Block5Hardware: lazy(() => import("./Block5Hardware")),
  Block6ActividadFisica: lazy(() => import("./Block6ActividadFisica")),
  Block7Gamificacion: lazy(() => import("./Block7Gamificacion")),
  Block8Cierre: lazy(() => import("./Block8Cierre")),

  // Semana 2, Clase 1
  S2_Block1Gancho: lazy(() => import("./S2_Block1Gancho")),
  S2_Block2Conceptos: lazy(() => import("./S2_Block2Conceptos")),
  S2_Block3Componentes: lazy(() => import("./S2_Block3Componentes")),
  S2_Block4Metodos: lazy(() => import("./S2_Block4Metodos")),
  S2_Block5Tecnologias: lazy(() => import("./S2_Block5Tecnologias")),
  S2_Block6BIA: lazy(() => import("./S2_Block6BIA")),
  S2_Block7Escaneo: lazy(() => import("./S2_Block7Escaneo")),
  S2_Block8Cierre: lazy(() => import("./S2_Block8Cierre")),

  // Semana 3, Clase 1 — VO₂ Máx
  S3_Block1Gancho: lazy(() => import("./S3_Block1Gancho")),
  S3_Block2ConceptosCV: lazy(() => import("./S3_Block2ConceptosCV")),
  S3_Block3FisiologiaVO2: lazy(() => import("./S3_Block3FisiologiaVO2")),
  S3_Block4MetodosMedicion: lazy(() => import("./S3_Block4MetodosMedicion")),
  S3C1_Block5Laboratorio: lazy(() => import("./S3C1_Block5Laboratorio")),
  S3C1_Block6Valores: lazy(() => import("./S3C1_Block6Valores")),
  S3C1_Block7Prescripcion: lazy(() => import("./S3C1_Block7Prescripcion")),
  S3C1_Block8Cierre: lazy(() => import("./S3C1_Block8Cierre")),

  // Semana 3, Clase 2 — ECG
  S3C2_Block1Gancho: lazy(() => import("./S3C2_Block1Gancho")),
  S3_Block5ECG: lazy(() => import("./S3_Block5ECG")),
  S3_Block6Procesamiento: lazy(() => import("./S3_Block6Procesamiento")),
  S3C2_Block4Derivaciones: lazy(() => import("./S3C2_Block4Derivaciones")),
  S3_Block7Dispositivos: lazy(() => import("./S3_Block7Dispositivos")),
  S3C2_Block6HRV: lazy(() => import("./S3C2_Block6HRV")),
  S3C2_Block7Apps: lazy(() => import("./S3C2_Block7Apps")),
  S3C2_Block8Cierre: lazy(() => import("./S3C2_Block8Cierre")),
};

export function getBlockComponent(componentName: string): LazyBlock | null {
  return BLOCK_REGISTRY[componentName] ?? null;
}

export default BLOCK_REGISTRY;

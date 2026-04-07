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
};

export function getBlockComponent(componentName: string): LazyBlock | null {
  return BLOCK_REGISTRY[componentName] ?? null;
}

export default BLOCK_REGISTRY;

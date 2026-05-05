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

  // Semana 4, Clase 1 — Capacidad Cardiovascular: EKG, Polar H10, Pulsioxímetro
  S4_Block1Gancho: lazy(() => import("./S4_Block1Gancho")),
  S4_Block2EKGElectrico: lazy(() => import("./S4_Block2EKGElectrico")),
  S4_Block3SenalEKG: lazy(() => import("./S4_Block3SenalEKG")),
  S4_Block4FiltradoEKG: lazy(() => import("./S4_Block4FiltradoEKG")),
  S4_Block5EquiposEKG: lazy(() => import("./S4_Block5EquiposEKG")),
  S4_Block6PolarH10: lazy(() => import("./S4_Block6PolarH10")),
  S4_Block7Pulsioximetro: lazy(() => import("./S4_Block7Pulsioximetro")),
  S4_Block8Cierre: lazy(() => import("./S4_Block8Cierre")),

  // Semana 5, Clase 1 — Capacidad Cardiovascular: Pulsioxímetro y Smartwatch
  S5_Block1Gancho: lazy(() => import("./S5_Block1Gancho")),
  S5_Block2Pulsioximetro: lazy(() => import("./S5_Block2Pulsioximetro")),
  S5_Block3SpO2Pulso: lazy(() => import("./S5_Block3SpO2Pulso")),
  S5_Block4ErroresMedicion: lazy(() => import("./S5_Block4ErroresMedicion")),
  S5_Block5Smartwatch: lazy(() => import("./S5_Block5Smartwatch")),
  S5_Block6ComparativaSmartwatch: lazy(() => import("./S5_Block6ComparativaSmartwatch")),
  S5_Block7DeporteSmart: lazy(() => import("./S5_Block7DeporteSmart")),
  S5_Block8Cierre: lazy(() => import("./S5_Block8Cierre")),
  S5_SimuladorPulsioximetro: lazy(() => import("./S5_SimuladorPulsioximetro")),

  // Semana 6, Clase 1 — Fuerza Muscular: Métodos de Aplicación
  S6C1_Block1Gancho: lazy(() => import("./S6C1_Block1Gancho")),
  S6C1_Block2Puente: lazy(() => import("./S6C1_Block2Puente")),
  S6C1_Block3LoadCell: lazy(() => import("./S6C1_Block3LoadCell")),
  S6C1_Block4Dinamometros: lazy(() => import("./S6C1_Block4Dinamometros")),
  S6C1_Block5Plataforma: lazy(() => import("./S6C1_Block5Plataforma")),
  S6C1_Block6EMG: lazy(() => import("./S6C1_Block6EMG")),
  S6C1_Block7Reflexion: lazy(() => import("./S6C1_Block7Reflexion")),
  S6C1_Block8Cierre: lazy(() => import("./S6C1_Block8Cierre")),

  // Semana 6, Clase 2 — Fuerza Muscular: Fisiología y Tipos de Fibras
  S6C2_Block1Gancho: lazy(() => import("./S6C2_Block1Gancho")),
  S6C2_Block2Definicion: lazy(() => import("./S6C2_Block2Definicion")),
  S6C2_Block3FibrasTipos: lazy(() => import("./S6C2_Block3FibrasTipos")),
  S6C2_Block4MedicionFuerza: lazy(() => import("./S6C2_Block4MedicionFuerza")),
  S6C2_Block5QuizFibras: lazy(() => import("./S6C2_Block5QuizFibras")),
  S6C2_Block6Cierre: lazy(() => import("./S6C2_Block6Cierre")),
};

export function getBlockComponent(componentName: string): LazyBlock | null {
  return BLOCK_REGISTRY[componentName] ?? null;
}

export default BLOCK_REGISTRY;

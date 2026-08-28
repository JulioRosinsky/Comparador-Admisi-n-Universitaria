export interface PaesScores {
  nem: number; // 1.0 to 7.0
  nemScore: number; // 100 to 1000
  ranking: number; // 100 to 1000
  lectora: number; // 100 to 1000
  m1: number; // 100 to 1000
  m2?: number; // 100 to 1000
  ciencias?: number; // 100 to 1000
  historia?: number; // 100 to 1000
  cienciasType?: 'biologia' | 'fisica' | 'quimica' | 'tp';
}

export type KnowledgeArea =
  | 'Salud y Medicina'
  | 'Ingeniería y Tecnología'
  | 'Derecho y Ciencias Sociales'
  | 'Administración y Comercio'
  | 'Ciencias Básicas'
  | 'Educación y Pedagogía'
  | 'Arte y Arquitectura'
  | 'Humanidades y Comunicaciones';

export type AcreditacionNivel =
  | 'Excelencia (6-7 años)'
  | 'Avanzada (4-5 años)'
  | 'Básica (3 años)'
  | 'Básica (1-3 años)'
  | 'No Acreditada'
  | 'En Cierre';

export type UniversityType = 'CRUCH Estatal' | 'CRUCH Privada G9' | 'Privada Adscrita' | 'Privada No Adscrita';

export interface SpecialAdmissionPathway {
  id: string;
  name: string; // e.g. "PACE (Programa de Acceso a la Educación Superior)"
  category: 'Equidad / Inclusión' | 'Talento / Mérito' | 'Deportistas' | 'Mujeres STEM' | 'Pueblos Originarios' | 'Internacional';
  requirements: string;
  quotaInfo: string; // e.g. "Cupos supernumerarios garantizados"
  source: string; // e.g. "Dirección de Admisión y Equidad DEMRE / Mineduc"
}

export interface BenefitDetail {
  category: 'Arancel' | 'Mantención y Alimentación' | 'Mérito y Rendimiento' | 'Residencia' | 'Inclusión y Familia';
  title: string;
  description: string;
  coverage: string; // e.g. "100% de arancel real y matrícula"
  source: string; // e.g. "División de Bienestar y Beneficios Mineduc / DAE"
}

export interface CampusLocation {
  campusName: string; // e.g. "Campus San Joaquín"
  address: string; // e.g. "Av. Vicuña Mackenna 4860"
  commune: string; // e.g. "Macul"
  region: string; // e.g. "Región Metropolitana"
  transportAccess: string; // e.g. "Metro Línea 5 (Estación San Joaquín - Conexión directa)"
  facilities: string[]; // e.g. ["Bibliotecas de última generación", "Laboratorios de Investigación", "Complejo Deportivo", "Casino Universitario"]
  source: string; // e.g. "Catálogo de Infraestructura y Sedes Institucionales"
}

export interface SubordinateCareer {
  id: string;
  name: string; // e.g. "Ingeniería Civil Eléctrica"
  code?: string;
  durationSemesters: number; // e.g. 11 or 12
  description: string;
  employmentRate1Year: number; // % e.g. 96.5%
  avgSalary5Year: string; // e.g. "$2.800.000 a $3.400.000"
  keyFields: string[]; // e.g. ["Sistemas de Potencia", "Energías Renovables", "Automatización y Control"]
  source: string; // e.g. "SIES / MiFuturo.cl y Plan de Estudios Oficial"
}

export interface CareerPonderation {
  nem: number; // e.g. 0.10
  ranking: number; // e.g. 0.20
  lectora: number; // e.g. 0.15
  m1: number; // e.g. 0.35
  m2: number; // e.g. 0.10 (0 if not required)
  cienciasHistoria: number; // e.g. 0.10
  requiresM2: boolean;
  minPonderadoPostulacion?: number;
  minPercentilPostulacion?: number;
}

export interface HistoricalCutoff {
  year: number;
  score: number;
}

export interface Metric50 {
  // 1. Dimensión Admisión y Ponderaciones (DEMRE / Universidades)
  corte2024: number;
  corte2023: number;
  corte2022: number;
  corte2021: number;
  corte2020: number;
  promedioCorte5Anos: number;
  vacantesRegulares: number;
  ponderacionNEM: number; // in %
  ponderacionRanking: number; // in %
  ponderacionLectora: number; // in %
  ponderacionM1: number; // in %
  ponderacionM2: number; // in %
  ponderacionCienciasHistoria: number; // in %
  exigenciaM2Texto: string;
  minimoPostulacion: string;

  // 2. Dimensión Empleabilidad e Inserción Laboral (MiFuturo.cl)
  empleabilidad1Ano: number; // %
  empleabilidad2Ano: number; // %
  ingreso1Ano: number; // CLP
  ingreso2Ano: number; // CLP
  ingreso3Ano: number; // CLP
  ingreso4Ano: number; // CLP
  ingreso5Ano: number; // CLP
  tramoIngreso5AnoMediana: string; // e.g. "$2.500.000 a $3.000.000"
  ingresoP10: number; // CLP
  ingresoP25: number; // CLP
  ingresoP75: number; // CLP
  ingresoP90: number; // CLP
  brechaSalarialNacional: string; // e.g. "+24.5% sobre promedio nacional"
  principalesSectoresContratacion: string[];

  // 3. Dimensión Académica y Eficiencia de Titulación (SIES / Mineduc)
  duracionFormalSemestres: number;
  duracionRealSemestres: number;
  sobreduracionSemestres: number;
  retencion1a2Ano: number; // %
  titulacionOportuna: number; // %
  jornada: 'Diurna' | 'Vespertina';
  sedeCampus: string;
  gradoYTitulo: string;
  ratioEstudiantesDocenteJCE: string; // e.g. "18:1"
  porcentajeDocentesPostgrado: number; // %

  // 4. Dimensión Institucional y Calidad (CNA / Mineduc)
  acreditacionAnos: number;
  acreditacionNivel: AcreditacionNivel;
  areasAcreditadas: string[];
  tipoInstitucion: UniversityType;
  totalMatriculadosInstitucion: number;

  // 5. Dimensión Financiera, Aranceles y Beneficios (Mineduc / DEMRE)
  arancelAnualCLP: number;
  arancelReferenciaCLP: number;
  copagoAnualEstimadoCLP: number;
  matriculaAnualCLP: number;
  adscritoGratuidad: boolean;
  accesoFondoSolidarioYCAE: string;
}

export interface Career {
  id: string;
  code: string; // Official DEMRE code e.g. "11045"
  name: string;
  universityName: string;
  universityShort: string;
  universityLogoText: string;
  region: string;
  city: string;
  area: KnowledgeArea;
  ponderation: CareerPonderation;
  historicalCutoffs: HistoricalCutoff[];
  metrics: Metric50;
  badge?: string;
  isPlanComun?: boolean;
  parentPlanName?: string;
  subordinateCareers?: SubordinateCareer[];
  specialAdmission?: SpecialAdmissionPathway[];
  benefits?: BenefitDetail[];
  campusLocation?: CampusLocation;
}

export type AdmissionCategory = 'SEGURA' | 'COMPETITIVA' | 'RIESGO_ALTO';

export interface StochasticAnalysis {
  weightedScore: number;
  selectedScienceHistoryTest: 'ciencias' | 'historia' | 'ninguna';
  selectedScienceHistoryScore: number;
  historicalMean: number;
  historicalStdDev: number;
  annualDrift: number;
  projectedCutoffNextYear: number;
  probability: number; // 0 to 100
  category: AdmissionCategory;
  categoryLabel: string;
  differenceTo2024Cutoff: number;
  differenceToProjectedCutoff: number;
  monteCarloSimulations: number[]; // 1000 samples for histogram/distribution
  percentileInDistribution: number;
  recommendation: string;
}

export interface CareerWithSimulation extends Career {
  simulation: StochasticAnalysis;
}

export interface SavedSimulation {
  id: string;
  name: string;
  date: string;
  scores: PaesScores;
  selectedCareersCount: number;
  notes?: string;
}

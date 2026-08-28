export interface DataSourceInfo {
  id: string;
  name: string;
  fullName: string;
  url: string;
  description: string;
  lastUpdated: string;
  badgeText: string;
}

export const DATA_SOURCES: Record<string, DataSourceInfo> = {
  demre: {
    id: 'demre',
    name: 'DEMRE - U. de Chile',
    fullName: 'Departamento de Evaluación, Medición y Registro Educacional (DEMRE)',
    url: 'https://demre.cl',
    description: 'Puntajes de corte históricos, vacantes regulares y ponderaciones oficiales del Proceso de Admisión 2020-2024.',
    lastUpdated: 'Proceso de Admisión 2024 / Regular 2025',
    badgeText: 'Fuente: DEMRE (Admisión 2024)',
  },
  mifuturo: {
    id: 'mifuturo',
    name: 'MiFuturo.cl (SIES)',
    fullName: 'Portal MiFuturo - Subsecretaría de Educación Superior, Ministerio de Educación de Chile',
    url: 'https://mifuturo.cl',
    description: 'Estadísticas oficiales de empleabilidad al 1° y 2° año, tramos de ingresos al 1°, 2°, 3°, 4° y 5° año por titulación cruzada con SII.',
    lastUpdated: 'Estadísticas Oficiales SIES 2024',
    badgeText: 'Fuente: MiFuturo.cl / SIES Mineduc',
  },
  sies: {
    id: 'sies',
    name: 'SIES - Mineduc',
    fullName: 'Servicio de Información de Educación Superior (SIES)',
    url: 'https://sies.cl',
    description: 'Duración formal, duración real de titulación, retención de 1° a 2° año, porcentaje de docentes con postgrado y ratio estudiante/docente.',
    lastUpdated: 'Base de Datos Oficial SIES 2024',
    badgeText: 'Fuente: SIES Mineduc',
  },
  cna: {
    id: 'cna',
    name: 'CNA-Chile',
    fullName: 'Comisión Nacional de Acreditación (CNA-Chile)',
    url: 'https://cnachile.cl',
    description: 'Años y nivel de acreditación institucional (Excelencia 6-7 años, Avanzada 4-5 años) y áreas de acreditación obligatorias y optativas.',
    lastUpdated: 'Registro Público de Acreditación 2024',
    badgeText: 'Fuente: Comisión Nacional de Acreditación (CNA)',
  },
  mineduc: {
    id: 'mineduc',
    name: 'Mineduc - Gratuidad y Aranceles',
    fullName: 'División de Educación Universitaria y Beneficios Estudiantiles (Mineduc)',
    url: 'https://beneficiosestudiantiles.cl',
    description: 'Aranceles reales, aranceles de referencia oficiales, adscripción a gratuidad universal (deciles 1 al 6), Fondo Solidario FSCU y Crédito CAE.',
    lastUpdated: 'Aranceles Oficiales Mineduc 2024',
    badgeText: 'Fuente: Mineduc - Beneficios y Aranceles',
  },
  specialAdmission: {
    id: 'specialAdmission',
    name: 'Admisión Especial Institucional',
    fullName: 'Direcciones Generales de Admisión y Equidad de Universidades Adscritas',
    url: 'https://demre.cl/admision-especial',
    description: 'Cupos supernumerarios BEA, PACE, Explora UNESCO, Más Mujeres en STEM, Deportistas Destacados, SIPEE y Talento e Inclusión.',
    lastUpdated: 'Convocatoria Admisión Especial 2024-2025',
    badgeText: 'Fuente: Admisión Especial DEMRE y Universidades',
  },
  montecarlo: {
    id: 'montecarlo',
    name: 'Simulador Estocástico Monte Carlo',
    fullName: 'Motor Algorítmico Estocástico con 1.000 iteraciones sobre distribución empírica de puntajes DEMRE 2020-2024',
    url: '#metodologia',
    description: 'Cálculo de probabilidad mediante muestreo gaussiano con corrección de tendencia anual (drift) y varianza histórica.',
    lastUpdated: 'Calibrado con Cortes PAES 2020-2024',
    badgeText: 'Fuente: Modelo Estocástico Monte Carlo (N=1.000)',
  },
};

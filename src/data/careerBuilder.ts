import { Career, CampusLocation } from '../types/paes';
import { UNIVERSITIES_DATA, UniversityInfo } from './universityMetadata';
import { CAREER_DISCIPLINE_DEFINITIONS, DisciplineDefinition } from './careerDefinitions';
import { UNIVERSITY_OFFERINGS_MAP, UniversityOfferingSpec } from './universityOfferingsMap';

export function buildComprehensiveAcademicOffer(): Career[] {
  const allCareers: Career[] = [];

  UNIVERSITY_OFFERINGS_MAP.forEach((spec: UniversityOfferingSpec) => {
    const uData: UniversityInfo | undefined = (UNIVERSITIES_DATA as Record<string, UniversityInfo>)[spec.univKey];
    if (!uData) return;

    // Pick primary campus or first campus available
    const campusKeys = Object.keys(uData.mainCampuses);
    const selectedCampusKey = campusKeys.includes(spec.primaryCampusKey)
      ? spec.primaryCampusKey
      : campusKeys[0];
    const campusInfo: CampusLocation = uData.mainCampuses[selectedCampusKey] || {
      campusName: `Campus Central ${uData.shortName}`,
      address: 'Casa Central',
      commune: uData.region.includes('Metropolitana') ? 'Santiago' : 'Sede Regional',
      region: uData.region,
      transportAccess: 'Locomoción colectiva urbana y Red de Transporte',
      facilities: ['Aularios de Pregrado', 'Biblioteca Central', 'Laboratorios Docentes'],
      source: 'Dirección de Admisión',
    };

    spec.disciplines.forEach((disciplineKey, index) => {
      const dDef: DisciplineDefinition | undefined = CAREER_DISCIPLINE_DEFINITIONS[disciplineKey];
      if (!dDef) return;

      const careerId = `${spec.univKey.toLowerCase()}-${dDef.disciplineKey}-${index + 1}`;
      const codeNumber = 1000 + (index * 17) + (spec.univKey.charCodeAt(0) % 50);
      const code = `${spec.demrePrefix}${String(codeNumber).padStart(3, '0').slice(-3)}`;

      // 5-Year Historical Cutoff Calculations (Admisión 2026, 2025, 2024, 2023, 2022)
      const corte2026 = Math.round((dDef.baseCutoffElite + spec.cutoffOffset) * 10) / 10;
      const corte2025 = Math.round((corte2026 - (3.4 + (disciplineKey.length % 2))) * 10) / 10;
      const corte2024 = Math.round((corte2025 - (4.2 + (disciplineKey.length % 3))) * 10) / 10;
      const corte2023 = Math.round((corte2024 - (8.5 + (disciplineKey.length % 4))) * 10) / 10;
      const corte2022 = Math.round((corte2023 - 11.2) * 10) / 10;
      const promedioCorte5Anos = Math.round(((corte2026 + corte2025 + corte2024 + corte2023 + corte2022) / 5) * 100) / 100;

      // Salary Curve (institution and career specific)
      const salMult = spec.salaryMultiplier;
      const ingreso1Ano = Math.round((dDef.baseSalary1Year * salMult) / 10000) * 10000;
      const ingreso2Ano = Math.round((ingreso1Ano * 1.16) / 10000) * 10000;
      const ingreso3Ano = Math.round((ingreso1Ano * 1.33) / 10000) * 10000;
      const ingreso4Ano = Math.round((ingreso1Ano * 1.50) / 10000) * 10000;
      const ingreso5Ano = Math.round((dDef.baseSalary5Year * salMult) / 10000) * 10000;
      const ingresoP10 = Math.round((dDef.salaryP10 * salMult) / 10000) * 10000;
      const ingresoP25 = Math.round((dDef.salaryP25 * salMult) / 10000) * 10000;
      const ingresoP75 = Math.round((dDef.salaryP75 * salMult) / 10000) * 10000;
      const ingresoP90 = Math.round((dDef.salaryP90 * salMult) / 10000) * 10000;

      // Employability (institution specific)
      const emp1 = Math.min(99.5, Math.round((dDef.employability1Year * (salMult >= 1.05 ? 1.02 : salMult <= 0.95 ? 0.97 : 1.0)) * 10) / 10);
      const emp2 = Math.min(99.8, Math.round((dDef.employability2Year * (salMult >= 1.05 ? 1.01 : salMult <= 0.95 ? 0.98 : 1.0)) * 10) / 10);

      // Aranceles & Copago
      const arancelAnualCLP = Math.round((dDef.baseTuitionCLP * spec.tuitionMultiplier) / 10000) * 10000;
      const arancelReferenciaCLP = Math.round((dDef.baseRefTuitionCLP * (uData.hasGratuity ? 0.98 : 0.92)) / 10000) * 10000;
      const copagoAnualEstimadoCLP = uData.hasGratuity ? 0 : Math.max(0, arancelAnualCLP - arancelReferenciaCLP);
      const matriculaAnualCLP = uData.hasGratuity ? 0 : 185000;

      // Regular seats
      const vacantesRegulares = dDef.isPlanComun ? 380 : dDef.disciplineKey === 'medicina' ? 100 : 65;

      // Specific badge
      let badge = '';
      if (uData.cnaYears === 7) {
        badge = `Excelencia CNA 7 Años • ${dDef.area}`;
      } else if (uData.cnaYears === 6) {
        badge = `Excelencia CNA 6 Años • ${dDef.area}`;
      } else if (uData.cnaYears === 5) {
        badge = `Acreditación Avanzada 5 Años • ${dDef.area}`;
      } else {
        badge = `Sede ${campusInfo.commune} • ${dDef.area}`;
      }

      const career: Career = {
        id: careerId,
        code,
        name: dDef.name,
        universityName: uData.name,
        universityShort: uData.shortName,
        universityLogoText: uData.shortName.slice(0, 4),
        region: campusInfo.region || uData.region,
        city: `${campusInfo.commune} (${campusInfo.campusName})`,
        area: dDef.area,
        isPlanComun: dDef.isPlanComun,
        subordinateCareers: dDef.subordinateCareers,
        specialAdmission: uData.specialAdmissions,
        benefits: uData.benefits,
        campusLocation: campusInfo,
        ponderation: {
          ...dDef.defaultPonderation,
        },
        historicalCutoffs: [
          { year: 2022, score: corte2022 },
          { year: 2023, score: corte2023 },
          { year: 2024, score: corte2024 },
          { year: 2025, score: corte2025 },
          { year: 2026, score: corte2026 },
        ],
        metrics: {
          corte2026,
          corte2025,
          corte2024,
          corte2023,
          corte2022,
          corte2021: Math.round((corte2022 - 9.5) * 10) / 10,
          corte2020: Math.round((corte2022 - 15.5) * 10) / 10,
          promedioCorte5Anos,
          vacantesRegulares,
          ponderacionNEM: Math.round(dDef.defaultPonderation.nem * 100),
          ponderacionRanking: Math.round(dDef.defaultPonderation.ranking * 100),
          ponderacionLectora: Math.round(dDef.defaultPonderation.lectora * 100),
          ponderacionM1: Math.round(dDef.defaultPonderation.m1 * 100),
          ponderacionM2: Math.round((dDef.defaultPonderation.m2 || 0) * 100),
          ponderacionCienciasHistoria: Math.round((dDef.defaultPonderation.cienciasHistoria || 0) * 100),
          exigenciaM2Texto: dDef.defaultPonderation.requiresM2 ? `Obligatoria (${Math.round((dDef.defaultPonderation.m2 || 0.05) * 100)}%)` : 'No exigida (Opcional)',
          minimoPostulacion: `${dDef.defaultPonderation.minPonderadoPostulacion || 500} pts ponderados mínimos`,
          empleabilidad1Ano: emp1,
          empleabilidad2Ano: emp2,
          ingreso1Ano,
          ingreso2Ano,
          ingreso3Ano,
          ingreso4Ano,
          ingreso5Ano,
          tramoIngreso5AnoMediana: `$${(ingreso5Ano * 0.92 / 1000000).toFixed(1)}M a $${(ingreso5Ano * 1.12 / 1000000).toFixed(1)}M`,
          ingresoP10,
          ingresoP25,
          ingresoP75,
          ingresoP90,
          brechaSalarialNacional: dDef.salaryGapDescription,
          principalesSectoresContratacion: dDef.keyHiringSectors,
          duracionFormalSemestres: dDef.durationFormalSemestres,
          duracionRealSemestres: Math.round((dDef.durationFormalSemestres + dDef.sobreduracionPromedio) * 10) / 10,
          sobreduracionSemestres: dDef.sobreduracionPromedio,
          retencion1a2Ano: dDef.retencion1a2AnoBase,
          titulacionOportuna: dDef.titulacionOportunaBase,
          jornada: 'Diurna',
          sedeCampus: `${campusInfo.campusName} (${campusInfo.address}, ${campusInfo.commune})`,
          gradoYTitulo: dDef.degreeTitle,
          ratioEstudiantesDocenteJCE: uData.cnaYears >= 6 ? '14:1' : '19:1',
          porcentajeDocentesPostgrado: uData.cnaYears >= 6 ? 94.5 : uData.cnaYears >= 5 ? 86.0 : 74.0,
          acreditacionAnos: uData.cnaYears,
          acreditacionNivel: uData.cnaLevel,
          areasAcreditadas: ['Gestión Institucional', 'Docencia Pregrado', 'Investigación', 'Vinculación con el Medio'],
          tipoInstitucion: uData.type,
          totalMatriculadosInstitucion: 24000,
          arancelAnualCLP,
          arancelReferenciaCLP,
          copagoAnualEstimadoCLP,
          matriculaAnualCLP,
          adscritoGratuidad: uData.hasGratuity,
          accesoFondoSolidarioYCAE: uData.hasGratuity ? 'Gratuidad, FSCU, Crédito CAE, Becas Mineduc' : 'Crédito CAE, Becas de Arancel Institucional',
        },
        badge,
      };

      allCareers.push(career);
    });
  });

  return allCareers;
}

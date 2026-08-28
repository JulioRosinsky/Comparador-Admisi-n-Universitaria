export interface UniversityOfferingSpec {
  univKey: string;
  demrePrefix: string;
  cutoffOffset: number; // Offset relative to elite baseline (0 = PUC/UCH, -15 = USACH/UDEC/USM, etc.)
  salaryMultiplier: number;
  tuitionMultiplier: number;
  primaryCampusKey: string;
  disciplines: string[]; // List of discipline keys from CAREER_DISCIPLINE_DEFINITIONS
}

export const UNIVERSITY_OFFERINGS_MAP: UniversityOfferingSpec[] = [
  // 1. PUC (26 carreras)
  {
    univKey: 'PUC',
    demrePrefix: '12',
    cutoffOffset: 0,
    salaryMultiplier: 1.08,
    tuitionMultiplier: 1.05,
    primaryCampusKey: 'sanJoaquin',
    disciplines: [
      'medicina', 'odontologia', 'enfermeria', 'kinesiologia', 'obstetricia', 'fonoaudiologia', 'nutricion', 'quimicaFarmacia', 'bioquimica', 'medicinaVeterinaria',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilMecanica', 'ingCivilObrasCiviles', 'ingCivilQuimica', 'ingCivilMinas', 'ingConstruccion',
      'derecho', 'psicologia', 'sociologia', 'trabajoSocial', 'cienciaPolitica',
      'ingComercial', 'astronomia', 'geologia', 'agronomia', 'pedBasica', 'pedParvularia', 'pedMatematica', 'pedIngles', 'pedEdFisica', 'arquitectura', 'diseno', 'teatro', 'periodismo', 'publicidad', 'licHistoria'
    ],
  },

  // 2. UCH (26 carreras)
  {
    univKey: 'UCH',
    demrePrefix: '11',
    cutoffOffset: -2,
    salaryMultiplier: 1.06,
    tuitionMultiplier: 1.0,
    primaryCampusKey: 'beauchef',
    disciplines: [
      'medicina', 'odontologia', 'enfermeria', 'kinesiologia', 'obstetricia', 'tecnologiaMedica', 'terapiaOcupacional', 'nutricion', 'quimicaFarmacia', 'bioquimica', 'medicinaVeterinaria',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilMecanica', 'ingCivilObrasCiviles', 'ingCivilQuimica', 'ingCivilMinas',
      'derecho', 'psicologia', 'sociologia', 'trabajoSocial', 'cienciaPolitica',
      'ingComercial', 'contadorAuditor', 'ingControlGestion', 'administracionPublica', 'geologia', 'astronomia', 'agronomia', 'pedBasica', 'pedMatematica', 'pedIngles', 'pedEdFisica', 'arquitectura', 'diseno', 'cine', 'teatro', 'periodismo', 'licHistoria'
    ],
  },

  // 3. UDEC (25 carreras)
  {
    univKey: 'UDEC',
    demrePrefix: '21',
    cutoffOffset: -18,
    salaryMultiplier: 0.98,
    tuitionMultiplier: 0.88,
    primaryCampusKey: 'concepcion',
    disciplines: [
      'medicina', 'odontologia', 'enfermeria', 'kinesiologia', 'obstetricia', 'tecnologiaMedica', 'nutricion', 'quimicaFarmacia', 'bioquimica', 'medicinaVeterinaria',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilMecanica', 'ingCivilObrasCiviles', 'ingCivilQuimica', 'ingCivilMinas',
      'derecho', 'psicologia', 'sociologia', 'trabajoSocial', 'cienciaPolitica',
      'ingComercial', 'contadorAuditor', 'administracionPublica', 'geologia', 'astronomia', 'biologiaMarina', 'agronomia', 'pedBasica', 'pedParvularia', 'pedMatematica', 'pedIngles', 'pedEdFisica', 'arquitectura', 'diseno', 'periodismo', 'licHistoria'
    ],
  },

  // 4. USACH (24 carreras)
  {
    univKey: 'USACH',
    demrePrefix: '16',
    cutoffOffset: -15,
    salaryMultiplier: 1.02,
    tuitionMultiplier: 0.92,
    primaryCampusKey: 'campusUnico',
    disciplines: [
      'medicina', 'enfermeria', 'kinesiologia', 'obstetricia', 'quimicaFarmacia', 'bioquimica',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilMecanica', 'ingCivilObrasCiviles', 'ingCivilQuimica', 'ingCivilMinas', 'ingConstruccion',
      'derecho', 'psicologia', 'sociologia', 'administracionPublica', 'cienciaPolitica',
      'ingComercial', 'contadorAuditor', 'ingControlGestion', 'astronomia', 'pedBasica', 'pedMatematica', 'pedIngles', 'pedEdFisica', 'arquitectura', 'diseno', 'periodismo', 'licHistoria'
    ],
  },

  // 5. UAI (18 carreras)
  {
    univKey: 'UAI',
    demrePrefix: '38',
    cutoffOffset: -12,
    salaryMultiplier: 1.05,
    tuitionMultiplier: 1.10,
    primaryCampusKey: 'penalolen',
    disciplines: [
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilMecanica', 'ingCivilMinas',
      'derecho', 'psicologia', 'sociologia', 'cienciaPolitica',
      'ingComercial', 'contadorAuditor', 'ingControlGestion',
      'pedBasica', 'pedIngles', 'diseno', 'periodismo', 'publicidad', 'licHistoria'
    ],
  },

  // 6. PUCV (24 carreras)
  {
    univKey: 'PUCV',
    demrePrefix: '24',
    cutoffOffset: -20,
    salaryMultiplier: 0.97,
    tuitionMultiplier: 0.90,
    primaryCampusKey: 'casaCentral',
    disciplines: [
      'kinesiologia', 'tecnologiaMedica', 'bioquimica',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilMecanica', 'ingCivilObrasCiviles', 'ingCivilQuimica', 'ingConstruccion',
      'derecho', 'psicologia', 'trabajoSocial',
      'ingComercial', 'contadorAuditor', 'administracionPublica', 'geologia', 'astronomia', 'biologiaMarina', 'agronomia', 'pedBasica', 'pedParvularia', 'pedMatematica', 'pedIngles', 'pedEdFisica', 'arquitectura', 'diseno', 'periodismo', 'licHistoria'
    ],
  },

  // 7. USM (22 carreras)
  {
    univKey: 'USM',
    demrePrefix: '15',
    cutoffOffset: -14,
    salaryMultiplier: 1.04,
    tuitionMultiplier: 0.94,
    primaryCampusKey: 'casaCentral',
    disciplines: [
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilMecanica', 'ingCivilObrasCiviles', 'ingCivilQuimica', 'ingCivilMinas', 'ingConstruccion',
      'ingComercial', 'astronomia', 'geologia', 'arquitectura', 'diseno'
    ],
  },

  // 8. UANDES (20 carreras)
  {
    univKey: 'UANDES',
    demrePrefix: '36',
    cutoffOffset: -10,
    salaryMultiplier: 1.06,
    tuitionMultiplier: 1.15,
    primaryCampusKey: 'sanCarlos',
    disciplines: [
      'medicina', 'odontologia', 'enfermeria', 'kinesiologia', 'obstetricia', 'nutricion',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilObrasCiviles',
      'derecho', 'psicologia',
      'ingComercial', 'administracionPublica',
      'pedBasica', 'pedParvularia', 'pedIngles', 'periodismo', 'publicidad', 'licHistoria'
    ],
  },

  // 9. UDP (20 carreras)
  {
    univKey: 'UDP',
    demrePrefix: '33',
    cutoffOffset: -22,
    salaryMultiplier: 0.98,
    tuitionMultiplier: 0.98,
    primaryCampusKey: 'ejercito',
    disciplines: [
      'medicina', 'odontologia', 'enfermeria', 'kinesiologia', 'obstetricia', 'tecnologiaMedica',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilObrasCiviles',
      'derecho', 'psicologia', 'sociologia', 'cienciaPolitica',
      'ingComercial', 'contadorAuditor', 'ingControlGestion',
      'pedBasica', 'pedParvularia', 'pedIngles', 'arquitectura', 'diseno', 'cine', 'periodismo', 'publicidad', 'licHistoria'
    ],
  },

  // 10. UVALPO (UV) (24 carreras)
  {
    univKey: 'UVALPO',
    demrePrefix: '22',
    cutoffOffset: -28,
    salaryMultiplier: 0.95,
    tuitionMultiplier: 0.88,
    primaryCampusKey: 'granBretana',
    disciplines: [
      'medicina', 'odontologia', 'enfermeria', 'kinesiologia', 'obstetricia', 'tecnologiaMedica', 'terapiaOcupacional', 'nutricion', 'quimicaFarmacia', 'bioquimica',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilObrasCiviles', 'ingConstruccion',
      'derecho', 'psicologia', 'sociologia', 'trabajoSocial',
      'ingComercial', 'contadorAuditor', 'administracionPublica', 'biologiaMarina', 'pedBasica', 'pedMatematica', 'pedIngles', 'pedEdFisica', 'arquitectura', 'diseno', 'cine', 'teatro', 'periodismo'
    ],
  },

  // 11. UACH (24 carreras)
  {
    univKey: 'UACH',
    demrePrefix: '27',
    cutoffOffset: -30,
    salaryMultiplier: 0.94,
    tuitionMultiplier: 0.86,
    primaryCampusKey: 'islaTeja',
    disciplines: [
      'medicina', 'odontologia', 'enfermeria', 'kinesiologia', 'obstetricia', 'terapiaOcupacional', 'bioquimica', 'medicinaVeterinaria',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilMecanica', 'ingCivilObrasCiviles', 'ingConstruccion',
      'derecho', 'psicologia', 'trabajoSocial',
      'ingComercial', 'contadorAuditor', 'administracionPublica', 'geologia', 'biologiaMarina', 'agronomia', 'pedBasica', 'pedParvularia', 'pedMatematica', 'pedIngles', 'pedEdFisica', 'arquitectura', 'artesVisuales', 'periodismo'
    ],
  },

  // 12. UFRO (24 carreras)
  {
    univKey: 'UFRO',
    demrePrefix: '28',
    cutoffOffset: -32,
    salaryMultiplier: 0.93,
    tuitionMultiplier: 0.85,
    primaryCampusKey: 'andresBello',
    disciplines: [
      'medicina', 'odontologia', 'enfermeria', 'kinesiologia', 'obstetricia', 'tecnologiaMedica', 'terapiaOcupacional', 'nutricion', 'quimicaFarmacia', 'bioquimica',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilMecanica', 'ingCivilObrasCiviles', 'ingCivilQuimica', 'ingConstruccion',
      'derecho', 'psicologia', 'sociologia', 'trabajoSocial',
      'ingComercial', 'contadorAuditor', 'agronomia', 'pedBasica', 'pedMatematica', 'pedIngles', 'pedEdFisica', 'periodismo'
    ],
  },

  // 13. UTALCA (24 carreras)
  {
    univKey: 'UTALCA',
    demrePrefix: '25',
    cutoffOffset: -30,
    salaryMultiplier: 0.94,
    tuitionMultiplier: 0.86,
    primaryCampusKey: 'licoqui',
    disciplines: [
      'medicina', 'odontologia', 'enfermeria', 'kinesiologia', 'obstetricia', 'tecnologiaMedica', 'terapiaOcupacional', 'nutricion', 'bioquimica',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilMecanica', 'ingCivilObrasCiviles', 'ingCivilMinas', 'ingConstruccion',
      'derecho', 'psicologia', 'trabajoSocial', 'cienciaPolitica',
      'ingComercial', 'contadorAuditor', 'administracionPublica', 'agronomia', 'pedBasica', 'pedParvularia', 'pedMatematica', 'pedIngles', 'arquitectura', 'diseno', 'periodismo'
    ],
  },

  // 14. UCN (22 carreras)
  {
    univKey: 'UCN',
    demrePrefix: '23',
    cutoffOffset: -35,
    salaryMultiplier: 0.96,
    tuitionMultiplier: 0.88,
    primaryCampusKey: 'antofagasta',
    disciplines: [
      'medicina', 'enfermeria', 'kinesiologia', 'nutricion', 'quimicaFarmacia',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilMecanica', 'ingCivilObrasCiviles', 'ingCivilQuimica', 'ingCivilMinas', 'ingConstruccion',
      'derecho', 'psicologia',
      'ingComercial', 'contadorAuditor', 'ingControlGestion', 'geologia', 'biologiaMarina', 'pedBasica', 'pedIngles', 'pedMatematica', 'arquitectura', 'periodismo'
    ],
  },

  // 15. UNAB (28 carreras)
  {
    univKey: 'UNAB',
    demrePrefix: '34',
    cutoffOffset: -38,
    salaryMultiplier: 0.95,
    tuitionMultiplier: 0.95,
    primaryCampusKey: 'casona',
    disciplines: [
      'medicina', 'odontologia', 'enfermeria', 'kinesiologia', 'obstetricia', 'tecnologiaMedica', 'terapiaOcupacional', 'nutricion', 'quimicaFarmacia', 'bioquimica', 'medicinaVeterinaria',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilMecanica', 'ingCivilObrasCiviles', 'ingCivilMinas', 'ingConstruccion',
      'derecho', 'psicologia', 'sociologia', 'trabajoSocial',
      'ingComercial', 'contadorAuditor', 'administracionPublica', 'geologia', 'astronomia', 'biologiaMarina', 'agronomia', 'pedBasica', 'pedParvularia', 'pedIngles', 'pedEdFisica', 'arquitectura', 'diseno', 'periodismo', 'publicidad'
    ],
  },

  // 16. UDD (20 carreras)
  {
    univKey: 'UDD',
    demrePrefix: '37',
    cutoffOffset: -20,
    salaryMultiplier: 1.02,
    tuitionMultiplier: 1.08,
    primaryCampusKey: 'lasCondes',
    disciplines: [
      'medicina', 'odontologia', 'enfermeria', 'kinesiologia', 'obstetricia', 'nutricion',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilObrasCiviles', 'ingCivilMinas',
      'derecho', 'psicologia', 'cienciaPolitica',
      'ingComercial', 'contadorAuditor', 'pedBasica', 'pedParvularia', 'pedIngles', 'arquitectura', 'diseno', 'cine', 'periodismo', 'publicidad'
    ],
  },

  // 17. UTEM (18 carreras)
  {
    univKey: 'UTEM',
    demrePrefix: '19',
    cutoffOffset: -45,
    salaryMultiplier: 0.92,
    tuitionMultiplier: 0.82,
    primaryCampusKey: 'macul',
    disciplines: [
      'enfermeria', 'kinesiologia',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilMecanica', 'ingCivilObrasCiviles', 'ingCivilQuimica', 'ingConstruccion',
      'derecho', 'trabajoSocial', 'administracionPublica',
      'ingComercial', 'contadorAuditor', 'ingControlGestion', 'arquitectura', 'diseno'
    ],
  },

  // 18. UBB (20 carreras)
  {
    univKey: 'UBB',
    demrePrefix: '26',
    cutoffOffset: -42,
    salaryMultiplier: 0.91,
    tuitionMultiplier: 0.82,
    primaryCampusKey: 'concepcion',
    disciplines: [
      'enfermeria', 'kinesiologia', 'nutricion',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilMecanica', 'ingCivilObrasCiviles', 'ingCivilQuimica', 'ingConstruccion',
      'trabajoSocial', 'administracionPublica',
      'ingComercial', 'contadorAuditor', 'pedBasica', 'pedParvularia', 'pedMatematica', 'pedIngles', 'pedEdFisica', 'arquitectura', 'diseno'
    ],
  },

  // 19. ULS (18 carreras)
  {
    univKey: 'ULS',
    demrePrefix: '17',
    cutoffOffset: -42,
    salaryMultiplier: 0.91,
    tuitionMultiplier: 0.82,
    primaryCampusKey: 'isabelBongard',
    disciplines: [
      'odontologia', 'enfermeria', 'kinesiologia',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilMecanica', 'ingCivilObrasCiviles', 'ingCivilMinas', 'ingConstruccion',
      'derecho', 'psicologia', 'trabajoSocial',
      'ingComercial', 'contadorAuditor', 'astronomia', 'pedBasica', 'pedParvularia', 'pedMatematica', 'pedIngles', 'pedEdFisica', 'arquitectura', 'periodismo'
    ],
  },

  // 20. UTA (18 carreras)
  {
    univKey: 'UTA',
    demrePrefix: '13',
    cutoffOffset: -45,
    salaryMultiplier: 0.91,
    tuitionMultiplier: 0.82,
    primaryCampusKey: 'saucache',
    disciplines: [
      'medicina', 'odontologia', 'enfermeria', 'kinesiologia', 'obstetricia', 'tecnologiaMedica', 'nutricion',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilMecanica', 'ingCivilObrasCiviles',
      'derecho', 'psicologia', 'trabajoSocial', 'antropologia',
      'ingComercial', 'contadorAuditor', 'pedBasica', 'pedParvularia', 'pedMatematica', 'pedIngles', 'pedEdFisica'
    ],
  },

  // 21. UATACAMA (16 carreras)
  {
    univKey: 'UATACAMA',
    demrePrefix: '14',
    cutoffOffset: -48,
    salaryMultiplier: 0.92,
    tuitionMultiplier: 0.82,
    primaryCampusKey: 'copayapu',
    disciplines: [
      'medicina', 'enfermeria', 'kinesiologia', 'obstetricia', 'nutricion',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilMecanica', 'ingCivilMinas', 'ingConstruccion',
      'derecho', 'psicologia', 'trabajoSocial',
      'ingComercial', 'contadorAuditor', 'geologia', 'pedBasica', 'pedEdFisica'
    ],
  },

  // 22. UAP (UNAP) (16 carreras)
  {
    univKey: 'UAP',
    demrePrefix: '18',
    cutoffOffset: -50,
    salaryMultiplier: 0.90,
    tuitionMultiplier: 0.80,
    primaryCampusKey: 'iquique',
    disciplines: [
      'odontologia', 'enfermeria', 'kinesiologia', 'obstetricia', 'quimicaFarmacia',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilObrasCiviles', 'ingCivilMinas',
      'derecho', 'psicologia', 'trabajoSocial',
      'ingComercial', 'contadorAuditor', 'biologiaMarina', 'pedBasica', 'pedIngles', 'arquitectura'
    ],
  },

  // 23. UANTOF (UA) (18 carreras)
  {
    univKey: 'UANTOF',
    demrePrefix: '20',
    cutoffOffset: -44,
    salaryMultiplier: 0.93,
    tuitionMultiplier: 0.84,
    primaryCampusKey: 'coloso',
    disciplines: [
      'medicina', 'odontologia', 'enfermeria', 'kinesiologia', 'obstetricia', 'tecnologiaMedica', 'terapiaOcupacional', 'nutricion', 'bioquimica',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilMecanica', 'ingCivilQuimica', 'ingCivilMinas',
      'derecho', 'psicologia', 'trabajoSocial',
      'ingComercial', 'contadorAuditor', 'geologia', 'biologiaMarina', 'pedBasica', 'pedMatematica', 'pedEdFisica', 'artesVisuales', 'periodismo'
    ],
  },

  // 24. UMCE (16 carreras)
  {
    univKey: 'UMCE',
    demrePrefix: '31',
    cutoffOffset: -38,
    salaryMultiplier: 0.91,
    tuitionMultiplier: 0.80,
    primaryCampusKey: 'macul',
    disciplines: [
      'kinesiologia', 'terapiaOcupacional',
      'pedBasica', 'pedParvularia', 'pedDiferencial', 'pedMatematica', 'pedIngles', 'pedEdFisica',
      'licHistoria', 'licLiteratura', 'artesVisuales', 'musica', 'teatro'
    ],
  },

  // 25. UPLA (16 carreras)
  {
    univKey: 'UPLA',
    demrePrefix: '32',
    cutoffOffset: -48,
    salaryMultiplier: 0.89,
    tuitionMultiplier: 0.80,
    primaryCampusKey: 'playaAncha',
    disciplines: [
      'enfermeria', 'kinesiologia', 'terapiaOcupacional', 'nutricion', 'fonoaudiologia',
      'ingCivilInformatica', 'ingCivilAmbiental',
      'derecho', 'psicologia', 'sociologia', 'trabajoSocial', 'administracionPublica',
      'pedBasica', 'pedParvularia', 'pedDiferencial', 'pedMatematica', 'pedIngles', 'pedEdFisica', 'diseno', 'artesVisuales', 'teatro', 'periodismo'
    ],
  },

  // 26. UMAG (16 carreras)
  {
    univKey: 'UMAG',
    demrePrefix: '29',
    cutoffOffset: -48,
    salaryMultiplier: 0.92,
    tuitionMultiplier: 0.82,
    primaryCampusKey: 'puntaArenas',
    disciplines: [
      'medicina', 'enfermeria', 'kinesiologia', 'terapiaOcupacional', 'nutricion',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilMecanica', 'ingCivilQuimica', 'ingConstruccion',
      'derecho', 'psicologia', 'trabajoSocial',
      'ingComercial', 'contadorAuditor', 'biologiaMarina', 'agronomia', 'pedBasica', 'pedParvularia', 'pedIngles', 'pedEdFisica', 'arquitectura'
    ],
  },

  // 27. ULAGOS (16 carreras)
  {
    univKey: 'ULAGOS',
    demrePrefix: '30',
    cutoffOffset: -50,
    salaryMultiplier: 0.89,
    tuitionMultiplier: 0.80,
    primaryCampusKey: 'osorno',
    disciplines: [
      'enfermeria', 'kinesiologia', 'nutricion', 'obstetricia',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingConstruccion',
      'derecho', 'psicologia', 'trabajoSocial', 'administracionPublica',
      'ingComercial', 'contadorAuditor', 'biologiaMarina', 'agronomia', 'pedBasica', 'pedParvularia', 'pedDiferencial', 'pedMatematica', 'pedIngles', 'pedEdFisica', 'arquitectura'
    ],
  },

  // 28. UAYSEN (10 carreras)
  {
    univKey: 'UAYSEN',
    demrePrefix: '48',
    cutoffOffset: -46,
    salaryMultiplier: 0.90,
    tuitionMultiplier: 0.80,
    primaryCampusKey: 'coyhaique',
    disciplines: [
      'enfermeria', 'obstetricia', 'kinesiologia',
      'ingCivilIndustrial', 'ingCivilInformatica',
      'trabajoSocial', 'administracionPublica', 'ingComercial',
      'agronomia', 'pedBasica', 'pedDiferencial'
    ],
  },

  // 29. UOH (16 carreras)
  {
    univKey: 'UOH',
    demrePrefix: '47',
    cutoffOffset: -36,
    salaryMultiplier: 0.93,
    tuitionMultiplier: 0.84,
    primaryCampusKey: 'rancagua',
    disciplines: [
      'medicina', 'enfermeria', 'kinesiologia', 'terapiaOcupacional', 'nutricion', 'medicinaVeterinaria',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilMecanica',
      'derecho', 'psicologia', 'administracionPublica',
      'ingComercial', 'contadorAuditor', 'geologia', 'agronomia', 'pedBasica', 'pedParvularia', 'pedMatematica', 'pedIngles'
    ],
  },

  // 30. UCSC (18 carreras)
  {
    univKey: 'UCSC',
    demrePrefix: '35',
    cutoffOffset: -40,
    salaryMultiplier: 0.91,
    tuitionMultiplier: 0.84,
    primaryCampusKey: 'sanAndres',
    disciplines: [
      'medicina', 'enfermeria', 'kinesiologia', 'nutricion', 'quimicaFarmacia', 'bioquimica',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilObrasCiviles', 'ingConstruccion',
      'derecho', 'psicologia', 'trabajoSocial',
      'ingComercial', 'contadorAuditor', 'biologiaMarina', 'pedBasica', 'pedParvularia', 'pedDiferencial', 'pedMatematica', 'pedIngles', 'pedEdFisica', 'periodismo'
    ],
  },

  // 31. UCT (18 carreras)
  {
    univKey: 'UCT',
    demrePrefix: '39',
    cutoffOffset: -44,
    salaryMultiplier: 0.90,
    tuitionMultiplier: 0.82,
    primaryCampusKey: 'sanJuanPablo',
    disciplines: [
      'medicinaVeterinaria', 'enfermeria', 'kinesiologia', 'terapiaOcupacional', 'nutricion', 'fonoaudiologia',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilObrasCiviles', 'ingConstruccion',
      'derecho', 'psicologia', 'sociologia', 'trabajoSocial', 'antropologia',
      'ingComercial', 'contadorAuditor', 'administracionPublica', 'geologia', 'agronomia', 'pedBasica', 'pedParvularia', 'pedDiferencial', 'pedIngles', 'pedEdFisica', 'arquitectura', 'diseno', 'artesVisuales'
    ],
  },

  // 32. UAUTONOMA (22 carreras)
  {
    univKey: 'UAUTONOMA',
    demrePrefix: '40',
    cutoffOffset: -42,
    salaryMultiplier: 0.93,
    tuitionMultiplier: 0.90,
    primaryCampusKey: 'providencia',
    disciplines: [
      'medicina', 'odontologia', 'enfermeria', 'kinesiologia', 'obstetricia', 'terapiaOcupacional', 'nutricion', 'quimicaFarmacia',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilObrasCiviles', 'ingConstruccion',
      'derecho', 'psicologia', 'trabajoSocial', 'administracionPublica',
      'ingComercial', 'contadorAuditor', 'ingControlGestion', 'pedBasica', 'pedParvularia', 'pedDiferencial', 'pedIngles', 'pedEdFisica', 'arquitectura', 'publicidad'
    ],
  },

  // 33. UFINIS (18 carreras)
  {
    univKey: 'UFINIS',
    demrePrefix: '41',
    cutoffOffset: -38,
    salaryMultiplier: 0.94,
    tuitionMultiplier: 0.96,
    primaryCampusKey: 'pedroValdivia',
    disciplines: [
      'medicina', 'odontologia', 'enfermeria', 'kinesiologia', 'nutricion',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica',
      'derecho', 'psicologia',
      'ingComercial', 'contadorAuditor', 'pedBasica', 'pedParvularia', 'pedIngles', 'arquitectura', 'diseno', 'artesVisuales', 'teatro', 'periodismo', 'publicidad', 'licHistoria'
    ],
  },

  // 34. UMAYOR (22 carreras)
  {
    univKey: 'UMAYOR',
    demrePrefix: '42',
    cutoffOffset: -38,
    salaryMultiplier: 0.94,
    tuitionMultiplier: 0.98,
    primaryCampusKey: 'huechuraba',
    disciplines: [
      'medicina', 'odontologia', 'enfermeria', 'kinesiologia', 'obstetricia', 'tecnologiaMedica', 'terapiaOcupacional', 'nutricion', 'medicinaVeterinaria',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilElectrica', 'ingCivilObrasCiviles', 'ingConstruccion',
      'derecho', 'psicologia', 'sociologia',
      'ingComercial', 'contadorAuditor', 'administracionPublica', 'agronomia', 'geologia', 'pedBasica', 'pedParvularia', 'pedDiferencial', 'pedIngles', 'pedEdFisica', 'arquitectura', 'diseno', 'cine', 'teatro', 'periodismo', 'publicidad'
    ],
  },

  // 35. USS (24 carreras)
  {
    univKey: 'USS',
    demrePrefix: '43',
    cutoffOffset: -38,
    salaryMultiplier: 0.93,
    tuitionMultiplier: 0.95,
    primaryCampusKey: 'bellavista',
    disciplines: [
      'medicina', 'odontologia', 'enfermeria', 'kinesiologia', 'obstetricia', 'tecnologiaMedica', 'terapiaOcupacional', 'nutricion', 'quimicaFarmacia', 'bioquimica', 'medicinaVeterinaria',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingCivilMecanica', 'ingCivilObrasCiviles', 'ingCivilMinas', 'ingConstruccion',
      'derecho', 'psicologia', 'trabajoSocial', 'administracionPublica',
      'ingComercial', 'contadorAuditor', 'ingControlGestion', 'pedBasica', 'pedParvularia', 'pedDiferencial', 'pedMatematica', 'pedIngles', 'pedEdFisica', 'arquitectura', 'diseno', 'periodismo', 'publicidad'
    ],
  },

  // 36. UST (20 carreras)
  {
    univKey: 'UST',
    demrePrefix: '44',
    cutoffOffset: -52,
    salaryMultiplier: 0.89,
    tuitionMultiplier: 0.86,
    primaryCampusKey: 'ejercito',
    disciplines: [
      'medicinaVeterinaria', 'enfermeria', 'kinesiologia', 'terapiaOcupacional', 'nutricion', 'fonoaudiologia',
      'ingCivilIndustrial', 'ingCivilInformatica', 'ingConstruccion',
      'derecho', 'psicologia', 'trabajoSocial',
      'ingComercial', 'contadorAuditor', 'administracionPublica', 'pedBasica', 'pedParvularia', 'pedDiferencial', 'pedIngles', 'pedEdFisica', 'diseno', 'periodismo'
    ],
  },

  // 37. UDLA (18 carreras)
  {
    univKey: 'UDLA',
    demrePrefix: '45',
    cutoffOffset: -58,
    salaryMultiplier: 0.87,
    tuitionMultiplier: 0.82,
    primaryCampusKey: 'providencia',
    disciplines: [
      'medicinaVeterinaria', 'enfermeria', 'kinesiologia', 'terapiaOcupacional', 'nutricion', 'fonoaudiologia',
      'ingCivilIndustrial', 'ingCivilInformatica', 'ingConstruccion',
      'derecho', 'psicologia', 'trabajoSocial',
      'ingComercial', 'contadorAuditor', 'administracionPublica', 'pedBasica', 'pedParvularia', 'pedDiferencial', 'pedIngles', 'pedEdFisica', 'arquitectura', 'diseno', 'publicidad'
    ],
  },

  // 38. UGM (10 carreras)
  {
    univKey: 'UGM',
    demrePrefix: '49',
    cutoffOffset: -60,
    salaryMultiplier: 0.88,
    tuitionMultiplier: 0.88,
    primaryCampusKey: 'providencia',
    disciplines: [
      'derecho', 'psicologia', 'trabajoSocial',
      'ingCivilIndustrial', 'ingCivilInformatica',
      'ingComercial', 'contadorAuditor', 'administracionPublica',
      'pedBasica', 'pedParvularia', 'diseno', 'periodismo', 'publicidad', 'licHistoria'
    ],
  },

  // 39. UAHC (12 carreras)
  {
    univKey: 'UAHC',
    demrePrefix: '51',
    cutoffOffset: -55,
    salaryMultiplier: 0.88,
    tuitionMultiplier: 0.82,
    primaryCampusKey: 'condell',
    disciplines: [
      'derecho', 'psicologia', 'sociologia', 'trabajoSocial', 'antropologia', 'administracionPublica',
      'ingComercial', 'pedBasica', 'pedDiferencial', 'pedHistoria', 'artesVisuales', 'teatro', 'cine', 'periodismo'
    ],
  },

  // 40. UCSH (14 carreras)
  {
    univKey: 'UCSH',
    demrePrefix: '52',
    cutoffOffset: -52,
    salaryMultiplier: 0.88,
    tuitionMultiplier: 0.82,
    primaryCampusKey: 'casaCentral',
    disciplines: [
      'enfermeria', 'kinesiologia', 'nutricion', 'fonoaudiologia',
      'derecho', 'psicologia', 'trabajoSocial', 'administracionPublica',
      'ingComercial', 'contadorAuditor',
      'pedBasica', 'pedParvularia', 'pedDiferencial', 'pedMatematica', 'pedIngles', 'pedEdFisica', 'licHistoria'
    ],
  },

  // 41. UNACH (12 carreras)
  {
    univKey: 'UNACH',
    demrePrefix: '53',
    cutoffOffset: -58,
    salaryMultiplier: 0.87,
    tuitionMultiplier: 0.82,
    primaryCampusKey: 'campusCentral',
    disciplines: [
      'enfermeria', 'kinesiologia', 'nutricion', 'obstetricia',
      'ingCivilInformatica', 'ingCivilIndustrial',
      'derecho', 'psicologia', 'trabajoSocial',
      'ingComercial', 'contadorAuditor',
      'pedBasica', 'pedParvularia', 'pedIngles', 'pedEdFisica'
    ],
  },

  // 42. UVM (16 carreras)
  {
    univKey: 'UVM',
    demrePrefix: '46',
    cutoffOffset: -52,
    salaryMultiplier: 0.89,
    tuitionMultiplier: 0.86,
    primaryCampusKey: 'rodelillo',
    disciplines: [
      'medicinaVeterinaria', 'odontologia', 'enfermeria', 'kinesiologia', 'terapiaOcupacional', 'nutricion', 'fonoaudiologia',
      'planComunIngCivil', 'ingCivilIndustrial', 'ingCivilInformatica', 'ingConstruccion',
      'derecho', 'psicologia', 'trabajoSocial', 'administracionPublica',
      'ingComercial', 'contadorAuditor', 'agronomia', 'pedBasica', 'pedParvularia', 'pedDiferencial', 'pedIngles', 'pedEdFisica', 'arquitectura', 'diseno', 'cine', 'periodismo'
    ],
  },

  // 43. UMC (8 carreras)
  {
    univKey: 'UMC',
    demrePrefix: '54',
    cutoffOffset: -65,
    salaryMultiplier: 0.85,
    tuitionMultiplier: 0.78,
    primaryCampusKey: 'santiago',
    disciplines: [
      'derecho', 'psicologia', 'trabajoSocial',
      'ingCivilIndustrial', 'ingCivilInformatica',
      'ingComercial', 'contadorAuditor', 'administracionPublica', 'pedBasica', 'pedParvularia'
    ],
  },

  // 44. UAC (8 carreras)
  {
    univKey: 'UAC',
    demrePrefix: '55',
    cutoffOffset: -65,
    salaryMultiplier: 0.85,
    tuitionMultiplier: 0.78,
    primaryCampusKey: 'sanFelipe',
    disciplines: [
      'enfermeria', 'kinesiologia', 'derecho', 'psicologia', 'trabajoSocial',
      'ingCivilIndustrial', 'ingComercial', 'contadorAuditor', 'pedBasica'
    ],
  },

  // 45. USEK (10 carreras)
  {
    univKey: 'USEK',
    demrePrefix: '56',
    cutoffOffset: -65,
    salaryMultiplier: 0.86,
    tuitionMultiplier: 0.80,
    primaryCampusKey: 'santaIsabel',
    disciplines: [
      'derecho', 'psicologia', 'trabajoSocial',
      'ingCivilIndustrial', 'ingCivilInformatica',
      'ingComercial', 'contadorAuditor', 'pedBasica', 'pedIngles', 'pedEdFisica', 'periodismo'
    ],
  },

  // 46. UDALBA (10 carreras)
  {
    univKey: 'UDALBA',
    demrePrefix: '57',
    cutoffOffset: -62,
    salaryMultiplier: 0.86,
    tuitionMultiplier: 0.82,
    primaryCampusKey: 'santiago',
    disciplines: [
      'medicina', 'medicinaVeterinaria', 'odontologia', 'enfermeria', 'kinesiologia', 'nutricion',
      'derecho', 'psicologia', 'ingCivilIndustrial', 'ingComercial'
    ],
  },

  // 47. ULAREP (8 carreras)
  {
    univKey: 'ULAREP',
    demrePrefix: '58',
    cutoffOffset: -70,
    salaryMultiplier: 0.83,
    tuitionMultiplier: 0.75,
    primaryCampusKey: 'santiago',
    disciplines: [
      'enfermeria', 'kinesiologia', 'derecho', 'psicologia', 'trabajoSocial',
      'ingCivilIndustrial', 'ingComercial', 'contadorAuditor'
    ],
  },

  // 48. ULL (6 carreras)
  {
    univKey: 'ULL',
    demrePrefix: '59',
    cutoffOffset: -75,
    salaryMultiplier: 0.82,
    tuitionMultiplier: 0.70,
    primaryCampusKey: 'providencia',
    disciplines: [
      'derecho', 'psicologia', 'trabajoSocial', 'ingCivilIndustrial', 'ingComercial', 'contadorAuditor'
    ],
  },

  // 49. INACAP (12 carreras profesionales)
  {
    univKey: 'INACAP',
    demrePrefix: '60',
    cutoffOffset: -55,
    salaryMultiplier: 0.90,
    tuitionMultiplier: 0.76,
    primaryCampusKey: 'santiagoSur',
    disciplines: [
      'ingCivilInformatica', 'ingCivilIndustrial', 'ingConstruccion',
      'contadorAuditor', 'ingControlGestion', 'administracionPublica', 'ingComercial',
      'diseno', 'agronomia'
    ],
  },

  // 50. DUOC (14 carreras profesionales)
  {
    univKey: 'DUOC',
    demrePrefix: '61',
    cutoffOffset: -50,
    salaryMultiplier: 0.92,
    tuitionMultiplier: 0.82,
    primaryCampusKey: 'sanCarlosApoquindo',
    disciplines: [
      'ingCivilInformatica', 'ingConstruccion',
      'contadorAuditor', 'ingControlGestion', 'ingComercial', 'administracionPublica',
      'diseno', 'publicidad', 'cine', 'agronomia'
    ],
  },
];

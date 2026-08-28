import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { ACADEMIC_OFFER } from './src/data/academicOffer';
import { UNIVERSITIES_DATA } from './src/data/universityMetadata';
import { calculateStochasticAdmission } from './src/utils/stochasticModel';
import { convertNemToScore } from './src/data/nemConversion';
import { PaesScores, Career, SavedSimulation } from './src/types/paes';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory / persistent simulation storage store
let serverSavedSimulations: SavedSimulation[] = [
  {
    id: 'sim-default-1',
    name: 'Ensayo Diagnóstico Inicial',
    date: '15 de Mayo, 2025',
    scores: {
      nem: 6.2,
      nemScore: 764,
      ranking: 810,
      lectora: 780,
      m1: 820,
      m2: 740,
      ciencias: 760,
      historia: 710,
    },
    selectedCareersCount: 4,
    notes: 'Puntajes de primer ensayo sin preparación intensiva.',
  },
];

// ==========================================
// REST API ENDPOINTS (FastAPI/DRF Architecture)
// ==========================================

// 1. Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Simulador PAES & Portal Universitario API',
    version: '2.0.0',
    totalCareers: ACADEMIC_OFFER.length,
    timestamp: new Date().toISOString(),
  });
});

// 2. Metadata Catalog Summary
app.get('/api/metadata', (_req: Request, res: Response) => {
  const areas = Array.from(new Set(ACADEMIC_OFFER.map((c) => c.area))).sort();
  const universities = Array.from(new Set(ACADEMIC_OFFER.map((c) => c.universityShort))).sort();
  const regions = Array.from(new Set(ACADEMIC_OFFER.map((c) => c.region))).sort();

  res.json({
    totalCareers: ACADEMIC_OFFER.length,
    totalUniversities: Object.keys(UNIVERSITIES_DATA).length,
    areas,
    universities,
    regions,
    dataSources: ['DEMRE 2024/2025', 'MiFuturo.cl SIES', 'CNA-Chile'],
  });
});

// 3. Universities Institutional Directory
app.get('/api/universities', (_req: Request, res: Response) => {
  res.json(UNIVERSITIES_DATA);
});

app.get('/api/universities/:shortName', (req: Request, res: Response) => {
  const shortName = req.params.shortName.toUpperCase();
  const uni = UNIVERSITIES_DATA[shortName];
  if (!uni) {
    return res.status(404).json({ error: 'Universidad no encontrada' });
  }
  return res.json(uni);
});

// 4. Careers Query (with search, filtering, and sorting)
app.get('/api/careers', (req: Request, res: Response) => {
  const {
    search = '',
    area = 'all',
    university = 'all',
    region = 'all',
    gratuityOnly = 'false',
    minCnaYears = '0',
    planComunOnly = 'false',
    limit = '100',
    offset = '0',
  } = req.query;

  let results = [...ACADEMIC_OFFER];

  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.universityName.toLowerCase().includes(q) ||
        c.universityShort.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.code.includes(q) ||
        c.subordinateCareers?.some((s) => s.name.toLowerCase().includes(q))
    );
  }

  if (area !== 'all') {
    results = results.filter((c) => c.area === area);
  }

  if (university !== 'all') {
    results = results.filter((c) => c.universityShort === university);
  }

  if (region !== 'all') {
    results = results.filter((c) => c.region === region);
  }

  if (gratuityOnly === 'true') {
    results = results.filter((c) => c.metrics.adscritoGratuidad);
  }

  const minCna = parseInt(minCnaYears as string, 10);
  if (!isNaN(minCna) && minCna > 0) {
    results = results.filter((c) => c.metrics.acreditacionAnos >= minCna);
  }

  if (planComunOnly === 'true') {
    results = results.filter((c) => c.isPlanComun);
  }

  const total = results.length;
  const numLimit = parseInt(limit as string, 10) || 100;
  const numOffset = parseInt(offset as string, 10) || 0;
  const paginated = results.slice(numOffset, numOffset + numLimit);

  res.json({
    total,
    count: paginated.length,
    offset: numOffset,
    limit: numLimit,
    data: paginated,
  });
});

// 5. Career Details by ID
app.get('/api/careers/:id', (req: Request, res: Response) => {
  const career = ACADEMIC_OFFER.find((c) => c.id === req.params.id);
  if (!career) {
    return res.status(404).json({ error: 'Carrera no encontrada' });
  }
  const uniInfo = UNIVERSITIES_DATA[career.universityShort] || null;
  return res.json({
    ...career,
    institutionalDetails: uniInfo,
  });
});

// 6. Stochastic Simulation Endpoint
app.post('/api/simulate', (req: Request, res: Response) => {
  const { scores, careerId } = req.body as { scores: PaesScores; careerId?: string };

  if (!scores) {
    return res.status(400).json({ error: 'Faltan los puntajes del postulante' });
  }

  if (careerId) {
    const career = ACADEMIC_OFFER.find((c) => c.id === careerId);
    if (!career) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }
    const simulation = calculateStochasticAdmission(scores, career);
    return res.json({
      career,
      simulation,
    });
  }

  // Calculate for all careers
  const results = ACADEMIC_OFFER.map((career) => ({
    careerId: career.id,
    simulation: calculateStochasticAdmission(scores, career),
  }));

  return res.json({
    count: results.length,
    results,
  });
});

// 7. Goal Gap & Study Recommendations Endpoint
app.post('/api/goal-gap', (req: Request, res: Response) => {
  const { currentScores, targetCareerId } = req.body as {
    currentScores: PaesScores;
    targetCareerId: string;
  };

  const career = ACADEMIC_OFFER.find((c) => c.id === targetCareerId);
  if (!career) {
    return res.status(404).json({ error: 'Carrera objetivo no encontrada' });
  }

  const currentSim = calculateStochasticAdmission(currentScores, career);
  const cutoff = career.metrics.corte2024;
  const weightedScore = currentSim.weightedScore;
  const gap = Math.max(0, Math.round((cutoff - weightedScore) * 10) / 10);

  // Recommendations based on weights (weights stored as percentages or decimals)
  const weights = [
    { test: 'Matemática 1 (M1)', weight: career.metrics.ponderacionM1 || Math.round(career.ponderation.m1 * 100), current: currentScores.m1 },
    { test: 'Comp. Lectora', weight: career.metrics.ponderacionLectora || Math.round(career.ponderation.lectora * 100), current: currentScores.lectora },
    { test: 'Matemática 2 (M2)', weight: career.metrics.ponderacionM2 || Math.round((career.ponderation.m2 || 0) * 100), current: currentScores.m2 || 0 },
    { test: 'Ciencias / Historia', weight: career.metrics.ponderacionCienciasHistoria || Math.round(career.ponderation.cienciasHistoria * 100), current: Math.max(currentScores.ciencias || 0, currentScores.historia || 0) },
  ].filter((w) => w.weight > 0);

  weights.sort((a, b) => b.weight - a.weight);

  res.json({
    careerName: career.name,
    university: career.universityShort,
    currentWeightedScore: weightedScore,
    cutoff2024: cutoff,
    pointsGap: gap,
    isAdmitted: weightedScore >= cutoff,
    probability: currentSim.probability,
    category: currentSim.category,
    topPriorityTests: weights.map((w) => ({
      testName: w.test,
      weightPercentage: `${w.weight}%`,
      recommendedPointGain: gap > 0 ? Math.ceil(gap / (w.weight / 100)) : 0,
    })),
  });
});

// 8. Saved Simulations Store
app.get('/api/simulations', (_req: Request, res: Response) => {
  res.json(serverSavedSimulations);
});

app.post('/api/simulations', (req: Request, res: Response) => {
  const { name, scores, notes, selectedCareersCount = 0 } = req.body;
  if (!scores) {
    return res.status(400).json({ error: 'Se requieren puntajes' });
  }
  const newSim: SavedSimulation = {
    id: `sim-${Date.now()}`,
    name: name?.trim() || `Simulación ${new Date().toLocaleDateString('es-CL')}`,
    date: new Date().toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    scores,
    selectedCareersCount,
    notes,
  };
  serverSavedSimulations.unshift(newSim);
  res.status(201).json(newSim);
});

app.delete('/api/simulations/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  serverSavedSimulations = serverSavedSimulations.filter((s) => s.id !== id);
  res.json({ success: true, remaining: serverSavedSimulations.length });
});

// ==========================================
// VITE & STATIC SPA MIDDLEWARE
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PAES Portal] Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

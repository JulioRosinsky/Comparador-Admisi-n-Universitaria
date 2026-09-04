import { Career, PaesScores, StochasticAnalysis } from '../types/paes';

/**
 * Standard Normal Cumulative Distribution Function (Phi) approximation
 */
function standardNormalCDF(x: number): number {
  // Abramowitz & Stegun approximation
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const p = 0.2316419;
  const c = 0.39894228;

  if (x >= 0) {
    const t = 1.0 / (1.0 + p * x);
    return 1.0 - c * Math.exp(-x * x / 2.0) * t *
      (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  } else {
    const t = 1.0 / (1.0 - p * x);
    return c * Math.exp(-x * x / 2.0) * t *
      (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  }
}

/**
 * Box-Muller transform for generating Gaussian random numbers
 */
function randomGaussian(mean: number, stdev: number): number {
  let u = 1 - Math.random();
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

/**
 * Calculates the exact weighted score according to university ponderations
 * Includes automatic optimization between Ciencias and Historia
 */
export function calculateWeightedScore(
  scores: PaesScores,
  career: Career
): {
  weightedScore: number;
  selectedScienceHistoryTest: 'ciencias' | 'historia' | 'ninguna';
  selectedScienceHistoryScore: number;
} {
  const { ponderation } = career;

  const nemScore = scores.nemScore || 100;
  const ranking = scores.ranking || 100;
  const lectora = scores.lectora || 100;
  const m1 = scores.m1 || 100;
  const m2 = ponderation.requiresM2 ? (scores.m2 || 100) : (scores.m2 || m1);

  // Automatic optimization: choose between Ciencias and Historia
  const cienciasScore = scores.ciencias ?? 0;
  const historiaScore = scores.historia ?? 0;

  let selectedScienceHistoryTest: 'ciencias' | 'historia' | 'ninguna' = 'ninguna';
  let selectedScienceHistoryScore = 0;

  if (ponderation.cienciasHistoria > 0) {
    if (cienciasScore >= historiaScore && cienciasScore > 0) {
      selectedScienceHistoryTest = 'ciencias';
      selectedScienceHistoryScore = cienciasScore;
    } else if (historiaScore > cienciasScore && historiaScore > 0) {
      selectedScienceHistoryTest = 'historia';
      selectedScienceHistoryScore = historiaScore;
    } else {
      // If neither is filled, pick whichever is greater or 0
      selectedScienceHistoryScore = Math.max(cienciasScore, historiaScore);
      selectedScienceHistoryTest = cienciasScore >= historiaScore ? 'ciencias' : 'historia';
    }
  }

  // Calculate weighted sum
  const weighted =
    nemScore * ponderation.nem +
    ranking * ponderation.ranking +
    lectora * ponderation.lectora +
    m1 * ponderation.m1 +
    (ponderation.requiresM2 ? (m2 * ponderation.m2) : (m1 * ponderation.m2)) +
    selectedScienceHistoryScore * ponderation.cienciasHistoria;

  return {
    weightedScore: Math.round(weighted * 100) / 100,
    selectedScienceHistoryTest,
    selectedScienceHistoryScore,
  };
}

/**
 * Executes stochastic time-series and Monte Carlo admission analysis
 */
export function calculateStochasticAdmission(
  scores: PaesScores,
  career: Career
): StochasticAnalysis {
  const { weightedScore, selectedScienceHistoryTest, selectedScienceHistoryScore } =
    calculateWeightedScore(scores, career);

  const cutoffs = career.historicalCutoffs.map((h) => h.score);
  const n = cutoffs.length;

  // 1. Mean
  const mean = cutoffs.reduce((a, b) => a + b, 0) / n;

  // 2. Standard deviation
  const variance =
    cutoffs.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n > 1 ? n - 1 : 1);
  const stdDev = Math.sqrt(variance);

  // 3. Linear drift / Annual trend (using least squares on 2020..2024 index)
  let sumT = 0;
  let sumC = 0;
  let sumTC = 0;
  let sumTT = 0;
  cutoffs.forEach((c, idx) => {
    const t = idx; // 0, 1, 2, 3, 4
    sumT += t;
    sumC += c;
    sumTC += t * c;
    sumTT += t * t;
  });
  const slope = (n * sumTC - sumT * sumC) / (n * sumTT - sumT * sumT);
  const annualDrift = Math.round(slope * 10) / 10;

  // Projected next cutoff (bounded drift to avoid runaway values)
  const lastCutoff2026 = cutoffs[cutoffs.length - 1];
  const boundedDrift = Math.max(-18, Math.min(22, annualDrift));
  const projectedCutoffNextYear = Math.round((lastCutoff2026 + boundedDrift) * 10) / 10;

  // Fast Analytical and Monte Carlo approximation
  // Cohort volatility factor
  const cohortVolatility = 12.5;
  const combinedSigma = Math.max(8.0, Math.sqrt(Math.pow(stdDev, 2) + Math.pow(cohortVolatility, 2)));

  // Analytical CDF probability for exact, instant smooth gradient (O(1) nanoseconds)
  const zScore = (weightedScore - projectedCutoffNextYear) / combinedSigma;
  const analyticalProb = standardNormalCDF(zScore) * 100;
  const probability = Math.min(99.9, Math.max(0.1, Math.round(analyticalProb * 10) / 10));

  // Generate lightweight 120-point distribution for histograms in modals without freezing the main thread
  const simulationSamples = 120;
  const monteCarloSimulations: number[] = [];
  for (let i = 0; i < simulationSamples; i++) {
    const p = (i + 0.5) / simulationSamples;
    // Inverse normal approx for smooth representative distribution
    const z = (p < 0.5 ? -1 : 1) * Math.sqrt(-2 * Math.log(p < 0.5 ? p : 1 - p));
    const sample = projectedCutoffNextYear + z * (combinedSigma * 0.85);
    monteCarloSimulations.push(Math.round(sample * 10) / 10);
  }

  // Category determination
  let category: 'SEGURA' | 'COMPETITIVA' | 'RIESGO_ALTO' = 'RIESGO_ALTO';
  let categoryLabel = 'Bajo el Corte Histórico / Riesgo Alto';

  if (probability >= 85) {
    category = 'SEGURA';
    categoryLabel = 'Admisión Segura / Muy Probable';
  } else if (probability >= 40) {
    category = 'COMPETITIVA';
    categoryLabel = 'Competitivo / Margen de Lista de Espera';
  } else {
    category = 'RIESGO_ALTO';
    categoryLabel = 'Bajo el Corte Histórico / Riesgo Alto';
  }

  const diff2026 = Math.round((weightedScore - lastCutoff2026) * 100) / 100;
  const diffProjected = Math.round((weightedScore - projectedCutoffNextYear) * 100) / 100;

  // Dynamic recommendation based on empirical statistics
  let recommendation = '';
  if (category === 'SEGURA') {
    recommendation = `Tu puntaje ponderado (${weightedScore}) supera holgadamente el corte proyectado (${projectedCutoffNextYear} pts, margen de +${diffProjected > 0 ? '+' : ''}${diffProjected} pts). Esta opción es de alta certidumbre para tus primeras preferencias.`;
  } else if (category === 'COMPETITIVA') {
    recommendation = `Te encuentras en la zona competitiva de corte y lista de espera (${Math.abs(diffProjected)} pts del corte proyectado). Muy recomendable postular con respaldo de una opción de seguridad en las preferencias siguientes.`;
  } else {
    const pointsNeeded = Math.round((projectedCutoffNextYear - weightedScore) * 10) / 10;
    recommendation = `Tu ponderado se ubica ${pointsNeeded} puntos por debajo del corte proyectado (${projectedCutoffNextYear}). Te sugerimos fortalecer tus puntajes PAES o considerarla como postulación de alta aspiración.`;
  }

  // Percentile position in simulated cohort cutoffs
  const sortedSims = [...monteCarloSimulations].sort((a, b) => a - b);
  const rank = sortedSims.filter((s) => s <= weightedScore).length;
  const percentileInDistribution = Math.round((rank / simulationSamples) * 100);

  return {
    weightedScore,
    selectedScienceHistoryTest,
    selectedScienceHistoryScore,
    historicalMean: Math.round(mean * 100) / 100,
    historicalStdDev: Math.round(stdDev * 100) / 100,
    annualDrift,
    projectedCutoffNextYear,
    probability,
    category,
    categoryLabel,
    differenceTo2026Cutoff: diff2026,
    differenceTo2024Cutoff: diff2026,
    differenceToProjectedCutoff: diffProjected,
    monteCarloSimulations,
    percentileInDistribution,
    recommendation,
  };
}

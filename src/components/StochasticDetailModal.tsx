import React, { useState, useEffect } from 'react';
import { CareerWithSimulation, PaesScores } from '../types/paes';
import { calculateStochasticAdmission } from '../utils/stochasticModel';
import {
  X,
  TrendingUp,
  BarChart,
  HelpCircle,
  Award,
  CheckCircle,
  AlertTriangle,
  Sliders,
  Sparkles,
  Layers,
  MapPin,
  Gift,
  BookOpen,
  Building,
  Info,
  ExternalLink,
  ShieldCheck,
  Check,
  Calendar,
  Briefcase,
  DollarSign,
  Navigation,
  School,
  FileText,
  Plus
} from 'lucide-react';
import { UNIVERSITIES_DATA } from '../data/universityMetadata';

interface StochasticDetailModalProps {
  career: CareerWithSimulation;
  baseScores: PaesScores;
  onClose: () => void;
  onToggleCompare?: (career: CareerWithSimulation) => void;
  isCompared?: boolean;
}

export const StochasticDetailModal: React.FC<StochasticDetailModalProps> = ({
  career,
  baseScores,
  onClose,
  onToggleCompare,
  isCompared = false,
}) => {
  const { simulation, metrics, ponderation, subordinateCareers, campusLocation, specialAdmission, benefits } = career;

  // University Institutional Metadata
  const uniInfo = UNIVERSITIES_DATA[career.universityShort] || {
    name: career.universityName,
    shortName: career.universityShort,
    cnaYears: metrics.acreditacionAnos,
    cnaLevel: metrics.acreditacionNivel,
    type: 'Universidad CRUCH / Adscrita',
    hasGratuity: metrics.adscritoGratuidad,
    region: career.region,
    mainCampuses: {},
    specialAdmissions: specialAdmission || [],
    benefits: benefits || []
  };

  // Active sub-tab in modal
  const [modalTab, setModalTab] = useState<'simulacion' | 'institucional' | 'subordinadas' | 'admisionEspecial' | 'beneficios' | 'empleabilidad'>(
    career.isPlanComun ? 'subordinadas' : 'simulacion'
  );

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Local sensitivity state
  const [testDeltaM1, setTestDeltaM1] = useState<number>(0);
  const [testDeltaLectora, setTestDeltaLectora] = useState<number>(0);
  const [testDeltaCiencias, setTestDeltaCiencias] = useState<number>(0);

  // Compute what-if scenario
  const modifiedScores: PaesScores = {
    ...baseScores,
    m1: Math.min(1000, Math.max(100, (baseScores.m1 || 600) + testDeltaM1)),
    m2: baseScores.m2 ? Math.min(1000, Math.max(100, baseScores.m2 + testDeltaM1)) : undefined,
    lectora: Math.min(1000, Math.max(100, (baseScores.lectora || 600) + testDeltaLectora)),
    ciencias: baseScores.ciencias
      ? Math.min(1000, Math.max(100, baseScores.ciencias + testDeltaCiencias))
      : undefined,
  };

  const dynamicSimulation = calculateStochasticAdmission(modifiedScores, career);

  // Monte Carlo distribution buckets
  const sims = simulation.monteCarloSimulations && simulation.monteCarloSimulations.length > 0
    ? simulation.monteCarloSimulations
    : [simulation.projectedCutoffNextYear - 15, simulation.projectedCutoffNextYear + 15];
  const minSim = Math.min(...sims);
  const maxSim = Math.max(...sims);
  const bucketCount = 12;
  const step = Math.max(1, (maxSim - minSim) / bucketCount);

  const buckets = Array.from({ length: bucketCount }, (_, i) => {
    const start = minSim + i * step;
    const end = start + step;
    const count = sims.filter((s) => s >= start && s < end).length;
    return {
      label: `${Math.round(start)} - ${Math.round(end)}`,
      center: Math.round((start + end) / 2),
      count,
      isCandidateBucket:
        simulation.weightedScore >= start && simulation.weightedScore < end,
    };
  });

  const maxBucketCount = Math.max(...buckets.map((b) => b.count), 1);
  const rangeMin = Math.round(simulation.projectedCutoffNextYear - (simulation.historicalStdDev || 10));
  const rangeMax = Math.round(simulation.projectedCutoffNextYear + (simulation.historicalStdDev || 10));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-career-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white rounded-2xl border border-[#E2DAD0] shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header (#001122) with full university identity */}
        <div className="bg-[#001122] text-[#EFEAE1] px-5 py-4 flex items-start justify-between border-b border-[#1E2E3E]">
          <div className="pr-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded bg-[#7C5E45] text-white font-serif font-bold text-xs tracking-wide">
                {career.universityShort}
              </span>
              <span className="text-xs text-[#C8BAAB] font-medium">
                {career.universityName}
              </span>
              <span className="text-[10px] bg-[#1A2838] text-[#E6C687] px-2 py-0.5 rounded border border-[#2B3B4D]">
                Cód. DEMRE: {career.code}
              </span>
            </div>

            <h2 id="modal-career-title" className="font-serif text-lg sm:text-2xl font-bold text-white leading-tight">
              {career.name}
            </h2>

            <div className="text-xs text-[#B8A99A] mt-1 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E6C687]" />
                {campusLocation?.campusName || metrics.sedeCampus || career.city}
              </span>
              <span>•</span>
              <span className="text-[#81C784] font-semibold">
                CNA: {metrics.acreditacionAnos} Años ({metrics.acreditacionNivel})
              </span>
              <span>•</span>
              <span className={metrics.adscritoGratuidad ? 'text-[#81C784]' : 'text-[#EF9A9A]'}>
                {metrics.adscritoGratuidad ? '✓ Adscrita a Gratuidad' : 'Sin Gratuidad'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(career)}
                className={`hidden sm:flex px-3 py-1.5 rounded-lg text-xs font-semibold items-center gap-1.5 transition ${
                  isCompared
                    ? 'bg-[#7C5E45] text-white hover:bg-[#5C4433]'
                    : 'bg-[#1A2838] text-white hover:bg-[#2B3B4D] border border-[#2B3B4D]'
                }`}
                aria-label={isCompared ? 'Quitar del comparador' : 'Agregar a comparador'}
              >
                {isCompared ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{isCompared ? 'Comparando' : 'Comparar'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#C8BAAB] hover:text-white bg-[#0A1A2B] rounded-lg border border-[#1E2E3E] transition focus:outline-none focus:ring-2 focus:ring-[#7C5E45]"
              title="Cerrar modal (Esc)"
              aria-label="Cerrar ventana de detalles"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs (Accessible, clear, responsive) */}
        <div className="bg-[#F7F4EF] px-4 sm:px-5 border-b border-[#E2DAD0] flex items-center gap-1.5 overflow-x-auto text-xs font-semibold py-2">
          <button
            type="button"
            onClick={() => setModalTab('simulacion')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              modalTab === 'simulacion'
                ? 'bg-[#001122] text-white shadow-xs'
                : 'text-[#6B5A4B] hover:bg-[#EAE3D8]'
            }`}
          >
            <BarChart className="w-4 h-4 text-[#E6C687]" />
            <span>Simulación & Cortes</span>
          </button>

          <button
            type="button"
            onClick={() => setModalTab('institucional')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              modalTab === 'institucional'
                ? 'bg-[#001122] text-white shadow-xs'
                : 'text-[#6B5A4B] hover:bg-[#EAE3D8]'
            }`}
          >
            <Building className="w-4 h-4 text-[#7C5E45]" />
            <span>Portal Institucional & Campus</span>
          </button>

          {subordinateCareers && subordinateCareers.length > 0 && (
            <button
              type="button"
              onClick={() => setModalTab('subordinadas')}
              className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                modalTab === 'subordinadas'
                  ? 'bg-[#7C5E45] text-white shadow-xs'
                  : 'text-[#6B5A4B] hover:bg-[#EAE3D8]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Especialidades ({subordinateCareers.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setModalTab('admisionEspecial')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              modalTab === 'admisionEspecial'
                ? 'bg-[#001122] text-white shadow-xs'
                : 'text-[#6B5A4B] hover:bg-[#EAE3D8]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#E6C687]" />
            <span>Vías Especiales ({specialAdmission?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setModalTab('beneficios')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              modalTab === 'beneficios'
                ? 'bg-[#001122] text-white shadow-xs'
                : 'text-[#6B5A4B] hover:bg-[#EAE3D8]'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Becas & Aranceles</span>
          </button>

          <button
            type="button"
            onClick={() => setModalTab('empleabilidad')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              modalTab === 'empleabilidad'
                ? 'bg-[#001122] text-white shadow-xs'
                : 'text-[#6B5A4B] hover:bg-[#EAE3D8]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Empleabilidad & Salarios</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#FAF8F5] space-y-6">
          {/* TAB 1: SIMULACIÓN & CORTES */}
          {modalTab === 'simulacion' && (
            <div className="space-y-6">
              {/* Top Verdict Bar */}
              <div className="bg-white p-5 rounded-xl border border-[#E2DAD0] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFEAE1]">
                  <div>
                    <span className="text-xs text-[#6B5A4B] font-semibold block mb-0.5">
                      Tu Puntaje Ponderado Obtenido:
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#001122]">
                        {simulation.weightedScore.toFixed(2)}
                      </span>
                      <span className="text-sm text-[#8C7662]">pts</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-[#6B5A4B] font-semibold block mb-0.5">
                      Corte 2024 (Último Seleccionado):
                    </span>
                    <div className="flex items-baseline gap-2 sm:justify-end">
                      <span className="text-2xl font-bold text-[#5C4433]">
                        {metrics.corte2024.toFixed(1)}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          simulation.differenceTo2024Cutoff >= 0
                            ? 'bg-[#E8F5E9] text-[#2E7D32]'
                            : 'bg-[#FFEBEE] text-[#C62828]'
                        }`}
                      >
                        {simulation.differenceTo2024Cutoff >= 0 ? '+' : ''}
                        {simulation.differenceTo2024Cutoff.toFixed(1)} pts
                      </span>
                    </div>
                  </div>
                </div>

                {/* Probability Meter & Description */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-xs ${
                        simulation.category === 'SEGURA'
                          ? 'bg-[#2E7D32]'
                          : simulation.category === 'COMPETITIVA'
                          ? 'bg-[#C77700]'
                          : 'bg-[#C62828]'
                      }`}
                    >
                      {simulation.probability}%
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#001122]">
                        {simulation.categoryLabel}
                      </h3>
                      <p className="text-xs text-[#6B5A4B]">
                        {simulation.recommendation}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs text-[#8C7662] bg-[#FBF9F5] p-2.5 rounded-lg border border-[#EAE3D8]">
                    <div>Corte Estimado 2025: <strong className="text-[#001122]">{simulation.projectedCutoffNextYear} pts</strong></div>
                    <div>Rango Probable: <strong className="text-[#001122]">{rangeMin} - {rangeMax} pts</strong></div>
                  </div>
                </div>
              </div>

              {/* Monte Carlo Visual Histogram */}
              <div className="bg-white p-5 rounded-xl border border-[#E2DAD0] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif font-bold text-sm text-[#001122] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#7C5E45]" />
                    <span>Distribución de Corte Simulada (5.000 Iteraciones Monte Carlo)</span>
                  </h3>
                  <span className="text-[11px] text-[#8C7662] italic">Modelo Estocástico DEMRE</span>
                </div>
                <p className="text-xs text-[#6B5A4B] mb-4">
                  El histograma muestra la probabilidad de corte para el próximo proceso. La barra dorada indica el rango donde cae tu puntaje actual ({simulation.weightedScore.toFixed(0)} pts).
                </p>

                <div className="h-36 flex items-end gap-1.5 pt-4 pb-2 px-2 bg-[#FAF8F5] rounded-xl border border-[#EFEAE1]">
                  {buckets.map((b, i) => {
                    const heightPercent = Math.max(8, (b.count / maxBucketCount) * 100);
                    return (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center h-full justify-end group relative"
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition bg-[#001122] text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-20 shadow-md">
                          {b.label} pts ({b.count} sims)
                        </div>

                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-md transition-all duration-300 ${
                            b.isCandidateBucket
                              ? 'bg-[#7C5E45] ring-2 ring-[#7C5E45]'
                              : 'bg-[#C5B7A6] group-hover:bg-[#8C7662]'
                          }`}
                        />
                        <span className="text-[9px] text-[#8C7662] mt-1 font-mono hidden sm:inline">
                          {b.center}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ponderation Table */}
              <div className="bg-white p-5 rounded-xl border border-[#E2DAD0] shadow-xs">
                <h3 className="font-serif font-bold text-sm text-[#001122] mb-3 flex items-center justify-between">
                  <span>Ponderaciones Oficiales Exigidas por la Carrera</span>
                  <span className="text-xs font-normal text-[#8C7662]">DEMRE Proceso 2025</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F7F4EF] text-[#5C4433] uppercase text-[10px] tracking-wider border-y border-[#E2DAD0]">
                      <tr>
                        <th className="py-2.5 px-3">Factor</th>
                        <th className="py-2.5 px-3 text-center">Ponderación %</th>
                        <th className="py-2.5 px-3 text-center">Tu Puntaje</th>
                        <th className="py-2.5 px-3 text-right">Aporte Ponderado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFEAE1]">
                      <tr>
                        <td className="py-2 px-3 font-semibold text-[#001122]">NEM (Notas Enseñanza Media)</td>
                        <td className="py-2 px-3 text-center font-bold">{metrics.ponderacionNEM}%</td>
                        <td className="py-2 px-3 text-center">{baseScores.nemScore} pts</td>
                        <td className="py-2 px-3 text-right font-bold text-[#7C5E45]">
                          {((baseScores.nemScore * metrics.ponderacionNEM) / 100).toFixed(2)} pts
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-[#001122]">Puntaje Ranking</td>
                        <td className="py-2 px-3 text-center font-bold">{metrics.ponderacionRanking}%</td>
                        <td className="py-2 px-3 text-center">{baseScores.ranking} pts</td>
                        <td className="py-2 px-3 text-right font-bold text-[#7C5E45]">
                          {((baseScores.ranking * metrics.ponderacionRanking) / 100).toFixed(2)} pts
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-[#001122]">Comprensión Lectora</td>
                        <td className="py-2 px-3 text-center font-bold">{metrics.ponderacionLectora}%</td>
                        <td className="py-2 px-3 text-center">{baseScores.lectora} pts</td>
                        <td className="py-2 px-3 text-right font-bold text-[#7C5E45]">
                          {((baseScores.lectora * metrics.ponderacionLectora) / 100).toFixed(2)} pts
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-[#001122]">Matemática 1 (M1)</td>
                        <td className="py-2 px-3 text-center font-bold">{metrics.ponderacionM1}%</td>
                        <td className="py-2 px-3 text-center">{baseScores.m1} pts</td>
                        <td className="py-2 px-3 text-right font-bold text-[#7C5E45]">
                          {((baseScores.m1 * metrics.ponderacionM1) / 100).toFixed(2)} pts
                        </td>
                      </tr>
                      {metrics.ponderacionM2 > 0 && (
                        <tr>
                          <td className="py-2 px-3 font-semibold text-[#001122]">Matemática 2 (M2)</td>
                          <td className="py-2 px-3 text-center font-bold">{metrics.ponderacionM2}%</td>
                          <td className="py-2 px-3 text-center">{baseScores.m2 || 'No rendida'}</td>
                          <td className="py-2 px-3 text-right font-bold text-[#7C5E45]">
                            {baseScores.m2
                              ? (((baseScores.m2) * metrics.ponderacionM2) / 100).toFixed(2)
                              : '0.00'}{' '}
                            pts
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="py-2 px-3 font-semibold text-[#001122]">
                          Ciencias / Historia
                        </td>
                        <td className="py-2 px-3 text-center font-bold">
                          {metrics.ponderacionCienciasHistoria}%
                        </td>
                        <td className="py-2 px-3 text-center">
                          {Math.max(baseScores.ciencias || 0, baseScores.historia || 0)} pts
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-[#7C5E45]">
                          {(
                            (Math.max(baseScores.ciencias || 0, baseScores.historia || 0) *
                              metrics.ponderacionCienciasHistoria) /
                            100
                          ).toFixed(2)}{' '}
                          pts
                        </td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-[#FAF8F5] border-t-2 border-[#D8CEBF] font-black text-[#001122]">
                      <tr>
                        <td className="py-2.5 px-3">Total Ponderado Calculado</td>
                        <td className="py-2.5 px-3 text-center">100%</td>
                        <td className="py-2.5 px-3 text-center">—</td>
                        <td className="py-2.5 px-3 text-right text-sm text-[#001122]">
                          {simulation.weightedScore.toFixed(2)} pts
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Interactive Sensitivity Sliders ("¿Qué pasa si subo mis puntajes?") */}
              <div className="bg-white p-5 rounded-xl border border-[#E2DAD0] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif font-bold text-sm text-[#001122] flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#7C5E45]" />
                    <span>Simulador de Sensibilidad & Metas Rápidas</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setTestDeltaM1(0);
                      setTestDeltaLectora(0);
                      setTestDeltaCiencias(0);
                    }}
                    className="text-xs text-[#7C5E45] hover:underline font-semibold"
                  >
                    Restablecer
                  </button>
                </div>
                <p className="text-xs text-[#6B5A4B] mb-4">
                  Ajusta los puntajes para ver cómo impactan directamente en tu probabilidad de ingreso a esta carrera:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#FAF8F5] p-3 rounded-lg border border-[#EFEAE1]">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-[#001122]">Matemática (M1/M2)</span>
                      <strong className="text-[#7C5E45]">{testDeltaM1 >= 0 ? `+${testDeltaM1}` : testDeltaM1} pts</strong>
                    </div>
                    <input
                      type="range"
                      min={-100}
                      max={150}
                      step={1}
                      value={testDeltaM1}
                      onChange={(e) => setTestDeltaM1(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-[#E2DAD0] rounded-lg appearance-none cursor-pointer accent-[#7C5E45]"
                      aria-label="Ajustar puntaje en Matemática"
                    />
                  </div>

                  <div className="bg-[#FAF8F5] p-3 rounded-lg border border-[#EFEAE1]">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-[#001122]">Comp. Lectora</span>
                      <strong className="text-[#7C5E45]">{testDeltaLectora >= 0 ? `+${testDeltaLectora}` : testDeltaLectora} pts</strong>
                    </div>
                    <input
                      type="range"
                      min={-100}
                      max={150}
                      step={1}
                      value={testDeltaLectora}
                      onChange={(e) => setTestDeltaLectora(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-[#E2DAD0] rounded-lg appearance-none cursor-pointer accent-[#7C5E45]"
                      aria-label="Ajustar puntaje en Comprensión Lectora"
                    />
                  </div>

                  <div className="bg-[#FAF8F5] p-3 rounded-lg border border-[#EFEAE1]">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-[#001122]">Ciencias / Historia</span>
                      <strong className="text-[#7C5E45]">{testDeltaCiencias >= 0 ? `+${testDeltaCiencias}` : testDeltaCiencias} pts</strong>
                    </div>
                    <input
                      type="range"
                      min={-100}
                      max={150}
                      step={1}
                      value={testDeltaCiencias}
                      onChange={(e) => setTestDeltaCiencias(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-[#E2DAD0] rounded-lg appearance-none cursor-pointer accent-[#7C5E45]"
                      aria-label="Ajustar puntaje en Ciencias o Historia"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EFEAE1] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FBF9F5] p-3 rounded-lg">
                  <div className="text-xs">
                    <span className="text-[#6B5A4B]">Nuevo Ponderado Simulado: </span>
                    <strong className="text-base text-[#001122] font-black">
                      {dynamicSimulation.weightedScore.toFixed(2)} pts
                    </strong>
                    <span className="text-[11px] text-[#7C5E45] ml-2">
                      ({(dynamicSimulation.weightedScore - simulation.weightedScore >= 0 ? '+' : '')}
                      {(dynamicSimulation.weightedScore - simulation.weightedScore).toFixed(2)} pts)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="text-[#5C4433]">Nueva Probabilidad:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-white ${
                        dynamicSimulation.category === 'SEGURA'
                          ? 'bg-[#2E7D32]'
                          : dynamicSimulation.category === 'COMPETITIVA'
                          ? 'bg-[#C77700]'
                          : 'bg-[#C62828]'
                      }`}
                    >
                      {dynamicSimulation.probability}% ({dynamicSimulation.categoryLabel})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PORTAL INSTITUCIONAL & CAMPUS */}
          {modalTab === 'institucional' && (
            <div className="space-y-6">
              {/* University Profile Card */}
              <div className="bg-white p-5 rounded-xl border border-[#E2DAD0] shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#001122] text-[#EFEAE1] flex items-center justify-center font-serif font-black text-xl shadow-md shrink-0">
                    {career.universityShort}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-lg text-[#001122]">
                        {uniInfo.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#6B5A4B] mt-0.5">
                      {uniInfo.type} • {uniInfo.region}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-bold border border-[#C8E6C9] flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        CNA: {uniInfo.cnaYears} Años de Acreditación ({uniInfo.cnaLevel})
                      </span>
                      <span className={`px-2.5 py-1 rounded-full font-bold border flex items-center gap-1 ${
                        uniInfo.hasGratuity
                          ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                          : 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]'
                      }`}>
                        <Gift className="w-3.5 h-3.5" />
                        {uniInfo.hasGratuity ? 'Adscrita a Gratuidad Universitaria' : 'No adscrita a gratuidad'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campus Location & Facilities Details */}
              <div className="bg-white p-5 rounded-xl border border-[#E2DAD0] shadow-xs">
                <h3 className="font-serif font-bold text-base text-[#001122] mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#7C5E45]" />
                  <span>Sede y Campus: {campusLocation?.campusName || metrics.sedeCampus || career.city}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#FAF8F5] p-3.5 rounded-lg border border-[#EFEAE1] space-y-2">
                    <div>
                      <span className="text-[#8C7662] block">Dirección Principal:</span>
                      <strong className="text-[#001122] text-sm">{campusLocation?.address || 'Campus Central Universitario'}</strong>
                    </div>
                    <div>
                      <span className="text-[#8C7662] block">Comuna y Región:</span>
                      <strong className="text-[#001122]">{campusLocation?.commune || career.city}, {career.region}</strong>
                    </div>
                    <div>
                      <span className="text-[#8C7662] block">Acceso y Transporte Público:</span>
                      <strong className="text-[#5C4433]">{campusLocation?.transportAccess || 'Conexión vía red de transporte público y buses de acercamiento.'}</strong>
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] p-3.5 rounded-lg border border-[#EFEAE1]">
                    <span className="text-[#8C7662] block mb-1.5 font-semibold">Infraestructura y Laboratorios:</span>
                    {campusLocation?.facilities && campusLocation.facilities.length > 0 ? (
                      <ul className="space-y-1 text-[#001122]">
                        {campusLocation.facilities.map((fac, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#7C5E45] font-bold">•</span>
                            <span>{fac}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[#6B5A4B]">
                        Bibliotecas especializadas, laboratorios de docencia e investigación, centros deportivos y salas de estudio.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* All University Campuses Breakdown if available */}
              {Object.keys(uniInfo.mainCampuses).length > 0 && (
                <div className="bg-white p-5 rounded-xl border border-[#E2DAD0] shadow-xs">
                  <h4 className="font-serif font-bold text-sm text-[#001122] mb-3">
                    Otros Campus y Sedes de {uniInfo.shortName}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(uniInfo.mainCampuses).map(([k, camp]) => (
                      <div key={k} className="p-3 bg-[#FAF8F5] rounded-lg border border-[#EFEAE1] text-xs">
                        <strong className="text-[#001122] block">{camp.campusName}</strong>
                        <span className="text-[#6B5A4B] block mt-0.5">{camp.address}, {camp.commune}</span>
                        <span className="text-[11px] text-[#7C5E45] block mt-1">{camp.transportAccess}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SUBORDINADAS & PLAN COMÚN */}
          {modalTab === 'subordinadas' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-[#E2DAD0] shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#7C5E45] text-white flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#001122]">
                      Plan Común y Especialidades Subordinadas
                    </h3>
                    <p className="text-xs text-[#6B5A4B]">
                      Esta carrera permite ingresar a un ciclo básico transversal y elegir tu mención o especialidad profesional sin rendir una nueva PAES.
                    </p>
                  </div>
                </div>

                {subordinateCareers && subordinateCareers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
                    {subordinateCareers.map((sub) => (
                      <div
                        key={sub.id}
                        className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFEAE1] hover:border-[#C5B7A6] transition shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-serif font-bold text-sm text-[#001122]">
                              {sub.name}
                            </h4>
                            <span className="px-2 py-0.5 rounded bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold">
                              {sub.employmentRate1Year}% Empleab.
                            </span>
                          </div>
                          <p className="text-xs text-[#6B5A4B] leading-relaxed mt-1">
                            {sub.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#EAE3D8] text-xs flex items-center justify-between text-[#5C4433]">
                          <div>
                            <span className="text-[#8C7662] block text-[10px]">Ingreso al 5° año:</span>
                            <strong className="text-[#001122]">{sub.avgSalary5Year}</strong>
                          </div>
                          <div className="text-right">
                            <span className="text-[#8C7662] block text-[10px]">Duración:</span>
                            <strong className="text-[#001122]">{sub.durationSemesters} semestres</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-[#8C7662]">
                    Esta carrera cuenta con una malla curricular directa de especialidad única.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: VÍAS DE ADMISIÓN ESPECIAL */}
          {modalTab === 'admisionEspecial' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-[#E2DAD0] shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#001122] text-[#E6C687] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#001122]">
                      Vías de Admisión Especial & Equidad
                    </h3>
                    <p className="text-xs text-[#6B5A4B]">
                      Postulaciones complementarias que no dependen exclusivamente del puntaje de corte regular DEMRE.
                    </p>
                  </div>
                </div>

                {specialAdmission && specialAdmission.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
                    {specialAdmission.map((via, idx) => (
                      <div
                        key={idx}
                        className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFEAE1] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-serif font-bold text-sm text-[#001122]">
                              {via.name}
                            </h4>
                            <span className="px-2 py-0.5 rounded bg-[#F7F4EF] text-[#7C5E45] border border-[#DCD3C7] text-[10px] font-bold">
                              {via.type}
                            </span>
                          </div>
                          <p className="text-xs text-[#6B5A4B] mt-1 leading-relaxed">
                            {via.description}
                          </p>

                          <div className="mt-2.5 bg-white p-2.5 rounded-lg border border-[#EAE3D8] text-xs">
                            <span className="text-[#8C7662] block font-semibold text-[11px]">Requisitos Clave:</span>
                            <ul className="list-disc list-inside text-[#001122] text-[11px] mt-1 space-y-0.5">
                              {via.requirements.map((req, rIdx) => (
                                <li key={rIdx}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {via.officialUrl && (
                          <div className="mt-3 pt-2 border-t border-[#EAE3D8] text-right">
                            <a
                              href={via.officialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#7C5E45] hover:underline font-semibold inline-flex items-center gap-1"
                            >
                              <span>Ver bases oficiales</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#8C7662] mt-4">
                    Consulta directamente en el departamento de Admisión de {career.universityName} sobre cupos especiales BEA, PACE, Talento Académico y Deportistas.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: BECAS & ARANCELES */}
          {modalTab === 'beneficios' && (
            <div className="space-y-6">
              {/* Financial Snapshot */}
              <div className="bg-white p-5 rounded-xl border border-[#E2DAD0] shadow-xs">
                <h3 className="font-serif font-bold text-base text-[#001122] mb-3 flex items-center justify-between">
                  <span>Aranceles y Financiamiento Mineduc / SIES</span>
                  <span className="text-xs font-normal text-[#8C7662]">Valores Oficiales 2024</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-4">
                  <div className="bg-[#FAF8F5] p-3.5 rounded-lg border border-[#EFEAE1]">
                    <span className="text-[#8C7662] block">Arancel Anual Real:</span>
                    <strong className="text-lg text-[#001122] font-black block mt-0.5">
                      ${metrics.arancelAnualCLP.toLocaleString('es-CL')}
                    </strong>
                    <span className="text-[10px] text-[#8C7662]">Anualidad oficial</span>
                  </div>

                  <div className="bg-[#FAF8F5] p-3.5 rounded-lg border border-[#EFEAE1]">
                    <span className="text-[#8C7662] block">Arancel de Referencia:</span>
                    <strong className="text-lg text-[#5C4433] font-black block mt-0.5">
                      ${metrics.arancelReferenciaCLP.toLocaleString('es-CL')}
                    </strong>
                    <span className="text-[10px] text-[#8C7662]">Monto cubierto por becas del Estado</span>
                  </div>

                  <div className="bg-[#FAF8F5] p-3.5 rounded-lg border border-[#EFEAE1]">
                    <span className="text-[#8C7662] block">Copago Anual Estimado:</span>
                    <strong className="text-lg text-[#7C5E45] font-black block mt-0.5">
                      ${metrics.copagoAnualEstimadoCLP.toLocaleString('es-CL')}
                    </strong>
                    <span className="text-[10px] text-[#8C7662]">Diferencia a financiar</span>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                  metrics.adscritoGratuidad
                    ? 'bg-[#E8F5E9] border-[#C8E6C9] text-[#2E7D32]'
                    : 'bg-[#FFF3E0] border-[#FFE0B2] text-[#E65100]'
                }`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>
                      {metrics.adscritoGratuidad
                        ? 'Esta institución está adscrita a Gratuidad Universitaria del Estado (cubre el 100% de arancel y matrícula para el 60% de menores ingresos).'
                        : 'Esta institución no cuenta con Gratuidad estatal, pero acepta Crédito CAE y becas de arancel Mineduc.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Institutional Scholarships */}
              {benefits && benefits.length > 0 && (
                <div className="bg-white p-5 rounded-xl border border-[#E2DAD0] shadow-xs">
                  <h4 className="font-serif font-bold text-sm text-[#001122] mb-3">
                    Becas y Beneficios Institucionales
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {benefits.map((b, idx) => (
                      <div key={idx} className="p-3.5 bg-[#FAF8F5] rounded-lg border border-[#EFEAE1] text-xs">
                        <strong className="text-[#001122] block font-serif font-bold text-sm">{b.name}</strong>
                        <p className="text-[#6B5A4B] mt-1 leading-relaxed">{b.description}</p>
                        <div className="mt-2 text-[11px] text-[#7C5E45] font-semibold">
                          Requisitos: {b.requirements}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: EMPLEABILIDAD & SALARIOS */}
          {modalTab === 'empleabilidad' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-[#E2DAD0] shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif font-bold text-base text-[#001122] flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#7C5E45]" />
                    <span>Datos de Empleabilidad e Ingresos al Egresar</span>
                  </h3>
                  <span className="text-xs text-[#8C7662] italic">Fuente: MiFuturo.cl / SIES Mineduc</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
                  <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFEAE1] text-center">
                    <span className="text-xs text-[#8C7662] block">Empleabilidad al 1° Año:</span>
                    <strong className="text-2xl font-black text-[#2E7D32] block mt-1">
                      {metrics.empleabilidad1Ano}%
                    </strong>
                    <span className="text-[10px] text-[#8C7662]">Titulados trabajando</span>
                  </div>

                  <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFEAE1] text-center">
                    <span className="text-xs text-[#8C7662] block">Empleabilidad al 2° Año:</span>
                    <strong className="text-2xl font-black text-[#2E7D32] block mt-1">
                      {metrics.empleabilidad2Ano}%
                    </strong>
                    <span className="text-[10px] text-[#8C7662]">Consolidación laboral</span>
                  </div>

                  <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFEAE1] text-center">
                    <span className="text-xs text-[#8C7662] block">Sueldo Mediano al 5° Año:</span>
                    <strong className="text-2xl font-black text-[#001122] block mt-1">
                      ${metrics.ingreso5Ano.toLocaleString('es-CL')}
                    </strong>
                    <span className="text-[10px] text-[#8C7662]">Líquido mensual estimado</span>
                  </div>
                </div>

                {/* Salary Progression Matrix */}
                <h4 className="font-serif font-bold text-xs text-[#5C4433] uppercase tracking-wider mb-2">
                  Evolución Salarial Proyectada por Años de Egreso
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EFEAE1]">
                    <span className="text-[11px] text-[#8C7662] block">1° Año</span>
                    <strong className="text-[#001122] text-sm block mt-0.5">
                      ${metrics.ingreso1Ano.toLocaleString('es-CL')}
                    </strong>
                  </div>
                  <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EFEAE1]">
                    <span className="text-[11px] text-[#8C7662] block">2° Año</span>
                    <strong className="text-[#001122] text-sm block mt-0.5">
                      ${metrics.ingreso2Ano.toLocaleString('es-CL')}
                    </strong>
                  </div>
                  <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EFEAE1]">
                    <span className="text-[11px] text-[#8C7662] block">3° Año</span>
                    <strong className="text-[#001122] text-sm block mt-0.5">
                      ${metrics.ingreso3Ano.toLocaleString('es-CL')}
                    </strong>
                  </div>
                  <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EFEAE1]">
                    <span className="text-[11px] text-[#8C7662] block">4° Año</span>
                    <strong className="text-[#001122] text-sm block mt-0.5">
                      ${metrics.ingreso4Ano.toLocaleString('es-CL')}
                    </strong>
                  </div>
                  <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EFEAE1]">
                    <span className="text-[11px] text-[#8C7662] block font-bold text-[#7C5E45]">5° Año</span>
                    <strong className="text-[#7C5E45] text-sm font-black block mt-0.5">
                      ${metrics.ingreso5Ano.toLocaleString('es-CL')}
                    </strong>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EFEAE1] text-[11px] text-[#8C7662] flex items-center justify-between">
                  <span>Retención 1° a 2° año: <strong className="text-[#001122]">{metrics.retencion1a2Ano}%</strong></span>
                  <span>Duración Real: <strong className="text-[#001122]">{metrics.duracionRealSemestres} semestres</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (Clean, accessible, friendly) */}
        <div className="bg-[#FBF9F5] px-5 py-3.5 border-t border-[#EAE3D8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-[#8C7662] text-center sm:text-left">
            Fuentes: DEMRE • SIES Mineduc • MiFuturo.cl • CNA-Chile (Vigente 2025)
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(career)}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                  isCompared
                    ? 'bg-[#7C5E45] text-white hover:bg-[#5C4433]'
                    : 'bg-[#EFEAE1] text-[#001122] hover:bg-[#E2DAD0] border border-[#D2C7B8]'
                }`}
              >
                {isCompared ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{isCompared ? 'En Comparador' : 'Agregar a Comparador'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#001122] text-white font-bold rounded-lg hover:bg-[#122336] transition shadow-xs"
            >
              Cerrar Ficha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

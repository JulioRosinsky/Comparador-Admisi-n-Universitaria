import React, { useState, useMemo, useEffect } from 'react';
import { ACADEMIC_OFFER } from './data/academicOffer';
import { convertNemToScore } from './data/nemConversion';
import {
  CareerWithSimulation,
  PaesScores,
  SavedSimulation,
} from './types/paes';
import { calculateStochasticAdmission } from './utils/stochasticModel';
import { generateApplicationReportPDF } from './utils/pdfGenerator';
import { Header } from './components/Header';
import { ScoreForm } from './components/ScoreForm';
import { FiltersBar, FilterState } from './components/FiltersBar';
import { CareerCard } from './components/CareerCard';
import { StochasticDetailModal } from './components/StochasticDetailModal';
import { CareerComparator } from './components/CareerComparator';
import { GoalTracker } from './components/GoalTracker';
import { SimulationHistory } from './components/SimulationHistory';
import { MethodologyModal } from './components/MethodologyModal';
import { apiService } from './services/apiService';
import { Layers, ArrowRight, X, Sparkles } from 'lucide-react';

const INITIAL_SCORES: PaesScores = {
  nem: 6.45,
  nemScore: 837,
  ranking: 880,
  lectora: 840,
  m1: 890,
  m2: 810,
  ciencias: 820,
  historia: 780,
};

export default function App() {
  // Navigation tabs: 'simulador' | 'comparador' | 'metas' | 'historial'
  const [activeTab, setActiveTab] = useState<'simulador' | 'comparador' | 'metas' | 'historial'>('simulador');

  // Candidate PAES Scores
  const [scores, setScores] = useState<PaesScores>(() => {
    const saved = localStorage.getItem('paes_active_scores');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_SCORES;
  });

  const [educationType, setEducationType] = useState<'humanista' | 'tecnico'>('humanista');

  // Compared careers (Up to 4)
  const [comparedCareerIds, setComparedCareerIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('paes_compared_ids');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((id) => ACADEMIC_OFFER.some((c) => c.id === id));
          if (valid.length > 0) return valid.slice(0, 4);
        }
      } catch (e) {}
    }
    return ACADEMIC_OFFER.slice(0, 4).map((c) => c.id);
  });

  // Modal states
  const [detailCareer, setDetailCareer] = useState<CareerWithSimulation | null>(null);
  const [showMethodologyModal, setShowMethodologyModal] = useState<boolean>(false);

  // Saved Simulations History
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>(() => {
    const saved = localStorage.getItem('paes_saved_simulations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
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
  });

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    area: 'all',
    university: 'all',
    region: 'all',
    gratuityOnly: false,
    minCnaYears: 0,
    planComunOnly: false,
    sortBy: 'probability',
    admissionCategory: 'all',
  });

  // Progressive loading for high performance with 750+ careers
  const [visibleCount, setVisibleCount] = useState<number>(36);

  useEffect(() => {
    setVisibleCount(36);
  }, [filters]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('paes_active_scores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem('paes_compared_ids', JSON.stringify(comparedCareerIds));
  }, [comparedCareerIds]);

  useEffect(() => {
    localStorage.setItem('paes_saved_simulations', JSON.stringify(savedSimulations));
  }, [savedSimulations]);

  // Compute stochastic simulation for all careers in catalog
  const processedCareers: CareerWithSimulation[] = useMemo(() => {
    return ACADEMIC_OFFER.map((career) => {
      const simulation = calculateStochasticAdmission(scores, career);
      return {
        ...career,
        simulation,
      };
    });
  }, [scores]);

  // Filter and sort processed careers
  const filteredCareers = useMemo(() => {
    return processedCareers
      .filter((item) => {
        // Search text: checks name, uni, city, code, subordinate branches (e.g. electrica, computacion), campus & special admissions
        if (filters.search) {
          const query = filters.search.toLowerCase().trim();
          const matchName = item.name.toLowerCase().includes(query);
          const matchUni = item.universityName.toLowerCase().includes(query) ||
                           item.universityShort.toLowerCase().includes(query);
          const matchCity = item.city.toLowerCase().includes(query);
          const matchCode = item.code.includes(query);
          const matchSubordinates = item.subordinateCareers?.some(
            (sub) =>
              sub.name.toLowerCase().includes(query) ||
              sub.description.toLowerCase().includes(query) ||
              sub.keyFields?.some((kf) => kf.toLowerCase().includes(query))
          );
          const matchCampus = item.campusLocation?.campusName.toLowerCase().includes(query) ||
                              item.campusLocation?.address.toLowerCase().includes(query) ||
                              item.campusLocation?.commune.toLowerCase().includes(query);
          const matchSpecial = item.specialAdmission?.some(
            (sa) => sa.name.toLowerCase().includes(query) || sa.category.toLowerCase().includes(query) || sa.requirements.toLowerCase().includes(query)
          );

          if (!matchName && !matchUni && !matchCity && !matchCode && !matchSubordinates && !matchCampus && !matchSpecial) {
            return false;
          }
        }

        // Area
        if (filters.area !== 'all' && item.area !== filters.area) {
          return false;
        }

        // University
        if (filters.university !== 'all' && item.universityShort !== filters.university) {
          return false;
        }

        // Region
        if (filters.region !== 'all' && item.region !== filters.region) {
          return false;
        }

        // Gratuity
        if (filters.gratuityOnly && !item.metrics.adscritoGratuidad) {
          return false;
        }

        // Min CNA
        if (filters.minCnaYears > 0 && item.metrics.acreditacionAnos < filters.minCnaYears) {
          return false;
        }

        // Plan Común
        if (filters.planComunOnly && !item.isPlanComun) {
          return false;
        }

        // Admission Verdict
        if (filters.admissionCategory !== 'all' && item.simulation.category !== filters.admissionCategory) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'probability') {
          return b.simulation.probability - a.simulation.probability;
        }
        if (filters.sortBy === 'weightedScore') {
          return b.simulation.weightedScore - a.simulation.weightedScore;
        }
        if (filters.sortBy === 'corte2024') {
          return b.metrics.corte2024 - a.metrics.corte2024;
        }
        if (filters.sortBy === 'arancelAsc') {
          return a.metrics.arancelAnualCLP - b.metrics.arancelAnualCLP;
        }
        if (filters.sortBy === 'empleabilidad') {
          return b.metrics.empleabilidad1Ano - a.metrics.empleabilidad1Ano;
        }
        if (filters.sortBy === 'ingreso5') {
          return b.metrics.ingreso5Ano - a.metrics.ingreso5Ano;
        }
        return 0;
      });
  }, [processedCareers, filters]);

  // Extract unique values for filter dropdowns
  const availableUniversities = useMemo(() => {
    const unis = new Set<string>();
    ACADEMIC_OFFER.forEach((c) => unis.add(c.universityShort));
    return Array.from(unis).sort();
  }, []);

  const availableRegions = useMemo(() => {
    const regs = new Set<string>();
    ACADEMIC_OFFER.forEach((c) => regs.add(c.region));
    return Array.from(regs).sort();
  }, []);

  const availableAreas = useMemo(() => {
    const areas = new Set<any>();
    ACADEMIC_OFFER.forEach((c) => areas.add(c.area));
    return Array.from(areas).sort();
  }, []);

  // Comparison handlers
  const handleToggleCompare = (career: CareerWithSimulation) => {
    if (comparedCareerIds.includes(career.id)) {
      setComparedCareerIds(comparedCareerIds.filter((id) => id !== career.id));
    } else {
      if (comparedCareerIds.length < 4) {
        setComparedCareerIds([...comparedCareerIds, career.id]);
      }
    }
  };

  const handleRemoveFromCompare = (careerId: string) => {
    setComparedCareerIds(comparedCareerIds.filter((id) => id !== careerId));
  };

  const handleAddFromCatalog = (careerId: string) => {
    if (!comparedCareerIds.includes(careerId) && comparedCareerIds.length < 4) {
      setComparedCareerIds([...comparedCareerIds, careerId]);
    }
  };

  const comparedCareers = useMemo(() => {
    return comparedCareerIds
      .map((id) => processedCareers.find((c) => c.id === id))
      .filter((c): c is CareerWithSimulation => c !== undefined);
  }, [comparedCareerIds, processedCareers]);

  // PDF Export
  const handleExportPDF = () => {
    const topCareers = filteredCareers.slice(0, 10);
    generateApplicationReportPDF(scores, topCareers, comparedCareers);
  };

  // Saved simulations handlers
  const handleSaveSimulation = async (name: string, notes?: string) => {
    const newSim: SavedSimulation = {
      id: `sim-${Date.now()}`,
      name: name.trim() || `Simulación ${new Date().toLocaleDateString('es-CL')}`,
      date: new Date().toLocaleDateString('es-CL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      scores: { ...scores },
      selectedCareersCount: comparedCareerIds.length,
      notes,
    };
    setSavedSimulations((prev) => [newSim, ...prev]);
    // Async background sync to REST API
    apiService.saveSimulation(name, scores, notes, comparedCareerIds.length).catch(() => {});
  };

  const handleRestoreSimulation = (sim: SavedSimulation) => {
    setScores(sim.scores);
    setActiveTab('simulador');
  };

  const handleDeleteSimulation = (simId: string) => {
    setSavedSimulations((prev) => prev.filter((s) => s.id !== simId));
    apiService.deleteSimulation(simId).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#001122] flex flex-col font-sans selection:bg-[#7C5E45] selection:text-white">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        comparedCount={comparedCareerIds.length}
        onExportPDF={handleExportPDF}
        onOpenInfo={() => setShowMethodologyModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* TAB 1: SIMULADOR & OFERTA ACADÉMICA */}
        {activeTab === 'simulador' && (
          <div className="space-y-6">
            {/* Score input card */}
            <ScoreForm
              scores={scores}
              onChangeScores={setScores}
              educationType={educationType}
              onChangeEducationType={setEducationType}
            />

            {/* Filters bar with CNA, Plan Común and Quick Filters */}
            <FiltersBar
              filters={filters}
              onChangeFilters={setFilters}
              availableUniversities={availableUniversities}
              availableRegions={availableRegions}
              availableAreas={availableAreas}
              totalResults={filteredCareers.length}
              totalCatalog={ACADEMIC_OFFER.length}
            />

            {/* Career Cards Grid */}
            {filteredCareers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E2DAD0] p-12 text-center shadow-xs">
                <p className="text-sm font-bold text-[#001122]">
                  No se encontraron carreras con los filtros seleccionados.
                </p>
                <p className="text-xs text-[#6B5A4B] mt-1">
                  Prueba modificando los criterios de búsqueda o restableciendo los filtros.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCareers.slice(0, visibleCount).map((career) => (
                    <CareerCard
                      key={career.id}
                      career={career}
                      isCompared={comparedCareerIds.includes(career.id)}
                      onToggleCompare={handleToggleCompare}
                      onOpenDetail={(c) => setDetailCareer(c)}
                      canCompare={comparedCareerIds.length < 4}
                    />
                  ))}
                </div>

                {filteredCareers.length > visibleCount && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 pb-2">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 36)}
                      className="min-h-[44px] px-6 py-2.5 bg-[#001122] hover:bg-[#1C2D42] active:bg-[#000814] text-white text-xs font-bold rounded-xl shadow-xs transition"
                    >
                      Cargar 36 carreras más (Mostrando {Math.min(visibleCount, filteredCareers.length)} de {filteredCareers.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisibleCount(filteredCareers.length)}
                      className="min-h-[44px] px-5 py-2.5 bg-white hover:bg-[#F4EFEA] text-[#5C4433] hover:text-[#001122] text-xs font-bold rounded-xl border border-[#D2C7B8] transition"
                    >
                      Mostrar todas ({filteredCareers.length})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMPARADOR 50 MÉTRICAS */}
        {activeTab === 'comparador' && (
          <CareerComparator
            comparedCareers={comparedCareers}
            onRemoveFromCompare={handleRemoveFromCompare}
            onAddFromCatalog={handleAddFromCatalog}
            allCareers={processedCareers}
            onExportPDF={handleExportPDF}
          />
        )}

        {/* TAB 3: METAS & ANÁLISIS DE BRECHA */}
        {activeTab === 'metas' && (
          <GoalTracker
            careers={processedCareers}
            currentScores={scores}
            onUpdateScores={setScores}
          />
        )}

        {/* TAB 4: HISTORIAL DE SIMULACIONES */}
        {activeTab === 'historial' && (
          <SimulationHistory
            currentScores={scores}
            savedSimulations={savedSimulations}
            onSaveSimulation={handleSaveSimulation}
            onRestoreSimulation={handleRestoreSimulation}
            onDeleteSimulation={handleDeleteSimulation}
          />
        )}
      </main>

      {/* Floating Sticky Comparison Drawer for quick access on mobile & desktop */}
      {comparedCareers.length > 0 && activeTab === 'simulador' && (
        <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-30 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#001122] text-white rounded-2xl shadow-xl border border-[#2B3B4D] p-3 sm:px-4 sm:py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#7C5E45] flex items-center justify-center text-white shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">
                    {comparedCareers.length} {comparedCareers.length === 1 ? 'carrera seleccionada' : 'carreras seleccionadas'}
                  </span>
                  <span className="text-[10px] text-[#A59582] bg-[#1A2838] px-1.5 py-0.2 rounded border border-[#2B3B4D]">
                    Máx 4
                  </span>
                </div>
                <div className="text-[11px] text-[#B8A99A] truncate hidden sm:block">
                  {comparedCareers.map((c) => `${c.name} (${c.universityShort})`).join(' • ')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setComparedCareerIds([])}
                className="p-2 text-[#A59582] hover:text-white rounded-lg transition"
                title="Limpiar comparador"
                aria-label="Limpiar carreras seleccionadas"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('comparador')}
                className="px-4 py-2 bg-[#7C5E45] hover:bg-[#9A7B62] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition"
              >
                <span>Ver Comparador</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stochastic Detail Modal with University Portal */}
      {detailCareer && (
        <StochasticDetailModal
          career={detailCareer}
          baseScores={scores}
          onClose={() => setDetailCareer(null)}
          onToggleCompare={handleToggleCompare}
          isCompared={comparedCareerIds.includes(detailCareer.id)}
        />
      )}

      {/* Methodology Info Modal */}
      {showMethodologyModal && (
        <MethodologyModal onClose={() => setShowMethodologyModal(false)} />
      )}

      {/* Footer with Data Attribution Notice */}
      <footer className="bg-[#001122] text-[#B8A99A] border-t border-[#1E2E3E] py-8 px-4 text-xs mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white">
              Simulador PAES, Motor Predictivo Estocástico & Portal de Información Universitaria de Chile
            </p>
            <p className="text-[11px] text-[#8C7662] mt-0.5">
              Sistema de Acceso Centralizado • Oferta Académica con &gt;1.000 carreras y programas oficiales.
            </p>
          </div>
          <div className="text-[11px] text-[#8C7662] sm:text-right space-y-0.5">
            <div><strong>Fuentes Oficiales:</strong> DEMRE • MiFuturo.cl • SIES Mineduc • CNA-Chile (Vigente 2025)</div>
            <div>Incluye todas las universidades acreditadas del Consejo de Rectores (CRUCH) y privadas adscritas.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

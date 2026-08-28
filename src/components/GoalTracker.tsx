import React, { useState } from 'react';
import { CareerWithSimulation, PaesScores } from '../types/paes';
import { calculateStochasticAdmission } from '../utils/stochasticModel';
import {
  Target,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Sliders,
} from 'lucide-react';

interface GoalTrackerProps {
  careers: CareerWithSimulation[];
  currentScores: PaesScores;
  onUpdateScores: (scores: PaesScores) => void;
}

export const GoalTracker: React.FC<GoalTrackerProps> = ({
  careers,
  currentScores,
  onUpdateScores,
}) => {
  const [selectedCareerId, setSelectedCareerId] = useState<string>(
    careers[0]?.id || ''
  );

  const selectedCareer =
    careers.find((c) => c.id === selectedCareerId) || careers[0];

  if (!selectedCareer) {
    return null;
  }

  const { simulation, ponderation, metrics } = selectedCareer;
  const targetCutoff = simulation.projectedCutoffNextYear;
  const currentWeighted = simulation.weightedScore;
  const pointsGap = Math.round((targetCutoff - currentWeighted) * 10) / 10;
  const isAlreadySafe = simulation.probability >= 85;

  // Strategic test impact multipliers
  const m1Weight = ponderation.m1;
  const lectoraWeight = ponderation.lectora;
  const m2Weight = ponderation.requiresM2 ? ponderation.m2 : 0;
  const electivaWeight = ponderation.cienciasHistoria;

  // Points needed if focused on only ONE test:
  const pointsNeededM1 = m1Weight > 0 ? Math.ceil(Math.max(0, pointsGap) / m1Weight) : 0;
  const pointsNeededLectora =
    lectoraWeight > 0 ? Math.ceil(Math.max(0, pointsGap) / lectoraWeight) : 0;
  const pointsNeededElectiva =
    electivaWeight > 0 ? Math.ceil(Math.max(0, pointsGap) / electivaWeight) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Target Selector */}
      <div className="bg-white rounded-xl border border-[#E2DAD0] shadow-sm p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EFEAE1]">
          <div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#7C5E45]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#001122]">
                Planificador de Metas & Análisis de Brecha
              </h2>
            </div>
            <p className="text-xs text-[#6B5A4B] mt-0.5">
              Identifica exactamente qué puntajes necesitas en tus próximos ensayos para asegurar tu admisión.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-[#001122] shrink-0">
              Meta Principal:
            </label>
            <select
              value={selectedCareerId}
              onChange={(e) => setSelectedCareerId(e.target.value)}
              className="text-xs font-bold text-[#001122] bg-[#FBF9F5] border border-[#D2C7B8] rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#7C5E45]"
            >
              {careers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - {c.universityShort} ({c.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Target Status Overview Card */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#FBF9F5] p-3.5 rounded-lg border border-[#EAE3D8]">
            <span className="text-[11px] text-[#8C7662] block font-medium">Tu Ponderado Actual</span>
            <span className="text-2xl font-black text-[#001122]">
              {currentWeighted.toFixed(1)} <span className="text-xs font-normal">pts</span>
            </span>
          </div>

          <div className="bg-[#FBF9F5] p-3.5 rounded-lg border border-[#EAE3D8]">
            <span className="text-[11px] text-[#8C7662] block font-medium">
              Corte Meta Proyectado (2025/2026)
            </span>
            <span className="text-2xl font-black text-[#7C5E45]">
              {targetCutoff.toFixed(1)} <span className="text-xs font-normal">pts</span>
            </span>
          </div>

          <div
            className={`p-3.5 rounded-lg border flex flex-col justify-center ${
              isAlreadySafe
                ? 'bg-[#E8F5E9] border-[#C8E6C9]'
                : pointsGap > 0
                ? 'bg-[#FFF9EC] border-[#FFE0B2]'
                : 'bg-[#E8F5E9] border-[#C8E6C9]'
            }`}
          >
            <span className="text-[11px] text-[#6B5A4B] block font-semibold">
              Estado de la Brecha
            </span>
            <div className="flex items-center gap-1.5">
              {isAlreadySafe ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
                  <span className="text-sm font-extrabold text-[#2E7D32]">
                    ¡Meta Cumplida! (+{Math.abs(pointsGap)} pts margen)
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-[#C77700]" />
                  <span className="text-sm font-extrabold text-[#C77700]">
                    Brecha de {pointsGap} puntos ponderados
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Efficiency Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Where to focus effort */}
        <div className="bg-white rounded-xl border border-[#E2DAD0] shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#7C5E45]" />
            <h3 className="font-serif text-base font-bold text-[#001122]">
              Estrategia de Mayor Retorno de Esfuerzo
            </h3>
          </div>
          <p className="text-xs text-[#6B5A4B] leading-relaxed">
            Debido a las ponderaciones específicas de <strong>{selectedCareer.name} ({selectedCareer.universityShort})</strong>, no todas las pruebas rinden igual por cada pregunta correcta.
          </p>

          <div className="space-y-2.5 text-xs">
            {/* M1 recommendation */}
            <div className="p-3 bg-[#FBF9F5] rounded-lg border border-[#EAE3D8] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#001122] block">Matemática 1 (M1)</span>
                <span className="text-[11px] text-[#8C7662]">
                  Pondera el <strong>{(m1Weight * 100)}%</strong> • Mayor impacto
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#6B5A4B] block">Si solo subes M1:</span>
                <strong className="text-sm text-[#7C5E45]">
                  +{pointsNeededM1} pts necesarios
                </strong>
              </div>
            </div>

            {/* Lectora recommendation */}
            <div className="p-3 bg-[#FBF9F5] rounded-lg border border-[#EAE3D8] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#001122]">Competencia Lectora</span>
                <span className="text-[11px] text-[#8C7662] block">
                  Pondera el <strong>{(lectoraWeight * 100)}%</strong>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#6B5A4B] block">Si solo subes Lectora:</span>
                <strong className="text-sm text-[#7C5E45]">
                  +{pointsNeededLectora} pts necesarios
                </strong>
              </div>
            </div>

            {/* Electiva recommendation */}
            <div className="p-3 bg-[#FBF9F5] rounded-lg border border-[#EAE3D8] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#001122]">Prueba Electiva (Ciencias / Hist)</span>
                <span className="text-[11px] text-[#8C7662] block">
                  Pondera el <strong>{(electivaWeight * 100)}%</strong>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#6B5A4B] block">Si solo subes Electiva:</span>
                <strong className="text-sm text-[#7C5E45]">
                  +{pointsNeededElectiva} pts necesarios
                </strong>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#EFEAE1] rounded-lg text-xs text-[#5C4433] leading-relaxed">
            💡 <strong>Consejo Táctico:</strong> Distribuir el objetivo en 3 pruebas (por ejemplo: +{Math.round(pointsNeededM1 * 0.4)} pts en M1, +{Math.round(pointsNeededLectora * 0.3)} pts en Lectora y +{Math.round(pointsNeededElectiva * 0.3)} pts en tu electiva) es mucho más alcanzable en tus próximos ensayos que pretender subir 100 puntos en una sola prueba.
          </div>
        </div>

        {/* Right: Quick Adjuster Sliders */}
        <div className="bg-white rounded-xl border border-[#E2DAD0] shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#7C5E45]" />
            <h3 className="font-serif text-base font-bold text-[#001122]">
              Ajuste Interactivo de Ensayos
            </h3>
          </div>
          <p className="text-xs text-[#6B5A4B]">
            Modifica tus puntajes directamente para ver cómo cambia la probabilidad de admisión en {selectedCareer.name}.
          </p>

          <div className="space-y-3 pt-1">
            {/* M1 Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#001122] mb-1">
                <span>Matemática 1 (M1)</span>
                <span className="text-[#7C5E45] font-black">{currentScores.m1} pts</span>
              </div>
              <input
                type="range"
                min={300}
                max={1000}
                step={10}
                value={currentScores.m1}
                onChange={(e) =>
                  onUpdateScores({ ...currentScores, m1: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-[#E2DAD0] rounded-lg appearance-none cursor-pointer accent-[#7C5E45]"
              />
            </div>

            {/* Lectora Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#001122] mb-1">
                <span>Competencia Lectora</span>
                <span className="text-[#7C5E45] font-black">{currentScores.lectora} pts</span>
              </div>
              <input
                type="range"
                min={300}
                max={1000}
                step={10}
                value={currentScores.lectora}
                onChange={(e) =>
                  onUpdateScores({ ...currentScores, lectora: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-[#E2DAD0] rounded-lg appearance-none cursor-pointer accent-[#7C5E45]"
              />
            </div>

            {/* Ciencias Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#001122] mb-1">
                <span>Prueba de Ciencias</span>
                <span className="text-[#7C5E45] font-black">{currentScores.ciencias || 600} pts</span>
              </div>
              <input
                type="range"
                min={300}
                max={1000}
                step={10}
                value={currentScores.ciencias || 600}
                onChange={(e) =>
                  onUpdateScores({ ...currentScores, ciencias: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-[#E2DAD0] rounded-lg appearance-none cursor-pointer accent-[#7C5E45]"
              />
            </div>

            {/* Historia Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#001122] mb-1">
                <span>Historia y Ciencias Sociales</span>
                <span className="text-[#7C5E45] font-black">{currentScores.historia || 600} pts</span>
              </div>
              <input
                type="range"
                min={300}
                max={1000}
                step={10}
                value={currentScores.historia || 600}
                onChange={(e) =>
                  onUpdateScores({ ...currentScores, historia: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-[#E2DAD0] rounded-lg appearance-none cursor-pointer accent-[#7C5E45]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

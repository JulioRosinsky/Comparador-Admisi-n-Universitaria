import React, { useState } from 'react';
import { CareerWithSimulation } from '../types/paes';
import {
  TrendingUp,
  Award,
  DollarSign,
  Briefcase,
  Check,
  Plus,
  BarChart2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Gift,
  Building,
  GraduationCap
} from 'lucide-react';

interface CareerCardProps {
  career: CareerWithSimulation;
  isCompared: boolean;
  onToggleCompare: (career: CareerWithSimulation) => void;
  onOpenDetail: (career: CareerWithSimulation) => void;
  canCompare: boolean;
}

export const CareerCard: React.FC<CareerCardProps> = ({
  career,
  isCompared,
  onToggleCompare,
  onOpenDetail,
  canCompare,
}) => {
  const { simulation, metrics, subordinateCareers, campusLocation, specialAdmission } = career;
  const isGreen = simulation.category === 'SEGURA';
  const isAmber = simulation.category === 'COMPETITIVA';

  const [showSubordinates, setShowSubordinates] = useState(false);

  return (
    <div
      className={`group bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg flex flex-col justify-between relative overflow-hidden ${
        isCompared
          ? 'border-[#7C5E45] ring-2 ring-[#7C5E45]/20 shadow-md'
          : 'border-[#EAE4DC] hover:border-[#C5B7A6]'
      }`}
    >
      {/* Top Status Accent Stripe */}
      <div
        className={`h-1.5 w-full transition-colors ${
          isGreen ? 'bg-[#2E7D32]' : isAmber ? 'bg-[#D97706]' : 'bg-[#DC2626]'
        }`}
      />

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        {/* Top Header: University Badge, City, CNA & Career Name */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg bg-[#001122] text-[#EFEAE1] font-serif font-bold text-xs shadow-2xs shrink-0">
                {career.universityShort}
              </span>
              <span className="text-xs text-[#7A6B5D] font-medium truncate max-w-[180px]" title={career.universityName}>
                {career.universityName}
              </span>
            </div>

            {/* CNA Accreditation badge */}
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-[#F4EFEA] text-[#5C4433] border border-[#E0D7CC] rounded-full shrink-0">
              <Award className="w-3 h-3 text-[#7C5E45]" />
              {metrics.acreditacionAnos} Años CNA
            </span>
          </div>

          <h3 className="font-serif text-lg font-bold text-[#001122] leading-tight group-hover:text-[#7C5E45] transition-colors">
            {career.name}
          </h3>

          {/* Location & Code metadata */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#8C7662] mt-1.5">
            <span className="flex items-center gap-1 text-[#4A3C31] font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#7C5E45]" />
              {campusLocation?.campusName || metrics.sedeCampus || career.city}
            </span>
            <span>•</span>
            <span>Cód. DEMRE: <strong className="text-[#001122]">{career.code}</strong></span>
            {career.isPlanComun && (
              <>
                <span>•</span>
                <span className="text-[#7C5E45] font-bold flex items-center gap-0.5">
                  <Layers className="w-3 h-3" />
                  Plan Común
                </span>
              </>
            )}
          </div>
        </div>

        {/* Admission & Weighted Score Block */}
        <div className="my-3.5 bg-[#FAF8F5] rounded-xl p-3.5 border border-[#EDE6DC]">
          {/* Scores comparison strip */}
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#E8E0D5]">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C7662] block">
                Tu Ponderado
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#001122] tracking-tight">
                  {simulation.weightedScore.toFixed(1)}
                </span>
                <span className="text-[10px] text-[#8C7662] font-semibold">pts</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C7662] block">
                Corte DEMRE 2024
              </span>
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-base font-bold text-[#5C4433]">
                  {metrics.corte2024.toFixed(1)}
                </span>
                <span
                  className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                    simulation.differenceTo2024Cutoff >= 0
                      ? 'bg-[#E8F5E9] text-[#2E7D32]'
                      : 'bg-[#FFEBEE] text-[#C62828]'
                  }`}
                >
                  {simulation.differenceTo2024Cutoff >= 0 ? '+' : ''}
                  {simulation.differenceTo2024Cutoff.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Probability verdict badge & meter */}
          <div className="pt-2.5">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="flex items-center gap-1.5 text-[#001122]">
                {isGreen && <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />}
                {isAmber && <AlertTriangle className="w-4 h-4 text-[#D97706]" />}
                {!isGreen && !isAmber && <AlertTriangle className="w-4 h-4 text-[#DC2626]" />}
                <span>{simulation.categoryLabel.split('/')[0].trim()}</span>
              </span>
              <span
                className={`font-black text-sm ${
                  isGreen
                    ? 'text-[#2E7D32]'
                    : isAmber
                    ? 'text-[#D97706]'
                    : 'text-[#DC2626]'
                }`}
              >
                {simulation.probability}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#E5DDD2] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isGreen
                    ? 'bg-[#2E7D32]'
                    : isAmber
                    ? 'bg-[#D97706]'
                    : 'bg-[#DC2626]'
                }`}
                style={{ width: `${Math.max(5, simulation.probability)}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-[#8C7662] mt-1.5 font-medium">
              <span>Proyección: <strong>{simulation.projectedCutoffNextYear} pts</strong></span>
              <span>Tendencia: {simulation.annualDrift > 0 ? `+${simulation.annualDrift}` : simulation.annualDrift} pts/año</span>
            </div>
          </div>
        </div>

        {/* Plan Común Collapsible Preview (if applicable) */}
        {career.isPlanComun && subordinateCareers && subordinateCareers.length > 0 && (
          <div className="mb-3 bg-[#F4EFEA] rounded-xl p-2.5 border border-[#E2DAD0]">
            <div className="flex items-center justify-between text-xs font-bold text-[#5C4433]">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#7C5E45]" />
                <span>{subordinateCareers.length} especialidades sin nueva PAES</span>
              </span>
              <button
                type="button"
                onClick={() => setShowSubordinates(!showSubordinates)}
                className="text-[11px] text-[#7C5E45] hover:underline flex items-center gap-0.5 font-bold"
                aria-expanded={showSubordinates}
              >
                {showSubordinates ? 'Ocultar' : 'Ver'}
                {showSubordinates ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showSubordinates ? (
              <div className="mt-2 space-y-1 pt-1.5 border-t border-[#E0D6C8] max-h-36 overflow-y-auto pr-1">
                {subordinateCareers.map((sub) => (
                  <div key={sub.id} className="bg-white p-1.5 rounded-lg border border-[#E5DDD2] text-[11px]">
                    <div className="flex justify-between font-bold text-[#001122]">
                      <span>{sub.name}</span>
                      <span className="text-[#2E7D32]">{sub.employmentRate1Year}% empl.</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {subordinateCareers.slice(0, 3).map((sub) => (
                  <span
                    key={sub.id}
                    className="text-[10px] bg-white text-[#5C4433] px-2 py-0.5 rounded-md border border-[#E0D7CB] font-medium"
                  >
                    {sub.name.replace('Ingeniería Civil', 'Ing. Civil')}
                  </span>
                ))}
                {subordinateCareers.length > 3 && (
                  <span className="text-[10px] bg-[#EAE3D8] text-[#5C4433] px-1.5 py-0.5 rounded-md font-medium">
                    +{subordinateCareers.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* 3 Key MiFuturo & SIES Snapshot Pills */}
        <div className="grid grid-cols-3 gap-1.5 text-center mb-3">
          <div className="bg-[#FAF8F5] p-2 rounded-xl border border-[#EDE6DC]">
            <span className="text-[10px] text-[#8C7662] block font-medium">Empleabilidad</span>
            <strong className="text-xs font-black text-[#001122] block mt-0.5">
              {metrics.empleabilidad1Ano}%
            </strong>
          </div>

          <div className="bg-[#FAF8F5] p-2 rounded-xl border border-[#EDE6DC]">
            <span className="text-[10px] text-[#8C7662] block font-medium">Ingreso 5° año</span>
            <strong className="text-xs font-black text-[#001122] block mt-0.5 truncate">
              ${(metrics.ingreso5Ano / 1000000).toFixed(1)}M
            </strong>
          </div>

          <div className="bg-[#FAF8F5] p-2 rounded-xl border border-[#EDE6DC]">
            <span className="text-[10px] text-[#8C7662] block font-medium">Gratuidad</span>
            <strong className={`text-xs font-black block mt-0.5 ${metrics.adscritoGratuidad ? 'text-[#2E7D32]' : 'text-[#C62828]'}`}>
              {metrics.adscritoGratuidad ? '✓ Sí' : 'No'}
            </strong>
          </div>
        </div>
      </div>

      {/* Action Footer: Buttons with Accessible Touch Targets */}
      <div className="p-3 bg-[#FAF8F5] border-t border-[#EDE6DC] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onOpenDetail(career)}
          className="flex-1 min-h-[42px] px-3 py-2 text-xs font-bold text-[#001122] bg-white hover:bg-[#F2ECE4] active:bg-[#E8E1D5] border border-[#D8CEBF] rounded-xl flex items-center justify-center gap-1.5 transition shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#7C5E45]"
          aria-label={`Ver portal y ficha de ${career.name}`}
        >
          <BarChart2 className="w-4 h-4 text-[#7C5E45]" />
          <span>Ver Ficha & Portal</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleCompare(career)}
          disabled={!isCompared && !canCompare}
          className={`min-h-[42px] px-3.5 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition focus:outline-none focus:ring-2 focus:ring-[#7C5E45] ${
            isCompared
              ? 'bg-[#7C5E45] text-white hover:bg-[#634934] shadow-2xs'
              : canCompare
              ? 'bg-[#001122] text-white hover:bg-[#122336] shadow-2xs'
              : 'bg-[#E5DDD2] text-[#A09588] cursor-not-allowed'
          }`}
          aria-label={isCompared ? `Quitar ${career.name} de comparación` : `Comparar ${career.name}`}
        >
          {isCompared ? (
            <>
              <Check className="w-4 h-4" />
              <span>Comparando</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Comparar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

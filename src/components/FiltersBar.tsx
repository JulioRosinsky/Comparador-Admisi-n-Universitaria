import React from 'react';
import { KnowledgeArea } from '../types/paes';
import { Search, Filter, ArrowUpDown, X, Award, CheckCircle2, Layers, Check } from 'lucide-react';

export interface FilterState {
  search: string;
  area: string;
  university: string;
  region: string;
  gratuityOnly: boolean;
  minCnaYears: number;
  planComunOnly: boolean;
  sortBy: 'probability' | 'weightedScore' | 'corte2026' | 'corte2024' | 'arancelAsc' | 'empleabilidad' | 'ingreso5';
  admissionCategory: 'all' | 'SEGURA' | 'COMPETITIVA' | 'RIESGO_ALTO';
}

interface FiltersBarProps {
  filters: FilterState;
  onChangeFilters: (filters: FilterState) => void;
  availableUniversities: string[];
  availableRegions: string[];
  availableAreas: KnowledgeArea[];
  totalResults: number;
  totalCatalog: number;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onChangeFilters,
  availableUniversities,
  availableRegions,
  availableAreas,
  totalResults,
  totalCatalog,
}) => {
  const handleUpdate = (patch: Partial<FilterState>) => {
    onChangeFilters({ ...filters, ...patch });
  };

  const resetFilters = () => {
    onChangeFilters({
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
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.area !== 'all' ||
    filters.university !== 'all' ||
    filters.region !== 'all' ||
    filters.gratuityOnly ||
    filters.minCnaYears > 0 ||
    filters.planComunOnly ||
    filters.admissionCategory !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-[#EAE4DC] shadow-sm p-4 sm:p-5 transition-all">
      {/* Search Input & Sort Selector Row */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pb-3.5 border-b border-[#EFEAE1]">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C7662] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleUpdate({ search: e.target.value })}
            placeholder="Buscar por carrera (ej: Eléctrica, Medicina), universidad, campus o código DEMRE..."
            className="w-full pl-9.5 pr-8 py-2 text-sm text-[#001122] bg-[#FAF8F5] border border-[#D8CEBF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C5E45] focus:bg-white placeholder-[#9B8C7E] transition"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => handleUpdate({ search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7662] hover:text-[#001122] p-1"
              title="Limpiar búsqueda"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-bold text-[#6B5A4B] flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#7C5E45]" /> Ordenar:
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleUpdate({ sortBy: e.target.value as FilterState['sortBy'] })}
            className="text-xs font-bold text-[#001122] bg-[#FAF8F5] border border-[#D8CEBF] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C5E45]"
          >
            <option value="probability">🟢 Mayor Probabilidad de Admisión</option>
            <option value="weightedScore">Puntaje Ponderado Más Alto</option>
            <option value="corte2026">Puntaje Corte Admisión 2026</option>
            <option value="arancelAsc">Arancel Más Económico</option>
            <option value="empleabilidad">Mayor Empleabilidad 1° Año</option>
            <option value="ingreso5">Mayor Ingreso al 5° Año</option>
          </select>
        </div>
      </div>

      {/* Quick Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-3 pb-2.5 border-b border-[#F4EFEA]">
        <span className="text-[11px] font-bold text-[#8C7662] flex items-center gap-1">
          <Filter className="w-3 h-3 text-[#7C5E45]" /> Filtros rápidos:
        </span>

        {/* CNA 5+ Years */}
        <button
          type="button"
          onClick={() => handleUpdate({ minCnaYears: filters.minCnaYears === 5 ? 0 : 5 })}
          className={`text-xs font-bold px-3 py-1 rounded-full border transition flex items-center gap-1.5 ${
            filters.minCnaYears >= 5
              ? 'bg-[#001122] text-white border-[#001122] shadow-2xs'
              : 'bg-[#FAF8F5] text-[#5C4433] border-[#DDD3C5] hover:bg-[#EFEAE1]'
          }`}
        >
          <Award className="w-3 h-3 text-[#E6C687]" />
          Acreditación &gt; 5 Años CNA
          {filters.minCnaYears >= 5 && <Check className="w-3 h-3 text-emerald-400" />}
        </button>

        {/* Plan Común */}
        <button
          type="button"
          onClick={() => handleUpdate({ planComunOnly: !filters.planComunOnly })}
          className={`text-xs font-bold px-3 py-1 rounded-full border transition flex items-center gap-1.5 ${
            filters.planComunOnly
              ? 'bg-[#7C5E45] text-white border-[#7C5E45] shadow-2xs'
              : 'bg-[#FAF8F5] text-[#5C4433] border-[#DDD3C5] hover:bg-[#EFEAE1]'
          }`}
        >
          <Layers className="w-3 h-3" />
          Plan Común / Con Subordinadas
        </button>

        {/* Gratuity */}
        <button
          type="button"
          onClick={() => handleUpdate({ gratuityOnly: !filters.gratuityOnly })}
          className={`text-xs font-bold px-3 py-1 rounded-full border transition flex items-center gap-1.5 ${
            filters.gratuityOnly
              ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-2xs'
              : 'bg-[#FAF8F5] text-[#5C4433] border-[#DDD3C5] hover:bg-[#EFEAE1]'
          }`}
        >
          <span>🎓 Con Gratuidad</span>
        </button>

        {/* Quick Area Tags */}
        <button
          type="button"
          onClick={() => handleUpdate({ area: filters.area === 'Salud y Medicina' ? 'all' : 'Salud y Medicina' })}
          className={`text-xs font-bold px-3 py-1 rounded-full border transition ${
            filters.area === 'Salud y Medicina'
              ? 'bg-[#001122] text-white border-[#001122] shadow-2xs'
              : 'bg-[#FAF8F5] text-[#6B5A4B] border-[#DDD3C5] hover:bg-[#EFEAE1]'
          }`}
        >
          🩺 Salud
        </button>

        <button
          type="button"
          onClick={() => handleUpdate({ area: filters.area === 'Ingeniería y Tecnología' ? 'all' : 'Ingeniería y Tecnología' })}
          className={`text-xs font-bold px-3 py-1 rounded-full border transition ${
            filters.area === 'Ingeniería y Tecnología'
              ? 'bg-[#001122] text-white border-[#001122] shadow-2xs'
              : 'bg-[#FAF8F5] text-[#6B5A4B] border-[#DDD3C5] hover:bg-[#EFEAE1]'
          }`}
        >
          ⚙️ Ingeniería
        </button>

        <button
          type="button"
          onClick={() => handleUpdate({ area: filters.area === 'Derecho y Ciencias Sociales' ? 'all' : 'Derecho y Ciencias Sociales' })}
          className={`text-xs font-bold px-3 py-1 rounded-full border transition ${
            filters.area === 'Derecho y Ciencias Sociales'
              ? 'bg-[#001122] text-white border-[#001122] shadow-2xs'
              : 'bg-[#FAF8F5] text-[#6B5A4B] border-[#DDD3C5] hover:bg-[#EFEAE1]'
          }`}
        >
          ⚖️ Derecho
        </button>

        <button
          type="button"
          onClick={() => handleUpdate({ area: filters.area === 'Administración y Comercio' ? 'all' : 'Administración y Comercio' })}
          className={`text-xs font-bold px-3 py-1 rounded-full border transition ${
            filters.area === 'Administración y Comercio'
              ? 'bg-[#001122] text-white border-[#001122] shadow-2xs'
              : 'bg-[#FAF8F5] text-[#6B5A4B] border-[#DDD3C5] hover:bg-[#EFEAE1]'
          }`}
        >
          📊 Negocios
        </button>
      </div>

      {/* Structured Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-3">
        {/* Knowledge Area */}
        <div>
          <label className="text-[11px] font-bold text-[#6B5A4B] block mb-1">
            Área de Conocimiento
          </label>
          <select
            value={filters.area}
            onChange={(e) => handleUpdate({ area: e.target.value })}
            className="w-full text-xs font-semibold text-[#001122] bg-[#FAF8F5] border border-[#D8CEBF] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#7C5E45]"
          >
            <option value="all">Todas las áreas ({totalCatalog})</option>
            {availableAreas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* University */}
        <div>
          <label className="text-[11px] font-bold text-[#6B5A4B] block mb-1">Universidad</label>
          <select
            value={filters.university}
            onChange={(e) => handleUpdate({ university: e.target.value })}
            className="w-full text-xs font-semibold text-[#001122] bg-[#FAF8F5] border border-[#D8CEBF] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#7C5E45]"
          >
            <option value="all">Todas las universidades</option>
            {availableUniversities.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="text-[11px] font-bold text-[#6B5A4B] block mb-1">Región / Sede</label>
          <select
            value={filters.region}
            onChange={(e) => handleUpdate({ region: e.target.value })}
            className="w-full text-xs font-semibold text-[#001122] bg-[#FAF8F5] border border-[#D8CEBF] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#7C5E45]"
          >
            <option value="all">Todas las regiones</option>
            {availableRegions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Admission Category */}
        <div>
          <label className="text-[11px] font-bold text-[#6B5A4B] block mb-1">
            Estado de Admisión
          </label>
          <select
            value={filters.admissionCategory}
            onChange={(e) =>
              handleUpdate({ admissionCategory: e.target.value as FilterState['admissionCategory'] })
            }
            className="w-full text-xs font-semibold text-[#001122] bg-[#FAF8F5] border border-[#D8CEBF] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#7C5E45]"
          >
            <option value="all">Todos los estados</option>
            <option value="SEGURA">🟢 Admisión Segura (P ≥ 85%)</option>
            <option value="COMPETITIVA">🟡 Competitivo / Espera (40% - 85%)</option>
            <option value="RIESGO_ALTO">🔴 Bajo Corte / Riesgo (P &lt; 40%)</option>
          </select>
        </div>

        {/* CNA Accreditation */}
        <div>
          <label className="text-[11px] font-bold text-[#6B5A4B] block mb-1">
            Acreditación Institucional
          </label>
          <select
            value={filters.minCnaYears}
            onChange={(e) => handleUpdate({ minCnaYears: parseInt(e.target.value) || 0 })}
            className="w-full text-xs font-semibold text-[#001122] bg-[#FAF8F5] border border-[#D8CEBF] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#7C5E45]"
          >
            <option value="0">Cualquier Acreditación</option>
            <option value="5">⭐⭐ 5+ Años (Avanzada / Excelencia)</option>
            <option value="6">⭐⭐⭐ 6+ Años (Alta Excelencia)</option>
            <option value="7">⭐⭐⭐⭐ 7 Años (Máxima Excelencia)</option>
          </select>
        </div>
      </div>

      {/* Results summary bar & reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 mt-3 border-t border-[#EFEAE1] text-xs gap-2">
        <div className="text-[#6B5A4B] flex items-center gap-2">
          <span>
            Mostrando <strong className="text-[#001122] font-bold">{totalResults}</strong> opciones de{' '}
            {totalCatalog} en el catálogo oficial.
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-[#7C5E45] hover:text-[#5C4433] font-bold flex items-center gap-1 transition"
          >
            <X className="w-3.5 h-3.5" /> Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
};

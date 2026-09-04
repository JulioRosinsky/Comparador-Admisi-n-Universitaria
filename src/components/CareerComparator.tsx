import React, { useState } from 'react';
import { Career, CareerWithSimulation } from '../types/paes';
import {
  Layers,
  X,
  Plus,
  FileDown,
  CheckCircle,
  AlertTriangle,
  Building,
  DollarSign,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  MapPin,
  Gift,
  ExternalLink,
  Info
} from 'lucide-react';
import { DATA_SOURCES } from '../data/sourcesAttribution';

interface CareerComparatorProps {
  comparedCareers: CareerWithSimulation[];
  onRemoveFromCompare: (careerId: string) => void;
  onAddFromCatalog: (careerId: string) => void;
  allCareers: CareerWithSimulation[];
  onExportPDF: () => void;
}

export const CareerComparator: React.FC<CareerComparatorProps> = ({
  comparedCareers,
  onRemoveFromCompare,
  onAddFromCatalog,
  allCareers,
  onExportPDF,
}) => {
  const [activeDimension, setActiveDimension] = useState<
    'all' | 'admision' | 'empleabilidad' | 'academica' | 'institucional' | 'financiera' | 'especiales'
  >('all');

  const [selectedToAddId, setSelectedToAddId] = useState<string>('');

  const availableToAdd = allCareers.filter(
    (c) => !comparedCareers.some((cmp) => cmp.id === c.id)
  );

  const handleAddSelection = () => {
    if (selectedToAddId) {
      onAddFromCatalog(selectedToAddId);
      setSelectedToAddId('');
    }
  };

  if (comparedCareers.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E2DAD0] p-8 sm:p-12 text-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-[#F7F4EF] text-[#7C5E45] flex items-center justify-center mx-auto mb-4 border border-[#DCD3C7]">
          <Layers className="w-7 h-7" />
        </div>
        <h3 className="font-serif text-xl font-bold text-[#001122]">
          Comparador Multicarrera (Hasta 4 opciones)
        </h3>
        <p className="text-sm text-[#6B5A4B] max-w-lg mx-auto mt-1 mb-6">
          No tienes carreras seleccionadas aún. Puedes agregar opciones desde el catálogo de tarjetas o seleccionar rápidamente desde este menú.
        </p>

        <div className="max-w-md mx-auto flex items-center gap-2">
          <select
            value={selectedToAddId}
            onChange={(e) => setSelectedToAddId(e.target.value)}
            className="flex-1 text-sm bg-[#FBF9F5] border border-[#D2C7B8] rounded-lg px-3 py-2 text-[#001122] focus:ring-1 focus:ring-[#7C5E45]"
          >
            <option value="">Selecciona una carrera del catálogo...</option>
            {availableToAdd.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} - {c.universityShort} ({c.city})
              </option>
            ))}
          </select>
          <button
            onClick={handleAddSelection}
            disabled={!selectedToAddId}
            className="px-4 py-2 bg-[#001122] hover:bg-[#122336] text-white text-sm font-semibold rounded-lg disabled:bg-[#D2C7B8] transition"
          >
            Agregar
          </button>
        </div>
      </div>
    );
  }

  // Best-in-class helpers for visual diff highlights
  const maxProbability = Math.max(...comparedCareers.map((c) => c.simulation.probability));
  const minArancel = Math.min(...comparedCareers.map((c) => c.metrics.arancelAnualCLP));
  const maxIngreso5 = Math.max(...comparedCareers.map((c) => c.metrics.ingreso5Ano));
  const maxEmpleabilidad = Math.max(...comparedCareers.map((c) => c.metrics.empleabilidad1Ano));
  const minDuracionReal = Math.min(...comparedCareers.map((c) => c.metrics.duracionRealSemestres));
  const maxAcreditacion = Math.max(...comparedCareers.map((c) => c.metrics.acreditacionAnos));

  return (
    <div className="space-y-6">
      {/* Top Header & Dimension Tabs */}
      <div className="bg-white rounded-xl border border-[#E2DAD0] shadow-sm p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-[#EFEAE1]">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#7C5E45]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#001122]">
                Matriz Comparativa de 50 Métricas Clave & Trazabilidad
              </h2>
              <span className="bg-[#7C5E45] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {comparedCareers.length} de 4
              </span>
            </div>
            <p className="text-xs text-[#6B5A4B] mt-0.5">
              Contraste oficial con datos trazables de DEMRE, MiFuturo.cl, SIES Mineduc y Comisión Nacional de Acreditación CNA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {comparedCareers.length < 4 && (
              <div className="flex items-center gap-1.5 text-xs">
                <select
                  value={selectedToAddId}
                  onChange={(e) => setSelectedToAddId(e.target.value)}
                  className="text-xs bg-[#FBF9F5] border border-[#D2C7B8] rounded-md px-2.5 py-1.5 text-[#001122] max-w-[200px]"
                >
                  <option value="">+ Añadir otra carrera...</option>
                  {availableToAdd.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.universityShort})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddSelection}
                  disabled={!selectedToAddId}
                  className="px-2.5 py-1.5 bg-[#001122] hover:bg-[#122336] text-white font-medium rounded-md disabled:bg-[#D2C7B8] transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={onExportPDF}
              className="px-3 py-1.5 bg-[#7C5E45] hover:bg-[#9A7B62] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 shadow-sm transition"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Exportar PDF</span>
            </button>
          </div>
        </div>

        {/* Dimension Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 text-xs">
          <button
            onClick={() => setActiveDimension('all')}
            className={`px-3 py-1.5 rounded-md font-semibold transition shrink-0 ${
              activeDimension === 'all'
                ? 'bg-[#001122] text-white'
                : 'bg-[#F7F4EF] text-[#6B5A4B] hover:bg-[#EFEAE1]'
            }`}
          >
            Todas las Dimensiones (50)
          </button>
          <button
            onClick={() => setActiveDimension('admision')}
            className={`px-3 py-1.5 rounded-md font-semibold transition shrink-0 ${
              activeDimension === 'admision'
                ? 'bg-[#001122] text-white'
                : 'bg-[#F7F4EF] text-[#6B5A4B] hover:bg-[#EFEAE1]'
            }`}
          >
            1. Admisión & Ponderaciones (DEMRE)
          </button>
          <button
            onClick={() => setActiveDimension('empleabilidad')}
            className={`px-3 py-1.5 rounded-md font-semibold transition shrink-0 ${
              activeDimension === 'empleabilidad'
                ? 'bg-[#001122] text-white'
                : 'bg-[#F7F4EF] text-[#6B5A4B] hover:bg-[#EFEAE1]'
            }`}
          >
            2. Empleabilidad & Salarios (MiFuturo)
          </button>
          <button
            onClick={() => setActiveDimension('academica')}
            className={`px-3 py-1.5 rounded-md font-semibold transition shrink-0 ${
              activeDimension === 'academica'
                ? 'bg-[#001122] text-white'
                : 'bg-[#F7F4EF] text-[#6B5A4B] hover:bg-[#EFEAE1]'
            }`}
          >
            3. Titulación & Docencia (SIES)
          </button>
          <button
            onClick={() => setActiveDimension('institucional')}
            className={`px-3 py-1.5 rounded-md font-semibold transition shrink-0 ${
              activeDimension === 'institucional'
                ? 'bg-[#001122] text-white'
                : 'bg-[#F7F4EF] text-[#6B5A4B] hover:bg-[#EFEAE1]'
            }`}
          >
            4. Calidad CNA (&gt;5 Años)
          </button>
          <button
            onClick={() => setActiveDimension('financiera')}
            className={`px-3 py-1.5 rounded-md font-semibold transition shrink-0 ${
              activeDimension === 'financiera'
                ? 'bg-[#001122] text-white'
                : 'bg-[#F7F4EF] text-[#6B5A4B] hover:bg-[#EFEAE1]'
            }`}
          >
            5. Aranceles & Beneficios
          </button>
          <button
            onClick={() => setActiveDimension('especiales')}
            className={`px-3 py-1.5 rounded-md font-semibold transition shrink-0 ${
              activeDimension === 'especiales'
                ? 'bg-[#7C5E45] text-white'
                : 'bg-[#F7F4EF] text-[#6B5A4B] hover:bg-[#EFEAE1]'
            }`}
          >
            6. Vías Especiales, Campus & Plan Común
          </button>
        </div>
      </div>

      {/* Main 50-Metric Comparison Table (Responsive Horizontal Scroll) */}
      <div className="bg-white rounded-xl border border-[#E2DAD0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            {/* Table Header: Careers Pins */}
            <thead>
              <tr className="bg-[#001122] text-white divide-x divide-[#1A2C3D]">
                <th className="p-4 w-[250px] text-xs font-serif uppercase tracking-wider text-[#D8C7B5] align-bottom">
                  Dimensión & Métrica
                </th>
                {comparedCareers.map((c) => (
                  <th key={c.id} className="p-4 text-xs align-top relative min-w-[210px]">
                    <button
                      onClick={() => onRemoveFromCompare(c.id)}
                      className="absolute top-2 right-2 p-1 text-[#A09588] hover:text-white bg-[#0A1A2B] rounded-full transition"
                      title="Quitar carrera"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="pr-6">
                      <span className="px-2 py-0.5 rounded bg-[#7C5E45] text-white font-serif font-bold text-[10px] inline-block mb-1">
                        {c.universityShort}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-white leading-tight">
                        {c.name}
                      </h4>
                      <p className="text-[10px] text-[#A09588] mt-0.5">{c.universityName}</p>
                      <div className="text-[9.5px] text-[#E6C687] mt-1 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" /> {c.campusLocation?.campusName || c.city}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EAE3D8] text-xs text-[#001122]">
              {/* ======================================================== */}
              {/* DIMENSIÓN 1: ADMISIÓN Y PONDERACIONES (DEMRE) [1 - 16]  */}
              {/* ======================================================== */}
              {(activeDimension === 'all' || activeDimension === 'admision') && (
                <>
                  <tr className="bg-[#F7F4EF] font-bold text-xs text-[#7C5E45]">
                    <td colSpan={comparedCareers.length + 1} className="py-2.5 px-4 font-serif flex items-center justify-between">
                      <span>1. Dimensión Admisión y Ponderaciones</span>
                      <span className="text-[10px] text-[#8C7662] font-normal italic">Fuente oficial: DEMRE Proceso 2024</span>
                    </td>
                  </tr>

                  {/* 1. Puntaje Ponderado */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 font-semibold text-[#5C4433]">
                      1. Tu Puntaje Ponderado
                      <span className="block text-[9px] text-[#9A8B7D] font-normal italic">Fuente: Cálculo según ponderaciones DEMRE</span>
                    </td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 font-black text-sm text-[#001122]">
                        {c.simulation.weightedScore.toFixed(1)} pts
                      </td>
                    ))}
                  </tr>

                  {/* 2. Probabilidad Estocástica */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8] bg-[#FDFBF7]">
                    <td className="p-3 font-semibold text-[#5C4433]">
                      2. Probabilidad Estocástica
                      <span className="block text-[9px] text-[#9A8B7D] font-normal italic">Fuente: Motor Monte Carlo 1.000 simulaciones</span>
                    </td>
                    {comparedCareers.map((c) => {
                      const isTop = c.simulation.probability === maxProbability && comparedCareers.length > 1;
                      return (
                        <td key={c.id} className="p-3">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-black text-sm ${
                                c.simulation.category === 'SEGURA'
                                  ? 'text-[#2E7D32]'
                                  : c.simulation.category === 'COMPETITIVA'
                                  ? 'text-[#C77700]'
                                  : 'text-[#C62828]'
                              }`}
                            >
                              {c.simulation.probability}%
                            </span>
                            {isTop && (
                              <span className="text-[9px] bg-[#E8F5E9] text-[#2E7D32] px-1 py-0.2 rounded font-bold">
                                Más Alta
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#8C7662] block mt-0.5">
                            {c.simulation.categoryLabel}
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* 3. Corte Admisión 2026 */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 font-semibold text-[#5C4433]">
                      3. Corte Último Matriculado 2026
                      <span className="block text-[9px] text-[#9A8B7D] font-normal italic">Fuente: DEMRE Compendio Estadístico Oficial Admisión 2026</span>
                    </td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 font-black text-[#001122]">
                        {c.metrics.corte2026 || c.metrics.corte2024} pts
                      </td>
                    ))}
                  </tr>

                  {/* 4. Corte 2025 */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">4. Corte 2025</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[#5C4433] font-semibold">
                        {c.metrics.corte2025 || (c.metrics.corte2024 - 1.5)} pts
                      </td>
                    ))}
                  </tr>

                  {/* 5. Corte 2024 */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">5. Corte 2024</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[#5C4433]">
                        {c.metrics.corte2024} pts
                      </td>
                    ))}
                  </tr>

                  {/* 6. Corte 2023 */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">6. Corte 2023</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[#5C4433]">
                        {c.metrics.corte2023} pts
                      </td>
                    ))}
                  </tr>

                  {/* 7. Corte 2022 */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">7. Corte 2022</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[#5C4433]">
                        {c.metrics.corte2022} pts
                      </td>
                    ))}
                  </tr>

                  {/* 8. Promedio 5 Años */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8] bg-[#FDFBF7]">
                    <td className="p-3 font-semibold text-[#5C4433]">
                      8. Promedio Corte 5 Años (μ)
                      <span className="block text-[9px] text-[#9A8B7D] font-normal italic">Fuente: Serie histórica DEMRE 2020-2024</span>
                    </td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 font-bold text-[#001122]">
                        {c.metrics.promedioCorte5Anos} pts
                      </td>
                    ))}
                  </tr>

                  {/* 9. Vacantes Regulares */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">
                      9. Vacantes Regulares Ofrecidas
                      <span className="block text-[9px] text-[#9A8B7D] font-normal italic">Fuente: DEMRE Oferta de Carreras y Vacantes</span>
                    </td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 font-medium">
                        {c.metrics.vacantesRegulares} cupos
                      </td>
                    ))}
                  </tr>

                  {/* 10. % NEM */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">10. % Ponderación NEM</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3">
                        {c.metrics.ponderacionNEM}%
                      </td>
                    ))}
                  </tr>

                  {/* 11. % Ranking */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">11. % Ponderación Ranking</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3">
                        {c.metrics.ponderacionRanking}%
                      </td>
                    ))}
                  </tr>

                  {/* 12. % Lectora */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">12. % Ponderación Comp. Lectora</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3">
                        {c.metrics.ponderacionLectora}%
                      </td>
                    ))}
                  </tr>

                  {/* 13. % M1 */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">13. % Ponderación M1</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3">
                        {c.metrics.ponderacionM1}%
                      </td>
                    ))}
                  </tr>

                  {/* 14. % M2 */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">14. % Ponderación M2 (Exigencia)</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 font-medium">
                        {c.metrics.exigenciaM2Texto}
                      </td>
                    ))}
                  </tr>

                  {/* 15. % Ciencias / Historia */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">15. % Ponderación Ciencias / Historia</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3">
                        {c.metrics.ponderacionCienciasHistoria}% (Opt. Automática)
                      </td>
                    ))}
                  </tr>

                  {/* 16. Mínimo de Postulación */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">16. Requisito Mínimo Postulación</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[11px] text-[#5C4433]">
                        {c.metrics.minimoPostulacion}
                      </td>
                    ))}
                  </tr>
                </>
              )}

              {/* ======================================================== */}
              {/* DIMENSIÓN 2: EMPLEABILIDAD E INSERCIÓN (MIFUTURO.CL)     */}
              {/* ======================================================== */}
              {(activeDimension === 'all' || activeDimension === 'empleabilidad') && (
                <>
                  <tr className="bg-[#F7F4EF] font-bold text-xs text-[#7C5E45]">
                    <td colSpan={comparedCareers.length + 1} className="py-2.5 px-4 font-serif flex items-center justify-between">
                      <span>2. Dimensión Empleabilidad e Inserción Laboral</span>
                      <span className="text-[10px] text-[#8C7662] font-normal italic">Fuente oficial: MiFuturo.cl / SII</span>
                    </td>
                  </tr>

                  {/* 17. Empleabilidad 1° Año */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 font-semibold text-[#5C4433]">
                      17. Empleabilidad al 1° Año
                      <span className="block text-[9px] text-[#9A8B7D] font-normal italic">Fuente: MiFuturo.cl / Cruzamiento SIES-SII</span>
                    </td>
                    {comparedCareers.map((c) => {
                      const isTop = c.metrics.empleabilidad1Ano === maxEmpleabilidad && comparedCareers.length > 1;
                      return (
                        <td key={c.id} className="p-3 font-bold">
                          <span className="text-[#001122]">{c.metrics.empleabilidad1Ano}%</span>
                          {isTop && (
                            <span className="ml-1 text-[9px] bg-[#E8F5E9] text-[#2E7D32] px-1 py-0.2 rounded font-bold">
                              Líder
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 18. Empleabilidad 2° Año */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">18. Empleabilidad al 2° Año</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 font-bold text-[#001122]">
                        {c.metrics.empleabilidad2Ano}%
                      </td>
                    ))}
                  </tr>

                  {/* 19. Ingreso 1° Año */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">19. Ingreso Bruto al 1° Año</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3">
                        ${c.metrics.ingreso1Ano.toLocaleString('es-CL')}
                      </td>
                    ))}
                  </tr>

                  {/* 20. Ingreso 2° Año */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">20. Ingreso Bruto al 2° Año</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3">
                        ${c.metrics.ingreso2Ano.toLocaleString('es-CL')}
                      </td>
                    ))}
                  </tr>

                  {/* 21. Ingreso 3° Año */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">21. Ingreso Bruto al 3° Año</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3">
                        ${c.metrics.ingreso3Ano.toLocaleString('es-CL')}
                      </td>
                    ))}
                  </tr>

                  {/* 22. Ingreso 4° Año */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">22. Ingreso Bruto al 4° Año</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3">
                        ${c.metrics.ingreso4Ano.toLocaleString('es-CL')}
                      </td>
                    ))}
                  </tr>

                  {/* 23. Ingreso 5° Año */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8] bg-[#FDFBF7]">
                    <td className="p-3 font-semibold text-[#5C4433]">
                      23. Ingreso Bruto al 5° Año
                      <span className="block text-[9px] text-[#9A8B7D] font-normal italic">Fuente: MiFuturo.cl / Ingresos reales tributables</span>
                    </td>
                    {comparedCareers.map((c) => {
                      const isTop = c.metrics.ingreso5Ano === maxIngreso5 && comparedCareers.length > 1;
                      return (
                        <td key={c.id} className="p-3 font-black text-sm text-[#001122]">
                          ${c.metrics.ingreso5Ano.toLocaleString('es-CL')}
                          {isTop && (
                            <span className="ml-1 text-[9px] bg-[#E8F5E9] text-[#2E7D32] px-1 py-0.2 rounded font-bold">
                              Mayor Ingreso
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 24. Tramo / Mediana 5° Año */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">24. Tramo Mediana al 5° Año</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 font-semibold text-[#7C5E45]">
                        {c.metrics.tramoIngreso5AnoMediana}
                      </td>
                    ))}
                  </tr>

                  {/* 25. Percentil 10 */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">25. Ingreso Percentil 10 (P10)</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[#6B5A4B]">
                        ${c.metrics.ingresoP10.toLocaleString('es-CL')}
                      </td>
                    ))}
                  </tr>

                  {/* 26. Percentil 25 */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">26. Ingreso Percentil 25 (P25)</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[#6B5A4B]">
                        ${c.metrics.ingresoP25.toLocaleString('es-CL')}
                      </td>
                    ))}
                  </tr>

                  {/* 27. Percentil 75 */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">27. Ingreso Percentil 75 (P75)</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[#001122] font-medium">
                        ${c.metrics.ingresoP75.toLocaleString('es-CL')}
                      </td>
                    ))}
                  </tr>

                  {/* 28. Percentil 90 */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">28. Ingreso Percentil 90 (P90)</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 font-bold text-[#001122]">
                        ${c.metrics.ingresoP90.toLocaleString('es-CL')}
                      </td>
                    ))}
                  </tr>

                  {/* 29. Brecha Salarial Nacional */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">29. Brecha vs Promedio Nacional</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[#2E7D32] font-semibold">
                        {c.metrics.brechaSalarialNacional}
                      </td>
                    ))}
                  </tr>

                  {/* 30. Sectores Económicos */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">30. Principales Sectores Contratación</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[11px] text-[#5C4433]">
                        <ul className="list-disc list-inside space-y-0.5">
                          {c.metrics.principalesSectoresContratacion.map((s, idx) => (
                            <li key={idx} className="truncate max-w-[200px]" title={s}>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </>
              )}

              {/* ======================================================== */}
              {/* DIMENSIÓN 3: ACADÉMICA Y EFICIENCIA DE TITULACIÓN (SIES) */}
              {/* ======================================================== */}
              {(activeDimension === 'all' || activeDimension === 'academica') && (
                <>
                  <tr className="bg-[#F7F4EF] font-bold text-xs text-[#7C5E45]">
                    <td colSpan={comparedCareers.length + 1} className="py-2.5 px-4 font-serif flex items-center justify-between">
                      <span>3. Dimensión Académica y Eficiencia de Titulación</span>
                      <span className="text-[10px] text-[#8C7662] font-normal italic">Fuente oficial: SIES Ministerio de Educación</span>
                    </td>
                  </tr>

                  {/* 31. Duración Formal */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">
                      31. Duración Formal
                      <span className="block text-[9px] text-[#9A8B7D] font-normal italic">Fuente: Malla oficial Mineduc / SIES</span>
                    </td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 font-medium">
                        {c.metrics.duracionFormalSemestres} semestres ({c.metrics.duracionFormalSemestres / 2} años)
                      </td>
                    ))}
                  </tr>

                  {/* 32. Duración Real */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8] bg-[#FDFBF7]">
                    <td className="p-3 font-semibold text-[#5C4433]">
                      32. Duración Real de Titulación
                      <span className="block text-[9px] text-[#9A8B7D] font-normal italic">Fuente: SIES Indicadores de Titulación</span>
                    </td>
                    {comparedCareers.map((c) => {
                      const isShortest = c.metrics.duracionRealSemestres === minDuracionReal && comparedCareers.length > 1;
                      return (
                        <td key={c.id} className="p-3 font-bold text-[#001122]">
                          {c.metrics.duracionRealSemestres} semestres
                          {isShortest && (
                            <span className="ml-1 text-[9px] bg-[#E8F5E9] text-[#2E7D32] px-1 py-0.2 rounded font-bold">
                              Más Oportuna
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 33. Sobreduración */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">33. Sobreduración Promedio</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[#7C5E45] font-semibold">
                        +{c.metrics.sobreduracionSemestres} semestres extra
                      </td>
                    ))}
                  </tr>

                  {/* 34. Retención 1° a 2° Año */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">34. Retención 1° a 2° Año</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 font-bold text-[#2E7D32]">
                        {c.metrics.retencion1a2Ano}%
                      </td>
                    ))}
                  </tr>

                  {/* 35. Titulación Oportuna */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">35. Tasa de Titulación Oportuna</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3">
                        {c.metrics.titulacionOportuna}%
                      </td>
                    ))}
                  </tr>

                  {/* 36. Jornada */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">36. Jornada</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3">
                        {c.metrics.jornada}
                      </td>
                    ))}
                  </tr>

                  {/* 37. Sede y Campus */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">37. Sede y Campus</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[11px]">
                        {c.metrics.sedeCampus}
                      </td>
                    ))}
                  </tr>

                  {/* 38. Grado y Título */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">38. Grado y Título Otorgado</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[11px] text-[#5C4433]">
                        {c.metrics.gradoYTitulo}
                      </td>
                    ))}
                  </tr>

                  {/* 39. Ratio Estudiantes/Docente */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">39. Ratio Estudiantes / Docente JCE</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 font-semibold">
                        {c.metrics.ratioEstudiantesDocenteJCE}
                      </td>
                    ))}
                  </tr>

                  {/* 40. Docentes con Postgrado */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">40. % Docentes con Postgrado</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 font-bold text-[#001122]">
                        {c.metrics.porcentajeDocentesPostgrado}%
                      </td>
                    ))}
                  </tr>
                </>
              )}

              {/* ======================================================== */}
              {/* DIMENSIÓN 4: INSTITUCIONAL Y CALIDAD (CNA / MINEDUC)     */}
              {/* ======================================================== */}
              {(activeDimension === 'all' || activeDimension === 'institucional') && (
                <>
                  <tr className="bg-[#F7F4EF] font-bold text-xs text-[#7C5E45]">
                    <td colSpan={comparedCareers.length + 1} className="py-2.5 px-4 font-serif flex items-center justify-between">
                      <span>4. Dimensión Institucional y Calidad (CNA-Chile)</span>
                      <span className="text-[10px] text-[#8C7662] font-normal italic">Fuente oficial: Comisión Nacional de Acreditación</span>
                    </td>
                  </tr>

                  {/* 41. Años de Acreditación CNA */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8] bg-[#FDFBF7]">
                    <td className="p-3 font-semibold text-[#5C4433]">
                      41. Años de Acreditación CNA
                      <span className="block text-[9px] text-[#9A8B7D] font-normal italic">Fuente: Registro Público de Acreditación CNA</span>
                    </td>
                    {comparedCareers.map((c) => {
                      const isTop = c.metrics.acreditacionAnos === maxAcreditacion && comparedCareers.length > 1;
                      return (
                        <td key={c.id} className="p-3 font-black text-sm text-[#2E7D32]">
                          {c.metrics.acreditacionAnos} Años
                          {isTop && (
                            <span className="ml-1 text-[9px] bg-[#E8F5E9] text-[#2E7D32] px-1 py-0.2 rounded font-bold">
                              Máxima
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 42. Nivel de Acreditación */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">42. Nivel de Acreditación CNA</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 font-semibold text-[#001122]">
                        {c.metrics.acreditacionNivel}
                      </td>
                    ))}
                  </tr>

                  {/* 43. Áreas Acreditadas */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">43. Áreas Acreditadas</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[11px] text-[#5C4433]">
                        {c.metrics.areasAcreditadas.length} áreas ({c.metrics.areasAcreditadas.join(', ')})
                      </td>
                    ))}
                  </tr>

                  {/* 44. Tipo de Institución */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">44. Tipo de Institución</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 font-medium">
                        {c.metrics.tipoInstitucion}
                      </td>
                    ))}
                  </tr>

                  {/* 45. Total Matriculados */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">45. Matrícula Total Institucional</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3">
                        {c.metrics.totalMatriculadosInstitucion.toLocaleString('es-CL')} estudiantes
                      </td>
                    ))}
                  </tr>
                </>
              )}

              {/* ======================================================== */}
              {/* DIMENSIÓN 5: FINANCIERA, ARANCELES Y BENEFICIOS (MINEDUC)*/}
              {/* ======================================================== */}
              {(activeDimension === 'all' || activeDimension === 'financiera') && (
                <>
                  <tr className="bg-[#F7F4EF] font-bold text-xs text-[#7C5E45]">
                    <td colSpan={comparedCareers.length + 1} className="py-2.5 px-4 font-serif flex items-center justify-between">
                      <span>5. Dimensión Financiera, Aranceles y Beneficios</span>
                      <span className="text-[10px] text-[#8C7662] font-normal italic">Fuente oficial: Mineduc / SIES</span>
                    </td>
                  </tr>

                  {/* 46. Arancel Anual */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8] bg-[#FDFBF7]">
                    <td className="p-3 font-semibold text-[#5C4433]">
                      46. Arancel Anual Real
                      <span className="block text-[9px] text-[#9A8B7D] font-normal italic">Fuente: Mineduc Catálogo de Aranceles Oficial</span>
                    </td>
                    {comparedCareers.map((c) => {
                      const isCheapest = c.metrics.arancelAnualCLP === minArancel && comparedCareers.length > 1;
                      return (
                        <td key={c.id} className="p-3 font-black text-sm text-[#001122]">
                          ${c.metrics.arancelAnualCLP.toLocaleString('es-CL')}
                          {isCheapest && (
                            <span className="ml-1 text-[9px] bg-[#E8F5E9] text-[#2E7D32] px-1 py-0.2 rounded font-bold">
                              Más Económico
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 47. Arancel Referencia */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">47. Arancel de Referencia Oficial</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[#6B5A4B]">
                        ${c.metrics.arancelReferenciaCLP.toLocaleString('es-CL')}
                      </td>
                    ))}
                  </tr>

                  {/* 48. Copago Anual Estimado */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">48. Copago / Brecha Anual Estimada</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 font-bold text-[#7C5E45]">
                        ${c.metrics.copagoAnualEstimadoCLP.toLocaleString('es-CL')}
                      </td>
                    ))}
                  </tr>

                  {/* 49. Costo de Matrícula */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 text-[#6B5A4B]">49. Costo de Matrícula Anual</td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3">
                        ${c.metrics.matriculaAnualCLP.toLocaleString('es-CL')}
                      </td>
                    ))}
                  </tr>

                  {/* 50. Adscripción Gratuidad & Ayudas */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8] bg-[#FDFBF7]">
                    <td className="p-3 font-semibold text-[#5C4433]">
                      50. Gratuidad & Beneficios Estatales
                      <span className="block text-[9px] text-[#9A8B7D] font-normal italic">Fuente: Subdere / Mineduc Gratuidad 2024</span>
                    </td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                            c.metrics.adscritoGratuidad
                              ? 'bg-[#E8F5E9] text-[#2E7D32]'
                              : 'bg-[#FFEBEE] text-[#C62828]'
                          }`}
                        >
                          {c.metrics.adscritoGratuidad ? '✓ Adscrita a Gratuidad' : '✗ No Adscrita'}
                        </span>
                        <span className="text-[10px] text-[#6B5A4B] block mt-1">
                          {c.metrics.accesoFondoSolidarioYCAE}
                        </span>
                      </td>
                    ))}
                  </tr>
                </>
              )}

              {/* ======================================================== */}
              {/* DIMENSIÓN 6: VÍAS ESPECIALES, CAMPUS & PLAN COMÚN       */}
              {/* ======================================================== */}
              {(activeDimension === 'all' || activeDimension === 'especiales') && (
                <>
                  <tr className="bg-[#F7F4EF] font-bold text-xs text-[#7C5E45]">
                    <td colSpan={comparedCareers.length + 1} className="py-2.5 px-4 font-serif flex items-center justify-between">
                      <span>6. Vías Especiales, Campus & Ramas Plan Común</span>
                      <span className="text-[10px] text-[#8C7662] font-normal italic">Fuente oficial: Portales Institucionales Universitarios</span>
                    </td>
                  </tr>

                  {/* Vías de Admisión Especial */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 font-semibold text-[#5C4433]">
                      Vías de Admisión Especial Disponibles
                      <span className="block text-[9px] text-[#9A8B7D] font-normal italic">Cupos de equidad, deportistas y mérito</span>
                    </td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[11px] space-y-1">
                        <span className="font-bold text-[#001122] block">
                          {c.specialAdmission?.length || 0} Vías Oficiales:
                        </span>
                        <div className="space-y-1">
                          {c.specialAdmission?.map((va) => (
                            <div key={va.id} className="bg-[#FAF8F5] p-1.5 rounded border border-[#E8E1D5]">
                              <strong className="text-[#7C5E45] block">{va.name}</strong>
                              <span className="text-[10px] text-[#6B5A4B] block">Plazo: {va.applicationDeadline}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Carreras Subordinadas (Plan Común) */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8] bg-[#FDFBF7]">
                    <td className="p-3 font-semibold text-[#5C4433]">
                      Ramas / Especialidades Subordinadas
                      <span className="block text-[9px] text-[#9A8B7D] font-normal italic">Especialidades a las que conduce el plan de estudios</span>
                    </td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[11px]">
                        {c.isPlanComun && c.subordinateCareers && c.subordinateCareers.length > 0 ? (
                          <div className="space-y-1.5">
                            <span className="font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded inline-block">
                              Plan Común ({c.subordinateCareers.length} especialidades)
                            </span>
                            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                              {c.subordinateCareers.map((sub) => (
                                <div key={sub.id} className="bg-white p-1.5 rounded border border-[#E5DDD2] text-[10px]">
                                  <strong className="text-[#001122] block">• {sub.name}</strong>
                                  <span className="text-[#6B5A4B]">Salario: {sub.avgSalary5Year} | Empleab: {sub.employmentRate1Year}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[#8C7662]">Carrera de ingreso directo unificado</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Campus & Ubicación */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 font-semibold text-[#5C4433]">
                      Campus, Dirección & Transporte
                      <span className="block text-[9px] text-[#9A8B7D] font-normal italic">Infraestructura y entorno universitario</span>
                    </td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[11px]">
                        <strong className="text-[#001122] block">{c.campusLocation?.name || c.metrics.sedeCampus}</strong>
                        <span className="text-[#6B5A4B] block">{c.campusLocation?.address}, {c.city}</span>
                        {c.campusLocation?.transitAccess && (
                          <span className="text-[10px] text-[#7C5E45] font-semibold block mt-1">
                            Metro/Bus: {c.campusLocation.transitAccess}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Beneficios Institucionales */}
                  <tr className="hover:bg-[#FBF9F5] divide-x divide-[#EAE3D8]">
                    <td className="p-3 font-semibold text-[#5C4433]">
                      Beneficios Propios & Becas Internas
                      <span className="block text-[9px] text-[#9A8B7D] font-normal italic">Apoyo socioeconómico complementario</span>
                    </td>
                    {comparedCareers.map((c) => (
                      <td key={c.id} className="p-3 text-[11px] space-y-1">
                        {c.benefits?.map((b) => (
                          <div key={b.id} className="bg-[#FAF8F5] p-1.5 rounded border border-[#E8E1D5]">
                            <strong className="text-[#001122] block">{b.name}</strong>
                            <span className="text-[10px] text-[#2E7D32] block font-semibold">{b.coverage}</span>
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

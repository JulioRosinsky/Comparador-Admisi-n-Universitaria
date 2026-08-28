import React from 'react';
import {
  GraduationCap,
  Layers,
  Sparkles,
  TrendingUp,
  History,
  FileDown,
  Info,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'simulador' | 'comparador' | 'metas' | 'historial';
  setActiveTab: (tab: 'simulador' | 'comparador' | 'metas' | 'historial') => void;
  comparedCount: number;
  onExportPDF: () => void;
  onOpenInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  comparedCount,
  onExportPDF,
  onOpenInfo,
}) => {
  return (
    <header className="bg-[#001122] text-[#EFEAE1] border-b border-[#1E2E3E] sticky top-0 z-40 shadow-md">
      {/* Top micro-bar */}
      <div className="bg-[#000B17] px-4 py-1 border-b border-[#0F1C2B] text-xs text-[#9A7B62]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span>
            <span className="truncate">Proceso de Admisión Universitaria en Chile 2025/2026 • Sistema de Acceso Centralizado</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#A59582] shrink-0">
            <span>DEMRE • MiFuturo • SIES • CNA-Chile</span>
          </div>
        </div>
      </div>

      {/* Main Header navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7C5E45] flex items-center justify-center text-white shadow-xs shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#FFFFFF]">
                  Simulador PAES & Admisión
                </h1>
                <span className="bg-[#1A2838] text-[#D8C7B5] text-[10px] uppercase font-semibold px-2 py-0.5 rounded border border-[#2B3B4D]">
                  Estocástico
                </span>
              </div>
              <p className="text-xs text-[#B8A99A]">
                Ponderaciones oficiales DEMRE, modelo predictivo y comparador multicarrera
              </p>
            </div>
          </div>

          <div className="flex md:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenInfo}
              className="p-2.5 text-[#C8BAAB] hover:text-white bg-[#0A1A2B] rounded-xl border border-[#1E2E3E] transition"
              title="Información metodológica"
              aria-label="Ver información y metodología"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onExportPDF}
              className="px-3 py-2 text-xs bg-[#7C5E45] hover:bg-[#9A7B62] active:bg-[#5C4433] text-white rounded-xl flex items-center gap-1 font-bold transition shadow-xs"
              title="Descargar Ficha PDF"
              aria-label="Exportar informe a PDF"
            >
              <FileDown className="w-4 h-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs & Actions */}
        <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-3 overflow-x-auto pb-1 md:pb-0">
          <nav
            aria-label="Pestañas principales"
            className="flex items-center bg-[#071728] p-1 rounded-xl border border-[#1C2C3D] text-xs"
          >
            <button
              type="button"
              onClick={() => setActiveTab('simulador')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition ${
                activeTab === 'simulador'
                  ? 'bg-[#7C5E45] text-white shadow-xs'
                  : 'text-[#C5B7A6] hover:text-white hover:bg-[#122336]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulador</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('comparador')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition relative ${
                activeTab === 'comparador'
                  ? 'bg-[#7C5E45] text-white shadow-xs'
                  : 'text-[#C5B7A6] hover:text-white hover:bg-[#122336]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Comparador</span>
              {comparedCount > 0 && (
                <span className="bg-[#2E7D32] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                  {comparedCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('metas')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition ${
                activeTab === 'metas'
                  ? 'bg-[#7C5E45] text-white shadow-xs'
                  : 'text-[#C5B7A6] hover:text-white hover:bg-[#122336]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Metas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('historial')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition ${
                activeTab === 'historial'
                  ? 'bg-[#7C5E45] text-white shadow-xs'
                  : 'text-[#C5B7A6] hover:text-white hover:bg-[#122336]'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Historial</span>
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenInfo}
              className="p-2.5 text-[#C8BAAB] hover:text-white hover:bg-[#122336] rounded-xl border border-[#1E2E3E] transition"
              title="Información y Metodología"
              aria-label="Ver información y metodología"
            >
              <Info className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onExportPDF}
              className="min-h-[38px] px-4 py-2 text-xs bg-[#7C5E45] hover:bg-[#9A7B62] active:bg-[#5C4433] text-white rounded-xl flex items-center gap-1.5 font-bold shadow-xs transition"
            >
              <FileDown className="w-4 h-4" />
              <span>Exportar PDF</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

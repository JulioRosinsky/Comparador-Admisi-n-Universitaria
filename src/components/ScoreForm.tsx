import React, { useState, useEffect } from 'react';
import { PaesScores } from '../types/paes';
import { convertNemToScore } from '../data/nemConversion';
import {
  SlidersHorizontal,
  RotateCcw,
  Plus,
  Minus,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';

interface ScoreFormProps {
  scores: PaesScores;
  onChangeScores: (scores: PaesScores) => void;
  educationType: 'humanista' | 'tecnico';
  onChangeEducationType: (type: 'humanista' | 'tecnico') => void;
}

interface ScoreInputRowProps {
  id: string;
  label: string;
  badge?: string;
  value: number | undefined;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  disabledPlaceholder?: string;
  onChange: (val: number) => void;
  enableCheckbox?: boolean;
  checked?: boolean;
  onToggleCheck?: (checked: boolean) => void;
  isNem?: boolean;
  convertedNemScore?: number;
}

const ScoreInputRow: React.FC<ScoreInputRowProps> = ({
  id,
  label,
  badge,
  value,
  min,
  max,
  step = 1,
  disabled = false,
  disabledPlaceholder = 'No rendida',
  onChange,
  enableCheckbox = false,
  checked = true,
  onToggleCheck,
  isNem = false,
  convertedNemScore,
}) => {
  const [localStr, setLocalStr] = useState<string>(
    value !== undefined ? (isNem ? value.toFixed(2) : String(value)) : ''
  );

  useEffect(() => {
    if (value !== undefined) {
      setLocalStr(isNem ? value.toFixed(2) : String(value));
    } else {
      setLocalStr('');
    }
  }, [value, isNem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(',', '.');
    setLocalStr(raw);
    if (raw === '') return;
    const num = isNem ? parseFloat(raw) : parseInt(raw, 10);
    if (!isNaN(num)) {
      const clamped = Math.min(max, Math.max(min, num));
      onChange(clamped);
    }
  };

  const handleBlur = () => {
    if (localStr === '' || isNaN(Number(localStr))) {
      const defaultVal = isNem ? 6.0 : 650;
      setLocalStr(isNem ? defaultVal.toFixed(2) : String(defaultVal));
      onChange(defaultVal);
      return;
    }
    const num = isNem ? parseFloat(localStr) : parseInt(localStr, 10);
    const clamped = Math.min(max, Math.max(min, num));
    setLocalStr(isNem ? clamped.toFixed(2) : String(clamped));
    onChange(clamped);
  };

  const handleStep = (delta: number) => {
    const current = value !== undefined ? value : (isNem ? 6.0 : 650);
    const next = isNem
      ? Math.round((current + delta) * 100) / 100
      : Math.round(current + delta);
    const clamped = Math.min(max, Math.max(min, next));
    setLocalStr(isNem ? clamped.toFixed(2) : String(clamped));
    onChange(clamped);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleStep(e.shiftKey ? (isNem ? 0.1 : 10) : (isNem ? 0.01 : 1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleStep(e.shiftKey ? (isNem ? -0.1 : -10) : (isNem ? -0.01 : -1));
    }
  };

  return (
    <div
      className={`p-3 rounded-xl border transition-all ${
        disabled
          ? 'bg-[#FAF8F5]/60 border-[#EAE4DC] opacity-75'
          : 'bg-white border-[#EAE4DC] hover:border-[#C5B7A6] shadow-2xs'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {enableCheckbox && onToggleCheck && (
            <input
              type="checkbox"
              id={`check-${id}`}
              checked={checked}
              onChange={(e) => onToggleCheck(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-[#7C5E45] border-[#D2C7B8] focus:ring-[#7C5E45] cursor-pointer"
              aria-label={`Incluir ${label}`}
            />
          )}
          <label
            htmlFor={enableCheckbox ? `check-${id}` : `input-${id}`}
            className="text-xs font-bold text-[#001122] truncate cursor-pointer"
          >
            {label}
          </label>
        </div>

        {badge && (
          <span className="text-[10px] font-semibold text-[#8C7662] bg-[#F4EFEA] px-1.5 py-0.5 rounded-md border border-[#E0D7CC] shrink-0">
            {badge}
          </span>
        )}
      </div>

      {!disabled ? (
        <div className="space-y-2">
          {/* Stepper buttons and input */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleStep(isNem ? -0.1 : -10)}
              className="w-7 h-7 bg-[#F4EFEA] hover:bg-[#EAE3D8] active:bg-[#DFD5C5] text-[#5C4433] rounded-lg text-[10px] font-bold border border-[#DDD3C5] flex items-center justify-center transition"
              title={isNem ? 'Restar 0.10 puntos' : 'Restar 10 puntos (Shift+Abajo)'}
              aria-label={`Restar 10 puntos a ${label}`}
            >
              -10
            </button>

            <button
              type="button"
              onClick={() => handleStep(isNem ? -0.01 : -1)}
              className="w-7 h-7 bg-[#F4EFEA] hover:bg-[#EAE3D8] active:bg-[#DFD5C5] text-[#001122] rounded-lg text-xs font-bold border border-[#DDD3C5] flex items-center justify-center transition"
              title={isNem ? 'Restar 0.01 puntos' : 'Restar 1 punto (Flecha Abajo)'}
              aria-label={`Restar 1 punto a ${label}`}
            >
              <Minus className="w-3 h-3" />
            </button>

            <div className="relative flex-1">
              <input
                id={`input-${id}`}
                type="text"
                inputMode="decimal"
                value={localStr}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="w-full h-7 px-2 text-center text-sm font-black text-[#001122] bg-[#FAF8F5] border border-[#C5B7A6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C5E45] focus:bg-white transition"
                aria-label={`Puntaje para ${label}`}
              />
            </div>

            <button
              type="button"
              onClick={() => handleStep(isNem ? 0.01 : 1)}
              className="w-7 h-7 bg-[#F4EFEA] hover:bg-[#EAE3D8] active:bg-[#DFD5C5] text-[#001122] rounded-lg text-xs font-bold border border-[#DDD3C5] flex items-center justify-center transition"
              title={isNem ? 'Sumar 0.01 puntos' : 'Sumar 1 punto (Flecha Arriba)'}
              aria-label={`Sumar 1 punto a ${label}`}
            >
              <Plus className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={() => handleStep(isNem ? 0.1 : 10)}
              className="w-7 h-7 bg-[#F4EFEA] hover:bg-[#EAE3D8] active:bg-[#DFD5C5] text-[#5C4433] rounded-lg text-[10px] font-bold border border-[#DDD3C5] flex items-center justify-center transition"
              title={isNem ? 'Sumar 0.10 puntos' : 'Sumar 10 puntos (Shift+Arriba)'}
              aria-label={`Sumar 10 puntos a ${label}`}
            >
              +10
            </button>
          </div>

          {/* Slider */}
          <div className="pt-0.5">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value !== undefined ? value : min}
              onChange={(e) => {
                const val = isNem ? parseFloat(e.target.value) : parseInt(e.target.value, 10);
                onChange(val);
              }}
              className="w-full h-1.5 bg-[#E5DDD2] rounded-lg appearance-none cursor-pointer accent-[#7C5E45]"
              aria-label={`Deslizador para ${label}`}
            />
          </div>

          {/* NEM Conversion note */}
          {isNem && convertedNemScore !== undefined && (
            <div className="flex items-center justify-between text-[10px] bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#EDE6DC] text-[#6B5A4B]">
              <span>Equivalencia DEMRE:</span>
              <strong className="text-[11px] font-black text-[#7C5E45]">
                {convertedNemScore} <span className="text-[9px] font-normal text-[#8C7662]">pts</span>
              </strong>
            </div>
          )}
        </div>
      ) : (
        <div className="py-2.5 text-center">
          <p className="text-xs font-semibold text-[#A09588]">{disabledPlaceholder}</p>
          <p className="text-[10px] text-[#B8AEA2] mt-0.5">Haz clic en la casilla para activar</p>
        </div>
      )}
    </div>
  );
};

export const ScoreForm: React.FC<ScoreFormProps> = ({
  scores,
  onChangeScores,
  educationType,
  onChangeEducationType,
}) => {
  const [includeM2, setIncludeM2] = useState<boolean>(!!scores.m2);
  const [includeCiencias, setIncludeCiencias] = useState<boolean>(
    scores.ciencias !== undefined && scores.ciencias > 0
  );
  const [includeHistoria, setIncludeHistoria] = useState<boolean>(
    scores.historia !== undefined && scores.historia > 0
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const handleNemChange = (nemVal: number) => {
    const clampedNem = Math.min(7.0, Math.max(1.0, Math.round(nemVal * 100) / 100));
    const converted = convertNemToScore(clampedNem, educationType);
    onChangeScores({
      ...scores,
      nem: clampedNem,
      nemScore: converted,
    });
  };

  const handleFieldChange = (field: keyof PaesScores, value: number) => {
    const clamped = Math.min(1000, Math.max(100, Math.round(value)));
    onChangeScores({
      ...scores,
      [field]: clamped,
    });
  };

  const handleEducationTypeToggle = (type: 'humanista' | 'tecnico') => {
    onChangeEducationType(type);
    const converted = convertNemToScore(scores.nem, type);
    onChangeScores({
      ...scores,
      nemScore: converted,
    });
  };

  const applyPreset = (presetName: string) => {
    if (presetName === 'medicina') {
      const nem = 6.85;
      onChangeScores({
        nem,
        nemScore: convertNemToScore(nem, educationType),
        ranking: 975,
        lectora: 925,
        m1: 960,
        m2: 890,
        ciencias: 945,
        historia: 820,
      });
      setIncludeM2(true);
      setIncludeCiencias(true);
      setIncludeHistoria(true);
    } else if (presetName === 'ingenieria') {
      const nem = 6.6;
      onChangeScores({
        nem,
        nemScore: convertNemToScore(nem, educationType),
        ranking: 920,
        lectora: 840,
        m1: 980,
        m2: 950,
        ciencias: 890,
        historia: 710,
      });
      setIncludeM2(true);
      setIncludeCiencias(true);
      setIncludeHistoria(false);
    } else if (presetName === 'derecho') {
      const nem = 6.65;
      onChangeScores({
        nem,
        nemScore: convertNemToScore(nem, educationType),
        ranking: 930,
        lectora: 950,
        m1: 810,
        m2: undefined,
        ciencias: 720,
        historia: 935,
      });
      setIncludeM2(false);
      setIncludeCiencias(false);
      setIncludeHistoria(true);
    } else if (presetName === 'promedio') {
      const nem = 5.8;
      onChangeScores({
        nem,
        nemScore: convertNemToScore(nem, educationType),
        ranking: 690,
        lectora: 680,
        m1: 670,
        m2: undefined,
        ciencias: 650,
        historia: 660,
      });
      setIncludeM2(false);
      setIncludeCiencias(true);
      setIncludeHistoria(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EAE4DC] shadow-sm p-4 sm:p-5 transition-all">
      {/* Top Header & Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-[#EFEAE1]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#001122] flex items-center justify-center text-white shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-[#001122] leading-tight">
                Tus Puntajes PAES & Notas EM
              </h2>
              <p className="text-xs text-[#8C7662]">
                Ajuste fino de punto en punto, entrada directa y conversión oficial DEMRE
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="lg:hidden p-2 text-[#7C5E45] hover:bg-[#F4EFEA] rounded-lg transition"
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? 'Expandir panel de puntajes' : 'Minimizar panel de puntajes'}
          >
            {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {/* Segmented controls & Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Education Type Segmented Toggle */}
          <div className="bg-[#FAF8F5] p-1 rounded-xl border border-[#E0D7CC] flex items-center text-xs">
            <button
              type="button"
              onClick={() => handleEducationTypeToggle('humanista')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                educationType === 'humanista'
                  ? 'bg-[#001122] text-white shadow-2xs'
                  : 'text-[#6B5A4B] hover:text-[#001122]'
              }`}
            >
              H-C
            </button>
            <button
              type="button"
              onClick={() => handleEducationTypeToggle('tecnico')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                educationType === 'tecnico'
                  ? 'bg-[#001122] text-white shadow-2xs'
                  : 'text-[#6B5A4B] hover:text-[#001122]'
              }`}
            >
              T-P
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-semibold text-[#8C7662] hidden sm:inline">Perfiles:</span>
            <button
              type="button"
              onClick={() => applyPreset('medicina')}
              className="text-xs font-bold px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#EAE3D8] text-[#5C4433] rounded-lg border border-[#E0D7CC] transition whitespace-nowrap"
            >
              🩺 Medicina Top
            </button>
            <button
              type="button"
              onClick={() => applyPreset('ingenieria')}
              className="text-xs font-bold px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#EAE3D8] text-[#5C4433] rounded-lg border border-[#E0D7CC] transition whitespace-nowrap"
            >
              ⚙️ Ing. Plan Común
            </button>
            <button
              type="button"
              onClick={() => applyPreset('derecho')}
              className="text-xs font-bold px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#EAE3D8] text-[#5C4433] rounded-lg border border-[#E0D7CC] transition whitespace-nowrap"
            >
              ⚖️ Derecho CRUCH
            </button>
            <button
              type="button"
              onClick={() => applyPreset('promedio')}
              className="text-xs font-bold px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#EAE3D8] text-[#5C4433] rounded-lg border border-[#E0D7CC] transition whitespace-nowrap"
            >
              📊 Promedio Nacional
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center gap-1 text-xs font-bold text-[#7C5E45] hover:bg-[#F4EFEA] px-2.5 py-1.5 rounded-lg transition"
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? (
              <>
                <span>Expandir</span>
                <ChevronDown className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Minimizar</span>
                <ChevronUp className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Collapsed summary pill bar */}
      {isCollapsed ? (
        <div className="pt-3 flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-[#FAF8F5] px-3 py-1 rounded-lg border border-[#E0D7CC] font-medium text-[#001122]">
            NEM: <strong>{scores.nem.toFixed(2)}</strong> ({scores.nemScore} pts)
          </div>
          <div className="bg-[#FAF8F5] px-3 py-1 rounded-lg border border-[#E0D7CC] font-medium text-[#001122]">
            Ranking: <strong>{scores.ranking}</strong> pts
          </div>
          <div className="bg-[#FAF8F5] px-3 py-1 rounded-lg border border-[#E0D7CC] font-medium text-[#001122]">
            Lectora: <strong>{scores.lectora}</strong> pts
          </div>
          <div className="bg-[#FAF8F5] px-3 py-1 rounded-lg border border-[#E0D7CC] font-medium text-[#001122]">
            M1: <strong>{scores.m1}</strong> pts
          </div>
          {scores.m2 && (
            <div className="bg-[#FAF8F5] px-3 py-1 rounded-lg border border-[#E0D7CC] font-medium text-[#001122]">
              M2: <strong>{scores.m2}</strong> pts
            </div>
          )}
          {scores.ciencias && (
            <div className="bg-[#FAF8F5] px-3 py-1 rounded-lg border border-[#E0D7CC] font-medium text-[#001122]">
              Ciencias: <strong>{scores.ciencias}</strong> pts
            </div>
          )}
          {scores.historia && (
            <div className="bg-[#FAF8F5] px-3 py-1 rounded-lg border border-[#E0D7CC] font-medium text-[#001122]">
              Historia: <strong>{scores.historia}</strong> pts
            </div>
          )}
        </div>
      ) : (
        /* Expanded Input Matrix */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-3.5">
          {/* NEM */}
          <ScoreInputRow
            id="nem"
            label="NEM (Notas EM)"
            badge="1.00 - 7.00"
            value={scores.nem}
            min={1.0}
            max={7.0}
            step={0.01}
            isNem={true}
            convertedNemScore={scores.nemScore}
            onChange={handleNemChange}
          />

          {/* Ranking */}
          <ScoreInputRow
            id="ranking"
            label="Ranking EM"
            badge="100 - 1000"
            value={scores.ranking}
            min={100}
            max={1000}
            step={1}
            onChange={(val) => handleFieldChange('ranking', val)}
          />

          {/* Competencia Lectora */}
          <ScoreInputRow
            id="lectora"
            label="Comp. Lectora"
            badge="Obligatoria"
            value={scores.lectora}
            min={100}
            max={1000}
            step={1}
            onChange={(val) => handleFieldChange('lectora', val)}
          />

          {/* Matemática 1 (M1) */}
          <ScoreInputRow
            id="m1"
            label="Matemática 1"
            badge="Obligatoria"
            value={scores.m1}
            min={100}
            max={1000}
            step={1}
            onChange={(val) => handleFieldChange('m1', val)}
          />

          {/* Matemática 2 (M2) */}
          <ScoreInputRow
            id="m2"
            label="Matemática 2"
            badge="Selectiva"
            value={includeM2 ? (scores.m2 || 650) : undefined}
            min={100}
            max={1000}
            step={1}
            disabled={!includeM2}
            enableCheckbox={true}
            checked={includeM2}
            onToggleCheck={(chk) => {
              setIncludeM2(chk);
              onChangeScores({
                ...scores,
                m2: chk ? (scores.m2 || 650) : undefined,
              });
            }}
            onChange={(val) => handleFieldChange('m2', val)}
          />

          {/* Ciencias */}
          <ScoreInputRow
            id="ciencias"
            label="Ciencias"
            badge="Electiva"
            value={includeCiencias ? (scores.ciencias || 650) : undefined}
            min={100}
            max={1000}
            step={1}
            disabled={!includeCiencias}
            enableCheckbox={true}
            checked={includeCiencias}
            onToggleCheck={(chk) => {
              setIncludeCiencias(chk);
              onChangeScores({
                ...scores,
                ciencias: chk ? (scores.ciencias || 650) : undefined,
              });
            }}
            onChange={(val) => handleFieldChange('ciencias', val)}
          />

          {/* Historia y Ciencias Sociales */}
          <ScoreInputRow
            id="historia"
            label="Historia"
            badge="Electiva"
            value={includeHistoria ? (scores.historia || 650) : undefined}
            min={100}
            max={1000}
            step={1}
            disabled={!includeHistoria}
            enableCheckbox={true}
            checked={includeHistoria}
            onToggleCheck={(chk) => {
              setIncludeHistoria(chk);
              onChangeScores({
                ...scores,
                historia: chk ? (scores.historia || 650) : undefined,
              });
            }}
            onChange={(val) => handleFieldChange('historia', val)}
          />
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { PaesScores, SavedSimulation } from '../types/paes';
import {
  History,
  Save,
  Trash2,
  Upload,
  Calendar,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

interface SimulationHistoryProps {
  currentScores: PaesScores;
  savedSimulations: SavedSimulation[];
  onSaveSimulation: (name: string, notes?: string) => void;
  onRestoreSimulation: (scores: PaesScores) => void;
  onDeleteSimulation: (id: string) => void;
}

export const SimulationHistory: React.FC<SimulationHistoryProps> = ({
  currentScores,
  savedSimulations,
  onSaveSimulation,
  onRestoreSimulation,
  onDeleteSimulation,
}) => {
  const [simulationName, setSimulationName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [justSaved, setJustSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulationName.trim()) return;

    onSaveSimulation(simulationName.trim(), notes.trim() || undefined);
    setSimulationName('');
    setNotes('');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Save current state card */}
      <div className="bg-white rounded-xl border border-[#E2DAD0] shadow-sm p-4 sm:p-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#EFEAE1]">
          <Save className="w-5 h-5 text-[#7C5E45]" />
          <div>
            <h2 className="font-serif text-lg font-bold text-[#001122]">
              Guardar Simulación o Ensayo
            </h2>
            <p className="text-xs text-[#6B5A4B]">
              Registra tus puntajes de ensayos actuales para hacer seguimiento a tu evolución histórica.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-xs font-semibold text-[#001122] block mb-1">
              Nombre de la Simulación *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Ensayo Nacional Agosto, Meta Final..."
              value={simulationName}
              onChange={(e) => setSimulationName(e.target.value)}
              className="w-full text-xs bg-[#FBF9F5] border border-[#D2C7B8] rounded-lg px-3 py-2 text-[#001122] focus:ring-1 focus:ring-[#7C5E45]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#001122] block mb-1">
              Notas / Observaciones (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: Preuniversitario Pedro de Valdivia, Ensayo M1 difícil..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs bg-[#FBF9F5] border border-[#D2C7B8] rounded-lg px-3 py-2 text-[#001122] focus:ring-1 focus:ring-[#7C5E45]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#001122] hover:bg-[#122336] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Registro</span>
            </button>
          </div>
        </form>

        {justSaved && (
          <div className="mt-3 p-2 bg-[#E8F5E9] text-[#2E7D32] rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            <span>¡Simulación guardada con éxito en tu historial local!</span>
          </div>
        )}
      </div>

      {/* History Records List */}
      <div className="bg-white rounded-xl border border-[#E2DAD0] shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#EFEAE1]">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#7C5E45]" />
            <h3 className="font-serif text-base font-bold text-[#001122]">
              Registro Histórico de Simulaciones ({savedSimulations.length})
            </h3>
          </div>
          <span className="text-xs text-[#8C7662]">Almacenamiento Seguro Local</span>
        </div>

        {savedSimulations.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#8C7662]">
            No tienes simulaciones guardadas todavía. Guarda tu primera simulación arriba.
          </div>
        ) : (
          <div className="divide-y divide-[#EFEAE1] mt-2">
            {savedSimulations.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FBF9F5] px-2 rounded-lg transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-sm text-[#001122]">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-[#8C7662] bg-[#F7F4EF] px-2 py-0.5 rounded border border-[#EAE3D8] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#7C5E45]" />
                      {item.date}
                    </span>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-[#6B5A4B] mt-0.5">{item.notes}</p>
                  )}

                  {/* Puntajes pill list */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#5C4433] mt-2">
                    <span className="bg-[#EFEAE1] px-2 py-0.5 rounded">
                      NEM: <strong>{item.scores.nem.toFixed(2)}</strong> ({item.scores.nemScore} pts)
                    </span>
                    <span className="bg-[#EFEAE1] px-2 py-0.5 rounded">
                      Ranking: <strong>{item.scores.ranking}</strong>
                    </span>
                    <span className="bg-[#EFEAE1] px-2 py-0.5 rounded">
                      Lectora: <strong>{item.scores.lectora}</strong>
                    </span>
                    <span className="bg-[#EFEAE1] px-2 py-0.5 rounded font-bold text-[#001122]">
                      M1: <strong>{item.scores.m1}</strong>
                    </span>
                    {item.scores.m2 && (
                      <span className="bg-[#EFEAE1] px-2 py-0.5 rounded">
                        M2: <strong>{item.scores.m2}</strong>
                      </span>
                    )}
                    {item.scores.ciencias && (
                      <span className="bg-[#EFEAE1] px-2 py-0.5 rounded">
                        Ciencias: <strong>{item.scores.ciencias}</strong>
                      </span>
                    )}
                    {item.scores.historia && (
                      <span className="bg-[#EFEAE1] px-2 py-0.5 rounded">
                        Historia: <strong>{item.scores.historia}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onRestoreSimulation(item.scores)}
                    className="px-3 py-1.5 bg-[#F7F4EF] hover:bg-[#EFEAE1] text-[#001122] text-xs font-semibold rounded-lg border border-[#D2C7B8] flex items-center gap-1.5 transition"
                    title="Cargar puntajes en el simulador"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#7C5E45]" />
                    <span>Restaurar</span>
                  </button>

                  <button
                    onClick={() => onDeleteSimulation(item.id)}
                    className="p-1.5 text-[#C62828] hover:bg-[#FFEBEE] rounded-lg border border-transparent hover:border-[#FFCDD2] transition"
                    title="Eliminar registro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

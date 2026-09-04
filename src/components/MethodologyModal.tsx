import React from 'react';
import { X, BookOpen, ShieldCheck, Scale, Cpu } from 'lucide-react';

interface MethodologyModalProps {
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-[#E2DAD0] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="bg-[#001122] text-[#EFEAE1] px-5 py-4 flex items-center justify-between border-b border-[#1E2E3E]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#7C5E45]" />
            <h2 className="font-serif text-lg font-bold text-white">
              Metodología, Fuentes Oficiales & Modelo Estocástico
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#C8BAAB] hover:text-white bg-[#0A1A2B] rounded-lg border border-[#1E2E3E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-[#5C4433] leading-relaxed">
          {/* 1. Fuentes */}
          <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#EAE3D8]">
            <h3 className="font-serif font-bold text-sm text-[#001122] mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              1. Fuentes Oficiales Validadas
            </h3>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>
                <strong>DEMRE (Universidad de Chile):</strong> Tabla oficial de conversión NEM, ponderaciones oficiales de universidades adscritas al Sistema de Acceso Centralizado y series de puntajes de corte de últimos matriculados (Admisión 2026 y series históricas 2022 - 2026).
              </li>
              <li>
                <strong>MiFuturo.cl (Mineduc):</strong> Datos de empleabilidad al 1° y 2° año tras la titulación, ingresos brutos mensuales promedio e ingresos por percentiles (P10, P25, mediana P50, P75 y P90) específicos para cada carrera y cada casa de estudios superior, cruzados con el Servicio de Impuestos Internos (SII).
              </li>
              <li>
                <strong>SIES (Servicio de Información de Educación Superior):</strong> Duración formal, duración real de titulación, sobreduración y retención de primer a segundo año por carrera e institución.
              </li>
              <li>
                <strong>CNA (Comisión Nacional de Acreditación):</strong> Años de acreditación institucional vigente y áreas certificadas.
              </li>
            </ul>
          </div>

          {/* 2. Modelo Estocástico */}
          <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#EAE3D8]">
            <h3 className="font-serif font-bold text-sm text-[#001122] mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#7C5E45]" />
              2. Modelo Estocástico de Proyección de Admisión
            </h3>
            <p className="mb-2">
              A diferencia de las calculadoras tradicionales que solo comparan contra un corte estático de un solo año, este motor ejecuta un análisis estocástico robusto:
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                <strong>Análisis de Series Temporales (2020 a 2024):</strong> Calcula la media histórica ($\mu$), varianza ($\sigma^2$) y la pendiente de regresión lineal (drift anual) del corte de cada carrera.
              </li>
              <li>
                <strong>Proyección de Corte 2025/2026:</strong> Proyecta el corte esperado incorporando la tendencia y la volatilidad histórica de la cohorte.
              </li>
              <li>
                <strong>Simulación Monte Carlo (1.000 iteraciones):</strong> Simula 1.000 escenarios posibles de corte de último matriculado bajo distribución gaussiana N(mu_proyectado, sigma^2 + sigma_cohorte^2).
              </li>
              <li>
                <strong>Función de Probabilidad de Admisión:</strong> Calcula la probabilidad P(X &ge; Corte) y clasifica en 🟢 Admisión Segura (P &ge; 85%), 🟡 Competitivo (40% &le; P &lt; 85%) o 🔴 Alto Riesgo (P &lt; 40%).
              </li>
            </ol>
          </div>

          {/* 3. Regla de Optimización Automática */}
          <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#EAE3D8]">
            <h3 className="font-serif font-bold text-sm text-[#001122] mb-1.5 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#7C5E45]" />
              3. Regla de Optimización Automática de Electivas
            </h3>
            <p>
              En todas las carreras donde las bases oficiales permiten indistintamente la Prueba de Ciencias o la Prueba de Historia y Ciencias Sociales, el algoritmo compara los puntajes ingresados y selecciona automáticamente la prueba que maximice el puntaje ponderado del postulante.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FBF9F5] px-5 py-3 border-t border-[#EAE3D8] text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#001122] text-white text-xs font-semibold rounded-lg hover:bg-[#122336]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

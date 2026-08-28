import { PaesScores, Career, CareerWithSimulation, SavedSimulation } from '../types/paes';
import { calculateStochasticAdmission } from '../utils/stochasticModel';

export interface CatalogMetadata {
  totalCareers: number;
  totalUniversities: number;
  areas: string[];
  universities: string[];
  regions: string[];
  dataSources: string[];
}

export interface GoalGapResponse {
  careerName: string;
  university: string;
  currentWeightedScore: number;
  cutoff2024: number;
  pointsGap: number;
  isAdmitted: boolean;
  probability: number;
  category: 'SEGURA' | 'COMPETITIVA' | 'RIESGO_ALTO';
  topPriorityTests: {
    testName: string;
    weightPercentage: string;
    recommendedPointGain: number;
  }[];
}

class ApiService {
  private baseUrl = '/api';

  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }

  async getMetadata(): Promise<CatalogMetadata | null> {
    try {
      const res = await fetch(`${this.baseUrl}/metadata`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend API metadata unreachable, using client cache');
    }
    return null;
  }

  async getCareers(params?: {
    search?: string;
    area?: string;
    university?: string;
    region?: string;
    gratuityOnly?: boolean;
    minCnaYears?: number;
    planComunOnly?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ total: number; count: number; data: Career[] } | null> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.set('search', params.search);
      if (params?.area && params.area !== 'all') query.set('area', params.area);
      if (params?.university && params.university !== 'all') query.set('university', params.university);
      if (params?.region && params.region !== 'all') query.set('region', params.region);
      if (params?.gratuityOnly) query.set('gratuityOnly', 'true');
      if (params?.minCnaYears) query.set('minCnaYears', String(params.minCnaYears));
      if (params?.planComunOnly) query.set('planComunOnly', 'true');
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.offset) query.set('offset', String(params.offset));

      const res = await fetch(`${this.baseUrl}/careers?${query.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend API careers query fallback to local state');
    }
    return null;
  }

  async getGoalGap(currentScores: PaesScores, targetCareerId: string): Promise<GoalGapResponse | null> {
    try {
      const res = await fetch(`${this.baseUrl}/goal-gap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentScores, targetCareerId }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend API goal gap error');
    }
    return null;
  }

  async getSavedSimulations(): Promise<SavedSimulation[]> {
    try {
      const res = await fetch(`${this.baseUrl}/simulations`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend API simulations fallback to localStorage');
    }
    const local = localStorage.getItem('paes_saved_simulations');
    return local ? JSON.parse(local) : [];
  }

  async saveSimulation(
    name: string,
    scores: PaesScores,
    notes?: string,
    selectedCareersCount: number = 0
  ): Promise<SavedSimulation> {
    try {
      const res = await fetch(`${this.baseUrl}/simulations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, scores, notes, selectedCareersCount }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend API save simulation fallback');
    }
    const localSim: SavedSimulation = {
      id: `sim-${Date.now()}`,
      name: name.trim() || `Simulación ${new Date().toLocaleDateString('es-CL')}`,
      date: new Date().toLocaleDateString('es-CL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      scores: { ...scores },
      selectedCareersCount,
      notes,
    };
    return localSim;
  }

  async deleteSimulation(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/simulations/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();

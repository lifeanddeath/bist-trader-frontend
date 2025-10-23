import { 
  ApiResponse, 
  SignalsData, 
  FormationsData, 
  TopPicksData, 
  AnalysisStatus, 
  StatusData, 
  CountData 
} from '../types';

const API_BASE = process.env.REACT_APP_API_URL || 'https://web-production-beb022.up.railway.app';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<T> = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'API error');
      }

      return data.data as T;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Signals
  async getSignals(): Promise<SignalsData> {
    return this.request<SignalsData>('/api/signals');
  }

  async getSignalsCount(): Promise<CountData> {
    return this.request<CountData>('/api/signals/count');
  }

  // Formations
  async getFormations(): Promise<FormationsData> {
    return this.request<FormationsData>('/api/formations');
  }

  // Top Picks
  async getTopPicks(): Promise<TopPicksData> {
    return this.request<TopPicksData>('/api/top-picks');
  }

  // Analysis
  async startAnalysis(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/analysis/start', {
      method: 'POST',
    });
  }

  async getAnalysisStatus(): Promise<AnalysisStatus> {
    return this.request<AnalysisStatus>('/api/analysis/status');
  }

  async startFormationAnalysis(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/formations/start', {
      method: 'POST',
    });
  }

  // Status
  async getStatus(): Promise<StatusData> {
    return this.request<StatusData>('/api/status');
  }
}

export const apiService = new ApiService();

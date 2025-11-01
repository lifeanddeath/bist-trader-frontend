import { 
  ApiResponse, 
  SignalsData, 
  FormationsData, 
  TopPicksData, 
  AnalysisStatus, 
  StatusData, 
  CountData,
  DashboardData,
  LatestSignalsResponse
} from '../types';

// API Base URL: local için 8000, Docker için backend:8000
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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

  // Direct request without ApiResponse wrapper (for new API format)
  private async directRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
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

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health Check
  async getHealth(): Promise<{ status: string; timestamp: string }> {
    return this.directRequest<{ status: string; timestamp: string }>('/health');
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

  async startSignalAnalysis(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/signals/start', {
      method: 'POST',
    });
  }

  // Status
  async getStatus(): Promise<StatusData> {
    return this.request<StatusData>('/api/status');
  }

  // Dashboard (Legacy)
  async getDashboard(): Promise<DashboardData> {
    return this.request<DashboardData>('/api/dashboard');
  }

  // Latest Signals (New API)
  async getLatestSignals(): Promise<LatestSignalsResponse> {
    return this.directRequest<LatestSignalsResponse>('/api/latest-signals');
  }

  // Signals History (Optional)
  async getSignalsHistory(limit: number = 10): Promise<{ count: number; data: LatestSignalsResponse[] }> {
    return this.directRequest<{ count: number; data: LatestSignalsResponse[] }>(`/api/signals-history?limit=${limit}`);
  }

  // Manual Signal Finder Run (Test)
  async runSignalFinder(): Promise<{ message: string }> {
    return this.directRequest<{ message: string }>('/api/run-signal-finder', {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();

// API Response Types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
  data?: T;
}

// Stock Types
export interface Stock {
  symbol: string;
  current_price: number;
  target_1: number;
  target_2: number;
  stop_loss: number;
  buy_signals: string[];
}

export interface SignalsData {
  stocks: Stock[];
  total_count: number;
  last_analysis: string;
  total_analyzed: number;
}

// Formation Types
export interface Formation {
  symbol: string;
  formation_type: string;
  formation_name: string;
  current_price: number;
  target_price: number;
  stop_loss: number;
  potential_gain_percent: number;
  risk_reward_ratio: number;
  confidence: number;
  description: string;
  key_levels: {
    support: number;
    resistance: number;
    breakout_level: number;
  };
  timeframe: string;
  success_rate: string;
  volume_confirmation: string;
  formation_timeline: {
    start_date: string;             // Formasyon başlangıç tarihi
    start_price: number;            // Formasyon başlangıç fiyatı
    estimated_completion: string;    // Tahmini tamamlanma tarihi
    days_elapsed: number;           // Geçen gün sayısı
    estimated_days_remaining: number; // Tahmini kalan gün sayısı
  };
}

export interface FormationsData {
  formations: Formation[];
  total_count: number;
  last_analysis: string;
  total_analyzed: number;
}

// Top Picks Types
export interface TopPick {
  stock: Stock;
  score: number;
  reasons: string[];
}

export interface TopPicksData {
  top_picks: TopPick[];
  selection_criteria: {
    rsi_weight: number;
    signal_count_weight: number;
    risk_reward_weight: number;
    volatility_weight: number;
  };
}

// Analysis Status Types
export interface AnalysisStatus {
  is_running: boolean;
  progress: string;
  completed: boolean;
  changes: {
    added: string[];
    removed: string[];
  };
}

export interface StatusData {
  status: string;
  perfect_signals_count: number;
  total_analyzed: number;
  last_analysis: string;
}

export interface CountData {
  perfect_signals_count: number;
  total_analyzed: number;
  last_analysis: string;
}

// Dashboard Types
export interface DashboardData {
  timestamp: string;
  total_analyzed: number;
  perfect_signals_count: number;
  stocks: Stock[];
}

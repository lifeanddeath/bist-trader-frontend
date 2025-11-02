import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { 
  SignalsData, 
  FormationsData, 
  TopPicksData, 
  AnalysisStatus, 
  StatusData, 
  CountData,
  DashboardData,
  LatestSignalsResponse
} from '../types';

// Signals Hook
export function useSignals() {
  const [data, setData] = useState<SignalsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSignals = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const signalsData = await apiService.getSignals();
      setData(signalsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  return { data, loading, error, refetch: fetchSignals };
}

// Formations Hook
export function useFormations() {
  const [data, setData] = useState<FormationsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFormations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const formationsData = await apiService.getFormations();
      setData(formationsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFormations();
  }, [fetchFormations]);

  return { data, loading, error, refetch: fetchFormations };
}

// Top Picks Hook
export function useTopPicks() {
  const [data, setData] = useState<TopPicksData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopPicks = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const topPicksData = await apiService.getTopPicks();
      setData(topPicksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopPicks();
  }, [fetchTopPicks]);

  return { data, loading, error, refetch: fetchTopPicks };
}

// Analysis Status Hook
export function useAnalysisStatus() {
  const [status, setStatus] = useState<AnalysisStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const statusData = await apiService.getAnalysisStatus();
      setStatus(statusData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 2000); // Her 2 saniyede kontrol et
    return () => clearInterval(interval);
  }, [checkStatus]);

  return { status, loading, error, checkStatus };
}

// Status Hook
export function useStatus() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const statusData = await apiService.getStatus();
      setData(statusData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { data, loading, error, refetch: fetchStatus };
}

// Count Hook
export function useSignalsCount() {
  const [data, setData] = useState<CountData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const countData = await apiService.getSignalsCount();
      setData(countData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return { data, loading, error, refetch: fetchCount };
}

// Dashboard Hook (Legacy)
export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const dashboardData = await apiService.getDashboard();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, error, refetch: fetchDashboard };
}

// Latest Signals Hook (New API - 5 dakikada bir otomatik refresh)
export function useLatestSignals() {
  const [data, setData] = useState<LatestSignalsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestSignals = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Frontend sadece backend API'yi kullanır, database'e direkt bağlanmaz
      const signalsData = await apiService.getLatestSignals();
      
      // Eğer message varsa ve "No signals found" ise boş stocks array döndür
      if (signalsData.message === 'No signals found' || !signalsData.stocks || signalsData.stocks.length === 0) {
        setData({
          timestamp: new Date().toISOString(),
          total_analyzed: 0,
          perfect_signals_count: 0,
          stocks: [],
          message: 'No signals found',
        });
      } else {
        // Response'dan direkt stocks array'i al (backend API'den geliyor)
        const stocks = signalsData.stocks || [];
        const timestamp = signalsData.timestamp || signalsData.created_at || new Date().toISOString();
        
        setData({
          ...signalsData,
          stocks,
          timestamp,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      console.error('Latest signals fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // İlk yükleme
    fetchLatestSignals();
    
    // Her 5 dakikada bir otomatik refresh (5 * 60 * 1000 ms)
    const interval = setInterval(() => {
      fetchLatestSignals();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchLatestSignals]);

  return { data, loading, error, refetch: fetchLatestSignals };
}

// Latest Relaxed Signals Hook (New API - 5 dakikada bir otomatik refresh)
export function useLatestSignalsRelaxed() {
  const [data, setData] = useState<LatestSignalsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestSignalsRelaxed = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Frontend sadece backend API'yi kullanır, database'e direkt bağlanmaz
      const signalsData = await apiService.getLatestSignalsRelaxed();
      
      // Eğer message varsa ve "No signals found" ise boş stocks array döndür
      if (signalsData.message === 'No signals found' || !signalsData.stocks || signalsData.stocks.length === 0) {
        setData({
          timestamp: new Date().toISOString(),
          total_analyzed: 0,
          perfect_signals_count: 0,
          stocks: [],
          message: 'No signals found',
        });
      } else {
        // Response'dan direkt stocks array'i al (backend API'den geliyor)
        const stocks = signalsData.stocks || [];
        const timestamp = signalsData.timestamp || signalsData.created_at || new Date().toISOString();
        
        setData({
          ...signalsData,
          stocks,
          timestamp,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      console.error('Latest relaxed signals fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // İlk yükleme
    fetchLatestSignalsRelaxed();
    
    // Her 5 dakikada bir otomatik refresh (5 * 60 * 1000 ms)
    const interval = setInterval(() => {
      fetchLatestSignalsRelaxed();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchLatestSignalsRelaxed]);

  return { data, loading, error, refetch: fetchLatestSignalsRelaxed };
}

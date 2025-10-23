import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { 
  SignalsData, 
  FormationsData, 
  TopPicksData, 
  AnalysisStatus, 
  StatusData, 
  CountData 
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

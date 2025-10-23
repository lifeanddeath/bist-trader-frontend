import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Alert,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Backdrop,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayIcon,
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  Shield as ShieldIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useFormations } from '../hooks/useApi';
import { apiService } from '../services/api';

export default function Formations() {
  const { data, loading, error, refetch } = useFormations();
  const [isStartingAnalysis, setIsStartingAnalysis] = React.useState(false);
  const [analysisProgress, setAnalysisProgress] = React.useState(0);

  // Auto-refresh during analysis
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    
    if (isStartingAnalysis) {
      setAnalysisProgress(0);
      
      // Progress bar animation (slower, more realistic)
      progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) return prev; // Stop at 90%, wait for real completion
          return prev + 2;
        });
      }, 1000);
      
      // Check for real completion every 3 seconds
      interval = setInterval(async () => {
        try {
          const status = await apiService.getAnalysisStatus();
          if (!status.is_running) {
            clearInterval(interval);
            clearInterval(progressInterval);
            setAnalysisProgress(100);
            setTimeout(() => {
              setIsStartingAnalysis(false);
              refetch(); // Final refresh
            }, 1000);
          }
        } catch (error) {
          console.error('Analiz durumu kontrol hatası:', error);
        }
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isStartingAnalysis, refetch]);

  const handleStartFormationAnalysis = async () => {
    setIsStartingAnalysis(true);
    try {
      await apiService.startFormationAnalysis();
    } catch (error) {
      console.error('Formasyon analizi başlatma hatası:', error);
      alert('Formasyon analizi zaten çalışıyor olabilir veya bir hata oluştu. Lütfen birkaç dakika sonra tekrar deneyin.');
      setIsStartingAnalysis(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₺${price.toFixed(2)}`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'success';
    if (confidence >= 60) return 'warning';
    return 'error';
  };


  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Formasyonlar yüklenirken hata oluştu: {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Analysis Progress Overlay */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}
        open={isStartingAnalysis}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Formasyon Analizi Başlatılıyor...
          </Typography>
          <Box sx={{ width: 300, mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={analysisProgress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Yeni formasyonlar analiz ediliyor ve sayfa otomatik olarak güncellenecek
          </Typography>
        </Box>
      </Backdrop>

      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Formasyon Analizi
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<PlayIcon />}
            onClick={handleStartFormationAnalysis}
            disabled={isStartingAnalysis}
            sx={{ mr: 2 }}
          >
            {isStartingAnalysis ? 'Formasyon Analizi Başlatılıyor...' : 'Formasyon Analizi Başlat'}
          </Button>
          <IconButton onClick={refetch} disabled={loading || isStartingAnalysis}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {data && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 2, 
            mb: 3 
          }}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                {data.total_count}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tespit Edilen Formasyon
              </Typography>
            </Card>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="secondary">
                {data.total_analyzed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Analiz Edilen Hisse
              </Typography>
            </Card>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Son Analiz
              </Typography>
              <Typography variant="body2">
                {new Date(data.last_analysis).toLocaleString('tr-TR')}
              </Typography>
            </Card>
          </Box>
        </Box>
      )}

      {data?.formations && data.formations.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {data.formations.map((formation, index) => (
              <Card
                sx={{
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        {formation.symbol}
                      </Typography>
                      <Typography variant="subtitle1" color="primary">
                        {formation.formation_type}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                      <Chip
                        label={`%${formation.potential_gain_percent.toFixed(1)} Kazanç`}
                        color="success"
                        size="small"
                      />
                      <Chip
                        label={`${formation.confidence.toFixed(1)}% Güven`}
                        color={getConfidenceColor(formation.confidence)}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
                    gap: 3, 
                    mb: 2 
                  }}>
                    <Box textAlign="center">
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(formation.current_price)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mevcut Fiyat
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h5" color="success.main" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(formation.target_price)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hedef Fiyat
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h5" color="error.main" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(formation.stop_loss)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stop Loss
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h5" color="info.main" sx={{ fontWeight: 'bold' }}>
                        {formation.risk_reward_ratio.toFixed(1)}:1
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Risk/Ödül Oranı
                      </Typography>
                    </Box>
                  </Box>

                  {/* Formasyon Timeline Bilgileri */}
                  <Paper sx={{ p: 2, mb: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                      📊 Formasyon Zaman Çizelgesi
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                      gap: 2 
                    }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          📅 Başlangıç Tarihi
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {new Date(formation.formation_timeline.start_date).toLocaleDateString('tr-TR')}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          💰 Başlangıç Fiyatı
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {formatPrice(formation.formation_timeline.start_price)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          🎯 Tahmini Tamamlanma Tarihi
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          {new Date(formation.formation_timeline.estimated_completion).toLocaleDateString('tr-TR')}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          ⏱️ Geçen Gün / Kalan Gün
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {formation.formation_timeline.days_elapsed} / {formation.formation_timeline.estimated_days_remaining}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>

                  <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                    {formation.description}
                  </Typography>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        Detaylı Bilgiler
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                        gap: 2 
                      }}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            <ShieldIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                            Anahtar Seviyeler
                          </Typography>
                          <Box sx={{ pl: 3 }}>
                            <Typography variant="body2">
                              <strong>Destek:</strong> {formatPrice(formation.key_levels.support)}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Direnç:</strong> {formatPrice(formation.key_levels.resistance)}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Kırılım Seviyesi:</strong> {formatPrice(formation.key_levels.breakout_level)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            <ScheduleIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                            Zaman Çerçevesi
                          </Typography>
                          <Typography variant="body2" sx={{ pl: 3 }}>
                            {formation.timeframe}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            <TrendingUpIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                            Başarı Oranı
                          </Typography>
                          <Typography variant="body2" sx={{ pl: 3 }}>
                            {formation.success_rate}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            <CheckCircleIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                            Hacim Konfirmasyonu
                          </Typography>
                          <Typography variant="body2" sx={{ pl: 3 }}>
                            {formation.volume_confirmation}
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
          ))}
        </Box>
      ) : (
        !loading && (
          <Box textAlign="center" sx={{ py: 8 }}>
            <AnalyticsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Henüz formasyon bulunamadı
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Formasyon analizi başlatmak için yukarıdaki butonu kullanın
            </Typography>
          </Box>
        )
      )}
    </Box>
  );
}

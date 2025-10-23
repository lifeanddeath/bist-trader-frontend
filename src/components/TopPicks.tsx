import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Avatar,
  Divider,
  Button,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import {
  Star as StarIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  EmojiEvents as TrophyIcon,
  Analytics as AnalyticsIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { useTopPicks } from '../hooks/useApi';
import { apiService } from '../services/api';

export default function TopPicks() {
  const { data, loading, error, refetch } = useTopPicks();
  const [isStartingAnalysis, setIsStartingAnalysis] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

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
              // Tüm sayfaları yenile
              window.location.reload();
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

  const handleStartAnalysis = async () => {
    setIsStartingAnalysis(true);
    try {
      await apiService.startAnalysis();
    } catch (error) {
      console.error('Analiz başlatma hatası:', error);
      alert('Analiz zaten çalışıyor olabilir veya bir hata oluştu. Lütfen birkaç dakika sonra tekrar deneyin.');
      setIsStartingAnalysis(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₺${price.toFixed(2)}`;
  };

  const calculateGainPercent = (current: number, target: number) => {
    return ((target - current) / current * 100).toFixed(1);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Mükemmel';
    if (score >= 80) return 'Çok İyi';
    if (score >= 70) return 'İyi';
    if (score >= 60) return 'Orta';
    return 'Düşük';
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        En iyi seçimler yüklenirken hata oluştu: {error}
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
            En İyi Seçimler Analiz Ediliyor...
          </Typography>
          <Box sx={{ width: 300, mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={analysisProgress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Yeni en iyi hisseler analiz ediliyor ve sayfa otomatik olarak güncellenecek
          </Typography>
        </Box>
      </Backdrop>

      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          En İyi 2 Hisse Seçimi
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<PlayIcon />}
            onClick={handleStartAnalysis}
            disabled={isStartingAnalysis}
            sx={{ mr: 2 }}
          >
            {isStartingAnalysis ? 'En İyi Seçimler Analiz Ediliyor...' : 'En İyi Seçimler Analiz Et'}
          </Button>
          <IconButton onClick={refetch} disabled={loading || isStartingAnalysis}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {data && (
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Seçim Kriterleri
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2 
            }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  RSI Ağırlığı
                </Typography>
                <Typography variant="h6" color="primary">
                  %{(data.selection_criteria.rsi_weight * 100).toFixed(0)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Sinyal Sayısı Ağırlığı
                </Typography>
                <Typography variant="h6" color="secondary">
                  %{(data.selection_criteria.signal_count_weight * 100).toFixed(0)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Risk/Ödül Ağırlığı
                </Typography>
                <Typography variant="h6" color="warning.main">
                  %{(data.selection_criteria.risk_reward_weight * 100).toFixed(0)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Volatilite Ağırlığı
                </Typography>
                <Typography variant="h6" color="info.main">
                  %{(data.selection_criteria.volatility_weight * 100).toFixed(0)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      {data?.top_picks && data.top_picks.length > 0 ? (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3 
        }}>
          {data.top_picks.map((pick, index) => (
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                {/* Rank Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: index === 0 ? 'gold' : 'primary.main',
                      width: 40,
                      height: 40,
                      fontWeight: 'bold',
                    }}
                  >
                    {index + 1}
                  </Avatar>
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <TrophyIcon sx={{ fontSize: 24, mr: 1, color: index === 0 ? 'gold' : 'primary.main' }} />
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {pick.stock.symbol}
                    </Typography>
                  </Box>

                  {/* Score */}
                  <Box sx={{ mb: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Seçim Skoru
                      </Typography>
                      <Chip
                        label={`${pick.score.toFixed(1)} - ${getScoreLabel(pick.score)}`}
                        color={getScoreColor(pick.score)}
                        size="small"
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={pick.score}
                      color={getScoreColor(pick.score)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  {/* Price Information */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {formatPrice(pick.stock.current_price)}
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 2 
                    }}>
                      <Box textAlign="center">
                        <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                          {formatPrice(pick.stock.target_1)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Hedef 1 (%{calculateGainPercent(pick.stock.current_price, pick.stock.target_1)})
                        </Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                          {formatPrice(pick.stock.target_2)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Hedef 2 (%{calculateGainPercent(pick.stock.current_price, pick.stock.target_2)})
                        </Typography>
                      </Box>
                    </Box>
                    <Box textAlign="center" sx={{ mt: 2 }}>
                      <Typography variant="h6" color="error.main" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(pick.stock.stop_loss)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Stop Loss
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Reasons */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                      <StarIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      Seçim Nedenleri
                    </Typography>
                    <List dense>
                      {pick.reasons.map((reason, reasonIndex) => (
                        <ListItem key={reasonIndex} sx={{ py: 0.5, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                {reason}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Buy Signals */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      <TrendingUpIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      Alım Sinyalleri ({pick.stock.buy_signals.length})
                    </Typography>
                    <List dense>
                      {pick.stock.buy_signals.slice(0, 2).map((signal, signalIndex) => (
                        <ListItem key={signalIndex} sx={{ py: 0.5, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <AnalyticsIcon color="primary" sx={{ fontSize: 16 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                {signal}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                      {pick.stock.buy_signals.length > 2 && (
                        <ListItem sx={{ py: 0.5, px: 0 }}>
                          <ListItemText
                            primary={
                              <Typography variant="body2" color="text.secondary">
                                +{pick.stock.buy_signals.length - 2} sinyal daha...
                              </Typography>
                            }
                          />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                </CardContent>
              </Card>
          ))}
        </Box>
      ) : (
        !loading && (
          <Box textAlign="center" sx={{ py: 8 }}>
            <StarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Henüz en iyi seçim bulunamadı
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Analiz tamamlandıktan sonra en iyi seçimler burada görünecek
            </Typography>
          </Box>
        )
      )}
    </Box>
  );
}

import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Alert,
  LinearProgress,
  Button,
  IconButton,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useLatestSignals, useLatestSignalsRelaxed } from '../hooks/useApi';
import { apiService } from '../services/api';

interface SignalsProps {
  signalType?: 'standard' | 'relaxed';
}

export default function Signals({ signalType = 'standard' }: SignalsProps) {
  const standardSignals = useLatestSignals();
  const relaxedSignals = useLatestSignalsRelaxed();
  const { data, loading, error, refetch } = signalType === 'relaxed' ? relaxedSignals : standardSignals;
  const [isStartingAnalysis, setIsStartingAnalysis] = React.useState(false);
  const [analysisProgress, setAnalysisProgress] = React.useState(0);

  // Auto-refresh during analysis
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let refreshInterval: NodeJS.Timeout;
    
    if (isStartingAnalysis) {
      setAnalysisProgress(0);
      
      // Progress bar animation (slower, more realistic)
      progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) return prev; // Stop at 90%, wait for real completion
          return prev + 2;
        });
      }, 1000);
      
      // Check for new data every 5 seconds (analysis usually takes 1-2 minutes)
      refreshInterval = setInterval(() => {
        refetch();
      }, 5000);
      
      // Auto-complete after 90 seconds (analysis should be done by then)
      const timeout = setTimeout(() => {
        clearInterval(progressInterval);
        clearInterval(refreshInterval);
        setAnalysisProgress(100);
        setTimeout(() => {
          setIsStartingAnalysis(false);
          refetch(); // Final refresh
        }, 1000);
      }, 90000); // 90 seconds timeout
      
      return () => {
        clearInterval(progressInterval);
        clearInterval(refreshInterval);
        clearTimeout(timeout);
      };
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [isStartingAnalysis, refetch]);

  const handleStartAnalysis = async () => {
    setIsStartingAnalysis(true);
    try {
      if (signalType === 'relaxed') {
        await apiService.runSignalFinderRelaxed();
      } else {
        await apiService.runSignalFinder();
      }
      // Analysis started, progress bar will handle completion
    } catch (error) {
      console.error('Analiz başlatma hatası:', error);
      alert('Analiz başlatılamadı veya bir hata oluştu. Lütfen birkaç dakika sonra tekrar deneyin.');
      setIsStartingAnalysis(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₺${price.toFixed(2)}`;
  };

  const calculateGainPercent = (current: number, target: number) => {
    return ((target - current) / current * 100).toFixed(1);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Sinyaller yüklenirken hata oluştu: {error}
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
            Analiz Başlatılıyor...
          </Typography>
          <Box sx={{ width: 300, mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={analysisProgress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Yeni hisseler analiz ediliyor ve sayfa otomatik olarak güncellenecek
          </Typography>
        </Box>
      </Backdrop>

      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {signalType === 'relaxed' ? 'BIST Sinyalleri (Biraz Daha Esnetilmiş)' : 'BIST Sinyalleri'}
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<PlayIcon />}
            onClick={handleStartAnalysis}
            disabled={isStartingAnalysis}
            sx={{ mr: 2 }}
          >
            {isStartingAnalysis ? 'Analiz Başlatılıyor...' : 'Analiz Başlat'}
          </Button>
          <IconButton onClick={refetch} disabled={loading || isStartingAnalysis}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {data && (
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 2 
            }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Toplam Sinyal
                </Typography>
                <Typography variant="h6" color="primary">
                  {data.perfect_signals_count || data.total_count || 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Analiz Edilen
                </Typography>
                <Typography variant="h6" color="secondary">
                  {data.total_analyzed || 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Son Analiz
                </Typography>
                <Typography variant="body2">
                  {data.timestamp ? new Date(data.timestamp).toLocaleString('tr-TR') : 'Henüz analiz yapılmadı'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      {data?.stocks && data.stocks.length > 0 ? (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 3 
        }}>
          {data.stocks.map((stock, index) => (
              <Card
                key={stock.symbol}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {stock.symbol}
                    </Typography>
                    <Chip
                      label={`${data.stocks.length - index}. Sıra`}
                      color="primary"
                      size="small"
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                      {formatPrice(stock.current_price)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mevcut Fiyat
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2, 
                    mb: 3 
                  }}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(stock.target_1)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Hedef 1 (%{calculateGainPercent(stock.current_price, stock.target_1)})
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(stock.target_2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Hedef 2 (%{calculateGainPercent(stock.current_price, stock.target_2)})
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Stop Loss
                    </Typography>
                    <Typography variant="h6" color="error.main" sx={{ fontWeight: 'bold' }}>
                      {formatPrice(stock.stop_loss)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Alım Sinyalleri ({stock.buy_signals.length})
                    </Typography>
                    <List dense>
                      {stock.buy_signals.slice(0, 3).map((signal, signalIndex) => (
                        <ListItem key={signalIndex} sx={{ py: 0.5, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
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
                      {stock.buy_signals.length > 3 && (
                        <ListItem sx={{ py: 0.5, px: 0 }}>
                          <ListItemText
                            primary={
                              <Typography variant="body2" color="text.secondary">
                                +{stock.buy_signals.length - 3} sinyal daha...
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
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <TrendingUpIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Henüz sinyal bulunamadı
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Analiz başlatmak için yukarıdaki butonu kullanın
            </Typography>
          </Paper>
        )
      )}
    </Box>
  );
}

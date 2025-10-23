import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useStatus, useSignalsCount } from '../hooks/useApi';

export default function Dashboard() {
  const { data: status, loading: statusLoading, error: statusError } = useStatus();
  const { data: count, loading: countLoading, error: countError } = useSignalsCount();

  const stats = [
    {
      title: 'Mükemmel Sinyal',
      value: count?.perfect_signals_count || 0,
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary',
    },
    {
      title: 'Toplam Analiz',
      value: status?.total_analyzed || 0,
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      color: 'secondary',
    },
    {
      title: 'En İyi Seçim',
      value: '2',
      icon: <StarIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: 'warning',
    },
    {
      title: 'API Durumu',
      value: status?.status === 'ready' ? 'Hazır' : 'Beklemede',
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success',
    },
  ];

  if (statusError || countError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Veri yüklenirken hata oluştu. Lütfen API bağlantısını kontrol edin.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        🚀 Cart Curt Algo Trading Dashboard
      </Typography>
      
      {/* Uyarı Mesajı */}
      <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          ⚠️ UYARI: Bu platform yatırım tavsiyesi değildir! Tüm işlemler kendi sorumluluğunuzdadır. 
          Finansal kararlarınızı alırken mutlaka profesyonel danışmanlık alın.
        </Typography>
      </Alert>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3, 
        mb: 4 
      }}>
        {stats.map((stat, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {stat.title}
                  </Typography>
                </Box>
                {stat.icon}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>


      {/* Last Analysis Info */}
      {status && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Son Analiz Bilgileri
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2 
          }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Son Analiz Zamanı
              </Typography>
              <Typography variant="body1">
                {new Date(status.last_analysis).toLocaleString('tr-TR')}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Toplam Analiz Edilen Hisse
              </Typography>
              <Typography variant="body1">
                {status.total_analyzed} hisse
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Loading States */}
      {(statusLoading || countLoading) && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Veriler yükleniyor...
          </Typography>
        </Box>
      )}
    </Box>
  );
}

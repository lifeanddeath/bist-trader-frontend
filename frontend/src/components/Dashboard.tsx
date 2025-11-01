import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
} from '@mui/material';
import { useDashboard } from '../hooks/useApi';

export default function Dashboard() {
  const { data } = useDashboard();

  // Örnek veriler - API'den veri gelmediğinde gösterilecek
  const exampleStocks = [
    {
      symbol: 'BASCM.IS',
      current_price: 15.0,
      target_1: 15.15,
      target_2: 15.3,
      stop_loss: 14.22,
      buy_signals: ['RSI Düşük Seviye', 'MACD Crossover', 'Desteğe Dokunuş'],
    },
    {
      symbol: 'AKBNK.IS',
      current_price: 48.75,
      target_1: 50.20,
      target_2: 52.10,
      stop_loss: 47.00,
      buy_signals: ['Hacim Artışı', 'Momentum Güçlenme', 'Fibonacci Seviyesi'],
    },
    {
      symbol: 'THYAO.IS',
      current_price: 125.50,
      target_1: 130.00,
      target_2: 135.50,
      stop_loss: 120.00,
      buy_signals: ['Trend Kırılım', 'RSI Düşük Seviye', 'Güçlü Alım Hacmi', 'Formasyon Tamamlama'],
    },
  ];

  const exampleData = {
    timestamp: '2025-11-01T16:16:22.319957',
    total_analyzed: 477,
    perfect_signals_count: 6,
    stocks: exampleStocks,
  };

  // Örnek veri veya gerçek veri kullan
  const displayData = data && data.stocks && data.stocks.length > 0 ? data : exampleData;

  const formatPrice = (price: number) => `₺${price.toFixed(2)}`;

  const formatDate = (dateString: string) => {
    // JSON response'dan gelen timestamp'i direkt parse et
    // Format: "2025-11-01T16:16:22.319957"
    const parts = dateString.split('T');
    if (parts.length !== 2) return dateString;
    
    const datePart = parts[0]; // "2025-11-01"
    const timePart = parts[1]; // "16:16:22.319957"
    
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    
    const monthIndex = parseInt(month, 10) - 1;
    const monthName = monthNames[monthIndex] || month;
    
    return `${parseInt(day, 10)} ${monthName} ${hour}:${minute}`;
  };

  return (
    <Box>
      {/* Last Update Date - Top Right */}
      {displayData && displayData.timestamp && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mb: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#4a5568',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: 600,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: { xs: 1, sm: 1.5 },
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            En Son Güncelleme: {formatDate(displayData.timestamp)}
          </Typography>
        </Box>
      )}

      {/* Stock Cards */}
      {displayData && displayData.stocks && displayData.stocks.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {displayData.stocks.map((stock) => {
            return (
              <Card
                key={stock.symbol}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  borderRadius: 2,
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2.5 } }}>
                  {/* Symbol Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#2d3748',
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                      }}
                    >
                      {stock.symbol}
                    </Typography>
                    <Chip
                      label={`${stock.buy_signals?.length || 0} Sinyal`}
                      size="small"
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        fontWeight: 600,
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea',
                        height: { xs: 22, sm: 26 },
                      }}
                    />
                  </Box>

                  {/* Current Price */}
                  <Box sx={{ mb: 2.5 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: '#2d3748',
                        fontSize: { xs: '1.4rem', sm: '1.6rem' },
                        mb: 0.5,
                      }}
                    >
                      {formatPrice(stock.current_price)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#718096',
                        fontWeight: 500,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      }}
                    >
                      Mevcut Fiyat
                    </Typography>
                  </Box>

                  {/* Targets Section */}
                  <Box sx={{ mb: 2 }}>
                    {/* Target 1 */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1.5,
                        py: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: '#4a5568', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        %1 Hedef Fiyatı
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, color: '#2d3748', fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
                      >
                        {formatPrice(stock.target_1)}
                      </Typography>
                    </Box>

                    {/* Target 2 */}
                    {stock.target_2 && (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1.5,
                          py: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: '#4a5568', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                          %2 Hedef Fiyatı
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, color: '#2d3748', fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
                        >
                          {formatPrice(stock.target_2)}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Stop Loss */}
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: '#4a5568', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        Stop Loss
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, color: '#2d3748', fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
                      >
                        {formatPrice(stock.stop_loss)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Buy Signals */}
                  {stock.buy_signals && stock.buy_signals.length > 0 && (
                    <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          color: '#718096',
                          mb: 1,
                          fontWeight: 600,
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        }}
                      >
                        Alım Sinyalleri ({stock.buy_signals.length})
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {stock.buy_signals.slice(0, 4).map((signal, idx) => (
                          <Chip
                            key={idx}
                            label={signal}
                            size="small"
                            sx={{
                              fontSize: { xs: '0.65rem', sm: '0.7rem' },
                              height: { xs: 20, sm: 24 },
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              color: '#4a5568',
                              fontWeight: 500,
                              border: 'none',
                            }}
                          />
                        ))}
                        {stock.buy_signals.length > 4 && (
                          <Chip
                            label={`+${stock.buy_signals.length - 4}`}
                            size="small"
                            sx={{
                              fontSize: { xs: '0.65rem', sm: '0.7rem' },
                              height: { xs: 20, sm: 24 },
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              color: '#4a5568',
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      ) : null}
    </Box>
  );
}

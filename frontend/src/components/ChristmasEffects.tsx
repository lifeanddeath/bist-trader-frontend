import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

// Kar taneleri efekti
const Snowflake = () => {
  const [snowflakes, setSnowflakes] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    const createSnowflake = () => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: -10,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
    });

    const initialSnowflakes = Array.from({ length: 50 }, createSnowflake);
    setSnowflakes(initialSnowflakes);

    const interval = setInterval(() => {
      setSnowflakes(prev => 
        prev.map(snowflake => ({
          ...snowflake,
          y: snowflake.y + snowflake.speed,
          x: snowflake.x + Math.sin(snowflake.y * 0.01) * 0.5,
        })).filter(snowflake => snowflake.y < window.innerHeight + 10)
        .concat(Array.from({ length: 2 }, createSnowflake))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      {snowflakes.map(snowflake => (
        <Box
          key={snowflake.id}
          sx={{
            position: 'absolute',
            left: snowflake.x,
            top: snowflake.y,
            width: snowflake.size,
            height: snowflake.size,
            backgroundColor: 'white',
            borderRadius: '50%',
            opacity: snowflake.opacity,
            boxShadow: '0 0 6px white',
            animation: 'sparkle 2s infinite',
          }}
        />
      ))}
    </Box>
  );
};

// Noel Baba animasyonu
const SantaAnimation = () => {
  const [santaPosition, setSantaPosition] = useState(-100);

  useEffect(() => {
    const interval = setInterval(() => {
      setSantaPosition(prev => {
        if (prev > window.innerWidth + 100) {
          return -100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '10%',
        left: santaPosition,
        zIndex: 1001,
        pointerEvents: 'none',
        fontSize: '2rem',
        animation: 'bounce 1s infinite',
      }}
    >
      🎅
    </Box>
  );
};

// Ren geyiği animasyonu
const ReindeerAnimation = () => {
  const [reindeerPosition, setReindeerPosition] = useState(-150);

  useEffect(() => {
    const interval = setInterval(() => {
      setReindeerPosition(prev => {
        if (prev > window.innerWidth + 150) {
          return -150;
        }
        return prev + 1.5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '15%',
        left: reindeerPosition,
        zIndex: 1001,
        pointerEvents: 'none',
        fontSize: '1.5rem',
        animation: 'wiggle 0.5s infinite',
      }}
    >
      🦌
    </Box>
  );
};

// Noel mesajı
const ChristmasMessage = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!showMessage) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1002,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        animation: 'fadeIn 1s ease-in',
      }}
    >
      <Typography variant="h4" sx={{ mb: 1 }}>
        🎄 Mutlu Yıllar! 🎄
      </Typography>
      <Typography variant="h6">
        Cart Curt Algo Trading'den
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
        Yeni yılda bol kazançlar! 💰
      </Typography>
    </Box>
  );
};

// Ana Christmas Effects komponenti
const ChristmasEffects = () => {
  const [isChristmas, setIsChristmas] = useState(false);

  useEffect(() => {
    // Test için her zaman aktif - gerçek kullanımda aşağıdaki kodu kullanın:
    // const now = new Date();
    // const isDecember = now.getMonth() === 11; // Aralık ayı
    // const isNearChristmas = isDecember && now.getDate() >= 15;
    // setIsChristmas(isNearChristmas);
    
    // Şimdi her zaman aktif (test için)
    setIsChristmas(false);
  }, []);

  if (!isChristmas) return null;

  return (
    <>
      <Snowflake />
      <SantaAnimation />
      <ReindeerAnimation />
      <ChristmasMessage />
      
      <style>
        {`
          @keyframes sparkle {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.2); opacity: 1; }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(5deg); }
            75% { transform: rotate(-5deg); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
        `}
      </style>
    </>
  );
};

export default ChristmasEffects;

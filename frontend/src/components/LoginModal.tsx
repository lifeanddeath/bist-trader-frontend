import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  Typography,
  Paper,
  Container,
} from '@mui/material';
import { AccountCircle as AccountCircleIcon, Lock as LockIcon } from '@mui/icons-material';

interface LoginModalProps {
  open: boolean;
  onLogin: (username: string, password: string) => void;
}

export default function LoginModal({ open, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // Check for saved credentials on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('bist-trading-username');
    const savedPassword = localStorage.getItem('bist-trading-password');
    const rememberMe = localStorage.getItem('bist-trading-remember') === 'true';
    const expiryDate = localStorage.getItem('bist-trading-expiry');
    
    if (savedUsername && savedPassword && rememberMe && expiryDate) {
      const now = new Date();
      const expiry = new Date(expiryDate);
      
      if (now < expiry) {
        setUsername(savedUsername);
        setPassword(savedPassword);
        setRememberMe(true);
      } else {
        // Expired, clear storage
        localStorage.removeItem('bist-trading-username');
        localStorage.removeItem('bist-trading-password');
        localStorage.removeItem('bist-trading-remember');
        localStorage.removeItem('bist-trading-expiry');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = () => {
    setError('');
    
    if (!username || !password) {
      setError('Lütfen kullanıcı adı ve şifrenizi girin.');
      return;
    }

    if (username === 'cartcurt3434' && password === 'harthurt3434') {
      if (rememberMe) {
        localStorage.setItem('bist-trading-username', username);
        localStorage.setItem('bist-trading-password', password);
        localStorage.setItem('bist-trading-remember', 'true');
        // 5 gün sonra otomatik sil
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 5);
        localStorage.setItem('bist-trading-expiry', expiryDate.toISOString());
      } else {
        localStorage.removeItem('bist-trading-username');
        localStorage.removeItem('bist-trading-password');
        localStorage.removeItem('bist-trading-remember');
        localStorage.removeItem('bist-trading-expiry');
      }
      onLogin(username, password);
    } else {
      setError('Kullanıcı adı veya şifre hatalı. Lütfen tekrar deneyin.');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #20b2aa 50%, #40e0d0 75%, #00ced1 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        padding: { xs: 2, sm: 3 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)',
          animation: 'floatReverse 25s ease-in-out infinite',
        },
        '@keyframes gradientShift': {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
        '@keyframes float': {
          '0%, 100%': {
            transform: 'translate(0, 0) rotate(0deg)',
          },
          '50%': {
            transform: 'translate(-50px, -50px) rotate(180deg)',
          },
        },
        '@keyframes floatReverse': {
          '0%, 100%': {
            transform: 'translate(0, 0) rotate(0deg)',
          },
          '50%': {
            transform: 'translate(50px, 50px) rotate(-180deg)',
          },
        },
      }}
    >
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Floating particles effect */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 0,
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
              borderRadius: '50%',
              top: '10%',
              left: '10%',
              animation: 'particle1 8s ease-in-out infinite',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, rgba(102,126,234,0.4) 0%, transparent 70%)',
              borderRadius: '50%',
              bottom: '15%',
              right: '15%',
              animation: 'particle2 10s ease-in-out infinite',
            },
            '@keyframes particle1': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: 0.3 },
              '50%': { transform: 'translate(30px, -30px) scale(1.2)', opacity: 0.6 },
            },
            '@keyframes particle2': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: 0.4 },
              '50%': { transform: 'translate(-40px, 40px) scale(1.3)', opacity: 0.7 },
            },
          }}
        />
        <Paper
          elevation={0}
          sx={{
            padding: { xs: 3.5, sm: 4.5 },
            borderRadius: 4,
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
            backdropFilter: 'blur(30px) saturate(180%)',
            WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.15),
              0 0 0 1px rgba(255, 255, 255, 0.3) inset,
              0 0 40px rgba(102, 126, 234, 0.2),
              0 0 80px rgba(32, 178, 170, 0.15)
            `,
            border: '1px solid rgba(255, 255, 255, 0.5)',
            position: 'relative',
            zIndex: 1,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 4,
              padding: '2px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.5), rgba(32, 178, 170, 0.5), rgba(0, 206, 209, 0.5))',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              opacity: 0,
              transition: 'opacity 0.4s ease',
            },
            '&:hover': {
              transform: 'translateY(-4px) scale(1.01)',
              boxShadow: `
                0 16px 48px rgba(0, 0, 0, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.4) inset,
                0 0 60px rgba(102, 126, 234, 0.4),
                0 0 100px rgba(32, 178, 170, 0.3)
              `,
              '&::before': {
                opacity: 1,
              },
            },
          }}
        >
          {/* Company Name */}
          <Box sx={{ textAlign: 'center', mb: 4.5, position: 'relative' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#2d3748',
                fontSize: { xs: '2rem', sm: '2.5rem' },
                mb: 1.5,
                letterSpacing: '-0.5px',
                position: 'relative',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              Cart Curt Trade
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#4a5568',
                fontStyle: 'italic',
                fontSize: { xs: '0.95rem', sm: '1rem' },
                mt: 1.5,
                fontWeight: 600,
                letterSpacing: '0.3px',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.9)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '8px 16px',
                borderRadius: 2,
                display: 'inline-block',
                backdropFilter: 'blur(10px)',
              }}
            >
              -Harcarken cart curt, borsa istanbulda hart hurt
            </Typography>
          </Box>

          {/* Login Form */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Kullanıcı Adı"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <AccountCircleIcon sx={{ mr: 1, color: '#667eea', fontSize: 24 }} />
                ),
              }}
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                    '& fieldset': {
                      borderColor: '#667eea',
                      borderWidth: 2.5,
                    },
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4), 0 0 0 4px rgba(102, 126, 234, 0.1)',
                    '& fieldset': {
                      borderColor: '#667eea',
                      borderWidth: 2.5,
                    },
                  },
                  '& fieldset': {
                    borderColor: 'rgba(102, 126, 234, 0.3)',
                    borderWidth: 2,
                    transition: 'all 0.3s ease',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#2d3748',
                  fontWeight: 600,
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
                  '&.Mui-focused': {
                    color: '#667eea',
                    fontWeight: 700,
                    textShadow: '0 1px 3px rgba(102, 126, 234, 0.3)',
                  },
                },
              }}
              autoComplete="username"
            />

            <TextField
              fullWidth
              type="password"
              label="Şifre"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <LockIcon sx={{ mr: 1, color: '#20b2aa', fontSize: 24 }} />
                ),
              }}
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 4px 20px rgba(32, 178, 170, 0.2)',
                    '& fieldset': {
                      borderColor: '#20b2aa',
                      borderWidth: 2.5,
                    },
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 8px 30px rgba(32, 178, 170, 0.4), 0 0 0 4px rgba(32, 178, 170, 0.1)',
                    '& fieldset': {
                      borderColor: '#20b2aa',
                      borderWidth: 2.5,
                    },
                  },
                  '& fieldset': {
                    borderColor: 'rgba(32, 178, 170, 0.3)',
                    borderWidth: 2,
                    transition: 'all 0.3s ease',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#2d3748',
                  fontWeight: 600,
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
                  '&.Mui-focused': {
                    color: '#20b2aa',
                    fontWeight: 700,
                    textShadow: '0 1px 3px rgba(32, 178, 170, 0.3)',
                  },
                },
              }}
              autoComplete="current-password"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{
                    color: '#667eea',
                    transition: 'all 0.3s ease',
                    '&.Mui-checked': {
                      color: '#667eea',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    },
                  }}
                />
              }
              label={
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                    color: '#2d3748',
                    fontWeight: 600,
                    textShadow: '0 1px 1px rgba(255, 255, 255, 0.8)',
                  }}
                >
                  Beni Hatırla (5 gün)
                </Typography>
              }
              sx={{ mb: 2.5 }}
            />

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2.5,
                  borderRadius: 2,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  border: '1px solid rgba(244, 67, 54, 0.3)',
                }}
              >
                {error}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              size="large"
              sx={{
                mt: 1,
                mb: 2,
                padding: { xs: 1.75, sm: 2 },
                borderRadius: 3,
                backgroundColor: '#667eea',
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                textTransform: 'none',
                letterSpacing: '0.5px',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#5568d3',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              Giriş Yap
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

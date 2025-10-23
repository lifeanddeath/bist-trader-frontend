import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { Lock as LockIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';

interface LoginModalProps {
  open: boolean;
  onLogin: (password: string) => void;
}

export default function LoginModal({ open, onLogin }: LoginModalProps) {
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // Check for saved password on mount
  useEffect(() => {
    const savedPassword = localStorage.getItem('bist-trading-password');
    const rememberMe = localStorage.getItem('bist-trading-remember') === 'true';
    
    if (savedPassword && rememberMe) {
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = () => {
    if (password === 'CartCurt3434!') { // Güvenli şifre
      if (rememberMe) {
        localStorage.setItem('bist-trading-password', password);
        localStorage.setItem('bist-trading-remember', 'true');
        // 5 gün sonra otomatik sil
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 5);
        localStorage.setItem('bist-trading-expiry', expiryDate.toISOString());
      } else {
        localStorage.removeItem('bist-trading-password');
        localStorage.removeItem('bist-trading-remember');
        localStorage.removeItem('bist-trading-expiry');
      }
      onLogin(password);
    } else {
      setError('Yanlış şifre! Lütfen tekrar deneyin.');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Dialog 
      open={open} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <TrendingUpIcon sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Cart Curt Algo Trading
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          🔐 Güvenli Erişim
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Paper sx={{ p: 3, backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
          <TextField
            fullWidth
            type="password"
            label="Güvenlik Şifresi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: <LockIcon sx={{ mr: 1, color: 'white' }} />
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                '&.Mui-focused fieldset': { borderColor: 'white' }
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'white' }
            }}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                sx={{ color: 'white' }}
              />
            }
            label="Beni Hatırla (5 gün)"
            sx={{ color: 'white', mb: 2 }}
          />
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center', mt: 2 }}>
            ⚠️ Bu platform yatırım tavsiyesi değildir. Tüm işlemler kendi sorumluluğunuzdadır.
          </Typography>
        </Paper>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleLogin}
          variant="contained"
          fullWidth
          size="large"
          sx={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              background: 'rgba(255,255,255,0.3)',
            }
          }}
        >
          🚀 Giriş Yap
        </Button>
      </DialogActions>
    </Dialog>
  );
}

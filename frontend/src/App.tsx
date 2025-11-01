import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Signals from './components/Signals';
import Formations from './components/Formations';
import TopPicks from './components/TopPicks';
import LoginModal from './components/LoginModal';
import ChristmasEffects from './components/ChristmasEffects';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('bist-trading-username');
    const savedPassword = localStorage.getItem('bist-trading-password');
    const rememberMe = localStorage.getItem('bist-trading-remember') === 'true';
    const expiryDate = localStorage.getItem('bist-trading-expiry');
    
    if (savedUsername && savedPassword && rememberMe && expiryDate) {
      const now = new Date();
      const expiry = new Date(expiryDate);
      
      if (now < expiry) {
        // Verify credentials are still valid
        if (savedUsername === 'cartcurt3434' && savedPassword === 'harthurt3434') {
          setIsAuthenticated(true);
          setShowLogin(false);
        } else {
          // Invalid credentials, clear storage
          localStorage.removeItem('bist-trading-username');
          localStorage.removeItem('bist-trading-password');
          localStorage.removeItem('bist-trading-remember');
          localStorage.removeItem('bist-trading-expiry');
        }
      } else {
        // Expired, clear storage
        localStorage.removeItem('bist-trading-username');
        localStorage.removeItem('bist-trading-password');
        localStorage.removeItem('bist-trading-remember');
        localStorage.removeItem('bist-trading-expiry');
      }
    }
  }, []);

  const handleLogin = (username: string, password: string) => {
    if (username === 'cartcurt3434' && password === 'harthurt3434') {
      setIsAuthenticated(true);
      setShowLogin(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'signals':
        return <Signals />;
      case 'formations':
        return <Formations />;
      case 'top-picks':
        return <TopPicks />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginModal open={showLogin} onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChristmasEffects />
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;

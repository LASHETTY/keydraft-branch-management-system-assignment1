import React, { useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import BranchManagement from './components/BranchManagement';
import Login from './components/Login';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1e88e5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#34495e',
    },
  },
  typography: {
    fontWeightBold: 600,
    h4: {
      fontWeight: 700,
      color: '#2c3e50',
    },
    h5: {
      fontWeight: 600,
      color: '#2c3e50',
    },
    h6: {
      fontWeight: 600,
      color: '#2c3e50',
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isAuthenticated ? (
        <Login onLogin={setIsAuthenticated} />
      ) : (
        <BranchManagement onLogout={handleLogout} />
      )}
    </ThemeProvider>
  );
}

export default App;

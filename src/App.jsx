import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Typography, Box } from '@mui/material';
import { AppProvider } from './context/AppContext.jsx';
import { theme } from './theme/theme.js';
import MainLayout from './components/layout/MainLayout.jsx';
import KPIGrid from './components/KPIGrid.jsx';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <MainLayout>
          {/* Dashboard Header */}
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 2, 
                color: theme.palette.secondary.main, 
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Dashboard
            </Typography>
            <Box sx={{display:"flex", gap:3}}>
          <Box>
            {/* KPI Cards Grid */}
            <KPIGrid />
          </Box>
          </Box>
        </MainLayout>
      </AppProvider>
    </ThemeProvider>
  );
}


export default App;

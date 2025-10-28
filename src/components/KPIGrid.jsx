import React, { useState, useEffect } from 'react';
import { Grid, Typography, CircularProgress, Alert, useTheme } from '@mui/material';
import { ReusableCard } from './cards/index.js';
import { mockKpiData } from '../utils/mockData.js';

const KPIGrid = () => {
  const [kpiData, setKpiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchKpiData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/kpi/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        // Normalize backend field `bg_color` -> `bgcolor` so ReusableCard receives the expected prop
        const normalized = (Array.isArray(data) ? data : [])
          .map((item) => ({
            ...item,
            // prefer backend `bg_color`, then `bgcolor` if already present
            bgcolor: item.bg_color ?? item.bgcolor ?? item.bgColor ?? undefined,
          }));

        setKpiData(normalized);
        setError(null);
      } catch (err) {
        console.error('Error fetching KPI data:', err);
        console.log('Using fallback mock data for KPI display');
        
        // Use mock data as fallback
        const normalizedMockData = mockKpiData.map((item) => ({
          ...item,
          bgcolor: item.bg_color ?? item.bgcolor ?? item.bgColor ?? undefined,
        }));
        
        setKpiData(normalizedMockData);
        setError(null); // Clear error since we have fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchKpiData();
  }, []);

  return (
    <Grid container spacing={3}>
      {loading ? (
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Grid>
      ) : error ? (
        <Grid item xs={12}>
          <Alert severity="error">
            Error loading KPI data: {error}
          </Alert>
        </Grid>
      ) : (
        <>
          {kpiData.map((kpi, index) => (
          <Grid 
            item 
            xs={12}        // 1 card per row on extra small screens
            sm={12}        // 1 card per row on small screens
            md={4}         // 3 cards per row on medium screens
            lg={4}   
          
            // 4 cards per row on large screens
            key={index}
            sx={{
              display: 'flex',
              flexGrow: 1,
              // stretch child on small screens, but keep auto sizing on md+
              width: { xs: '100%', md: 'auto' },
              justifyContent: { xs: 'stretch', md: 'flex-start' },
              alignItems: 'stretch'
            }}
          >
            <ReusableCard
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              icon={kpi.icon}
              color={kpi.color}
              bgcolor={kpi.bgcolor}
              variant="elevated"
              onClick={kpi.onClick || (() => console.log(`${kpi.title} clicked!`))}
              sx={{ width: { xs: '100%', sm: '100%', md: 'auto',flexGrow:"1"} }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 0.5, 
                  color: theme.palette.mode === 'dark' ? 'grey.600' : 'text.secondary'
                }}
              >
                {kpi.description}
              </Typography>
            </ReusableCard>
          </Grid>
        ))}
        </>
      )}
    </Grid>
  );
};

export default KPIGrid;
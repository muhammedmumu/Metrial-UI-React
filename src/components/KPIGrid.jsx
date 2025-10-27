import React, { useState, useEffect } from 'react';
import { Grid, Typography, CircularProgress, Alert } from '@mui/material';
import { ReusableCard } from './cards/index.js';

const KPIGrid = () => {
  const [kpiData, setKpiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchKpiData = async () => {
      try {
        setLoading(true);
        
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch('http://127.0.0.1:8000/api/kpi/', {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Normalize backend field `bg_color` -> `bgcolor` so ReusableCard receives the expected prop
        const normalized = (Array.isArray(data) ? data : [])
<<<<<<< HEAD
=======
          .slice(0, 6)
>>>>>>> c3b0faea5ef3dd165ca3ac61348b3edb6fb3ed8b
          .map((item) => ({
            ...item,
            // prefer backend `bg_color`, then `bgcolor` if already present
            bgcolor: item.bg_color ?? item.bgcolor ?? item.bgColor ?? undefined,
          }));

        setKpiData(normalized);
        setError(null);
      } catch (err) {
        console.warn('KPI API unavailable, using fallback data:', err.message);
        setError(null); // Don't show error to user, just use fallback
      } finally {
        setLoading(false);
      }
    };

    fetchKpiData();
  }, []);

  return (
    <Grid container spacing={3}>
      {loading ? (
        <Grid item xs={12} lg={4} sx={{ display: 'flex', justifyContent: 'space-evenly', py: 4 }}>
          <CircularProgress />
        </Grid>
      ) : error ? (
        <Grid item xs={12}>
          <Alert severity="error">
            Error loading KPI data: {error}
          </Alert>
        </Grid>
      ) : (
        kpiData.map((kpi, index) => (
          <Grid
            item
            xs={12}        // 1 card per row on extra small screens
            sm={12}        // 1 card per row on small screens
            md={4}         // 3 cards per row on medium screens
            lg={12}         // 4 cards per row on large screens

            // 4 cards per row on large screens
            key={index}
            sx={{
              display: 'flex',
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
              sx={{ width: { xs: '100%', sm: '100%', md: 'auto' } }}
            >

            </ReusableCard>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default KPIGrid;
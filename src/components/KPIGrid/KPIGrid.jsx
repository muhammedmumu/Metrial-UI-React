import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, useTheme } from '@mui/material';
import { ReusableCard } from '../Card/index.js';
import { mockKpiData } from '../../utils/mockData.js';

const KPIGrid = () => {
  const [kpiData, setKpiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    // Simulate loading delay and use mock data directly
    const loadMockData = () => {
      setLoading(true);

      // Simulate a brief loading state for better UX
      setTimeout(() => {
        // Normalize the mock data to match expected format
        const normalizedData = mockKpiData.map((item) => ({
          ...item,
          bgcolor: item.bg_color ?? item.bgcolor ?? item.bgColor ?? undefined,
        }));

        setKpiData(normalizedData);
        setError(null);
        setLoading(false);
      }, 500); // Brief 500ms delay to show loading state
    };

    loadMockData();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">
          Error loading KPI data: {error}
        </Alert>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              // lg: 'repeat(4, 1fr)',
            },
            gap: 3,
            width: '100%'
          }}
        >
          {kpiData.map((kpi, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
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
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
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
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default KPIGrid;
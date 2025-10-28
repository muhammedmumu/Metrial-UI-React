import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import { 
  ArrowForward, 
  TrendingUp, 
  TrendingDown, 
  Home,
  KeyboardArrowUp,
  KeyboardArrowDown 
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import ReusableCard from './cards/ReusableCard.jsx';

// Sample data (will be replaced with API call later)
const sampleData = {
  totalListings: 2988,
  forSale: {
    count: 1234,
    change: 0.23, // +0.23% increase
  },
  forRent: {
    count: 1754,
    change: -0.11, // -0.11% decrease
  }
};

// Chart colors
const COLORS = {
  forSale: '#2E7D32',  // Green for For Sale
  forRent: '#1976D2',  // Blue for For Rent
};

const ListingInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call - replace this with actual API endpoint
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, use sample data
        setData(sampleData);
        setError(null);
      } catch (err) {
        console.error('Error fetching listing insights:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewAll = () => {
    console.log('View All Listings clicked');
    // Add navigation logic here
  };

  // Prepare chart data
  const chartData = data ? [
    { name: 'For Sale', value: data.forSale.count, color: COLORS.forSale },
    { name: 'For Rent', value: data.forRent.count, color: COLORS.forRent }
  ] : [];

  // Format percentage change
  const formatChange = (change) => {
    const percentage = Math.abs(change * 100).toFixed(1);
    return `${percentage}%`;
  };

  // Get change icon and color
  const getChangeIndicator = (change) => {
    const isPositive = change > 0;
    return {
      icon: isPositive ? KeyboardArrowUp : KeyboardArrowDown,
      color: isPositive ? theme.palette.success.main : theme.palette.error.main,
      text: isPositive ? '+' : '-'
    };
  };

  // Custom label for center of donut
  const renderCenterLabel = () => (
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
      style={{ pointerEvents: 'none' }}
    >
      <tspan x="50%" dy="-0.5em" fontSize="12" fill={theme.palette.text.secondary}>
        Total Listings
      </tspan>
      <tspan x="50%" dy="1.2em" fontSize="20" fontWeight="600" fill={theme.palette.text.primary}>
        {data?.totalListings?.toLocaleString() || '0'}
      </tspan>
    </text>
  );

  if (loading) {
    return (
      <ReusableCard
        variant="elevated"
        sx={{ height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <CircularProgress />
      </ReusableCard>
    );
  }

  if (error) {
    return (
      <ReusableCard
        variant="elevated"
        sx={{ height: 480 }}
      >
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading listing insights: {error}
        </Alert>
      </ReusableCard>
    );
  }

  return (
    <ReusableCard
      variant="elevated"
      sx={{ 
        height: "fit-content", 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        width:{sm:"100%",
          md:"auto"
        }
      }}
    >
      {/* Header with title and View All button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="Body1"
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Home sx={{ fontSize: 20, color: theme.palette.primary.main }} />
          Property Listings
        </Typography>

        <IconButton
          onClick={handleViewAll}
          sx={{
            color: theme.palette.primary.main,
            backgroundColor: 'transparent',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'transparent',
              transform: 'scale(1.05)',
            },
            '&:active': {
              backgroundColor: 'transparent',
              transform: 'scale(0.95)',
            },
            '&:focus': {
              backgroundColor: 'transparent',
              outline: 'none',
            },
            boxShadow: 'none',
            border: 'none',
          }}
          disableRipple={true}
          disableFocusRipple={true}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 500,
              mr: 0.5,
            }}
          >
            View All
          </Typography>
          <ArrowForward sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* Donut Chart */}
      <Box
        sx={{
          height: 250,
          position: 'relative',
          mb: 3,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {/* Center Label */}
            {renderCenterLabel()}
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Metrics Rows */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* For Sale Metrics */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            backgroundColor: `${COLORS.forSale}08`,
            border: `1px solid ${COLORS.forSale}20`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: COLORS.forSale,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: theme.palette.text.primary,
              }}
            >
              For Sale
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {data?.forSale.count.toLocaleString()}
            </Typography>

            {data?.forSale.change !== 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {React.createElement(getChangeIndicator(data.forSale.change).icon, {
                  sx: { 
                    fontSize: 16, 
                    color: getChangeIndicator(data.forSale.change).color 
                  }
                })}
                <Typography
                  variant="caption"
                  sx={{
                    color: getChangeIndicator(data.forSale.change).color,
                    fontWeight: 500,
                  }}
                >
                  {formatChange(data.forSale.change)}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* For Rent Metrics */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            backgroundColor: `${COLORS.forRent}08`,
            border: `1px solid ${COLORS.forRent}20`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: COLORS.forRent,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: theme.palette.text.primary,
              }}
            >
              For Rent
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {data?.forRent.count.toLocaleString()}
            </Typography>

            {data?.forRent.change !== 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {React.createElement(getChangeIndicator(data.forRent.change).icon, {
                  sx: { 
                    fontSize: 16, 
                    color: getChangeIndicator(data.forRent.change).color 
                  }
                })}
                <Typography
                  variant="caption"
                  sx={{
                    color: getChangeIndicator(data.forRent.change).color,
                    fontWeight: 500,
                  }}
                >
                  {formatChange(data.forRent.change)}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </ReusableCard>
  );
};

export default ListingInsights;

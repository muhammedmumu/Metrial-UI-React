import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, BarChart, ShowChart } from '@mui/icons-material';

// Icon mapping for string-based icon names
const iconMap = {
  'TrendingUp': TrendingUp,
  'TrendingDown': TrendingDown,
  'BarChart': BarChart,
  'ShowChart': ShowChart,
};
import ReusableCard from '../Card';

const ChartCard = ({ 
  title, 
  children, 
  sx = {},
  type,
  data,
  xAxisKey,
  series,
  height = 300,
  showLegend = true,
  formatValue,
  icon,
  color,
  variant = 'outlined'
}) => {
  const theme = useTheme();

  // If children are provided, use the original simple card behavior
  if (children) {
    return (
      <Card sx={{ mb: 2, ...sx }} variant={variant}>
        <CardContent>
          {title && (
            <Typography variant="h6" component="h2" gutterBottom>
              {title}
            </Typography>
          )}
          <Box sx={{ mt: 2 }}>
            {children}
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Enhanced chart functionality
  const renderChart = () => {
    if (type === 'line' && data && series) {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey={xAxisKey || 'x'} 
              stroke={theme.palette.text.secondary}
              fontSize={12}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              fontSize={12}
              tickFormatter={formatValue}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius,
              }}
              formatter={(value) => formatValue ? formatValue(value) : value}
            />
            {showLegend && <Legend />}
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color || theme.palette.primary.main}
                strokeWidth={2}
                dot={{ fill: s.color || theme.palette.primary.main, strokeWidth: 2, r: 4 }}
                name={s.name || s.key}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    }
    
    return (
      <Box 
        sx={{ 
          height: height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: theme.palette.text.secondary 
        }}
      >
        <Typography>Chart type "{type}" not implemented yet</Typography>
      </Box>
    );
  };

  return (
    <Card sx={{ mb: 2, ...sx }} variant={variant}>
      <ReusableCard>
        {title && (
          <Typography 
            variant="h6" 
            component="h2" 
            gutterBottom
            sx={{ 
              color: color || theme.palette.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            {icon && (() => {
              // If icon is a string, get the corresponding Material-UI icon
              if (typeof icon === 'string' && iconMap[icon]) {
                const IconComponent = iconMap[icon];
                return <IconComponent sx={{ fontSize: '1.2em' }} />;
              }
              // If icon is already a React component, render it directly
              return icon;
            })()}
            {title}
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          {renderChart()}
        </Box>
      </ReusableCard>
    </Card>
  );
};

export default ChartCard;
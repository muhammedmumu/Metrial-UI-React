import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import ReusableCard from '../cards/ReusableCard';

// Default color palette for charts
const DEFAULT_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
  '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, formatValue, labelFormatter }) => {
  const theme = useTheme();
  
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          p: 1.5,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          boxShadow: theme.shadows[3],
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {labelFormatter ? labelFormatter(label) : label}
        </Typography>
        {payload.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                backgroundColor: entry.color,
                borderRadius: '50%',
              }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {entry.name}: {formatValue ? formatValue(entry.value) : entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

const ChartCard = ({
  // Chart configuration
  type = 'line', // 'line', 'area', 'bar', 'pie'
  data = [],
  xAxisKey = 'x',
  yAxisKey = 'y',
  
  // Multiple series support
  series = [], // [{ key: 'sales', name: 'Sales', color: '#8884d8' }]
  
  // Chart styling
  colors = DEFAULT_COLORS,
  height = 400,
  
  // Axis configuration
  showXAxis = true,
  showYAxis = true,
  showGrid = true,
  showLegend = false,
  showTooltip = true,
  
  // Formatting functions
  formatValue,
  formatXAxisLabel,
  formatYAxisLabel,
  formatTooltipLabel,
  
  // Card props (inherited from ReusableCard)
  title,
  icon,
  color = 'inherit',
  bgcolor,
  variant = 'default',
  onClick,
  sx = {},
  
  // Chart specific props
  strokeWidth = 2,
  fillOpacity = 0.6,
  animationDuration = 300,
  
  // Loading and error states
  loading = false,
  error = null,
  emptyMessage = 'No data available',
  
  ...props
}) => {
  const theme = useTheme();

  // Memoize chart colors
  const chartColors = useMemo(() => {
    if (series.length > 0) {
      return series.map((s, index) => s.color || colors[index % colors.length]);
    }
    return colors;
  }, [series, colors]);

  // Format data for charts
  const formattedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(item => ({
      ...item,
      [xAxisKey]: formatXAxisLabel ? formatXAxisLabel(item[xAxisKey]) : item[xAxisKey],
    }));
  }, [data, xAxisKey, formatXAxisLabel]);

  // Render different chart types
  const renderChart = () => {
    if (loading) {
      return (
        <Box
          sx={{
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
          }}
        >
          <Typography>Loading chart...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box
          sx={{
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'error.main',
          }}
        >
          <Typography>{error}</Typography>
        </Box>
      );
    }

    if (!formattedData || formattedData.length === 0) {
      return (
        <Box
          sx={{
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
          }}
        >
          <Typography>{emptyMessage}</Typography>
        </Box>
      );
    }

    const commonProps = {
      data: formattedData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />}
            {showXAxis && (
              <XAxis
                dataKey={xAxisKey}
                stroke={theme.palette.text.secondary}
                fontSize={12}
                tickFormatter={formatXAxisLabel}
              />
            )}
            {showYAxis && (
              <YAxis
                stroke={theme.palette.text.secondary}
                fontSize={12}
                tickFormatter={formatYAxisLabel}
              />
            )}
            {showTooltip && (
              <Tooltip
                content={<CustomTooltip formatValue={formatValue} labelFormatter={formatTooltipLabel} />}
              />
            )}
            {showLegend && <Legend />}
            {series.length > 0 ? (
              series.map((item, index) => (
                <Line
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  name={item.name}
                  stroke={item.color || chartColors[index]}
                  strokeWidth={strokeWidth}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={animationDuration}
                />
              ))
            ) : (
              <Line
                type="monotone"
                dataKey={yAxisKey}
                stroke={chartColors[0]}
                strokeWidth={strokeWidth}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={animationDuration}
              />
            )}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />}
            {showXAxis && (
              <XAxis
                dataKey={xAxisKey}
                stroke={theme.palette.text.secondary}
                fontSize={12}
                tickFormatter={formatXAxisLabel}
              />
            )}
            {showYAxis && (
              <YAxis
                stroke={theme.palette.text.secondary}
                fontSize={12}
                tickFormatter={formatYAxisLabel}
              />
            )}
            {showTooltip && (
              <Tooltip
                content={<CustomTooltip formatValue={formatValue} labelFormatter={formatTooltipLabel} />}
              />
            )}
            {showLegend && <Legend />}
            {series.length > 0 ? (
              series.map((item, index) => (
                <Area
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  name={item.name}
                  stroke={item.color || chartColors[index]}
                  fill={item.color || chartColors[index]}
                  fillOpacity={fillOpacity}
                  strokeWidth={strokeWidth}
                  animationDuration={animationDuration}
                />
              ))
            ) : (
              <Area
                type="monotone"
                dataKey={yAxisKey}
                stroke={chartColors[0]}
                fill={chartColors[0]}
                fillOpacity={fillOpacity}
                strokeWidth={strokeWidth}
                animationDuration={animationDuration}
              />
            )}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />}
            {showXAxis && (
              <XAxis
                dataKey={xAxisKey}
                stroke={theme.palette.text.secondary}
                fontSize={12}
                tickFormatter={formatXAxisLabel}
              />
            )}
            {showYAxis && (
              <YAxis
                stroke={theme.palette.text.secondary}
                fontSize={12}
                tickFormatter={formatYAxisLabel}
              />
            )}
            {showTooltip && (
              <Tooltip
                content={<CustomTooltip formatValue={formatValue} labelFormatter={formatTooltipLabel} />}
              />
            )}
            {showLegend && <Legend />}
            {series.length > 0 ? (
              series.map((item, index) => (
                <Bar
                  key={item.key}
                  dataKey={item.key}
                  name={item.name}
                  fill={item.color || chartColors[index]}
                  animationDuration={animationDuration}
                />
              ))
            ) : (
              <Bar
                dataKey={yAxisKey}
                fill={chartColors[0]}
                animationDuration={animationDuration}
              />
            )}
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart {...commonProps}>
            {showTooltip && (
              <Tooltip
                content={<CustomTooltip formatValue={formatValue} labelFormatter={formatTooltipLabel} />}
              />
            )}
            {showLegend && <Legend />}
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              outerRadius={Math.min(height * 0.35, 120)}
              fill="#8884d8"
              dataKey={yAxisKey}
              nameKey={xAxisKey}
              animationDuration={animationDuration}
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
          </PieChart>
        );

      default:
        return (
          <Box
            sx={{
              height,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'error.main',
            }}
          >
            <Typography>Unsupported chart type: {type}</Typography>
          </Box>
        );
    }
  };

  return (
    <ReusableCard
      title={title}
      icon={icon}
      color={color}
      bgcolor={bgcolor}
      variant={variant}
      onClick={onClick}
      sx={{
        ...sx,
      }}
      {...props}
    >
      <Box sx={{ width: '100%', height, minHeight: height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </Box>
    </ReusableCard>
  );
};

export default ChartCard;
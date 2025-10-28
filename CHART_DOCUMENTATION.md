# ChartCard Component Documentation

## Overview

The `ChartCard` component is a production-ready, flexible chart component built using the `ReusableCard` wrapper and `recharts` library. It supports multiple chart types and is designed to handle real-world data from backend APIs.

## Features

- ✅ **Multiple Chart Types**: Line, Area, Bar, and Pie charts
- ✅ **Production Ready**: Error handling, loading states, and empty states
- ✅ **Backend Integration**: Designed to work with API data
- ✅ **Responsive Design**: Automatically adapts to container size
- ✅ **Customizable**: Extensive styling and formatting options
- ✅ **Material-UI Integration**: Uses MUI theming and components
- ✅ **TypeScript Ready**: Full prop types support

## Installation

The component uses the following dependencies (already installed):
```bash
npm install recharts @mui/material @mui/icons-material
```

## Basic Usage

```jsx
import { ChartCard } from './components/charts';

// Simple line chart
<ChartCard
  type="line"
  title="Sales Trend"
  data={salesData}
  xAxisKey="month"
  yAxisKey="sales"
  height={300}
/>
```

## API Reference

### Props

#### Chart Configuration
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'line' \| 'area' \| 'bar' \| 'pie'` | `'line'` | Chart type |
| `data` | `Array<Object>` | `[]` | Chart data array |
| `xAxisKey` | `string` | `'x'` | Key for X-axis data |
| `yAxisKey` | `string` | `'y'` | Key for Y-axis data |
| `series` | `Array<SeriesConfig>` | `[]` | Multiple data series configuration |
| `height` | `number` | `300` | Chart height in pixels |

#### Styling
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colors` | `string[]` | `DEFAULT_COLORS` | Color palette for chart elements |
| `strokeWidth` | `number` | `2` | Line/border width |
| `fillOpacity` | `number` | `0.6` | Fill opacity for area charts |
| `animationDuration` | `number` | `300` | Animation duration in ms |

#### Axis & Display
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showXAxis` | `boolean` | `true` | Show X-axis |
| `showYAxis` | `boolean` | `true` | Show Y-axis |
| `showGrid` | `boolean` | `true` | Show grid lines |
| `showLegend` | `boolean` | `false` | Show legend |
| `showTooltip` | `boolean` | `true` | Show tooltip on hover |

#### Formatting Functions
| Prop | Type | Description |
|------|------|-------------|
| `formatValue` | `(value) => string` | Format values in tooltip/legend |
| `formatXAxisLabel` | `(value) => string` | Format X-axis labels |
| `formatYAxisLabel` | `(value) => string` | Format Y-axis labels |
| `formatTooltipLabel` | `(label) => string` | Format tooltip labels |

#### States
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | `false` | Show loading state |
| `error` | `string \| null` | `null` | Show error message |
| `emptyMessage` | `string` | `'No data available'` | Empty state message |

#### Card Props (inherited from ReusableCard)
| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Card title |
| `icon` | `string` | Icon name (from utils/icons.js) |
| `color` | `string` | Primary color |
| `bgcolor` | `string` | Background color |
| `variant` | `string` | Card variant |
| `onClick` | `function` | Click handler |

### Series Configuration

For multi-series charts, use the `series` prop:

```jsx
const series = [
  { key: 'sales', name: 'Sales', color: '#1976d2' },
  { key: 'target', name: 'Target', color: '#ed6c02' }
];

<ChartCard
  type="line"
  data={data}
  series={series}
  showLegend={true}
/>
```

## Usage Examples

### 1. Simple Line Chart
```jsx
<ChartCard
  type="line"
  title="Revenue Trend"
  icon="TrendingUp"
  data={[
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 }
  ]}
  xAxisKey="month"
  yAxisKey="revenue"
  formatValue={(value) => `$${value.toLocaleString()}`}
/>
```

### 2. Multi-Series Chart
```jsx
<ChartCard
  type="line"
  title="Sales vs Target"
  data={salesData}
  xAxisKey="month"
  series={[
    { key: 'actual', name: 'Actual Sales', color: '#2196f3' },
    { key: 'target', name: 'Target', color: '#ff9800' }
  ]}
  showLegend={true}
  height={400}
/>
```

### 3. Pie Chart
```jsx
<ChartCard
  type="pie"
  title="Market Share"
  data={[
    { category: 'Product A', value: 400 },
    { category: 'Product B', value: 300 },
    { category: 'Product C', value: 200 }
  ]}
  xAxisKey="category"
  yAxisKey="value"
  showLegend={true}
/>
```

### 4. API Integration Example
```jsx
import React, { useState, useEffect } from 'react';
import { ChartCard } from './components/charts';

const DashboardChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/chart-data');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ChartCard
      type="line"
      title="Real-time Analytics"
      icon="Analytics"
      data={data}
      loading={loading}
      error={error}
      xAxisKey="timestamp"
      yAxisKey="value"
      formatValue={(value) => value.toLocaleString()}
      formatXAxisLabel={(timestamp) => new Date(timestamp).toLocaleDateString()}
      height={350}
      variant="elevated"
    />
  );
};
```

### 5. Advanced Formatting
```jsx
<ChartCard
  type="area"
  title="Performance Metrics"
  data={performanceData}
  xAxisKey="date"
  yAxisKey="performance"
  formatValue={(value) => `${value}%`}
  formatXAxisLabel={(date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }}
  formatTooltipLabel={(label) => `Date: ${label}`}
  colors={['#4caf50']}
  fillOpacity={0.3}
  strokeWidth={2}
/>
```

## Data Format Requirements

### Standard Data Format
```javascript
const data = [
  { x: 'Label1', y: 100 },
  { x: 'Label2', y: 200 },
  { x: 'Label3', y: 150 }
];
```

### Multi-Series Data Format
```javascript
const data = [
  { month: 'Jan', sales: 4000, target: 3500, expenses: 2000 },
  { month: 'Feb', sales: 3000, target: 3800, expenses: 1800 },
  { month: 'Mar', sales: 5000, target: 4200, expenses: 2200 }
];
```

### Pie Chart Data Format
```javascript
const data = [
  { category: 'Category A', value: 400 },
  { category: 'Category B', value: 300 },
  { category: 'Category C', value: 200 }
];
```

## Best Practices

1. **Error Handling**: Always provide error states for API failures
2. **Loading States**: Show loading indicators for better UX
3. **Data Validation**: Validate data format before passing to component
4. **Performance**: Use `useMemo` for expensive data transformations
5. **Accessibility**: Provide meaningful titles and descriptions
6. **Responsive Design**: Test charts on different screen sizes
7. **Color Consistency**: Use your design system's color palette

## Troubleshooting

### Common Issues

1. **Chart not rendering**: Check data format and required props
2. **Colors not working**: Ensure colors are valid CSS color values
3. **Tooltip formatting**: Verify `formatValue` function returns string
4. **Performance issues**: Use `useMemo` for data transformations
5. **Responsive issues**: Ensure parent container has defined dimensions

### Debug Mode
Enable debug mode by adding this to your component:
```jsx
console.log('Chart Data:', data);
console.log('Chart Config:', { type, xAxisKey, yAxisKey, series });
```
import React, { useState, useEffect } from 'react';
import { Grid, Container, Typography, Box } from '@mui/material';
import { ChartCard } from '../components/charts';

// Example usage of ChartCard component
const ChartExamples = () => {
  // Sample data for different chart types
  const [salesData, setSalesData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate API data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample sales trend data
      setSalesData([
        { month: 'Jan', sales: 4000, target: 3500 },
        { month: 'Feb', sales: 3000, target: 3800 },
        { month: 'Mar', sales: 5000, target: 4200 },
        { month: 'Apr', sales: 4500, target: 4500 },
        { month: 'May', sales: 6000, target: 5000 },
        { month: 'Jun', sales: 5500, target: 5200 },
      ]);

      // Sample revenue data
      setRevenueData([
        { date: '2024-01', revenue: 120000 },
        { date: '2024-02', revenue: 135000 },
        { date: '2024-03', revenue: 148000 },
        { date: '2024-04', revenue: 162000 },
        { date: '2024-05', revenue: 178000 },
        { date: '2024-06', revenue: 195000 },
      ]);

      // Sample category distribution
      setCategoryData([
        { category: 'Electronics', value: 400 },
        { category: 'Clothing', value: 300 },
        { category: 'Books', value: 200 },
        { category: 'Home', value: 150 },
        { category: 'Sports', value: 100 },
      ]);

      setLoading(false);
    };

    fetchData();
  }, []);

  // Format functions
  const formatCurrency = (value) => `$${value.toLocaleString()}`;
  const formatTooltipDate = (label) => `Month: ${label}`;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Chart Component Examples
      </Typography>
      
      <Grid container spacing={3}>
        {/* Line Chart Example */}
        <Grid item xs={12} md={6}>
          <ChartCard
            type="line"
            title="Sales Trend"
            icon="TrendingUp"
            color="#1976d2"
            data={salesData}
            xAxisKey="month"
            series={[
              { key: 'sales', name: 'Actual Sales', color: '#1976d2' },
              { key: 'target', name: 'Target', color: '#ed6c02' }
            ]}
            height={300}
            loading={loading}
            showLegend={true}
            formatValue={formatCurrency}
            formatTooltipLabel={formatTooltipDate}
            variant="elevated"
          />
        </Grid>

        {/* Area Chart Example */}
        <Grid item xs={12} md={6}>
          <ChartCard
            type="area"
            title="Revenue Growth"
            icon="AttachMoney"
            color="#2e7d32"
            data={revenueData}
            xAxisKey="date"
            yAxisKey="revenue"
            height={300}
            loading={loading}
            formatValue={formatCurrency}
            formatXAxisLabel={(value) => value.split('-')[1]}
            colors={['#4caf50']}
            variant="outlined"
          />
        </Grid>

        {/* Bar Chart Example */}
        <Grid item xs={12} md={6}>
          <ChartCard
            type="bar"
            title="Monthly Sales"
            icon="BarChart"
            color="#9c27b0"
            data={salesData}
            xAxisKey="month"
            yAxisKey="sales"
            height={300}
            loading={loading}
            formatValue={formatCurrency}
            colors={['#9c27b0']}
            variant="filled"
          />
        </Grid>

        {/* Pie Chart Example */}
        <Grid item xs={12} md={6}>
          <ChartCard
            type="pie"
            title="Sales by Category"
            icon="PieChart"
            color="#f57c00"
            data={categoryData}
            xAxisKey="category"
            yAxisKey="value"
            height={300}
            loading={loading}
            showLegend={true}
            formatValue={(value) => `${value} units`}
            variant="minimal"
          />
        </Grid>

        {/* Multi-series Line Chart */}
        <Grid item xs={12}>
          <ChartCard
            type="line"
            title="Performance Dashboard"
            icon="Dashboard"
            color="#d32f2f"
            data={salesData}
            xAxisKey="month"
            series={[
              { key: 'sales', name: 'Sales', color: '#1976d2' },
              { key: 'target', name: 'Target', color: '#ed6c02' }
            ]}
            height={400}
            loading={loading}
            showLegend={true}
            showGrid={true}
            formatValue={formatCurrency}
            strokeWidth={3}
            variant="elevated"
          />
        </Grid>

        {/* Error State Example */}
        <Grid item xs={12} md={6}>
          <ChartCard
            type="line"
            title="Error Example"
            icon="Error"
            color="#d32f2f"
            data={[]}
            error="Failed to load chart data"
            height={200}
            variant="outlined"
          />
        </Grid>

        {/* Empty State Example */}
        <Grid item xs={12} md={6}>
          <ChartCard
            type="bar"
            title="Empty Data Example"
            icon="HourglassEmpty"
            color="#757575"
            data={[]}
            emptyMessage="No sales data available for this period"
            height={200}
            variant="filled"
          />
        </Grid>
      </Grid>

      {/* API Integration Example */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          API Integration Example
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Here's how you would integrate with a real API:
        </Typography>
        <Box
          component="pre"
          sx={{
            p: 2,
            bgcolor: 'grey.100',
            borderRadius: 1,
            overflow: 'auto',
            fontSize: '0.875rem',
          }}
        >
{`// Example API integration
const [chartData, setChartData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchChartData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sales-data');
      const data = await response.json();
      setChartData(data);
    } catch (err) {
      setError('Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  fetchChartData();
}, []);

// Use in component
<ChartCard
  type="line"
  title="Real-time Sales"
  data={chartData}
  loading={loading}
  error={error}
  xAxisKey="date"
  yAxisKey="amount"
  formatValue={(value) => \`$\${value.toLocaleString()}\`}
/>`}
        </Box>
      </Box>
    </Container>
  );
};

export default ChartExamples;
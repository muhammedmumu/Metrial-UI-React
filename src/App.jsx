import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Typography, Box } from '@mui/material';
import { AppProvider } from './context/AppContext.jsx';
import { theme } from './theme/theme.js';
import MainLayout from './components/layout/MainLayout.jsx';
import KPIGrid from './components/KPIGrid.jsx';
import DataTable from './components/tables/DataTable/DataTable.jsx';
import LineChart from './components/charts/LineChart/LineChart.jsx';
import StatsCard from './components/cards/StatsCard/StatsCard.jsx';
import { mockChartData } from './utils/mockData.js';

// Sample data for DataTable
const sampleRows = [
  { id: 1, name: 'Alice Johnson', email: 'alice@company.com', position: 'Manager', department: 'HR', visits: 45 },
  { id: 2, name: 'Bob Smith', email: 'bob@company.com', position: 'Developer', department: 'IT', visits: 32 },
  { id: 3, name: 'Carol Davis', email: 'carol@company.com', position: 'Designer', department: 'Design', visits: 28 },
  { id: 4, name: 'David Wilson', email: 'david@company.com', position: 'Analyst', department: 'Finance', visits: 41 },
  { id: 5, name: 'Eva Brown', email: 'eva@company.com', position: 'Coordinator', department: 'Marketing', visits: 37 },
];

const sampleColumns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
  { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
  { field: 'position', headerName: 'Position', flex: 1, minWidth: 120 },
  { field: 'department', headerName: 'Department', flex: 1, minWidth: 120 },
  { field: 'visits', headerName: 'Visits', type: 'number', width: 100 },
];

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
          <Box sx={{ display: "flex", gap: 3, flexDirection: "row", width: "100%" }}>
            <Box sx={{ display: "flex", gap: 3, flexDirection: "column", width: "50%" }}>
              <Box sx={{ width: "100%" }}>
                {/* KPI Cards Grid */}
                <KPIGrid />
              </Box>
              <Box  chart sx={{}}>
                <Typography variant="h6" sx={{ mb: 2 }}>Trend</Typography>
                <LineChart data={mockChartData} xKey="date" series={[{ dataKey: 'value', name: 'Value', color: '#1976d2' }]} />
              </Box>
            </Box>
            <Box>

              {/* <Box>
                <DataTable rows={sampleRows} columns={sampleColumns} />
              </Box> */}
            </Box>
            {/* <Box sx={{ }}>
              <StatsCard title="Trend">
                <LineChart data={mockChartData} xKey="date" series={[{ dataKey: 'value', name: 'Value', color: '#1976d2' }]} />
              </StatsCard>
            </Box> */}
          </Box>
        </MainLayout>
      </AppProvider>
    </ThemeProvider>
  );
}


export default App;

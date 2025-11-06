import React from 'react';
import { Grid, Typography, Box, Divider } from '@mui/material';
import KPIGrid from '../components/KPIGrid/KPIGrid.jsx';
import { ChartCard } from '../components/charts';
import PropertyLists from '../components/PropertyLists.jsx';
import ListingInsights from '../components/ListingInsights.jsx';
import RecentAgentRegistrations from '../components/RecentAgentRegistrations.jsx';
// import PropertyTransactionsTable from '../components/PropertyTransactionsTable.jsx';
import PropertyTransactionsTableURL from '../components/PropertyTransactionsTableURL.jsx';
import { mockPropertyTransactions } from '../utils/mockData.js';

const HomePage = () => {

  // Sample chart data
  const salesData = [
    { month: "Jan", sales: 4000, target: 3500 },
    { month: "Feb", sales: 3000, target: 3800 },
    { month: "Mar", sales: 5000, target: 4200 },
    { month: "Apr", sales: 4500, target: 4500 },
    { month: "May", sales: 6000, target: 5000 },
    { month: "Jun", sales: 5500, target: 5200 },
  ];

  // Format functions
  const formatCurrency = (value) => `$${value.toLocaleString()}`;

  return (
    <>
      {/* Main Content Container - Responsive Layout */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: {
            xs: "column", // Column layout on mobile/small screens
            lg: "row", // Row layout on large screens
          },
          gap: 3,
          mb: 2,
        }}
      >
        {/* Left Side - KPI Cards and Chart */}
        <Box
          sx={{
            width: {
              xs: "100%", // 100% width on mobile (extra small screens)
              sm: "100%", // 100% width on small screens
              lg: "50%", // 50% width on large screens
            },
            display: "flex",
            flexDirection: "column",
            gap: 3
          }}
        >
          {/* KPI Cards Grid */}
          <KPIGrid />

          {/* Sales Trend Line Chart */}
          <Box>
            <ChartCard
              type="line"
              title="Sales vs Target"
              icon="TrendingUp"
              color="#1976d2"
              data={salesData}
              xAxisKey="month"
              series={[
                { key: "sales", name: "Actual Sales", color: "#1976d2" },
                { key: "target", name: "Target", color: "#ed6c02" },
              ]}
              height={300}
              showLegend={true}
              formatValue={formatCurrency}
              variant="elevated"
            />
          </Box>
        </Box>

        {/* Right Side - Property Lists */}
        <Box
          sx={{
            width: {
              xs: "100%", // 100% width on mobile (extra small screens)
              sm: "100%", // 100% width on small screens
              lg: "50%",  // 50% width on large screens
            },
            display: "flex",
            flexDirection: "column",
            gap: 3,
            justifyContent: "space-between",
          }}
        >
          <Box sx={{
            display: "flex",
            flexDirection: {
              xs: "column", // Column layout on small screens
              sm: "column", // Column layout on small screens
              lg: "row", // Row layout on large screens
            },
            width: "100%",
            gap: 2,
            justifyContent: "space-between"
          }}>
            <PropertyLists />
            <ListingInsights />
          </Box>

          {/* Recent Agent Registrations */}
          <RecentAgentRegistrations />
        </Box>
      </Box>

      {/* Full-width Property Transactions Table */}
      {/* <Box sx={{ mt: 3, width: "100%" }}>
        <PropertyTransactionsTable />
      </Box> */}

      {/* Divider between tables */}


      {/* URL-driven Property Transactions Table */}
      <Box sx={{ width: "100%" }}>
        <PropertyTransactionsTableURL
          transactions={mockPropertyTransactions}
        />
      </Box>
    </>
  );
};

export default HomePage;
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Typography, Box } from "@mui/material";
import { AppProvider } from "./store/AppContext.jsx";
import { RouterProvider, Routes, Route } from "./routes/Router.jsx";
import { createAppTheme } from "./assets/styles/theme.js";
import { useApp } from "./store/useApp.js";
import { useRouter } from "./hooks/useRouter.js";
import MainLayout from "./layouts/MainLayout.jsx";
import AppBreadcrumbs from "./components/Breadcrumbs/AppBreadcrumbs.jsx";
import { dashboardConfig } from "./config/dashboard.config.js";

// Import all pages
import HomePage from "./pages/HomePage.jsx";
import SurveysPage from "./pages/SurveysPage.jsx";
import SurveyAnalyticsPage from "./pages/SurveyAnalyticsPage.jsx";
import ActionPlanningPage from "./pages/ActionPlanningPage.jsx";
import {
  ORAHomePage,
  ORAScorePage,
  ReviewsPage,
  ReviewInsightsPage,
  ReportsPage,
  KeywordsPage,
  TemplatesPage,
  LearningCenterPage,
  LayoutEditorPage,
  SocialPage,
  ListingPage,
  EinsteinPage,
  CustomSurveysPage,
  HealthCheckPage,
} from "./pages/AllPages.jsx";

function AppContent() {
  console.log("AppContent component is rendering");

  const { theme: themeState } = useApp();
  const { currentPath } = useRouter();
  const theme = createAppTheme(themeState.mode);

  // Function to get page title from path
  const getPageTitle = (path) => {
    const navItem = dashboardConfig.navigation.find(item => item.path === path);
    if (navItem) {
      return navItem.text;
    }

    // Handle special cases
    switch (path) {
      case '/':
      case '/home':
        return 'Home';
      case '/health':
        return 'Health Check';
      default:
        // Convert path to title (remove /, replace - with space, capitalize)
        return path
          .replace('/', '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  };

  try {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MainLayout>
          {/* Dashboard Header with Breadcrumbs */}
          <Box sx={{ flexDirection: { xs: "column", sm: "column" }, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            {/* Page Title */}
            <Box>
              <Typography variant="h5" sx={{ mb: 0, color: theme.palette.text.primary, fontWeight: 600, }} >
                {getPageTitle(currentPath)}
              </Typography>
            </Box>

            {/* Breadcrumbs */}
            <AppBreadcrumbs
              currentPath={currentPath}
              navigationConfig={dashboardConfig.navigation}
            />
          </Box>

          {/* Page Content */}
          <Routes>
            <Route path="/home" exact>
              <HomePage />
            </Route>
            <Route path="/" exact>
              <HomePage />
            </Route>
            <Route path="/surveys" exact>
              <SurveysPage />
            </Route>
            <Route path="/survey-analytics" exact>
              <SurveyAnalyticsPage />
            </Route>
            <Route path="/action-planning" exact>
              <ActionPlanningPage />
            </Route>
            <Route path="/ora-home" exact>
              <ORAHomePage />
            </Route>
            <Route path="/ora-score" exact>
              <ORAScorePage />
            </Route>
            <Route path="/reviews" exact>
              <ReviewsPage />
            </Route>
            <Route path="/review-insights" exact>
              <ReviewInsightsPage />
            </Route>
            <Route path="/reports" exact>
              <ReportsPage />
            </Route>
            <Route path="/keywords" exact>
              <KeywordsPage />
            </Route>
            <Route path="/templates" exact>
              <TemplatesPage />
            </Route>
            <Route path="/learning-center" exact>
              <LearningCenterPage />
            </Route>
            <Route path="/layout-editor" exact>
              <LayoutEditorPage />
            </Route>
            <Route path="/social" exact>
              <SocialPage />
            </Route>
            <Route path="/listing" exact>
              <ListingPage />
            </Route>
            <Route path="/einstein" exact>
              <EinsteinPage />
            </Route>
            <Route path="/custom-surveys" exact>
              <CustomSurveysPage />
            </Route>
            <Route path="/health" exact>
              <HealthCheckPage />
            </Route>
          </Routes>

        </MainLayout>
      </ThemeProvider>
    );
  } catch (error) {
    console.error("Error in AppContent component:", error);
    return (
      <Box sx={{ p: 2, color: "red" }}>
        <h2>Error in AppContent component:</h2>
        <p>{error.message}</p>
        <pre>{error.stack}</pre>
      </Box>
    );
  }
}

function App() {
  console.log("App component is rendering");

  return (
    <AppProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </AppProvider>
  );
}

export default App;
// Route configuration constants
import HomePage from '../pages/HomePage.jsx';
import SurveysPage from '../pages/SurveysPage.jsx';
import SurveyAnalyticsPage from '../pages/SurveyAnalyticsPage.jsx';
import ActionPlanningPage from '../pages/ActionPlanningPage.jsx';

export const routeConfig = [
  {
    path: '/home',
    component: HomePage,
    exact: true,
    title: 'Dashboard Home'
  },
  {
    path: '/surveys',
    component: SurveysPage,
    exact: true,
    title: 'Surveys'
  },
  {
    path: '/analytics',
    component: SurveyAnalyticsPage,
    exact: true,
    title: 'Analytics'
  },
  {
    path: '/action-planning',
    component: ActionPlanningPage,
    exact: true,
    title: 'Action Planning'
  }
];
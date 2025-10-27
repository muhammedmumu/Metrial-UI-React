// Configuration file for easy customization
export const dashboardConfig = {
  // Application settings
  app: {
    name: 'Averra',
    shortName: 'verra', // Since logo has "A", we show "verra"
    version: '1.0.0',
    company: 'Your Company Name',
    logo: '/logo.png', // Path to your logo
  },

  // Default user data (replace with API call in production)
  defaultUser: {
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Administrator',
    avatar: '', // URL to avatar image
    notifications: 3,
    permissions: ['read', 'write', 'admin'], // User permissions
  },

  // Theme customization
  theme: {
    colors: {
      primary: '#0EA5E9',
      primaryHover: '#0284C7',
      primaryActive: '#0369A1',
      primaryFocus: '#7DD3FC',
      secondary: '#F97316', // Changed from previous secondary to accent
      accent: '#F97316',
      accentHover: '#EA580C',
      accentActive: '#C2410C',
      accentFocus: '#FDBA74',
      disabled: '#94A3B8',
      border: '#E2E8F0',
      background: '#f5f5f5',
      sidebar: '#ffffff',
      navbar: '#ffffff',
    },
    layout: {
      sidebarWidth: 240,
      collapsedSidebarWidth: 78, // 78px
      navbarHeight: 64,
    },
    breakpoints: {
      mobile: 'md', // Breakpoint for mobile layout
    },
  },

  // Navigation menu configuration
  navigation: [
    {
      id: 'home',
      text: 'Home',
      icon: 'Home',
      path: '/home',
      badge: null,
      permission: 'read',
    },
    {
      id: 'surveys',
      text: 'Surveys',
      icon: 'Surveys',
      path: '/surveys',
      badge: null,
      permission: 'read',
    },
    {
      id: 'survey-analytics',
      text: 'Survey Analytics',
      icon: 'Analytics',
      path: '/survey-analytics',
      badge: null,
      permission: 'read',
    },
    {
      id: 'action-planning',
      text: 'Action Planning Tool',
      icon: 'ActionPlanning',
      path: '/action-planning',
      badge: null,
      permission: 'read',
    },
    {
      id: 'ora-home',
      text: 'ORA Home',
      icon: 'ORA',
      path: '/ora-home',
      badge: null,
      permission: 'read',
    },
    {
      id: 'ora-score',
      text: 'ORA Score',
      icon: 'Score',
      path: '/ora-score',
      badge: null,
      permission: 'read',
      children: [
        {
          id: 'ora-score-overview',
          text: 'Score Overview',
          path: '/ora-score/overview',
          permission: 'read',
        },
        {
          id: 'ora-score-details',
          text: 'Score Details',
          path: '/ora-score/details',
          permission: 'read',
        },
        {
          id: 'ora-score-history',
          text: 'Score History',
          path: '/ora-score/history',
          permission: 'read',
        },
      ],
    },
    {
      id: 'reviews',
      text: 'Reviews',
      icon: 'Reviews',
      path: '/reviews',
      badge: null,
      permission: 'read',
    },
    {
      id: 'review-insights',
      text: 'Review Insights',
      icon: 'Insights',
      path: '/review-insights',
      badge: null,
      permission: 'read',
      children: [
        {
          id: 'review-insights-summary',
          text: 'Insights Summary',
          path: '/review-insights/summary',
          permission: 'read',
        },
        {
          id: 'review-insights-trends',
          text: 'Trends Analysis',
          path: '/review-insights/trends',
          permission: 'read',
        },
        {
          id: 'review-insights-sentiment',
          text: 'Sentiment Analysis',
          path: '/review-insights/sentiment',
          permission: 'read',
        },
      ],
    },
    {
      id: 'reports',
      text: 'Reports',
      icon: 'Reports',
      path: '/reports',
      badge: null,
      permission: 'read',
    },
    {
      id: 'keywords',
      text: 'Keywords',
      icon: 'Keywords',
      path: '/keywords',
      badge: null,
      permission: 'read',
    },
    {
      id: 'templates',
      text: 'Templates',
      icon: 'Templates',
      path: '/templates',
      badge: null,
      permission: 'read',
    },
    {
      id: 'learning-center',
      text: 'Learning Center',
      icon: 'LearningCenter',
      path: '/learning-center',
      badge: null,
      permission: 'read',
    },
    {
      id: 'layout-editor',
      text: 'Layout Editor',
      icon: 'LayoutEditor',
      path: '/layout-editor',
      badge: null,
      permission: 'read',
    },
    {
      id: 'social',
      text: 'Social',
      icon: 'Social',
      path: '/social',
      badge: null,
      permission: 'read',
    },
    {
      id: 'listing',
      text: 'Listing',
      icon: 'Listing',
      path: '/listing',
      badge: null,
      permission: 'read',
    },
    {
      id: 'einstein',
      text: 'Einstein',
      icon: 'Einstein',
      path: '/einstein',
      badge: null,
      permission: 'read',
    },
    {
      id: 'custom-surveys',
      text: 'Custom Surveys',
      icon: 'CustomSurveys',
      path: '/custom-surveys',
      badge: null,
      permission: 'read',
    },
  ],

  // Feature flags
  features: {
    enableNotifications: true,
    enableUserProfile: true,
    enableSearch: true,
    enableThemeToggle: false,
    enableOfflineMode: false,
  },

  // API configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    timeout: 10000,
    retryAttempts: 3,
  },

  // Performance settings
  performance: {
    enableVirtualization: true, // For large lists
    lazyLoadImages: true,
    debounceSearchMs: 300,
  },
};

// Helper function to check user permissions
export function hasPermission(userPermissions, requiredPermission) {
  if (!requiredPermission) return true;
  return userPermissions.includes(requiredPermission) || userPermissions.includes('admin');
}

// Helper function to filter navigation items based on user permissions
export function getFilteredNavigation(navigation, userPermissions) {
  return navigation.filter(item => hasPermission(userPermissions, item.permission));
}

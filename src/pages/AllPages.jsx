import React from 'react';
import { Typography, Box, Paper, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const createPageComponent = (title, description) => {
  return () => {
    const theme = useTheme();

    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 4,
              borderRadius: 2,
              textAlign: 'center',
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                color: theme.palette.primary.main,
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              {description}
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  };
};

// Export all page components
export const ORAHomePage = createPageComponent(
  'ORA Home',
  'Online Reputation Analytics home dashboard. Monitor and manage your online reputation across all platforms.'
);

export const ORAScorePage = createPageComponent(
  'ORA Score',
  'View your Online Reputation Analytics score and detailed metrics. Track your reputation performance over time.'
);

export const ReviewsPage = createPageComponent(
  'Reviews',
  'Manage and respond to customer reviews across all platforms. Monitor review sentiment and engagement.'
);

export const ReviewInsightsPage = createPageComponent(
  'Review Insights',
  'Gain deeper insights from your customer reviews. Analyze sentiment, trends, and key themes in feedback.'
);

export const ReportsPage = createPageComponent(
  'Reports',
  'Generate comprehensive reports on your business performance, customer satisfaction, and key metrics.'
);

export const KeywordsPage = createPageComponent(
  'Keywords',
  'Manage and track important keywords for your business. Monitor search rankings and optimization opportunities.'
);

export const TemplatesPage = createPageComponent(
  'Templates',
  'Create and manage templates for surveys, responses, and communications to streamline your workflow.'
);

export const LearningCenterPage = createPageComponent(
  'Learning Center',
  'Access tutorials, best practices, and resources to maximize your use of the platform.'
);

export const LayoutEditorPage = createPageComponent(
  'Layout Editor',
  'Customize and design layouts for your surveys, reports, and customer-facing content.'
);

export const SocialPage = createPageComponent(
  'Social',
  'Monitor and manage your social media presence. Track mentions, engagement, and social reputation.'
);

export const ListingPage = createPageComponent(
  'Listing',
  'Manage your business listings across directories and platforms. Ensure accurate and consistent information.'
);

export const EinsteinPage = createPageComponent(
  'Einstein',
  'AI-powered insights and recommendations to optimize your business performance and customer experience.'
);

export const CustomSurveysPage = createPageComponent(
  'Custom Surveys',
  'Create fully customized surveys tailored to your specific business needs and customer segments.'
);

// Health Check Page
export const HealthCheckPage = () => {
  const theme = useTheme();
  const [status, setStatus] = React.useState('checking');
  const [lastChecked, setLastChecked] = React.useState(new Date());

  React.useEffect(() => {
    // Simulate health check
    const checkHealth = async () => {
      try {
        // You can add actual health checks here
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStatus('healthy');
        setLastChecked(new Date());
      } catch {
        setStatus('unhealthy');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return theme.palette.success.main;
      case 'unhealthy': return theme.palette.error.main;
      default: return theme.palette.warning.main;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              color: theme.palette.primary.main,
              fontWeight: 600,
            }}
          >
            System Health Check
          </Typography>
          
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              mb: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: theme.palette.action.hover,
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: getStatusColor(),
                animation: status === 'checking' ? 'pulse 1.5s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': {
                    opacity: 1,
                  },
                  '50%': {
                    opacity: 0.5,
                  },
                  '100%': {
                    opacity: 1,
                  },
                },
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: getStatusColor(),
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              System Status: {status}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          >
            Last checked: {lastChecked.toLocaleString()}
          </Typography>

          <Box sx={{ mt: 4, textAlign: 'left' }}>
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
              System Information
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Application</Typography>
                <Typography variant="body1" fontWeight={500}>Dashboard v1.0.0</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Environment</Typography>
                <Typography variant="body1" fontWeight={500}>Development</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Build Time</Typography>
                <Typography variant="body1" fontWeight={500}>{new Date().toLocaleDateString()}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Runtime</Typography>
                <Typography variant="body1" fontWeight={500}>React {React.version}</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
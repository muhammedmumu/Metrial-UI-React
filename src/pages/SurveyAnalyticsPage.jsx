import React from 'react';
import { Typography, Box, Paper, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const SurveyAnalyticsPage = () => {
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
            Survey Analytics
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Analyze survey responses and generate insights from your customer feedback. 
            View detailed analytics, trends, and performance metrics for all your surveys.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default SurveyAnalyticsPage;
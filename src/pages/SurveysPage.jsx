import React from 'react';
import { Typography, Box, Paper, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const SurveysPage = () => {
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
            Surveys
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Manage and create surveys to gather valuable feedback from your customers. 
            This section will contain survey creation tools, templates, and analytics.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default SurveysPage;
import React from 'react';
import { Typography, Box, Paper, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ActionPlanningPage = () => {
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
            Action Planning Tool
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Create and manage action plans based on survey insights and feedback. 
            Set goals, assign tasks, and track progress towards improvement initiatives.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default ActionPlanningPage;
import React from 'react';
import { Box, Typography } from '@mui/material';
import ReusableCard from './cards/ReusableCard.jsx';

const PropertyListsSimple = () => {
  return (
    <ReusableCard
      variant="elevated"
      sx={{ height: 300 }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">
          Property Lists Test
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          This is a simple test to check if the component renders correctly.
        </Typography>
      </Box>
    </ReusableCard>
  );
};

export default PropertyListsSimple;
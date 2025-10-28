import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import { 
  ArrowForward, 
  Person,
  Business,
  KeyboardArrowRight,
  MoreVert,
  Home,
} from '@mui/icons-material';
import ReusableCard from './cards/ReusableCard.jsx';

// Sample data (will be replaced with API call later)
const sampleAgents = [
  {
    id: 1,
    name: "Ava Realtors",
    email: "contact@avarealtors.com",
    avatar: null, // Using null to test fallback initials
    properties: 7,
    specialization: "Luxury Villas",
    tagColor: "#BFDBFE"
  },
  {
    id: 2,
    name: "BlueBrick Realty",
    email: "info@bluebrick.com",
    avatar: null,
    properties: 16,
    specialization: "Commercial Spaces",
    tagColor: "#FDE68A"
  },
  {
    id: 3,
    name: "Joseph Estates",
    email: "joseph@estates.com",
    avatar: null,
    properties: 32,
    specialization: "Urban Apartments",
    tagColor: "#E9D5FF"
  },
  {
    id: 4,
    name: "Golden Gate Properties",
    email: "hello@goldengate.com",
    avatar: null,
    properties: 24,
    specialization: "Waterfront Homes",
    tagColor: "#FED7D7"
  },
  {
    id: 5,
    name: "Summit Real Estate",
    email: "contact@summit.com",
    avatar: null,
    properties: 18,
    specialization: "Mountain Retreats",
    tagColor: "#C6F6D5"
  }
];

const RecentAgentRegistrations = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        // Simulate API call - replace this with actual API endpoint
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, use sample data
        setAgents(sampleAgents);
        setError(null);
      } catch (err) {
        console.error('Error fetching agent registrations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleViewAll = () => {
    console.log('View All Agents clicked');
    // Add navigation logic here
  };

  const handleAgentClick = (agentId) => {
    console.log('Agent clicked:', agentId);
    // Add navigation logic here
  };

  // Generate initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Format property count with leading zero
  const formatPropertyCount = (count) => {
    return count.toString().padStart(2, '0');
  };

  // Generate avatar color from name
  const getAvatarColor = (name) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <ReusableCard
        variant="elevated"
        sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <CircularProgress />
      </ReusableCard>
    );
  }

  if (error) {
    return (
      <ReusableCard
        variant="elevated"
        sx={{ height: 300 }}
      >
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading agent registrations: {error}
        </Alert>
      </ReusableCard>
    );
  }

  return (
    <ReusableCard
      variant="elevated"
      sx={{ 
        height: 300,
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header with title and View All button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Person sx={{ fontSize: 20, color: theme.palette.primary.main }} />
          Recent Agent Registrations
        </Typography>

        <IconButton
          onClick={handleViewAll}
          sx={{
            color: theme.palette.primary.main,
            backgroundColor: 'transparent',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'transparent',
              transform: 'scale(1)',
            },
            '&:active': {
              backgroundColor: 'transparent',
              transform: 'scale(0.98)',
            },
            '&:focus': {
              backgroundColor: 'transparent',
              outline: 'none',
            },
            boxShadow: 'none',
            border: 'none',
          }}
          disableRipple={true}
          disableFocusRipple={true}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 500,
              mr: 0.5,
            }}
          >
            View All
          </Typography>
          <ArrowForward sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* Agents List - Horizontal Scroll */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            overflowY: 'hidden',
            pb: 1,
            height: '100%',
            '&::-webkit-scrollbar': {
              height: 4,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: alpha(theme.palette.grey[300], 0.2),
              borderRadius: 2,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(theme.palette.primary.main, 0.3),
              borderRadius: 2,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.5),
              },
            },
          }}
        >
          {agents.map((agent) => (
            <Box
              key={agent.id}
              onClick={() => handleAgentClick(agent.id)}
              sx={{
                minWidth: 280,
                maxWidth: 280,
                height: 'fit-content',
                p: 2,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                boxShadow: theme.shadows[2],
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              {/* Agent Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  mb: 2,
                }}
              >
                <Avatar
                  src={agent.avatar}
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: getAvatarColor(agent.name),
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                  }}
                >
                  {!agent.avatar && getInitials(agent.name)}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      lineHeight: 1.2,
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {agent.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                    }}
                  >
                    {agent.email}
                  </Typography>
                </Box>

                <IconButton
                  size="small"
                  sx={{
                    color: theme.palette.text.secondary,
                    opacity: 0.7,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: theme.palette.primary.main,
                      opacity: 1,
                    },
                  }}
                >
                  <KeyboardArrowRight sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>

              {/* Property Stats */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: '0.75rem',
                      mb: 0.5,
                    }}
                  >
                    Listed Properties
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                      lineHeight: 1,
                    }}
                  >
                    {formatPropertyCount(agent.properties)}
                  </Typography>
                </Box>

                {/* <Box
                  sx={{
                    width: 1,
                    height: 40,
                    backgroundColor: alpha(theme.palette.divider, 0.5),
                  }}
                /> */}

                <Box sx={{ flex: 1, ml: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: '0.75rem',
                      mb: 0.5,
                    }}
                  >
                    Specialization
                  </Typography>
                  <Chip
                    label={agent.specialization}
                    size="small"
                    sx={{
                      backgroundColor: agent.tagColor,
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      fontSize: '0.7rem',
                      height: 24,
                      '& .MuiChip-label': {
                        px: 1,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </ReusableCard>
  );
};

export default RecentAgentRegistrations;
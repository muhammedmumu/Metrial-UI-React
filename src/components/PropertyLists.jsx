import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import { ArrowForward, LocationOn, Schedule, Work } from '@mui/icons-material';
import ReusableCard from './Card/ReusableCard.jsx';

// Sample data (will be replaced with API call later)
const sampleProperties = [
  {
    id: 1,
    initials: "AC",
    title: "Luxury Villa",
    company: "Achies Estate",
    time: "12 hrs ago",
    type: "For Sale",
    experience: "$2.5M",
    color: "#E9D5FF"
  },
  {
    id: 2,
    initials: "SI",
    title: "Modern Apartment",
    company: "Siachles Realty",
    time: "2 hrs ago",
    type: "For Rent",
    experience: "$3,500/month",
    color: "#BFDBFE"
  },
  {
    id: 3,
    initials: "LS",
    title: "Penthouse Suite",
    company: "LifeSpace Properties",
    time: "6 hrs ago",
    type: "For Sale",
    experience: "$4.2M",
    color: "#FED7D7"
  },
  {
    id: 4,
    initials: "GH",
    title: "Studio Loft",
    company: "GreenHomes",
    time: "1 day ago",
    type: "For Rent",
    experience: "$2,200/month",
    color: "#D1FAE5"
  },
  {
    id: 5,
    initials: "BT",
    title: "Family House",
    company: "BlueTower Realty",
    time: "2 days ago",
    type: "For Sale",
    experience: "$850K",
    color: "#FEF3C7"
  },
  {
    id: 6,
    initials: "RP",
    title: "Beachfront Condo",
    company: "RoyalPlace",
    time: "3 days ago",
    type: "For Rent",
    experience: "$5,000/month",
    color: "#E0E7FF"
  }
];

const PropertyListItem = ({ property, onClick }) => {
  const theme = useTheme();

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'for sale':
        return { bg: '#E8F5E8', color: '#2E7D32' };
      case 'for rent':
        return { bg: '#E3F2FD', color: '#1976D2' };
      default:
        return { bg: '#F5F5F5', color: '#757575' };
    }
  };

  const typeColors = getTypeColor(property.type);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 1,
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          transform: 'translateX(4px)',
        },
        border: `1px solid ${theme.palette.divider}`,
        mb: 1,
      }}
      onClick={() => onClick?.(property)}
    >
      {/* Property Avatar */}
      <Avatar
        sx={{
          width: 48,
          height: 48,
          backgroundColor: property.color,
          color: theme.palette.text.primary,
          fontWeight: 600,
          fontSize: '1rem',
        }}
      >
        {property.initials}
      </Avatar>

      {/* Property Details */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {property.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <LocationOn sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {property.company}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={property.type}
            size="small"
            sx={{
              backgroundColor: typeColors.bg,
              color: typeColors.color,
              fontWeight: 500,
              fontSize: '0.75rem',
              height: 24,
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Schedule sx={{ fontSize: 12, color: theme.palette.text.secondary }} />
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.secondary }}
            >
              {property.time}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Price and Arrow */}
      <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
          }}
        >
          {property.experience}
        </Typography>
        <ArrowForward
          sx={{
            fontSize: 18,
            color: theme.palette.text.secondary,
            transition: 'transform 0.2s ease',
          }}
        />
      </Box>
    </Box>
  );
};

const PropertyLists = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Simulate API call - replace this with actual API endpoint
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, use sample data
        setProperties(sampleProperties);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handlePropertyClick = (property) => {
    console.log('Property clicked:', property);
    // Add navigation logic here
  };

  const handleViewAll = () => {
    console.log('View All clicked');
    // Add navigation to full properties list
  };

  if (loading) {
    return (
      <ReusableCard
        title="Recent Listings"
        variant="elevated"
        sx={{ minHeight: 400 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </ReusableCard>
    );
  }

  if (error) {
    return (
      <ReusableCard
        title="Recent Listings"
        variant="elevated"
        sx={{ minHeight: 400 }}
      >
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading properties: {error}
        </Alert>
      </ReusableCard>
    );
  }

  return (
    <ReusableCard
      variant="elevated"
      sx={{ 
        height: 500, // Increased to accommodate header + 4-5 items
        
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        width:{sm:"100%",
          lg:"auto",
        }
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
          <Work sx={{ fontSize: 20, color: theme.palette.primary.main }} />
          Recent Listings
        </Typography>

        <IconButton
          onClick={handleViewAll}
          sx={{
            color: theme.palette.primary.main,
            backgroundColor: 'transparent',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'transparent',
              transform: 'scale(1.05)',
            },
            '&:active': {
              backgroundColor: 'transparent',
              transform: 'scale(0.95)',
            },
            '&:focus': {
              backgroundColor: 'transparent',
              outline: 'none',
            },
            // Remove default Material-UI button styles
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

      {/* Scrollable Properties List */}
      <Box
        sx={{
          height: 400, // Height to show exactly 4-5 items (~80px per item)
          overflowY: 'auto', // Enable scrolling
          overflowX: 'hidden', // Prevent horizontal scroll
          pr: 1,
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(theme.palette.grey[300], 0.2),
            borderRadius: 2,
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(theme.palette.primary.main, 0.3),
            borderRadius: 2,
            '&:hover': {
              background: alpha(theme.palette.primary.main, 0.5),
            },
          },
        }}
      >
        {properties.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No properties available
            </Typography>
          </Box>
        ) : (
          properties.map((property) => (
            <PropertyListItem
              key={property.id}
              property={property}
              onClick={handlePropertyClick}
            />
          ))
        )}
      </Box>
    </ReusableCard>
  );
};

export default PropertyLists;
import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Collapse,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useApp } from '../../context/useApp.js';
import { getIcon } from '../../utils/icons.js';
import { dashboardConfig } from '../../config/dashboard.config.js';

export default function SimpleSidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebar, navigation, actions } = useApp();

  const handleItemClick = (item) => {
    // If item has children, toggle expanded state
    if (item.children && item.children.length > 0) {
      const isExpanded = navigation.expandedItems.includes(item.id);
      if (isExpanded) {
        actions.setExpandedItems(navigation.expandedItems.filter(id => id !== item.id));
      } else {
        actions.setExpandedItems([...navigation.expandedItems, item.id]);
      }
    } else {
      // Select the item
      actions.setSelectedNavigation(item.id);
    }
  };

  const handleChildClick = (child) => {
    actions.setSelectedNavigation(child.id);
  };

  const handleCollapseToggle = () => {
    actions.setSidebarCollapsed(!sidebar.isCollapsed);
  };

  const renderNavigationItem = (item) => {
    const IconComponent = getIcon(item.icon);
    const isSelected = navigation.selectedItem === item.id;
    const isExpanded = navigation.expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <React.Fragment key={item.id}>
        <ListItemButton
          onClick={() => handleItemClick(item)}
          selected={isSelected && !hasChildren}
          sx={{
            pl: sidebar.isCollapsed ? 1 : 2,
            pr: 1,
            py: 1,
            minHeight: 48,
            borderRadius: sidebar.isCollapsed ? 0 : 1,
            mx: sidebar.isCollapsed ? 0 : 1,
            mb: 0.5,
            justifyContent: sidebar.isCollapsed ? 'center' : 'flex-start',
            color: '#FEFAE0', // Default light cream text
            '&:hover': {
              backgroundColor: 'rgba(254, 250, 224, 0.1)',
              color: '#FEFAE0',
            },
            '&.Mui-selected': {
              backgroundColor: '#DDA15E',
              color: '#283618',
              '&:hover': {
                backgroundColor: '#DDA15E',
                color: '#283618',
              },
            },
          }}
        >
          <ListItemIcon sx={{ 
            minWidth: sidebar.isCollapsed ? 'auto' : 40, 
            justifyContent: 'center',
            color: isSelected ? '#283618' : '#FEFAE0', // Dark green when selected, light cream default
          }}>
            {item.badge ? (
              <Badge
                badgeContent={item.badge.count}
                color={item.badge.color}
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.625rem',
                    height: 16,
                    minWidth: 16,
                  },
                }}
              >
                <IconComponent />
              </Badge>
            ) : (
              <IconComponent />
            )}
          </ListItemIcon>
          
          {!sidebar.isCollapsed && (
            <>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.875rem',
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? '#283618' : '#FEFAE0', // Dark green when selected, light cream default
                  },
                }}
              />
              {hasChildren && (
                <IconButton
                  size="small"
                  sx={{ color: isSelected ? '#283618' : '#FEFAE0', p: 0.5 }} // Dark green when selected, light cream default
                >
                  {(() => {
                    const ExpandIcon = getIcon(isExpanded ? 'ExpandLess' : 'ExpandMore');
                    return <ExpandIcon />;
                  })()}
                </IconButton>
              )}
            </>
          )}
        </ListItemButton>

        {/* Render children */}
        {hasChildren && !sidebar.isCollapsed && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => (
                <ListItemButton
                  key={child.id}
                  onClick={() => handleChildClick(child)}
                  selected={navigation.selectedItem === child.id}
                  sx={{
                    pl: 4,
                    pr: 2,
                    py: 0.75,
                    minHeight: 40,
                    borderRadius: 1,
                    mx: 1,
                    mb: 0.25,
                    color: '#FEFAE0', // Default light cream text
                    '&:hover': {
                      backgroundColor: 'rgba(254, 250, 224, 0.1)',
                      color: '#FEFAE0',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#DDA15E',
                      color: '#283618',
                      '&:hover': {
                        backgroundColor: '#DDA15E',
                        color: '#283618',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32, justifyContent: 'center' }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: navigation.selectedItem === child.id ? '#283618' : '#FEFAE0', // Dark green when selected, light cream default
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={child.text}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.8125rem',
                        fontWeight: navigation.selectedItem === child.id ? 500 : 400,
                        color: navigation.selectedItem === child.id ? '#283618' : '#FEFAE0', // Dark green when selected, light cream default
                      },
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawerWidth = sidebar.isCollapsed ? 78 : 240;

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header with Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebar.isCollapsed ? 'center' : 'space-between',
          p: 2,
          minHeight: 64,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {/* Logo and Text */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: sidebar.isCollapsed ? 0 : 0, // No gap at all
            cursor: sidebar.isCollapsed ? 'pointer' : 'default',
          }}
          onClick={sidebar.isCollapsed ? () => actions.setSidebarCollapsed(false) : undefined}
        >
          {/* Logo Image */}
          <Box
            component="img"
            src="/images/accordia-golf.svg"
            alt="Logo"
            sx={{
              width: sidebar.isCollapsed ? 32 : 40,
              height: sidebar.isCollapsed ? 32 : 40,
              transition: 'all 0.3s ease',
            }}
          />
          
          {/* Text - only show when not collapsed */}
          {!sidebar.isCollapsed && (
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                fontSize: '1.5rem',
                marginTop: '12px', // Push text down even more (increased from 8px to 12px)
                background: 'linear-gradient(135deg, #60ba45 0%, #00a74f 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent', // Fallback for non-webkit browsers
              }}
            >
              {dashboardConfig.app.shortName}
            </Typography>
          )}
        </Box>
        
        {/* Collapse Button - only on desktop and when not collapsed */}
        {!isMobile && !sidebar.isCollapsed && (
          <IconButton
            onClick={handleCollapseToggle}
            size="small"
            sx={{ color: '#FEFAE0' }} // Light cream color
          >
            {(() => {
              const ChevronIcon = getIcon('ChevronLeft');
              return <ChevronIcon />;
            })()}
          </IconButton>
        )}
      </Box>

      {/* Navigation List */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        py: 1,
        // Custom scrollbar styling
        '&::-webkit-scrollbar': {
          width: '4px', // Thin scrollbar width
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent', // Transparent track
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#FEFAE0', // Light cream thumb color
          borderRadius: '2px',
          opacity: 0.3,
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#FEFAE0', // Light cream on hover
          opacity: 0.5,
        },
        // For Firefox
        scrollbarWidth: 'thin',
        scrollbarColor: '#FEFAE0 transparent',
      }}>
        <List disablePadding>
          {dashboardConfig.navigation.map((item) => renderNavigationItem(item))}
        </List>
      </Box>

      {/* Footer */}
      {!sidebar.isCollapsed && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'rgba(254, 250, 224, 0.2)' }}>
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#FEFAE0' }}>
            Version {dashboardConfig.app.version}
          </Typography>
        </Box>
      )}
    </Box>
  );

  // Mobile drawer (temporary overlay)
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={sidebar.isOpen}
        onClose={() => actions.toggleSidebar()}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240, // Always full width on mobile
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // Desktop drawer (permanent)
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
import { createTheme } from '@mui/material/styles';
import { dashboardConfig } from '../config/dashboard.config.js';

// Get theme configuration
const themeConfig = dashboardConfig.theme;

// Define your color palette from configuration - using default colors
const colors = {
  primary: {
    main: '#1976d2', // Default Material-UI blue
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#fff',
  },
  secondary: {
    main: '#9c27b0', // Default Material-UI purple
    light: '#ba68c8',
    dark: '#7b1fa2',
    contrastText: '#fff',
  },
  background: {
    default: '#fafafa',
    paper: '#ffffff',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
  divider: 'rgba(0, 0, 0, 0.12)',
  action: {
    hover: 'rgba(25, 118, 210, 0.04)', // Primary color with low opacity
    selected: 'rgba(25, 118, 210, 0.12)', // Primary color with higher opacity
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    focus: 'rgba(25, 118, 210, 0.12)', // Primary color focus
  },
  navbar: {
    background: '#ffffff',
    color: 'rgba(0, 0, 0, 0.87)',
    shadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sidebar: {
    background: '#132a13', // Dark green background
    color: '#FEFAE0', // Light cream text and icons
    hover: 'rgba(254, 250, 224, 0.1)', // Light cream with opacity for hover
    active: '#DDA15E', // Golden brown background for active/selected
    border: 'rgba(254, 250, 224, 0.2)', // Light cream border with opacity
    selectedText: '#344e41', // Dark green text for selected items
    selectedIcon: '#344e41', // Dark green icons for selected items
    defaultText: '#FEFAE0', // Default light cream text
    defaultIcon: '#FEFAE0', // Default light cream icons
  }
};

// Define spacing and layout constants from configuration
export const layout = {
  sidebar: {
    width: themeConfig.layout.sidebarWidth,
    collapsedWidth: themeConfig.layout.collapsedSidebarWidth,
  },
  navbar: {
    height: themeConfig.layout.navbarHeight,
  },
  breakpoints: {
    mobile: themeConfig.breakpoints.mobile,
  }
};

// Create the theme
export const theme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
    divider: colors.divider,
    action: colors.action,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.4,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.navbar.background,
          color: colors.navbar.color,
          boxShadow: 'none', // Remove box shadow
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.sidebar.background,
          color: colors.sidebar.color,
          borderRight: `1px solid ${colors.sidebar.border}`,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: colors.sidebar.defaultText, // Default light cream text
          '& .MuiListItemIcon-root': {
            color: colors.sidebar.defaultIcon, // Default light cream icons
          },
          '& .MuiListItemText-primary': {
            color: colors.sidebar.defaultText, // Default light cream text
          },
          '&:hover': {
            backgroundColor: colors.sidebar.hover,
            '& .MuiListItemIcon-root': {
              color: colors.sidebar.defaultIcon,
            },
            '& .MuiListItemText-primary': {
              color: colors.sidebar.defaultText,
            },
          },
          '&.Mui-selected': {
            backgroundColor: colors.sidebar.active, // Golden brown background
            color: colors.sidebar.selectedText, // Dark green text
            '& .MuiListItemIcon-root': {
              color: colors.sidebar.selectedIcon, // Dark green icons
            },
            '& .MuiListItemText-primary': {
              color: colors.sidebar.selectedText, // Dark green text
              fontWeight: 600,
            },
            // Bullet points for child items
            '& .MuiBox-root': {
              backgroundColor: colors.sidebar.selectedText, // Dark green bullets
            },
            '&:hover': {
              backgroundColor: colors.sidebar.active, // Keep golden brown on hover
              '& .MuiListItemIcon-root': {
                color: colors.sidebar.selectedIcon,
              },
              '& .MuiListItemText-primary': {
                color: colors.sidebar.selectedText,
              },
            },
          },
          '&.MuiListItemButton-root': {
            borderRadius: 8,
            margin: '2px 8px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
        contained: {
          '&:hover': {
            backgroundColor: '#1565c0', // Default hover
          },
          '&:active': {
            backgroundColor: '#0d47a1', // Default active
          },
          '&:focus': {
            boxShadow: `0 0 0 3px rgba(25, 118, 210, 0.3)`, // Default focus
          },
          '&:disabled': {
            backgroundColor: 'rgba(0, 0, 0, 0.12)',
            color: 'rgba(0, 0, 0, 0.26)',
          },
        },
        outlined: {
          borderColor: 'rgba(0, 0, 0, 0.23)',
          '&:hover': {
            borderColor: '#1976d2',
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
          '&:focus': {
            boxShadow: `0 0 0 3px rgba(25, 118, 210, 0.3)`,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          '&:focus': {
            boxShadow: `0 0 0 3px rgba(25, 118, 210, 0.3)`,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '&.MuiChip-colorPrimary': {
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: '#9c27b0',
            '&:hover': {
              backgroundColor: '#7b1fa2',
            },
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: `${layout.navbar.height}px !important`,
        },
      },
    },
  },
  transitions: {
    duration: {
      standard: 300,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
});

export { colors };
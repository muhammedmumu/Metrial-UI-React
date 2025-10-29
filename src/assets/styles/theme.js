import { createTheme } from '@mui/material/styles';

// Use inline theme configuration to avoid build issues with dashboard.config.js
const themeConfig = {
  colors: {
    primary: '#0EA5E9',
    primaryHover: '#0284C7',
    primaryActive: '#0369A1',
    primaryFocus: '#7DD3FC',
    secondary: '#F97316',
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
    collapsedSidebarWidth: 78,
    navbarHeight: 64,
  }
};

// Define your color palette from configuration - light mode
const lightColors = {
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

// Define your color palette - dark mode
const darkColors = {
  primary: {
    main: '#90caf9', // Lighter blue for dark mode
    light: '#bbdefb',
    dark: '#42a5f5',
    contrastText: '#000',
  },
  secondary: {
    main: '#ce93d8', // Lighter purple for dark mode
    light: '#e1bee7',
    dark: '#ba68c8',
    contrastText: '#000',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
  action: {
    hover: 'rgba(144, 202, 249, 0.08)',
    selected: 'rgba(144, 202, 249, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.3)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)',
    focus: 'rgba(144, 202, 249, 0.12)',
  },
  navbar: {
    background: '#1e1e1e',
    color: '#ffffff',
    shadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  sidebar: {
    background: '#0a0a0a', // Very dark background
    color: '#e0e0e0', // Light gray text and icons
    hover: 'rgba(224, 224, 224, 0.08)', // Light gray with opacity for hover
    active: '#bb86fc', // Purple background for active/selected
    border: 'rgba(224, 224, 224, 0.12)', // Light gray border with opacity
    selectedText: '#000000', // Black text for selected items
    selectedIcon: '#000000', // Black icons for selected items
    defaultText: '#e0e0e0', // Default light gray text
    defaultIcon: '#e0e0e0', // Default light gray icons
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

// Create theme function that accepts mode
export const createAppTheme = (mode = 'light') => {
  const colors = mode === 'light' ? lightColors : darkColors;

  return createTheme({
    palette: {
      mode,
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
              backgroundColor: colors.primary.dark,
            },
            '&:active': {
              backgroundColor: colors.primary.dark,
            },
            '&:focus': {
              boxShadow: `0 0 0 3px rgba(${mode === 'light' ? '25, 118, 210' : '144, 202, 249'}, 0.3)`,
            },
            '&:disabled': {
              backgroundColor: colors.action.disabledBackground,
              color: colors.action.disabled,
            },
          },
          outlined: {
            borderColor: colors.divider,
            '&:hover': {
              borderColor: colors.primary.main,
              backgroundColor: colors.action.hover,
            },
            '&:focus': {
              boxShadow: `0 0 0 3px rgba(${mode === 'light' ? '25, 118, 210' : '144, 202, 249'}, 0.3)`,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: colors.action.hover,
            },
            '&:focus': {
              boxShadow: `0 0 0 3px rgba(${mode === 'light' ? '25, 118, 210' : '144, 202, 249'}, 0.3)`,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            '&.MuiChip-colorPrimary': {
              backgroundColor: colors.primary.main,
              '&:hover': {
                backgroundColor: colors.primary.dark,
              },
            },
            '&.MuiChip-colorSecondary': {
              backgroundColor: colors.secondary.main,
              '&:hover': {
                backgroundColor: colors.secondary.dark,
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
};

// Create the default theme (light mode)
export const theme = createAppTheme('light');

// Export colors for backward compatibility
export const colors = lightColors;
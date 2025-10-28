import React from 'react';
import { Box, CssBaseline, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import { useApp } from '../../context/useApp.js';
import { layout } from '../../theme/theme.js';
import Navbar from './Navbar.jsx';
import SimpleSidebar from './SimpleSidebar.jsx';

export default function MainLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebar } = useApp();

  const sidebarWidth = sidebar.isCollapsed ? layout.sidebar.collapsedWidth : layout.sidebar.width;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Sidebar */}
      <SimpleSidebar />
      
      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`,
          minHeight: '100vh',
          backgroundColor: 'background.default',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          // No margin on mobile since sidebar overlays
          marginLeft: isMobile ? 0 : undefined,
        }}
      >
        {/* Spacer for fixed navbar */}
        <Toolbar sx={{ minHeight: `${layout.navbar.height}px !important` }} />
        
        {/* Page Content */}
        <Box
          sx={{
            p: 2,
            maxWidth: '100%',
            overflow: 'hidden',
            display:"flex",
            flexDirection:"column",
            gap:1.5,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

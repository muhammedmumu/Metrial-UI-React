import React, { useState, useEffect, useRef } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar, 
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Badge,
  Tooltip,
  InputBase,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Popover,
  FormControl,
  Select,
  Chip,
} from '@mui/material';
import { 
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  History as HistoryIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  FilterList as FilterIcon,
  Refresh as ResetIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/useApp.js';
import { layout } from '../../theme/theme.js';

export default function Navbar() {
  const { sidebar, user, actions, isMobile, ui } = useApp();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [propertyTypes, setPropertyTypes] = useState([]);

  const propertyTypeOptions = ['Residential', 'Commercial', 'Industrial', 'Land', 'Mixed Use'];

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const debouncedLogRef = useRef(null);

  useEffect(() => {
    return () => {
      if (debouncedLogRef.current) {
        clearTimeout(debouncedLogRef.current);
      }
    };
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    actions.setSearchQuery(value);

    if (debouncedLogRef.current) {
      clearTimeout(debouncedLogRef.current);
    }
    debouncedLogRef.current = setTimeout(() => {
      console.log('Search query:', value);
    }, 300); // debounce delay in ms
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Handle search submission
    console.log('Search submitted:', ui.searchQuery);
    
    // Add to search history if not empty
    if (ui.searchQuery.trim()) {
      actions.addSearchHistory(ui.searchQuery);
    }
    
    // Reset the search bar after submission
    actions.setSearchQuery('');
    
    if (searchModalOpen) {
      setSearchModalOpen(false);
    }
  };

  const handleFilterOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleDateRangeChange = (field, value) => {
    setSelectedDate(value);
  };

  const handlePropertyTypeChange = (event) => {
    setPropertyTypes(event.target.value);
  };

  const handleApplyFilters = () => {
    console.log('Applied filters:', { selectedDate, propertyTypes });
    // Here you would implement filter logic
    handleFilterClose();
  };

  const handleClearFilters = () => {
    setSelectedDate('');
    setPropertyTypes([]);
    console.log('Filters cleared');
  };

  const handleSearchModalOpen = () => {
    setSearchModalOpen(true);
  };

  const handleSearchModalClose = () => {
    setSearchModalOpen(false);
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
    handleProfileMenuClose();
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
    handleProfileMenuClose();
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    handleProfileMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: isMobile ? '100%' : `calc(100% - ${sidebar.isCollapsed ? layout.sidebar.collapsedWidth : layout.sidebar.width}px)`,
        ml: isMobile ? 0 : `${sidebar.isCollapsed ? layout.sidebar.collapsedWidth : layout.sidebar.width}px`,
        transition: (theme) => theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: layout.navbar.height }}>
        {/* Mobile Menu Button with Logo */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={actions.toggleSidebar}
            edge="start"
            sx={{ 
              mr: 2,
              p: 1, // Slightly more padding for the logo
            }}
          >
            <Box
              component="img"
              src="/images/accordia-golf.svg"
              alt="Menu"
              sx={{
                width: 24,
                height: 24,
              }}
            />
          </IconButton>
        )}
        
        {/* Empty space to push content to the right */}
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search Bar - Hidden on very small screens, moved to right */}
          <Box 
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              position: 'relative',
              borderRadius: 1,
              backgroundColor: alpha('#000', 0.05),
              '&:hover': {
                backgroundColor: alpha('#000', 0.08),
              },
              mr: 1,
              width: 300,
            }}
          >
            <Box sx={{ p: 1, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Search..."
              value={ui.searchQuery}
              onChange={handleSearchChange}
              sx={{
                color: 'inherit',
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: '8px 8px 8px 0px',
                  paddingLeft: 0,
                  transition: (theme) => theme.transitions.create('width'),
                  width: '100%',
                },
              }}
            />
          </Box>

          {/* Filter Icon with Dropdown */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Tooltip title="Filter">
              <IconButton 
                color="inherit"
                onClick={handleFilterOpen}
                sx={{ 
                  bgcolor: (filterAnchorEl || propertyTypes.length > 0 || selectedDate) 
                    ? alpha('#000', 0.1) : 'transparent'
                }}
              >
                <FilterIcon />
                {(propertyTypes.length > 0 || selectedDate) && (
                  <Badge 
                    color="primary" 
                    variant="dot" 
                    sx={{ 
                      '& .MuiBadge-badge': { 
                        top: 8, 
                        right: 8 
                      } 
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
          </Box>

          {/* Reset Icon */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Tooltip title="Reset All">
              <IconButton 
                color="inherit"
                onClick={() => {
                  actions.setSearchQuery('');
                  handleClearFilters();
                }}
              >
                <ResetIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Search Icon for mobile */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Tooltip title="Search">
              <IconButton color="inherit" onClick={handleSearchModalOpen}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <Badge badgeContent={user.notifications} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Profile Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
            {/* User Info - Hidden on very small screens */}
            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                {user.role}
              </Typography>
            </Box>

            {/* Avatar with Menu */}
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ ml: 1 }}
                aria-controls={anchorEl ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={anchorEl ? 'true' : undefined}
              >
                <Avatar 
                  alt={user.name} 
                  src={user.avatar}
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                >
                  {user.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          {/* Settings Icon */}
          <Tooltip title="Settings">
            <IconButton color="inherit" sx={{ ml: 1 }}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          onClick={handleProfileMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleSettingsClick}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        {/* Search Modal for Mobile */}
        <Dialog 
          open={searchModalOpen} 
          onClose={handleSearchModalClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              position: 'fixed',
              top: 20,
              m: 2,
              maxHeight: 'calc(100vh - 40px)',
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon />
              Search
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSearchSubmit} sx={{ pt: 1 }}>
              <TextField
                autoFocus
                fullWidth
                variant="outlined"
                placeholder="What are you looking for?"
                value={ui.searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                      <SearchIcon color="action" />
                    </Box>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Box>
            
            {/* Mobile Filters Section */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterIcon fontSize="small" />
                Filters
              </Typography>
              
              {/* Date Filter */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 500, color: 'text.secondary' }}>
                  Date
                </Typography>
                <TextField
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateRangeChange('date', e.target.value)}
                  size="small"
                  fullWidth
                  variant="outlined"
                />
              </Box>

              {/* Property Type Filter */}
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 500, color: 'text.secondary' }}>
                  Property Type
                </Typography>
                <FormControl fullWidth size="small" variant="outlined">
                  <Select
                    multiple
                    value={propertyTypes}
                    onChange={handlePropertyTypeChange}
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <Typography variant="body2" color="text.secondary">Select types</Typography>;
                      }
                      return (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" sx={{ height: 18, fontSize: '0.7rem' }} />
                          ))}
                        </Box>
                      );
                    }}
                    sx={{
                      '& .MuiSelect-select': {
                        padding: '6px 12px',
                        minHeight: 'auto',
                      },
                    }}
                  >
                    {propertyTypeOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Filter Actions */}
              {(selectedDate || propertyTypes.length > 0) && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button 
                    size="small"
                    onClick={handleClearFilters}
                    sx={{ fontSize: '0.75rem', minWidth: 'auto', px: 1 }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              )}
            </Box>
            
            {/* Search History */}
            {ui.searchHistory.length > 0 && !ui.searchQuery && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HistoryIcon fontSize="small" />
                  Recent searches
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {ui.searchHistory.map((searchItem, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: 'action.hover',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.selected',
                        },
                      }}
                      onClick={() => {
                        actions.setSearchQuery(searchItem);
                        // Auto-focus the input after setting the query
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HistoryIcon fontSize="small" color="action" />
                        <Typography variant="body2">{searchItem}</Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          actions.removeSearchHistory(searchItem);
                        }}
                        sx={{ 
                          ml: 1,
                          '&:hover': {
                            backgroundColor: 'error.light',
                            color: 'error.contrastText',
                          }
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Current Search Preview */}
            {ui.searchQuery && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Searching for: "{ui.searchQuery}"
                </Typography>
                {/* You can add search results preview here */}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleSearchModalClose} color="inherit">
              Cancel
            </Button>
            <Button 
              onClick={handleSearchSubmit} 
              variant="contained" 
              disabled={!ui.searchQuery.trim()}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </DialogActions>
        </Dialog>

        {/* Filter Popover */}
        <Popover
          open={Boolean(filterAnchorEl)}
          anchorEl={filterAnchorEl}
          onClose={handleFilterClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: { 
              p: 2, 
              minWidth: 280,
              maxWidth: 300,
              boxShadow: 2,
            }
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Filters
          </Typography>

          {/* Date Section */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
              Date
            </Typography>
            <TextField
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateRangeChange('date', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
              fullWidth
              variant="outlined"
            />
          </Box>

          {/* Property Type Section */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
              Property Type
            </Typography>
            <FormControl fullWidth size="small" variant="outlined">
              <Select
                multiple
                value={propertyTypes}
                onChange={handlePropertyTypeChange}
                displayEmpty
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <Typography variant="body2" color="text.secondary">Select types</Typography>;
                  }
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" sx={{ height: 20, fontSize: '0.75rem' }} />
                      ))}
                    </Box>
                  );
                }}
                sx={{
                  '& .MuiSelect-select': {
                    padding: '8px 14px',
                    minHeight: 'auto',
                  },
                }}
              >
                {propertyTypeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              size="small"
              onClick={handleClearFilters}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Clear
            </Button>
            <Button 
              variant="contained" 
              size="small"
              onClick={handleApplyFilters}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Apply
            </Button>
          </Box>
        </Popover>
      </Toolbar>
    </AppBar>
  );
}

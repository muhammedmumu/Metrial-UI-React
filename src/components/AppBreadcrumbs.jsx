import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { useRouter } from '../hooks/useRouter.js';

const AppBreadcrumbs = ({ currentPath, navigationConfig }) => {
  const theme = useTheme();
  const { navigate } = useRouter();

  // Function to find navigation item by path
  const findNavItemByPath = (path, navItems) => {
    for (const item of navItems) {
      if (item.path === path) {
        return item;
      }
      if (item.children) {
        const found = findNavItemByPath(path, item.children);
        if (found) {
          return { parent: item, item: found };
        }
      }
    }
    return null;
  };

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = currentPath.split('/').filter(Boolean);
    const breadcrumbs = [];

    // Always start with Dashboard as root
    breadcrumbs.push({
      label: 'Dashboard',
      path: '/home',
      isActive: currentPath === '/' || currentPath === '/home'
    });

    if (pathSegments.length > 0 && pathSegments[0] !== 'home') {
      let currentPath = '';
      
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const navItem = findNavItemByPath(currentPath, navigationConfig);
        
        if (navItem) {
          const item = navItem.item || navItem;
          const isLast = index === pathSegments.length - 1;
          
          breadcrumbs.push({
            label: item.text,
            path: currentPath,
            isActive: isLast
          });
        } else {
          // If not found in navigation, create a title from the path segment
          const isLast = index === pathSegments.length - 1;
          const label = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
            
          breadcrumbs.push({
            label: label,
            path: currentPath,
            isActive: isLast
          });
        }
      });
    }

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  return (
    <Box
      sx={{
        py: 1,
        px: 0,
        mb: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: theme.palette.text.secondary,
          },
        }}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          if (isLast || item.isActive) {
            return (
              <Typography
                key={item.path}
                variant="body2"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }}
              >
                {item.label}
              </Typography>
            );
          }

          return (
            <Link
              key={item.path}
              component="button"
              underline="hover"
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                textDecoration: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
                console.log('Navigate to:', item.path);
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default AppBreadcrumbs;
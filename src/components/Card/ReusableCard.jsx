import React from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
 
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getIcon } from "../../assets/icons/icons.js";
import {
  ExpandLessOutlined,
  ExpandMoreOutlined,
} from "@mui/icons-material";

// Styled Card component for custom variants
const StyledCard = styled(Card)(({ theme, variant, bgcolor, clickable, color }) => ({
  position: "relative",
  overflow: "visible",
  cursor: clickable ? "pointer" : "default",
  transition: "all 0.3s ease",
  backgroundColor: bgcolor || theme.palette.background.paper,
  borderRadius: 10, // Increased border radius

  // Variant styles
  ...(variant === "elevated" && {
    boxShadow: theme.shadows[2],
    "&:hover": {
      boxShadow: clickable 
        ? `0 4px 8px ${color && color !== "inherit" ? `${color}40` : theme.palette.grey[400]}` 
        : theme.shadows[2],
      transform: clickable ? "translateY(-2px)" : "none",
    },
  }),

  ...(variant === "outlined" && {
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: "none",
    "&:hover": {
      borderColor: clickable
        ? color && color !== "inherit" ? color : theme.palette.primary.main
        : theme.palette.divider,
      boxShadow: clickable 
        ? `0 4px 8px ${color && color !== "inherit" ? `${color}30` : theme.palette.primary.main}30`
        : "none",
    },
  }),

  ...(variant === "filled" && {
    backgroundColor: bgcolor || theme.palette.grey[50],
    "&:hover": {
      backgroundColor: clickable
        ? theme.palette.grey[100]
        : bgcolor || theme.palette.grey[50],
      boxShadow: clickable 
        ? `0 4px 16px ${color && color !== "inherit" ? `${color}25` : theme.palette.grey[400]}`
        : "none",
    },
  }),

  ...(variant === "minimal" && {
    boxShadow: "none",
    border: "none",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: clickable ? theme.palette.action.hover : "transparent",
      boxShadow: clickable 
        ? `0 2px 8px ${color && color !== "inherit" ? `${color}20` : theme.palette.action.hover}`
        : "none",
    },
  }),

  // Default variant
  ...((!variant || variant === "default") && {
    "&:hover": {
      boxShadow: clickable 
        ? `0 4px 16px ${color && color !== "inherit" ? `${color}30` : theme.palette.grey[400]}`
        : theme.shadows[1],
    },
  }),
}));

// Main ReusableCard component
const ReusableCard = ({
  title,
  value,
  change,
  icon,
  color = "inherit",
  bgcolor,
  variant = "default",
  onClick,
  children,
  sx = {},
  ...props
}) => {
  // Support legacy/alternate background prop names from API or parent components
  const resolvedBg =
    bgcolor ?? props.bg_color ?? props.bgColor ?? props.backgroundColor ?? undefined;
  // Get icon component if icon is provided
  const IconComponent = icon ? getIcon(icon) : null;

  // Determine if card should be clickable
  const isClickable = Boolean(onClick);

  // Parse change value for styling
  const changeValue = change
    ? parseFloat(change.toString().replace(/[^-\d.]/g, ""))
    : null;
  const changeIcon =
    changeValue > 0
      ? "TrendingUp"
      : changeValue < 0
      ? "TrendingDown"
      : "TrendingFlat";
  const ChangeIconComponent = getIcon(changeIcon);

  // Card content
  const cardContent = (
    <CardContent sx={{ p: 1.5, "&:last-child": { pb: 3} }}>
      {/* Header with title and icon */}
      {(title || IconComponent) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 0.5,
          }}
        >
          {IconComponent && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor:
                  color !== "inherit" ? `${color}15` : "primary.light",
                color: color !== "inherit" ? color : "primary.main",
              }}
            >
              <IconComponent fontSize="small" />
            </Box>
          )}

           {title && (
          <Typography
            variant="h5"
            component="div"
            sx={{
              color: color !== "inherit" ? color : "text.primary",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            {title}
          </Typography>
        )}

         
        </Box>
      )}

      {/* Main value and change section */}
      {(value || change) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          {value && (
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: color !== "inherit" ? color : "text.primary",
                fontWeight: 700,
                mb: change ? 1 : 2,
                lineHeight: 1,
              }}
            >
              {value}
            </Typography>
          )}

          {change && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, m:0}}>
              {changeValue > 0 ? (
                <ExpandLessOutlined sx={{ fontSize: 16, color: "success.main" }} />
              ) : changeValue < 0 ? (
                <ExpandMoreOutlined sx={{ fontSize: 16, color: "error.main" }} />
              ) : (
                <ExpandLessOutlined sx={{ fontSize: 16, color: "text.secondary" }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: changeValue > 0 ? "success.main" : changeValue < 0 ? "error.main" : "text.secondary",
                  fontWeight: 500,
                }}
              >
                {change}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Custom children content */}
      {children && (
        <Box sx={{ 
          mt: (title || IconComponent || value || change) ? 1 : 0,
          width: '100%',
          minHeight: 'auto',
          display: 'block'
        }}>
          {children}
        </Box>
      )}
    </CardContent>
  );

  return (
    <StyledCard
      variant={variant}
      bgcolor={resolvedBg}
      clickable={isClickable}
      color={color}
      sx={{
        ...sx,
      }}
      {...props}
    >
      {isClickable ? (
        <CardActionArea onClick={onClick} sx={{ display: "block" }}>
          {cardContent}
        </CardActionArea>
      ) : (
        cardContent
      )}
    </StyledCard>
  );
};

export default ReusableCard;

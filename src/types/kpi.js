// KPI related types
export const KpiTypes = {
  // KPI item structure
  KpiItem: {
    title: 'string',
    value: 'string|number',
    change: 'string',
    icon: 'string',
    color: 'string',
    bgcolor: 'string',
    bg_color: 'string',
    description: 'string',
    onClick: 'function'
  },

  // API response structure
  KpiApiResponse: {
    data: 'Array<KpiItem>',
    status: 'number',
    message: 'string'
  }
};

// Common component props
export const ComponentTypes = {
  // Reusable Card props
  ReusableCardProps: {
    title: 'string',
    value: 'string|number',
    change: 'string',
    icon: 'string',
    color: 'string',
    bgcolor: 'string',
    variant: 'string',
    onClick: 'function',
    children: 'ReactNode',
    sx: 'object'
  }
};
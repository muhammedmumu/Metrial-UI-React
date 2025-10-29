import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Card, 
  CardContent, 
  Typography,
  Grid,
  Chip,
  Button
} from '@mui/material';

/**
 * CUSTOM HOOK: useURLParams
 * This hook manages URL search parameters and keeps component state in sync with URL
 */
const useURLParams = () => {
  // Get initial URL search parameters
  const [searchParams, setSearchParamsState] = useState(() => {
    return new URLSearchParams(window.location.search);
  });

  /**
   * Function to update URL parameters
   * @param {URLSearchParams} newParams - New parameters to set in URL
   * @param {Object} options - Options for navigation (replace vs push)
   */
  const setSearchParams = (newParams, options = {}) => {
    const url = new URL(window.location);
    url.search = newParams.toString();
    
    if (options.replace) {
      // Replace current history entry (doesn't create new history entry)
      window.history.replaceState({}, '', url);
    } else {
      // Push new history entry (creates new history entry)
      window.history.pushState({}, '', url);
    }
    
    // Update local state to trigger re-render
    setSearchParamsState(new URLSearchParams(newParams));
  };

  /**
   * Listen for browser back/forward navigation
   * This ensures the component updates when user uses browser navigation
   */
  useEffect(() => {
    const handlePopState = () => {
      // Update state when user navigates back/forward
      setSearchParamsState(new URLSearchParams(window.location.search));
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Cleanup event listener
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return [searchParams, setSearchParams];
};

/**
 * SAMPLE DATA
 * This represents the data your component would typically fetch from an API
 */
const sampleProducts = [
  { id: 1, name: 'Running Shoes', category: 'shoes', price: 120, brand: 'Nike' },
  { id: 2, name: 'Basketball Shoes', category: 'shoes', price: 150, brand: 'Adidas' },
  { id: 3, name: 'T-Shirt', category: 'clothing', price: 25, brand: 'Nike' },
  { id: 4, name: 'Jeans', category: 'clothing', price: 80, brand: 'Levi\'s' },
  { id: 5, name: 'Tennis Shoes', category: 'shoes', price: 90, brand: 'Nike' },
  { id: 6, name: 'Hoodie', category: 'clothing', price: 60, brand: 'Adidas' },
  { id: 7, name: 'Sneakers', category: 'shoes', price: 110, brand: 'Puma' },
  { id: 8, name: 'Shorts', category: 'clothing', price: 35, brand: 'Nike' },
];

/**
 * MAIN COMPONENT: URLDrivenProductList
 * This component demonstrates URL-driven filtering with query parameters
 */
const URLDrivenProductList = () => {
  // Use our custom hook to manage URL parameters
  const [searchParams, setSearchParams] = useURLParams();
  
  // Local state for products and filtered results
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * STEP 1: Initialize component with data
   * This simulates fetching data from an API when component mounts
   */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set the data (in real app, this would be from API)
      setAllProducts(sampleProducts);
      setLoading(false);
    };

    loadData();
  }, []);

  /**
   * STEP 2: Extract current filter values from URL
   * These values will be used to control form inputs and filter data
   */
  const currentCategory = searchParams.get('category') || 'all';
  const currentBrand = searchParams.get('brand') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  /**
   * STEP 3: Filter data based on URL parameters
   * This effect runs whenever URL parameters change or data is loaded
   */
  useEffect(() => {
    let filtered = [...allProducts];

    // Filter by category (if not 'all')
    if (currentCategory && currentCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === currentCategory.toLowerCase()
      );
    }

    // Filter by brand (if not 'all')
    if (currentBrand && currentBrand !== 'all') {
      filtered = filtered.filter(product => 
        product.brand.toLowerCase() === currentBrand.toLowerCase()
      );
    }

    // Filter by search term (searches name and brand)
    if (currentSearch) {
      const searchLower = currentSearch.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower)
      );
    }

    // Filter by price range
    if (currentMinPrice) {
      const minPrice = parseFloat(currentMinPrice);
      filtered = filtered.filter(product => product.price >= minPrice);
    }

    if (currentMaxPrice) {
      const maxPrice = parseFloat(currentMaxPrice);
      filtered = filtered.filter(product => product.price <= maxPrice);
    }

    // Update filtered results
    setFilteredProducts(filtered);
  }, [
    allProducts, 
    currentCategory, 
    currentBrand, 
    currentSearch, 
    currentMinPrice, 
    currentMaxPrice
  ]);

  /**
   * STEP 4: Helper function to update URL parameters
   * This function safely updates URL parameters and removes empty values
   */
  const updateURLParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value && value !== 'all' && value !== '') {
      // Set parameter if it has a meaningful value
      newParams.set(key, value);
    } else {
      // Remove parameter if it's empty or default value
      newParams.delete(key);
    }
    
    // Update URL (use replace to avoid creating too many history entries)
    setSearchParams(newParams, { replace: true });
  };

  /**
   * STEP 5: Event handlers for form controls
   * These handlers update the URL when user interacts with filters
   */
  const handleCategoryChange = (event) => {
    updateURLParam('category', event.target.value);
  };

  const handleBrandChange = (event) => {
    updateURLParam('brand', event.target.value);
  };

  const handleSearchChange = (event) => {
    updateURLParam('search', event.target.value);
  };

  const handleMinPriceChange = (event) => {
    updateURLParam('minPrice', event.target.value);
  };

  const handleMaxPriceChange = (event) => {
    updateURLParam('maxPrice', event.target.value);
  };

  /**
   * STEP 6: Clear all filters function
   * This removes all query parameters and shows all data
   */
  const clearAllFilters = () => {
    // Create empty URLSearchParams to clear all parameters
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Get unique values for filter dropdowns
  const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
  const uniqueBrands = [...new Set(allProducts.map(p => p.brand))];

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading products...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        URL-Driven Product Filter Demo
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This component demonstrates URL-driven filtering. Try changing filters and refreshing the page - 
        your filters will persist! You can also manually edit the URL parameters.
      </Typography>

      {/* FILTER CONTROLS */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters (URL Parameters: {window.location.search || 'none'})
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            {/* Search Input */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search"
                placeholder="Search products..."
                value={currentSearch}
                onChange={handleSearchChange}
                size="small"
              />
            </Grid>

            {/* Category Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={currentCategory}
                  label="Category"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {uniqueCategories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Brand Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Brand</InputLabel>
                <Select
                  value={currentBrand}
                  label="Brand"
                  onChange={handleBrandChange}
                >
                  <MenuItem value="all">All Brands</MenuItem>
                  {uniqueBrands.map(brand => (
                    <MenuItem key={brand} value={brand}>
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Price Range */}
            <Grid item xs={6} sm={3} md={1.5}>
              <TextField
                fullWidth
                label="Min Price"
                type="number"
                value={currentMinPrice}
                onChange={handleMinPriceChange}
                size="small"
              />
            </Grid>

            <Grid item xs={6} sm={3} md={1.5}>
              <TextField
                fullWidth
                label="Max Price"
                type="number"
                value={currentMaxPrice}
                onChange={handleMaxPriceChange}
                size="small"
              />
            </Grid>

            {/* Clear Filters Button */}
            <Grid item xs={12} sm={6} md={1}>
              <Button
                variant="outlined"
                onClick={clearAllFilters}
                size="small"
                fullWidth
              >
                Clear All
              </Button>
            </Grid>
          </Grid>

          {/* Active Filters Display */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Active Filters:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {currentCategory !== 'all' && (
                <Chip 
                  label={`Category: ${currentCategory}`} 
                  onDelete={() => updateURLParam('category', 'all')}
                  size="small"
                />
              )}
              {currentBrand !== 'all' && (
                <Chip 
                  label={`Brand: ${currentBrand}`} 
                  onDelete={() => updateURLParam('brand', 'all')}
                  size="small"
                />
              )}
              {currentSearch && (
                <Chip 
                  label={`Search: ${currentSearch}`} 
                  onDelete={() => updateURLParam('search', '')}
                  size="small"
                />
              )}
              {currentMinPrice && (
                <Chip 
                  label={`Min Price: $${currentMinPrice}`} 
                  onDelete={() => updateURLParam('minPrice', '')}
                  size="small"
                />
              )}
              {currentMaxPrice && (
                <Chip 
                  label={`Max Price: $${currentMaxPrice}`} 
                  onDelete={() => updateURLParam('maxPrice', '')}
                  size="small"
                />
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* RESULTS */}
      <Typography variant="h6" gutterBottom>
        Results ({filteredProducts.length} products)
      </Typography>

      <Grid container spacing={2}>
        {filteredProducts.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {product.brand} • {product.category}
                </Typography>
                <Typography variant="h5" color="primary">
                  ${product.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredProducts.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography color="text.secondary">
            No products found matching your filters.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default URLDrivenProductList;
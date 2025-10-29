import React, { useState, useEffect } from 'react';
// Note: If using React Router v6, you can import useSearchParams like this:
// import { useSearchParams } from 'react-router-dom';

/**
 * MODERN URL-DRIVEN COMPONENT WITH useSearchParams
 * 
 * This example shows how to use React Router's useSearchParams hook
 * for URL-driven components. If you're not using React Router,
 * see the custom implementation in SimpleURLExample.jsx
 */

// Custom useSearchParams implementation (use React Router's version if available)
const useSearchParams = () => {
  const [searchParams, setSearchParamsState] = useState(() => {
    return new URLSearchParams(window.location.search);
  });

  const setSearchParams = (updater) => {
    let newParams;
    
    if (typeof updater === 'function') {
      // If updater is a function, call it with current params
      newParams = updater(new URLSearchParams(searchParams));
    } else {
      // If updater is an object or URLSearchParams
      newParams = new URLSearchParams(updater);
    }
    
    // Update URL
    const newURL = `${window.location.pathname}?${newParams.toString()}`;
    window.history.replaceState({}, '', newURL);
    
    // Update state
    setSearchParamsState(newParams);
  };

  // Listen for browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setSearchParamsState(new URLSearchParams(window.location.search));
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return [searchParams, setSearchParams];
};

const ModernURLDrivenExample = () => {
  // Use the useSearchParams hook
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Sample data
  const allProducts = [
    { id: 1, name: 'Running Shoes', category: 'shoes', price: 120 },
    { id: 2, name: 'Basketball Shoes', category: 'shoes', price: 150 },
    { id: 3, name: 'T-Shirt', category: 'clothing', price: 25 },
    { id: 4, name: 'Jeans', category: 'clothing', price: 80 },
    { id: 5, name: 'Hoodie', category: 'clothing', price: 60 },
  ];

  // Component state
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * STEP 1: Extract values from URL parameters
   * Use .get() method to safely read URL parameters
   */
  const category = searchParams.get('category') || 'all';
  const minPrice = searchParams.get('minPrice') || '';
  const search = searchParams.get('search') || '';

  /**
   * STEP 2: Filter data based on URL parameters
   * This effect runs whenever URL parameters change
   */
  useEffect(() => {
    setLoading(true);
    
    // Simulate async data loading
    const filterData = async () => {
      // Start with all products
      let filtered = [...allProducts];

      // Apply category filter
      if (category !== 'all') {
        filtered = filtered.filter(product => product.category === category);
      }

      // Apply price filter
      if (minPrice) {
        const minPriceNum = parseFloat(minPrice);
        filtered = filtered.filter(product => product.price >= minPriceNum);
      }

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchLower)
        );
      }

      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setFilteredProducts(filtered);
      setLoading(false);
    };

    filterData();
  }, [category, minPrice, search]); // Re-run when URL params change

  /**
   * STEP 3: Helper function to update URL parameters
   * This function safely updates URL parameters
   */
  const updateParam = (key, value) => {
    setSearchParams(currentParams => {
      const newParams = new URLSearchParams(currentParams);
      
      if (value && value !== 'all' && value !== '') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      
      return newParams;
    });
  };

  /**
   * STEP 4: Event handlers for form controls
   */
  const handleCategoryChange = (event) => {
    updateParam('category', event.target.value);
  };

  const handleMinPriceChange = (event) => {
    updateParam('minPrice', event.target.value);
  };

  const handleSearchChange = (event) => {
    updateParam('search', event.target.value);
  };

  /**
   * STEP 5: Clear all filters
   */
  const clearFilters = () => {
    setSearchParams({}); // Pass empty object to clear all params
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Modern URL-Driven Component</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Using useSearchParams hook for URL state management
      </p>

      {/* Display current URL */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '10px', 
        backgroundColor: '#f0f8ff', 
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>Current URL:</strong> {window.location.href}
        <br />
        <strong>Params:</strong> {searchParams.toString() || 'none'}
      </div>

      {/* Filter Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '30px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Category Filter */}
        <div>
          <label style={{ marginRight: '8px' }}>Category:</label>
          <select 
            value={category} 
            onChange={handleCategoryChange}
            style={{ padding: '6px' }}
          >
            <option value="all">All</option>
            <option value="shoes">Shoes</option>
            <option value="clothing">Clothing</option>
          </select>
        </div>

        {/* Min Price Filter */}
        <div>
          <label style={{ marginRight: '8px' }}>Min Price:</label>
          <input 
            type="number"
            value={minPrice}
            onChange={handleMinPriceChange}
            placeholder="0"
            style={{ padding: '6px', width: '80px' }}
          />
        </div>

        {/* Search Filter */}
        <div>
          <label style={{ marginRight: '8px' }}>Search:</label>
          <input 
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Product name..."
            style={{ padding: '6px', width: '150px' }}
          />
        </div>

        {/* Clear Button */}
        <button 
          onClick={clearFilters}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#ff6b6b', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear All
        </button>
      </div>

      {/* Active Filters Display */}
      {(category !== 'all' || minPrice || search) && (
        <div style={{ marginBottom: '20px' }}>
          <strong>Active Filters:</strong>
          {category !== 'all' && (
            <span style={{ 
              marginLeft: '10px', 
              padding: '4px 8px', 
              backgroundColor: '#e3f2fd', 
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              Category: {category}
            </span>
          )}
          {minPrice && (
            <span style={{ 
              marginLeft: '10px', 
              padding: '4px 8px', 
              backgroundColor: '#e8f5e8', 
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              Min Price: ${minPrice}
            </span>
          )}
          {search && (
            <span style={{ 
              marginLeft: '10px', 
              padding: '4px 8px', 
              backgroundColor: '#fff3e0', 
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              Search: "{search}"
            </span>
          )}
        </div>
      )}

      {/* Results */}
      <div>
        <h2>Products ({loading ? '...' : filteredProducts.length})</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading products...
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px', 
                color: '#666',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px'
              }}>
                No products found matching your filters.
              </div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '15px' 
              }}>
                {filteredProducts.map(product => (
                  <div 
                    key={product.id}
                    style={{ 
                      border: '1px solid #ddd', 
                      borderRadius: '8px', 
                      padding: '15px',
                      backgroundColor: 'white'
                    }}
                  >
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                      {product.name}
                    </h3>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                      {product.category}
                    </p>
                    <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#2196f3' }}>
                      ${product.price}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Instructions */}
      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px' 
      }}>
        <h3>How This Works:</h3>
        <ol style={{ lineHeight: '1.6' }}>
          <li><strong>Default Load:</strong> When no URL params exist, shows all products</li>
          <li><strong>URL Updates:</strong> Filter changes automatically update the URL</li>
          <li><strong>Page Refresh:</strong> Filters persist after refresh because they're in URL</li>
          <li><strong>Manual URL Edit:</strong> Edit URL params directly - component auto-updates</li>
          <li><strong>Browser Navigation:</strong> Back/forward buttons work correctly</li>
        </ol>
        
        <h4>Key Benefits:</h4>
        <ul style={{ lineHeight: '1.6' }}>
          <li>Shareable URLs with filters applied</li>
          <li>State persists across page refreshes</li>
          <li>SEO-friendly filtering</li>
          <li>Browser history works naturally</li>
          <li>Deep linking to filtered views</li>
        </ul>
      </div>
    </div>
  );
};

export default ModernURLDrivenExample;
import React, { useState, useEffect } from 'react';

/**
 * SIMPLE URL-DRIVEN COMPONENT EXAMPLE
 * 
 * This example demonstrates the core concepts of URL-driven components:
 * 1. Loading default data when no query parameters exist
 * 2. Loading filtered data when query parameters exist
 * 3. Persisting data after page refresh
 * 4. Automatically updating when URL is manually changed
 */

const SimpleURLDrivenExample = () => {
  // Sample data - in real app, this would come from an API
  const allItems = [
    { id: 1, name: 'Red Shoes', category: 'shoes' },
    { id: 2, name: 'Blue Shirt', category: 'clothing' },
    { id:3, name: 'Green Shoes', category: 'shoes' },
    { id: 4, name: 'Black Pants', category: 'clothing' },
    { id: 5, name: 'White Sneakers', category: 'shoes' },
  ];

  // State for our filtered items
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * STEP 1: Get current URL parameters
   * URLSearchParams reads the current URL query string
   */
  const getURLParams = () => {
    return new URLSearchParams(window.location.search);
  };

  /**
   * STEP 2: Update URL parameters
   * This function updates the URL without causing a page reload
   */
  const updateURL = (key, value) => {
    const params = getURLParams();
    
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Update URL using browser History API
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newURL);
    
    // Trigger filtering after URL update
    filterItems();
  };

  /**
   * STEP 3: Filter items based on URL parameters
   * This function reads URL parameters and filters the data accordingly
   */
  const filterItems = () => {
    setLoading(true);
    
    // Get current category from URL
    const params = getURLParams();
    const category = params.get('category');
    
    // Simulate loading delay (remove in real app)
    setTimeout(() => {
      if (!category || category === 'all') {
        // No filter - show all items (DEFAULT BEHAVIOR)
        setItems(allItems);
      } else {
        // Filter by category (FILTERED BEHAVIOR)
        const filtered = allItems.filter(item => 
          item.category === category
        );
        setItems(filtered);
      }
      setLoading(false);
    }, 300);
  };

  /**
   * STEP 4: Initialize component and handle URL changes
   * This useEffect runs when component mounts and handles browser navigation
   */
  useEffect(() => {
    // Initial load - filter based on current URL
    filterItems();

    /**
     * STEP 5: Listen for manual URL changes
     * This handles when user manually edits URL or uses back/forward buttons
     */
    const handleURLChange = () => {
      filterItems();
    };

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', handleURLChange);
    
    // Listen for manual URL changes (not all browsers support this)
    // Alternative: you can use a polling mechanism to check URL changes
    const checkURLChange = setInterval(() => {
      const currentURL = window.location.search;
      if (currentURL !== checkURLChange.lastURL) {
        checkURLChange.lastURL = currentURL;
        filterItems();
      }
    }, 100);
    
    // Cleanup event listeners
    return () => {
      window.removeEventListener('popstate', handleURLChange);
      clearInterval(checkURLChange);
    };
  }, []); // Empty dependency array - only runs once on mount

  /**
   * STEP 6: Handle filter changes
   * This function is called when user selects a different filter
   */
  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    updateURL('category', selectedCategory);
  };

  // Get current category from URL for the select input
  const currentCategory = getURLParams().get('category') || 'all';

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Simple URL-Driven Example</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <strong>Current URL:</strong> {window.location.href}
      </div>

      {/* Filter Control */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="category-select">Filter by Category: </label>
        <select 
          id="category-select"
          value={currentCategory} 
          onChange={handleCategoryChange}
          style={{ padding: '8px', marginLeft: '10px' }}
        >
          <option value="all">All Items</option>
          <option value="shoes">Shoes</option>
          <option value="clothing">Clothing</option>
        </select>
      </div>

      {/* Results */}
      <div>
        <h2>Results ({items.length} items)</h2>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {items.map(item => (
              <li 
                key={item.id}
                style={{ 
                  padding: '10px', 
                  margin: '5px 0', 
                  backgroundColor: '#e3f2fd', 
                  borderRadius: '4px' 
                }}
              >
                <strong>{item.name}</strong> - {item.category}
              </li>
            ))}
          </ul>
        )}
        
        {!loading && items.length === 0 && (
          <p style={{ color: '#666' }}>No items found for selected category.</p>
        )}
      </div>

      {/* Instructions */}
      <div style={{ marginTop: '40px', padding: '15px', backgroundColor: '#fff3e0', borderRadius: '4px' }}>
        <h3>Try These Tests:</h3>
        <ol>
          <li><strong>Default Load:</strong> Refresh page with no query params - shows all items</li>
          <li><strong>Filter & Refresh:</strong> Select "Shoes", then refresh - filter persists</li>
          <li><strong>Manual URL Edit:</strong> Add <code>?category=clothing</code> to URL - auto updates</li>
          <li><strong>Browser Navigation:</strong> Use back/forward buttons - state preserved</li>
          <li><strong>Invalid Category:</strong> Try <code>?category=invalid</code> - shows no results</li>
        </ol>
      </div>
    </div>
  );
};

export default SimpleURLDrivenExample;
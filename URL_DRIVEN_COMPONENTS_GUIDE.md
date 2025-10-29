# URL-Driven React Components Guide

## 🎯 **What is a URL-Driven Component?**

A URL-driven component is a React component that:
- **Stores its state in URL query parameters** instead of just local state
- **Automatically loads the correct data** based on URL parameters
- **Persists state across page refreshes** because data is in the URL
- **Updates automatically** when URL parameters change manually

## 🔧 **Core Implementation Pattern**

### **1. Basic Structure**

```javascript
const URLDrivenComponent = () => {
  // 1. Read URL parameters
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 2. Extract values from URL
  const filter = searchParams.get('category') || 'all';
  
  // 3. Filter data based on URL params
  useEffect(() => {
    filterData(filter);
  }, [filter]);
  
  // 4. Update URL when filters change
  const updateFilter = (newFilter) => {
    setSearchParams({ category: newFilter });
  };
};
```

### **2. Key Hooks & Methods**

| Method | Purpose | Example |
|--------|---------|---------|
| `new URLSearchParams(window.location.search)` | Read current URL params | `?category=shoes&price=100` |
| `searchParams.get('key')` | Get specific parameter | `searchParams.get('category')` → `'shoes'` |
| `searchParams.set('key', 'value')` | Set parameter | `params.set('category', 'clothing')` |
| `window.history.replaceState()` | Update URL without reload | Updates browser address bar |
| `useEffect()` | React to URL changes | Trigger data filtering |

## 📋 **Step-by-Step Implementation**

### **Step 1: Create URL Parameter Hook**

```javascript
const useURLParams = () => {
  const [searchParams, setSearchParamsState] = useState(() => {
    return new URLSearchParams(window.location.search);
  });

  const setSearchParams = (newParams) => {
    const url = new URL(window.location);
    url.search = newParams.toString();
    window.history.replaceState({}, '', url);
    setSearchParamsState(new URLSearchParams(newParams));
  };

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setSearchParamsState(new URLSearchParams(window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return [searchParams, setSearchParams];
};
```

### **Step 2: Extract Current Values from URL**

```javascript
const MyComponent = () => {
  const [searchParams, setSearchParams] = useURLParams();
  
  // Extract values with fallbacks for when no params exist
  const category = searchParams.get('category') || 'all';        // DEFAULT: 'all'
  const search = searchParams.get('search') || '';              // DEFAULT: empty
  const page = parseInt(searchParams.get('page') || '1', 10);   // DEFAULT: 1
  const minPrice = searchParams.get('minPrice') || '';          // DEFAULT: empty
};
```

### **Step 3: Filter Data Based on URL Parameters**

```javascript
useEffect(() => {
  let filtered = allData;
  
  // Apply category filter (skip if 'all' or empty)
  if (category && category !== 'all') {
    filtered = filtered.filter(item => item.category === category);
  }
  
  // Apply search filter (skip if empty)
  if (search) {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Apply price filter (skip if empty)
  if (minPrice) {
    filtered = filtered.filter(item => item.price >= parseFloat(minPrice));
  }
  
  setFilteredData(filtered);
}, [category, search, minPrice, allData]); // Re-run when URL params change
```

### **Step 4: Update URL When Filters Change**

```javascript
const updateURLParam = (key, value) => {
  const newParams = new URLSearchParams(searchParams);
  
  if (value && value !== 'all' && value !== '') {
    newParams.set(key, value);        // Add/update parameter
  } else {
    newParams.delete(key);            // Remove parameter if empty/default
  }
  
  setSearchParams(newParams);         // Update URL
};

// Event handlers
const handleCategoryChange = (event) => {
  updateURLParam('category', event.target.value);
};

const handleSearchChange = (event) => {
  updateURLParam('search', event.target.value);
};
```

### **Step 5: Handle Manual URL Changes**

```javascript
// The useEffect in Step 3 automatically handles this!
// When URL parameters change (manually or via navigation),
// the useEffect dependencies trigger and re-filter the data.

// For browser navigation (back/forward), the popstate listener
// in the useURLParams hook handles URL updates.
```

## 🌟 **Complete Working Example**

```javascript
import React, { useState, useEffect } from 'react';

const ProductFilter = () => {
  // Sample data
  const allProducts = [
    { id: 1, name: 'Red Shoes', category: 'shoes', price: 100 },
    { id: 2, name: 'Blue Shirt', category: 'clothing', price: 50 },
    // ... more products
  ];

  // URL state management
  const [searchParams, setSearchParams] = useState(() => 
    new URLSearchParams(window.location.search)
  );
  
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Extract current URL parameters
  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';

  // Filter data when URL parameters change
  useEffect(() => {
    let filtered = allProducts;

    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [category, search]);

  // Update URL parameters
  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    // Update browser URL
    window.history.replaceState({}, '', `?${newParams.toString()}`);
    setSearchParams(newParams);
  };

  return (
    <div>
      {/* Filters */}
      <select 
        value={category} 
        onChange={(e) => updateParam('category', e.target.value)}
      >
        <option value="all">All Categories</option>
        <option value="shoes">Shoes</option>
        <option value="clothing">Clothing</option>
      </select>

      <input 
        type="text"
        value={search}
        onChange={(e) => updateParam('search', e.target.value)}
        placeholder="Search products..."
      />

      {/* Results */}
      <div>
        {filteredProducts.map(product => (
          <div key={product.id}>
            {product.name} - {product.category} - ${product.price}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 🎯 **Key Benefits**

| Benefit | Description | Example |
|---------|-------------|---------|
| **Shareable URLs** | Users can share filtered views | `example.com/products?category=shoes&price=100` |
| **Persistent State** | Filters survive page refreshes | Refresh page → filters remain active |
| **SEO Friendly** | Search engines can index filtered pages | Better search visibility |
| **Browser History** | Back/forward buttons work naturally | Navigate through filter history |
| **Deep Linking** | Link directly to specific filtered views | Bookmark specific searches |

## ⚡ **Common Patterns**

### **Multiple Independent Tables**
```javascript
// Table 1: uses prefix "table1_"
const [table1Params, setTable1Params] = useURLParams('table1_');

// Table 2: uses prefix "table2_" 
const [table2Params, setTable2Params] = useURLParams('table2_');

// URL: ?table1_category=shoes&table2_category=clothing
```

### **Pagination with URL**
```javascript
const page = parseInt(searchParams.get('page') || '1', 10);
const rowsPerPage = parseInt(searchParams.get('limit') || '10', 10);

const updatePage = (newPage) => {
  updateParam('page', newPage.toString());
};
```

### **Complex Filters**
```javascript
const filters = {
  category: searchParams.get('category') || 'all',
  minPrice: searchParams.get('minPrice') || '',
  maxPrice: searchParams.get('maxPrice') || '',
  sortBy: searchParams.get('sortBy') || 'name',
  sortOrder: searchParams.get('sortOrder') || 'asc',
};
```

## 🚀 **Testing Your Implementation**

1. **Default Load Test**: Visit page without URL params → should show all data
2. **Filter & Refresh Test**: Apply filters, refresh page → filters should persist
3. **Manual URL Edit Test**: Edit URL directly → component should update
4. **Browser Navigation Test**: Use back/forward buttons → should work correctly
5. **Share URL Test**: Copy/paste URL → should load with same filters applied

This approach makes your React components much more user-friendly and provides a better overall experience!
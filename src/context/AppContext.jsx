import React, { useReducer } from 'react';
import { useMediaQuery } from '@mui/material';
import { dashboardConfig } from '../config/dashboard.config.js';
import { AppContext } from './context.js';
import { 
  TOGGLE_SIDEBAR, 
  SET_SIDEBAR_COLLAPSED,
  SET_SELECTED_NAVIGATION,
  SET_EXPANDED_ITEMS,
  SET_SEARCH_QUERY,
  ADD_SEARCH_HISTORY,
  REMOVE_SEARCH_HISTORY,
  CLEAR_SEARCH_HISTORY,
  TOGGLE_THEME,
  SET_THEME
} from './actionTypes.js';

// Initial state
const initialState = {
  sidebar: {
    isOpen: true,
    isCollapsed: false,
  },
  navigation: {
    selectedItem: dashboardConfig.navigation[0]?.id || null,
    expandedItems: [],
  },
  ui: {
    searchQuery: '',
    searchHistory: [],
  },
  theme: {
    mode: localStorage.getItem('theme-mode') || 'light',
  },
  user: dashboardConfig.defaultUser,
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case TOGGLE_SIDEBAR: {
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          isOpen: !state.sidebar.isOpen,
        },
      };
    }
    case SET_SIDEBAR_COLLAPSED: {
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          isCollapsed: action.payload,
        },
      };
    }
    case SET_SELECTED_NAVIGATION: {
      return {
        ...state,
        navigation: {
          ...state.navigation,
          selectedItem: action.payload,
        },
      };
    }
    case SET_EXPANDED_ITEMS: {
      return {
        ...state,
        navigation: {
          ...state.navigation,
          expandedItems: action.payload,
        },
      };
    }
    case SET_SEARCH_QUERY: {
      return {
        ...state,
        ui: {
          ...state.ui,
          searchQuery: action.payload,
        },
      };
    }
    case ADD_SEARCH_HISTORY: {
      const newHistory = [action.payload, ...state.ui.searchHistory.filter(item => item !== action.payload)];
      return {
        ...state,
        ui: {
          ...state.ui,
          searchHistory: newHistory.slice(0, 3), // Keep only last 3 items
        },
      };
    }
    case REMOVE_SEARCH_HISTORY: {
      return {
        ...state,
        ui: {
          ...state.ui,
          searchHistory: state.ui.searchHistory.filter(item => item !== action.payload),
        },
      };
    }
    case CLEAR_SEARCH_HISTORY: {
      return {
        ...state,
        ui: {
          ...state.ui,
          searchHistory: [],
        },
      };
    }
    case TOGGLE_THEME: {
      const newMode = state.theme.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', newMode);
      return {
        ...state,
        theme: {
          ...state.theme,
          mode: newMode,
        },
      };
    }
    case SET_THEME: {
      localStorage.setItem('theme-mode', action.payload);
      return {
        ...state,
        theme: {
          ...state.theme,
          mode: action.payload,
        },
      };
    }
    default:
      return state;
  }
}

// Create context
// Context provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const isMobile = useMediaQuery(`(max-width:${dashboardConfig.theme.breakpoints.mobile === 'md' ? '959.95' : '899.95'}px)`);

  // Action creators
  const actions = {
    toggleSidebar: () => dispatch({ type: TOGGLE_SIDEBAR }),
    setSidebarCollapsed: (collapsed) => dispatch({ type: SET_SIDEBAR_COLLAPSED, payload: collapsed }),
    setSelectedNavigation: (itemId) => dispatch({ type: SET_SELECTED_NAVIGATION, payload: itemId }),
    setExpandedItems: (items) => dispatch({ type: SET_EXPANDED_ITEMS, payload: items }),
    setSearchQuery: (query) => dispatch({ type: SET_SEARCH_QUERY, payload: query }),
    addSearchHistory: (query) => dispatch({ type: ADD_SEARCH_HISTORY, payload: query }),
    removeSearchHistory: (query) => dispatch({ type: REMOVE_SEARCH_HISTORY, payload: query }),
    clearSearchHistory: () => dispatch({ type: CLEAR_SEARCH_HISTORY }),
    toggleTheme: () => dispatch({ type: TOGGLE_THEME }),
    setTheme: (mode) => dispatch({ type: SET_THEME, payload: mode }),
  };

  const value = {
    ...state,
    actions,
    isMobile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

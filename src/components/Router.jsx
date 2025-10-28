import React, { useState, useEffect } from 'react';
import { RouterContext } from '../context/RouterContext.js';
import { useRouter } from '../hooks/useRouter.js';

// Router Provider Component
export const RouterProvider = ({ children }) => {
  const [currentPath, setCurrentPath] = useState('/home');
  const [history, setHistory] = useState(['/home']);

  // Listen to URL changes (for manual URL entry)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/home';
      setCurrentPath(path);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Set initial path
    const initialPath = window.location.pathname || '/home';
    setCurrentPath(initialPath);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (path) => {
    setCurrentPath(path);
    setHistory(prev => [...prev, path]);
    
    // Update browser URL without page reload
    window.history.pushState({}, '', path);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousPath = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentPath(previousPath);
      window.history.pushState({}, '', previousPath);
    }
  };

  const value = {
    currentPath,
    history,
    navigate,
    goBack,
  };

  return (
    <RouterContext.Provider value={value}>
      {children}
    </RouterContext.Provider>
  );
};

// Route Component
export const Route = ({ path, children, exact = false }) => {
  const { currentPath } = useRouter();
  
  const isMatch = exact 
    ? currentPath === path
    : currentPath.startsWith(path);

  return isMatch ? children : null;
};

// Routes Container Component
export const Routes = ({ children }) => {
  return <>{children}</>;
};
// Route configuration
import React from 'react';
import { Routes, Route } from './Router.jsx';
import { routeConfig } from './routeConfig.js';

// Import page components
import HomePage from '../pages/HomePage.jsx';

// Main Routes component
export const AppRoutes = () => {
  return (
    <Routes>
      {routeConfig.map(({ path, component: ComponentToRender, exact }) => {
        const Component = ComponentToRender;
        return (
          <Route key={path} path={path} exact={exact}>
            <Component />
          </Route>
        );
      })}
      {/* Default route */}
      <Route path="/" exact>
        <HomePage />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, useParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import { routeConfig, NotFound } from './routeConfig';
import { Loader2 } from 'lucide-react';

// Loading spinner component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Update document title
const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title || 'Rentify - Rent Anything, Anytime';
  }, [title]);
};

// Route wrapper with params support
const RouteWithTitle = ({ element: Element, title, useParams: needParams, ...props }) => {
  useDocumentTitle(title);
  const params = useParams();
  
  // For routes that need params (like ProductRent, BillingPayment)
  if (needParams) {
    // Pass itemId or billId based on the route
    const itemId = params.id;
    const billId = params.billId;
    
    if (itemId) {
      return <Element itemId={itemId} {...props} />;
    }
    if (billId) {
      return <Element billId={billId} {...props} />;
    }
  }
  
  return <Element {...props} />;
};

const AppRoutes = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          {routeConfig.public.map(({ path, element: Element, title, useParams }) => (
            <Route
              key={path}
              path={path}
              element={<RouteWithTitle element={Element} title={title} useParams={useParams} />}
            />
          ))}
        </Route>

        {/* Auth Routes with AuthLayout (redirect if already logged in) */}
        <Route element={<AuthLayout />}>
          {routeConfig.auth.map(({ path, element: Element, title }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute requireAuth={false}>
                  <RouteWithTitle element={Element} title={title} />
                </ProtectedRoute>
              }
            />
          ))}
        </Route>

        {/* Protected Routes with DashboardLayout */}
        <Route element={<DashboardLayout />}>
          {routeConfig.protected.map(({ path, element: Element, title, useParams }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute requireAuth={true}>
                  <RouteWithTitle element={Element} title={title} useParams={useParams} />
                </ProtectedRoute>
              }
            />
          ))}
        </Route>

        {/* 404 Page */}
        <Route element={<MainLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
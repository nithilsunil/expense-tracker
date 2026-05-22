import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Loader2 } from 'lucide-react';

// Protected Route Component Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 size={36} className="animate-spin text-brand-600 dark:text-brand-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (Redirects to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 size={36} className="animate-spin text-brand-600 dark:text-brand-500" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Sidebar Layout Wrapper for Protected Pages
const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar />
      <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full overflow-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth pages */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } 
        />

        {/* Protected app views */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

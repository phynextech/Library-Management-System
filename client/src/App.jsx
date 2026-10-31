import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BooksPage from './pages/BooksPage';
import CategoriesPage from './pages/CategoriesPage';
import StudentsPage from './pages/StudentsPage';
import IssueReturnPage from './pages/IssueReturnPage';
import TransactionsPage from './pages/TransactionsPage';
import StudentPortalPage from './pages/StudentPortalPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

// Route Guards
const ProtectedRoute = ({ children, adminOnly = false, studentOnly = false }) => {
  const { user, loading, isAdmin, isStudent } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/student-portal" replace />;
  }

  return children;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Application Workspace */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard (Admin) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute adminOnly>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Student Self-Service Portal */}
            <Route path="/student-portal" element={<StudentPortalPage />} />

            {/* Book Catalog */}
            <Route path="/books" element={<BooksPage />} />

            {/* Categories */}
            <Route path="/categories" element={<CategoriesPage />} />

            {/* Student Management (Admin) */}
            <Route
              path="/students"
              element={
                <ProtectedRoute adminOnly>
                  <StudentsPage />
                </ProtectedRoute>
              }
            />

            {/* Book Issue & Return (Admin) */}
            <Route
              path="/issue"
              element={
                <ProtectedRoute adminOnly>
                  <IssueReturnPage defaultTab="issue" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/return"
              element={
                <ProtectedRoute adminOnly>
                  <IssueReturnPage defaultTab="return" />
                </ProtectedRoute>
              }
            />

            {/* Transactions Ledger */}
            <Route path="/transactions" element={<TransactionsPage />} />

            {/* Reports & Analytics (Admin) */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute adminOnly>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />

            {/* Settings */}
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

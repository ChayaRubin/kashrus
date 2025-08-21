// // src/routes/ProtectedRoute/ProtectedRoute.jsx
// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../app/auth/auth.jsx';

// export default function ProtectedRoute({ role, children }) {
//   const { user, loading } = useAuth();
//   const loc = useLocation();
//   if (loading) return null;
//   if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
//   if (role && user.role !== role) return <Navigate to="/" replace />;
//   return children;
// }
// src/app/ProtectedRoute/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function ProtectedRoute({ role, children }) {
  const auth = useAuth();            // ← don’t destructure right away
  const loc = useLocation();

  // handle case where context is missing
  if (!auth) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  const { user, loading, isAuthenticated } = auth;

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

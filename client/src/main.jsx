// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/router.jsx';
import { LevelsProvider } from './components/LevelsContext/LevelsContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LevelsProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </LevelsProvider>
  </React.StrictMode>
);

import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// layouts
import PublicLayout from '../../layouts/PublicLayout/PublicLayout.jsx';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout.jsx';

// guards
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute.jsx';

// public pages
import Home from '../../pages/public/Home/Home.jsx';
import LevelPage from '../../pages/public/LevelPage/LevelPage.jsx';
import RestaurantDetail from '../../pages/public/RestaurantDetail/RestaurantDetail.jsx';
import Login from '../../pages/public/Login/Login.jsx';

// admin pages
import Dashboard from '../../pages/admin/Dashboard/Dashboard.jsx';
import AdminRestaurants from '../../pages/admin/Restaurants/Restaurants.jsx';
import RestaurantForm from '../../pages/admin/RestaurantForm/RestaurantForm.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'level/:level', element: <LevelPage /> },
      { path: 'restaurant/:id', element: <RestaurantDetail /> },
      { path: 'login', element: <Login /> },
    ],
  },
  {
    element: <ProtectedRoute />, // gate all admin routes
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'restaurants', element: <AdminRestaurants /> },
          { path: 'restaurants/:id', element: <RestaurantForm /> },   // :id or "new"
        ],
      },
    ],
  },
]);

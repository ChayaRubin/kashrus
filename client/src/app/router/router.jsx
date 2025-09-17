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
import Login from '../../pages/public/Auth/Login.jsx';
import SignUp from '../../pages/public/Auth/SignUp.jsx';
import CategoryPage from '../../pages/public/CategoryPage/CategoryPage.jsx';
import TypePage from '../../pages/public/TypePage/TypePage.jsx';
import Articles from "../../pages/public/Articles/Articles.jsx";
import ArticleDetail from "../../pages/public/ArticleDetail/ArticleDetail.jsx";
import Hechsheirim from "../../pages/public/Hechsheirim/Hechsheirim.jsx";
import Rabanim from "../../pages/public/Rabanim/Rabanim.jsx";
import AboutUs from "../../pages/public/AboutUs/AboutUs.jsx";
// admin pages
import Dashboard from '../../pages/admin/Dashboard/Dashboard.jsx';
import AdminRestaurants from '../../pages/admin/Restaurants/AdminRestaurants.jsx';
import RestaurantForm from '../../pages/admin/Restaurants/RestaurantForm.jsx';
import AdminArticles from "../../pages/admin/AdminArticles/AdminArticles.jsx";
import AdminRabanim from "../../pages/admin/AdminRabanim/AdminRabanim.jsx";
import AdminHechsheirim from "../../pages/admin/AdminHechsheirim/AdminHechsheirim.jsx";
import AdminUsers from '../../pages/admin/AdimUsers/AdminUsers.jsx';




export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
      { path: '/home', element: <Home /> },
      { path: '/browse', element: <CategoryPage /> },
      { path: '/browse/:category', element: <TypePage /> },
      { path: '/browse/:category/:type', element: <LevelPage /> },
      { path: '/browse/:category/:type/:level', element: <LevelPage /> },
      { path: '/restaurant/:id', element: <RestaurantDetail /> },
      { path: '/about', element: <AboutUs /> },
      
      // 👇 new public pages
      { path: '/articles', element: <Articles /> },
      { path: '/articles/:id', element: <ArticleDetail /> },
      { path: '/hechsheirim', element: <Hechsheirim /> },
      { path: '/rabanim', element: <Rabanim /> },
      { path: '/admin/articles', element: <AdminArticles /> },
      { path: '/admin/rabanim', element: <AdminRabanim /> },
      { path: '/admin/hechsheirim', element: <AdminHechsheirim /> }
    ],
  },
  {
    element: (
      <ProtectedRoute role="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/admin', element: <Dashboard /> },
      { path: '/admin/restaurants', element: <AdminRestaurants /> },
      { path: '/admin/restaurants/new', element: <RestaurantForm /> },
      { path: '/admin/restaurants/:id', element: <RestaurantForm /> },
      { path: '/admin/users', element: <AdminUsers /> },
    ],
  },
]);

// src/app/router/router.jsx
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// layouts
import PublicLayout from '../../layouts/PublicLayout/PublicLayout.jsx';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout.jsx';

// guards
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute.jsx';

// public pages
import Home from '../../pages/public/Home/Home.jsx';
import LevelPage from '../../pages/public/LevelPage/LevelPage.jsx'; // used as "Results" page
import RestaurantDetail from '../../pages/public/RestaurantDetail/RestaurantDetail.jsx';
import Login from '../../pages/public/Auth/Login.jsx';
import SignUp from '../../pages/public/Auth/SignUp.jsx';
import CategoryPage from '../../pages/public/CategoryPage/CategoryPage.jsx';
import TypePage from '../../pages/public/TypePage/TypePage.jsx';
import Articles from '../../pages/public/Articles/Articles.jsx';
import Hechsheirim from '../../pages/public/Hechsheirim/Hechsheirim.jsx';
import Rabanim from '../../pages/public/Rabanim/Rabanim.jsx';
import AboutUs from '../../pages/public/AboutUs/AboutUs.jsx';
// import MyRatings from '../../components/StarRating/StarRating.jsx';
import Contact from '../../pages/public/Contact/Contact.jsx';

// inside the public routes:

// admin pages
import Dashboard from '../../pages/admin/Dashboard/Dashboard.jsx';
import AdminRestaurants from '../../pages/admin/Restaurants/AdminRestaurants.jsx';
import RestaurantForm from '../../pages/admin/Restaurants/RestaurantForm.jsx';
import AdminArticles from '../../pages/admin/AdminArticles/List.jsx';
import AdminRabanim from '../../pages/admin/AdminRabanim/List.jsx';
import AdminHechsheirim from '../../pages/admin/AdminHechsheirim/List.jsx';
import AdminUsers from '../../pages/admin/AdimUsers/AdminUsers.jsx';
import HechsheirimForm from  '../../pages/admin/AdminHechsheirim/Form.jsx';
import RabanimForm from '../../pages/admin/AdminRabanim/Form.jsx';
import ArticleForm from '../../pages/admin/AdminArticles/Form.jsx';
import Slideshow from '../../pages/admin/SlideShow/AdminSlideshow.jsx';
import AdminFeedback from '../../pages/admin/AdminFeedback/List.jsx';
import AdminHome from '../../pages/admin/AdminHome/AdminHome.jsx';
export const router = createBrowserRouter([
  // PUBLIC
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'home', element: <Home /> },

      // browse flow: Category -> Type -> Results (levels come from context)
      { path: 'browse', element: <CategoryPage /> },
      { path: 'browse/:category', element: <TypePage /> },
      { path: 'browse/:category/:type', element: <LevelPage /> },

      // details
      { path: 'restaurant/:id', element: <RestaurantDetail /> },
      { path: 'contact', element: <Contact /> },

      // { path: 'my-ratings', element: <MyRatings /> },

      // misc public
      { path: 'about', element: <AboutUs /> },
      { path: 'articles', element: <Articles /> },
      { path: 'hechsheirim', element: <Hechsheirim /> },
      { path: 'rabanim', element: <Rabanim /> },

      // auth
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
    ],
  },

  // ADMIN (guarded)
  {
    element: (
      <ProtectedRoute role="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/admin', element: <Dashboard /> },

      // restaurants
      { path: '/admin/restaurants', element: <AdminRestaurants /> },
      { path: '/admin/restaurants/new', element: <RestaurantForm /> },
      { path: '/admin/restaurants/:id', element: <RestaurantForm /> },

      // users
      { path: '/admin/users', element: <AdminUsers /> },

      // feedback
      { path: '/admin/feedback', element: <AdminFeedback /> },

      // content management
      { path: '/admin/articles', element: <AdminArticles /> },
      { path: '/admin/rabanim', element: <AdminRabanim /> },
      { path: '/admin/hechsheirim', element: <AdminHechsheirim /> },
      { path: '/admin/hechsheirim/new', element: <HechsheirimForm /> },
      { path: '/admin/hechsheirim/:id', element: <HechsheirimForm /> },
      { path: '/admin/rabanim/new', element: <RabanimForm /> },
      { path: '/admin/rabanim/:id', element: <RabanimForm /> },
      { path: '/admin/articles/new', element: <ArticleForm /> },
      { path: '/admin/articles/:id', element: <ArticleForm /> },
      { path: '/admin/slideshow', element: <Slideshow /> },
      { path: "/admin/home", element: <AdminHome /> },
    ],
  },
]);

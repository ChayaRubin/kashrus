// import React from 'react';
// import { createBrowserRouter } from 'react-router-dom';

// // layouts
// import PublicLayout from '../../layouts/PublicLayout/PublicLayout.jsx';
// import AdminLayout from '../../layouts/AdminLayout/AdminLayout.jsx';

// // guards
// import ProtectedRoute from '../ProtectedRoute/ProtectedRoute.jsx';

// // public pages
// import Home from '../../pages/public/Home/Home.jsx';
// import LevelPage from '../../pages/public/LevelPage/LevelPage.jsx';
// import RestaurantDetail from '../../pages/public/RestaurantDetail/RestaurantDetail.jsx';
// import Login from '../../pages/public/Auth/Login.jsx';
// import SignUp from '../../pages/public/Auth/SignUp.jsx';
// import CategoryPage from '../../pages/public/CategoryPage/CategoryPage.jsx';
// import TypePage from '../../pages/public/TypePage/TypePage.jsx';
// import Articles from "../../pages/public/Articles/Articles.jsx";
// import ArticleDetail from "../../pages/public/ArticleDetail/ArticleDetail.jsx";
// import Hechsheirim from "../../pages/public/Hechsheirim/Hechsheirim.jsx";
// import Rabanim from "../../pages/public/Rabanim/Rabanim.jsx";
// import AboutUs from "../../pages/public/AboutUs/AboutUs.jsx";
// // admin pages
// import Dashboard from '../../pages/admin/Dashboard/Dashboard.jsx';
// import AdminRestaurants from '../../pages/admin/Restaurants/AdminRestaurants.jsx';
// import RestaurantForm from '../../pages/admin/Restaurants/RestaurantForm.jsx';
// import AdminArticles from "../../pages/admin/AdminArticles/AdminArticles.jsx";
// import AdminRabanim from "../../pages/admin/AdminRabanim/AdminRabanim.jsx";
// import AdminHechsheirim from "../../pages/admin/AdminHechsheirim/AdminHechsheirim.jsx";
// import AdminUsers from '../../pages/admin/AdimUsers/AdminUsers.jsx';




// export const router = createBrowserRouter([
//   {
//     element: <PublicLayout />,
//     children: [
//       { index: true, element: <Home /> },
//       { path: 'login', element: <Login /> },
//       { path: 'signup', element: <SignUp /> },
//       { path: '/home', element: <Home /> },
//       { path: '/browse', element: <CategoryPage /> },
//       { path: '/browse/:category', element: <TypePage /> },
//       { path: '/browse/:category/:type', element: <LevelPage /> },
//       { path: '/browse/:category/:type/:level', element: <LevelPage /> },
//       { path: '/restaurant/:id', element: <RestaurantDetail /> },
//       { path: '/about', element: <AboutUs /> },
      
//       // 👇 new public pages
//       { path: '/articles', element: <Articles /> },
//       { path: '/articles/:id', element: <ArticleDetail /> },
//       { path: '/hechsheirim', element: <Hechsheirim /> },
//       { path: '/rabanim', element: <Rabanim /> },
//       { path: '/admin/articles', element: <AdminArticles /> },
//       { path: '/admin/rabanim', element: <AdminRabanim /> },
//       { path: '/admin/hechsheirim', element: <AdminHechsheirim /> }
//     ],
//   },
//   {
//     element: (
//       <ProtectedRoute role="admin">
//         <AdminLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       { path: '/admin', element: <Dashboard /> },
//       { path: '/admin/restaurants', element: <AdminRestaurants /> },
//       { path: '/admin/restaurants/new', element: <RestaurantForm /> },
//       { path: '/admin/restaurants/:id', element: <RestaurantForm /> },
//       { path: '/admin/users', element: <AdminUsers /> },
//     ],
//   },
// ]);
// src/router/index.jsx
import React from 'react';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';

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
import Articles from '../../pages/public/Articles/Articles.jsx';
import ArticleDetail from '../../pages/public/ArticleDetail/ArticleDetail.jsx';
import Hechsheirim from '../../pages/public/Hechsheirim/Hechsheirim.jsx';
import Rabanim from '../../pages/public/Rabanim/Rabanim.jsx';
import AboutUs from '../../pages/public/AboutUs/AboutUs.jsx';
import Contact from '../../pages/public/Contact/Contact.jsx';

// admin pages
import Dashboard from '../../pages/admin/Dashboard/Dashboard.jsx';
import AdminHomePage from '../../pages/admin/AdminHome/AdminHome.jsx';
import AdminSlideshow from '../../pages/admin/SlideShow/AdminSlideshow.jsx';
import AdminRestaurants from '../../pages/admin/Restaurants/AdminRestaurants.jsx';
import RestaurantForm from '../../pages/admin/Restaurants/RestaurantForm.jsx';
import AdminArticles from '../../pages/admin/AdminArticles/AdminArticles.jsx';
import AdminArticlesForm from '../../pages/admin/AdminArticles/Form.jsx';
import AdminRabanim from '../../pages/admin/AdminRabanim/AdminRabanim.jsx';
import AdminRabanimForm from '../../pages/admin/AdminRabanim/Form.jsx';
import AdminHechsheirim from '../../pages/admin/AdminHechsheirim/AdminHechsheirim.jsx';
import AdminHechsheirimForm from '../../pages/admin/AdminHechsheirim/Form.jsx';
import AdminUsers from '../../pages/admin/AdimUsers/AdminUsers.jsx';

// NEW — admin feedback pages (create these if you don’t have them yet)
import AdminFeedbackList from '../../pages/admin/AdminFeedback/List.jsx';
//import AdminFeedbackDetail from '../../pages/admin/AdminFeedback/AdminFeedbackDetail.jsx';

// NEW — scroll helper
//import ScrollToAnchor from './components/ScrollToAnchor.jsx';

// Wrap layouts so ScrollToAnchor runs at the router level
function PublicRoot() {
  return (
    <>
    {/* <ScrollToAnchor offset={-96} /> */}
      <PublicLayout />
    </>
  );
}
function AdminRoot() {
  return (
    <>
      {/* <ScrollToAnchor offset={-96} /> */}
      <ProtectedRoute role="admin">
        <AdminLayout />
      </ProtectedRoute>
    </>
  );
}

// NEW — /contact route that lands on Home and jumps to #contact, keeping the query string
function ContactRoute() {
  const location = useLocation();
  return (
    <Navigate
      replace
      to={{ pathname: '/', hash: '#contact', search: location.search }}
    />
  );
}

// NEW — /about route that lands on Home and jumps to #about, keeping the query string
function AboutRoute() {
  const location = useLocation();
  return (
    <Navigate
      replace
      to={{ pathname: '/', hash: '#about', search: location.search }}
    />
  );
}

export const router = createBrowserRouter([
  {
    element: <PublicRoot />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
      { path: '/home', element: <Home /> },

      // browsing
      { path: '/browse', element: <CategoryPage /> },
      { path: '/browse/:category', element: <TypePage /> },
      { path: '/browse/:category/:type', element: <LevelPage /> },
      { path: '/browse/:category/:type/:level', element: <LevelPage /> },

      // restaurant
      { path: '/restaurant/:id', element: <RestaurantDetail /> },

      // about + contact - redirect to home page with hash
      { path: '/about', element: <AboutRoute /> },
      { path: '/contact', element: <ContactRoute /> },         // ← this makes /contact?restaurantId=30 work

      // public content
      { path: '/articles', element: <Articles /> },
      { path: '/articles/:id', element: <ArticleDetail /> },
      { path: '/hechsheirim', element: <Hechsheirim /> },
      { path: '/rabanim', element: <Rabanim /> },

      // (optional) 404 under public
      { path: '*', element: <Navigate to='/' replace /> },
    ],
  },
  {
    element: <AdminRoot />,
    children: [
      { path: '/admin', element: <Dashboard /> },
      { path: '/admin/restaurants', element: <AdminRestaurants /> },
      { path: '/admin/restaurants/new', element: <RestaurantForm /> },
      { path: '/admin/restaurants/:id', element: <RestaurantForm /> },
      { path: '/admin/users', element: <AdminUsers /> },

      // NEW — admin feedback routes
      { path: '/admin/feedback', element: <AdminFeedbackList /> },
      { path: '/admin/home', element: <AdminHomePage /> },
      { path: '/admin/slideshow', element: <AdminSlideshow /> },
      //{ path: '/admin/feedback/:id', element: <AdminFeedbackDetail /> },

      // existing admin content routes
      { path: '/admin/articles', element: <AdminArticles /> },
      { path: '/admin/articles/:id', element: <AdminArticlesForm /> },
      { path: '/admin/rabanim', element: <AdminRabanim /> },
      { path: '/admin/rabanim/:id', element: <AdminRabanimForm /> },
      { path: '/admin/hechsheirim', element: <AdminHechsheirim /> },
      { path: '/admin/hechsheirim/:id', element: <AdminHechsheirimForm /> },
    ],
  },
]);

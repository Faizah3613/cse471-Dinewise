

import React, { useEffect } from 'react';  // Correct import for useEffect
import { Routes, Route, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Login from './pages/Login';
import Register from './pages/Register';

import TableDashboard from "./pages/TableDashboard";
import NewTable from "./pages/NewTable";
import EditTable from "./pages/EditTable";

import OrderDashboard from "./pages/OrderDashboard";
import NewOrder from "./pages/NewOrder";
import EditOrder from "./pages/EditOrder";
import Homepage from "./pages/Homepage";
import MergeSplitTables from "./pages/MergeSplitTables";
import MenuPage from './pages/MenuPage';

import DishPopularityPage from './pages/DishPopularityPage';
import Inventory from './pages/InventoryPage';

import AIRecommendationHub from './pages/AIRecommendationHub';
import RecommendationResults from './pages/RecommendationResults';

import SaladBuilder from './pages/SaladBuilder';
import SentimentAnalysis from './pages/SentimentAnalysis';
import ReviewDashboard from './pages/ReviewDashboard';



const App = () => {
  const navigate = useNavigate();


  const isLoggedIn = localStorage.getItem('token') !== null;

  // UseEffect to handle redirect before rendering routes
  useEffect(() => {
    const path = window.location.pathname;
    if (!isLoggedIn && path !== '/register') {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);  // Trigger redirection when isLoggedIn changes

  return (
    <div data-theme="autumn" className="bg-rose-50">
      <Routes>
        {/* Login and Register Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Homepage (conditionally shown depending on login state) */}
        <Route path="/" element={isLoggedIn ? <Homepage /> : <Login />} />

        {/* Protected Routes */}
        <Route path="/tables" element={isLoggedIn ? <TableDashboard /> : <Login />} />
        <Route path="/tables/new" element={isLoggedIn ? <NewTable /> : <Login />} />
        <Route path="/tables/edit/:id" element={isLoggedIn ? <EditTable /> : <Login />} />

        <Route path="/orders" element={isLoggedIn ? <OrderDashboard /> : <Login />} />
        <Route path="/orders/new" element={isLoggedIn ? <NewOrder /> : <Login />} />
        <Route path="/orders/edit/:id" element={isLoggedIn ? <EditOrder /> : <Login />} />
        
        <Route path="/merge-split-tables" element={isLoggedIn ? <MergeSplitTables /> : <Login />} />
        <Route path="/menu" element={isLoggedIn ? <MenuPage /> : <Login />} />
        <Route path="/dish-popularity" element={isLoggedIn ? <DishPopularityPage /> : <Login />} />
        <Route path="/inventory" element={isLoggedIn ? <Inventory /> : <Login />} />

        <Route path="/ai-recommendations" element={isLoggedIn ? <AIRecommendationHub /> : <Login />} />
        <Route path="/ai-recommendations/results" element={isLoggedIn ? <RecommendationResults /> : <Login />} /> 

        <Route path="/salad-builder" element={isLoggedIn ? <SaladBuilder /> : <Login />} />
        <Route path="/sentiment-analysis" element={isLoggedIn ? <SentimentAnalysis /> : <Login />} />
        <Route path="/reviews" element={isLoggedIn ? <ReviewDashboard /> : <Login />} />
      </Routes>
    </div>
  );
};

export default App;

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './store/store';
import { validateToken } from './store/slices/authSlice';
import Login from './components/common/Login';
import Layout from './components/layout/Layout';
import Dashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard';
import Shops from './components/pages/Shops';
import Employees from './components/pages/Employees';
import Products from './components/pages/Products';
import ProductCreate from './components/pages/ProductCreate';
import Users from './components/pages/Users';
import ProtectedRoute from './components/ProtectedRoute';
import 'react-toastify/dist/ReactToastify.css';

// Component to handle token validation on app load
const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Validate token on app load
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(validateToken());
    }
  }, [dispatch]);

  return (
    <div className="App">
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<UserDashboard />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes with Layout */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/shops" 
          element={
            <ProtectedRoute>
              <Layout>
                <Shops />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/employees" 
          element={
            <ProtectedRoute>
              <Layout>
                <Employees />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <Layout>
                <Products />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/products/new" 
          element={
            <ProtectedRoute>
              <Layout>
                <ProductCreate />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <Layout>
                <Users />
              </Layout>
            </ProtectedRoute>
          } 
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;

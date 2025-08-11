import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar'
import HeroCarousel from './Components/HeroCarousel'
import AnimatedHeader from './Components/AnimatedHeader'
import Collaborators from './Components/Collaborators'
import TestimonialsCarousel from './Components/TestimonialsCarousel'
import CustomerStoriesMasterFixed from './Components/CustomerStoriesMasterFixed'
import Stats from './Components/Stats'
import Footer from './Components/Footer/Footer'
import Login from './Components/Auth/Login'
import Signup from './Components/Auth/Signup'
import AdminLogin from './Components/Auth/AdminLogin'
import { AuthProvider, useAuth } from './Components/Auth/AuthContext'
import AdminDashboard from './Components/Admin/AdminDashboard'

// Protected route component
const ProtectedRoute = ({ children, isLoggedIn, userType, requiredUserType }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Home page component
const HomePage = () => {
  return (
    <>
      <HeroCarousel />
      <AnimatedHeader />
      <Stats/>
      <Collaborators />
      <CustomerStoriesMasterFixed />
      <TestimonialsCarousel />
    </>
  );
};

function MainApp() {
  const { isLoggedIn, userType, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Auth routes with no navbar or footer */}
          <Route 
            path="/login" 
            element={<Login />} 
          />
          <Route 
            path="/signup" 
            element={<Signup />} 
          />
          <Route 
            path="/admin/login" 
            element={<AdminLogin />} 
          />
          
          {/* Regular routes with navbar and footer */}
          <Route 
            path="/" 
            element={
              <>
                <Navbar 
                  isLoggedIn={isLoggedIn} 
                  userType={userType} 
                  onLogout={handleLogout}
                />
                <HomePage />
                <Footer />
              </>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} userType={userType} requiredUserType="admin">
                <Navbar 
                  isLoggedIn={isLoggedIn} 
                  userType={userType} 
                  onLogout={handleLogout}
                />
                <AdminDashboard />
                <Footer />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}

export default App

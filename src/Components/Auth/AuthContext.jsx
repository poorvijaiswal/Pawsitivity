import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    userType: null,
    user: null,
    loading: true
  });

  useEffect(() => {
    // Check if user info exists in localStorage on initial load
    const checkAuth = () => {
      const storedUser = localStorage.getItem('pawsitivity_user');
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.isAuthenticated) {
            setAuthState({
              isLoggedIn: true,
              userType: parsedUser.userType,
              user: parsedUser,
              loading: false
            });
            return;
          }
        } catch (error) {
          console.error('Error parsing user data', error);
        }
      }
      
      setAuthState(prev => ({
        ...prev,
        loading: false
      }));
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = (userData) => {
    localStorage.setItem('pawsitivity_user', JSON.stringify({
      ...userData,
      isAuthenticated: true
    }));
    
    setAuthState({
      isLoggedIn: true,
      userType: userData.userType,
      user: userData,
      loading: false
    });
  };

  // Signup function
  const signup = (userData) => {
    localStorage.setItem('pawsitivity_user', JSON.stringify({
      ...userData,
      isAuthenticated: true
    }));
    
    setAuthState({
      isLoggedIn: true,
      userType: userData.userType,
      user: userData,
      loading: false
    });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('pawsitivity_user');
    
    setAuthState({
      isLoggedIn: false,
      userType: null,
      user: null,
      loading: false
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        ...authState, 
        login, 
        signup, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

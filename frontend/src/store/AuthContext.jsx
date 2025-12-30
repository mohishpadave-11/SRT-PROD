import { createContext, useContext, useState, useEffect } from 'react';
import { isTokenExpired, validateTokenAndGetUser } from '../utils/tokenUtils.js';
import { setGlobalLogout, clearGlobalLogout } from '../utils/auth.js';
import Spinner from '../components/Spinner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check for token on initial load with validation
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      // Validate token before setting state
      if (!isTokenExpired(storedToken)) {
        const tokenUser = validateTokenAndGetUser(storedToken);
        if (tokenUser) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } else {
          // Token invalid, clean up
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } else {
        // Token expired, clean up
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // 2. Login Action with token validation
  const login = (userData, authToken) => {
    // Validate token before setting
    if (isTokenExpired(authToken)) {
      console.error('Attempted to login with expired token');
      console.error('Token expiration check failed for token:', authToken?.substring(0, 20) + '...');
      return false;
    }
    
    console.log('Login successful, token validated');
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    return true;
  };

  // 3. Logout Action
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login'; 
  };

  // 4. Register global logout function
  useEffect(() => {
    setGlobalLogout(logout);
    
    // Cleanup on unmount
    return () => {
      clearGlobalLogout();
    };
  }, []);

  // 5. Periodic token validation
  useEffect(() => {
    if (!token) return;

    const validateToken = () => {
      if (isTokenExpired(token)) {
        console.info('Token expired during session, logging out');
        logout();
      }
    };

    // Check token every 5 minutes
    const interval = setInterval(validateToken, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => {
  return useContext(AuthContext);
};

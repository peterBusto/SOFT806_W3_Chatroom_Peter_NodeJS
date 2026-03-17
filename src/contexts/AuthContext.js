import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: true, 
        user: action.payload.user,
        token: action.payload.token,
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: false, 
        user: null, 
        token: null,
        error: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null, 
        token: null,
        error: null 
      };
    case 'REGISTER_START':
      return { ...state, loading: true, error: null };
    case 'REGISTER_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        error: null,
        registrationSuccess: true 
      };
    case 'REGISTER_FAILURE':
      return { 
        ...state, 
        loading: false, 
        error: action.payload,
        registrationSuccess: false 
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('authToken'),
  loading: false, // Avoid blocking on mount
  error: null,
  registrationSuccess: false,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount, if a token exists, consider the user authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Auth init: token exists?', !!token);
    if (token) {
      // Optimistically restore session without a profile call
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, user: null } // user can be fetched later if needed
      });
    } else {
      console.log('Auth init: no token found');
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem('authToken', state.token);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [state.token]);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { token, user } 
      });
      return { success: true };
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error.response?.data?.message || 'Login failed' 
      });
      return { success: false, error: error.response?.data };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      await authAPI.register(userData);
      dispatch({ type: 'REGISTER_SUCCESS' });
      return { success: true };
    } catch (error) {
      dispatch({ 
        type: 'REGISTER_FAILURE', 
        payload: error.response?.data?.message || 'Registration failed' 
      });
      return { success: false, error: error.response?.data };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

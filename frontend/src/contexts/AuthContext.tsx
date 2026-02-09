import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../lib/apiClient';

interface User {
  id: string;
  email: string;
  display_name?: string;
  username?: string;
  nickname?: string;
  avatar_url?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const response = await apiClient.getMe(authToken);
      setUser(response.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // Token might be invalid, clear it
      localStorage.removeItem('auth_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

const signUp = async (email: string, password: string, displayName?: string) => {
  try {
    const response = await apiClient.signup(email, password, displayName) as any;
    const { token: newToken, user: newUser } = response;
    
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('auth_token', newToken);
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw error;
  }
};

  const signIn = async (email: string, password: string) => {
    try {
      const response: any = await apiClient.login(email, password) as any;
      const { token: newToken, user: newUser } = response;
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('auth_token', newToken);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (token) {
        await apiClient.logout(token);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
    }
  };

  const refreshUser = async () => {
    if (token) {
      await fetchUser(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signUp,
        signIn,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

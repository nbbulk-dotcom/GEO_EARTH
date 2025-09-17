import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  user_id: string;
  authenticated: boolean;
  permissions: string[];
  system: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authenticate: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const authenticate = async () => {
    try {
      setLoading(true);
      
      const defaultUser: User = {
        user_id: 'default_user',
        authenticated: true,
        permissions: ['earthquake_prediction', 'data_access'],
        system: 'BRETT-v4.0'
      };
      
      setUser(defaultUser);
    } catch (error) {
      console.error('Authentication failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    authenticate();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user?.authenticated,
    authenticate,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

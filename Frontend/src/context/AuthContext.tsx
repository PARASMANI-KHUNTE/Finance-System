import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'admin' | 'analyst' | 'viewer';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(() => {
    const saved = localStorage.getItem('user-role');
    return (saved as Role) || 'admin';
  });

  useEffect(() => {
    localStorage.setItem('user-role', role);
  }, [role]);

  return (
    <AuthContext.Provider value={{ role, setRole }}>
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

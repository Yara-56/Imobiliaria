import { createContext, useEffect, useState, useCallback, useMemo } from "react";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Memoizando o logout para evitar re-renderizações desnecessárias
  const logout = useCallback(() => {
    localStorage.removeItem("@Imobiliaria:user");
    localStorage.removeItem("@Imobiliaria:token");
    setUser(null);
  }, []);

  useEffect(() => {
    function loadStorageData() {
      const storedUser = localStorage.getItem("@Imobiliaria:user");
      const storedToken = localStorage.getItem("@Imobiliaria:token");

      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser));
          // Aqui você configuraria o header do seu API (axios) com o token
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    }

    loadStorageData();
  }, [logout]);

  const login = useCallback((userData, token) => {
    // No SaaS, o userData deve vir com tenant_id (ex: id da imobiliária da sua avó)
    localStorage.setItem("@Imobiliaria:user", JSON.stringify(userData));
    localStorage.setItem("@Imobiliaria:token", token);
    setUser(userData);
  }, []);

  const hasRole = useCallback((roles) => {
    if (!user) return false;
    const userRole = user.role?.toLowerCase();
    
    if (Array.isArray(roles)) {
      return roles.map(r => r.toLowerCase()).includes(userRole);
    }
    return userRole === roles.toLowerCase();
  }, [user]);

  // useMemo para performance: só muda se o usuário ou loading mudar
  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    tenantId: user?.tenant_id, // Essencial para o Multi-tenant
    login,
    logout,
    hasRole
  }), [user, loading, login, logout, hasRole]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
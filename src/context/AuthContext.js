import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setLoading(false);
          return;
        }
  
        console.log('Fazendo requisição para /me com token:', token);
        
        // Substituição do Axios pelo Fetch
        fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        .then(async response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Resposta da rota /me:', data);
          setUser(data);
        })
        .catch(error => {
          console.error('Erro na requisição /me:', error);
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        localStorage.removeItem('token');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    
    // Decodifica o token imediatamente para UI
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      logout();
      return;
    }
  
    // Verificação com o backend
    fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Falha na verificação');
      return response.json();
    })
    .then(userData => {
      setUser(userData);
      // Redireciona após login bem-sucedido
      window.location.href = '/'; // Ou a rota desejada
    })
    .catch(error => {
      console.error('Erro ao verificar token:', error);
      logout();
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
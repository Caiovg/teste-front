import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    // Método 1: Token na URL (recomendado)
    const token = searchParams.get('token');
    if (token) {
      login(token);
      window.location.href = '/'; // Redireciona para a página inicial
      return;
    }

    // Método 2: postMessage (alternativo)
    const handleMessage = (event) => {
      if (event.origin !== process.env.REACT_APP_FRONTEND_URL) return;
      
      if (event.data.token) {
        login(event.data.token);
        window.close();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [searchParams, login]);

  return <div>Processando login...</div>;
};

export default AuthCallback;
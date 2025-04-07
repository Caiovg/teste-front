import React from 'react';
import { useAuth } from '../context/AuthContext';
import MatchEditor from '../components/editor/MatchEditor';

const Dashboard = () => {
  const { user, logout } = useAuth();

  // Extrai o primeiro usuário do objeto data (se existir)
  const userData = user?.data?.["0"] || {};

  const handleSave = (htmlContent) => {
    console.log('Conteúdo salvo:', htmlContent);
    // Aqui você pode adicionar a lógica para salvar no backend
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bem-vindo, {userData.name || 'Usuário'}!</h1>
      <button onClick={logout}>Sair</button>

      <div style={{ marginTop: '40px' }}>
        <MatchEditor onSave={handleSave} />
      </div>
    </div>
  );
};

export default Dashboard;
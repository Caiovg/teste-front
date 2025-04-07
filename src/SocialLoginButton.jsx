import React from 'react';

const SocialLoginButton = ({ provider, icon, onClick }) => {
  return (
    <button 
      onClick={() => onClick(provider)}
      style={{
        padding: '10px 20px',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer'
      }}
    >
      <img src={icon} alt={provider} width="20" />
      <span>Login with {provider}</span>
    </button>
  );
};

export default SocialLoginButton;
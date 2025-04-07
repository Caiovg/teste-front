import React from 'react';
import SocialLoginButton from './SocialLoginButton';
import GoogleIcon from './icons/google.svg';
import FacebookIcon from './icons/facebook.svg';
import GitHubIcon from './icons/github.svg';

const LoginPage = () => {
  const handleSocialLogin = (provider) => {
    // Abre uma nova janela para o login
    window.open(
      `http://seuservidor.com/api/auth/${provider}`,
      'authWindow',
      'width=500,height=600'
    );

    // Escuta mensagem de retorno
    window.addEventListener('message', (event) => {
      if (event.data.token) {
        localStorage.setItem('token', event.data.token);
        window.location.href = '/dashboard';
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <SocialLoginButton 
        provider="google" 
        icon={GoogleIcon}
        onClick={handleSocialLogin}
      />
      <SocialLoginButton 
        provider="facebook" 
        icon={FacebookIcon}
        onClick={handleSocialLogin}
      />
      <SocialLoginButton 
        provider="github" 
        icon={GitHubIcon}
        onClick={handleSocialLogin}
      />
    </div>
  );
};

export default LoginPage;
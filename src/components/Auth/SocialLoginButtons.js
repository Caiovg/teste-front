import React from 'react';

const SocialLoginButtons = () => {
  const handleLogin = (provider) => {
    // Open the auth window
    const authWindow = window.open(
      `${process.env.REACT_APP_API_URL}/api/auth/${provider}`,
      'authWindow',
      'width=500,height=600'
    );

    // Message handler for successful authentication
    const messageHandler = (event) => {
      // Check origin for security - make sure this matches your backend URL
      if (event.origin !== process.env.REACT_APP_API_URL) return;
      
      if (event.data.token) {
        // Store the token
        localStorage.setItem('token', event.data.token);
        window.location.href = '/';
      }
    };

    window.addEventListener('message', messageHandler);

    // Cleanup - use a different approach than checking window.closed
    const cleanup = () => {
      window.removeEventListener('message', messageHandler);
    };

    // Fallback timeout for cleanup
    const cleanupTimeout = setTimeout(cleanup, 5 * 60 * 1000); // 5 minutes

    // Alternative way to detect when auth is done
    window.authComplete = () => {
      clearTimeout(cleanupTimeout);
      cleanup();
    };
  };

  return (
    <div className="social-login-buttons">
      <button onClick={() => handleLogin('google')}>
        Login com Google
      </button>
    </div>
  );
};

export default SocialLoginButtons;
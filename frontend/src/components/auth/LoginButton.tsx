import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect()}
      className="login-button"
      style={{
        padding: '12px 24px',
        backgroundColor: '#635BFF',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4F46E5')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#635BFF')}
    >
      Se connecter
    </button>
  );
};

export default LoginButton;

import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // Redirect to dashboard after successful login
    navigate('/dashboard');
  };

  const goToRegister = () => {
    navigate('/auth/register');
  };

  const goToForgotPassword = () => {
    navigate('/auth/forgot-password');
  };

  return (
    <div>
      {/* Login form... */}
      <button onClick={goToRegister} className="text-blue-600 hover:underline">
        Don't have an account? Register
      </button>
      <button onClick={goToForgotPassword} className="text-gray-600 hover:underline">
        Forgot password?
      </button>
    </div>
  );
}
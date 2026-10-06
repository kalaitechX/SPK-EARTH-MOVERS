import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { AuthInput, PasswordInput } from '../../components/auth/AuthInputs';
import LoginButton from '../../components/auth/LoginButton';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const FarmerLogin = () => {
  const navigate = useNavigate();

  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const mobile = formData.get('mobile') as string;
    const password = formData.get('password') as string;

    setError('');
    try {
      const res = await api.post('/auth/farmer/login', { mobile, password }, false);
      if (res.success) {
        login(res.user, res.token);
        navigate('/farmer/dashboard');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    }
  };

  return (
    <AuthLayout 
      title="Farmer Login" 
      subtitle="Login to book and manage your vehicle requests."
    >
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}
        <AuthInput 
          label="Mobile Number" 
          name="mobile"
          type="tel" 
          placeholder="Enter mobile number" 
          required 
        />
        <PasswordInput 
          label="Password" 
          name="password"
          placeholder="Enter password" 
          required 
        />
        
        <div className="flex items-center justify-between pb-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-sm font-medium text-primary hover:text-primary-hover">
            Forgot Password?
          </a>
        </div>
        
        <LoginButton type="submit">Login</LoginButton>
        
        <div className="pt-4 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/farmer/register" className="font-semibold text-primary hover:underline">
              Create Farmer Account
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default FarmerLogin;

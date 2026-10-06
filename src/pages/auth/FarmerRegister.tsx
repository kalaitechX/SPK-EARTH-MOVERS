import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { AuthInput, PasswordInput } from '../../components/auth/AuthInputs';
import LoginButton from '../../components/auth/LoginButton';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const FarmerRegister = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const mobile = formData.get('mobile') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirm = formData.get('confirmPassword') as string;

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    
    setError('');
    
    try {
      const res = await api.post('/auth/farmer/register', { name, mobile, email, password }, false);
      if (res.success) {
        login(res.user, res.token);
        navigate('/farmer/dashboard');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    }
  };

  return (
    <AuthLayout 
      title="Create Farmer Account" 
      subtitle="Join SPK Earth Movers to book vehicles."
      showBack={false}
    >
      <form onSubmit={handleRegister} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}
        <AuthInput label="Full Name" name="name" type="text" placeholder="Enter full name" required />
        <AuthInput label="Mobile Number" name="mobile" type="tel" placeholder="Enter mobile number" required />
        <AuthInput label="Email (optional)" name="email" type="email" placeholder="Enter email address" />
        <AuthInput label="Village / Location" name="location" type="text" placeholder="Enter your village or location" required />
        <PasswordInput label="Password" name="password" placeholder="Create a password" required />
        <PasswordInput label="Confirm Password" name="confirmPassword" placeholder="Confirm your password" required />
        
        <div className="pt-2">
          <LoginButton type="submit">Create Account</LoginButton>
        </div>
        
        <div className="pt-2 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/farmer/login" className="font-semibold text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default FarmerRegister;

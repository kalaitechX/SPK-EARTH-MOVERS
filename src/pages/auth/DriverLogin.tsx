import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { AuthInput, PasswordInput } from '../../components/auth/AuthInputs';
import LoginButton from '../../components/auth/LoginButton';
import { Info, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const DriverLogin = () => {
  const navigate = useNavigate();
  const [driverId, setDriverId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/driver/login', { mobile: driverId, password }, false);
      if (res.success) {
        login(res.user, res.token);
        navigate('/driver/dashboard');
      } else {
        setError(res.message || 'Invalid Driver ID/Mobile or password');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    }
  };

  return (
    <AuthLayout 
      title="Driver Login" 
      subtitle="Access your assigned work and vehicle details."
    >
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center space-x-2 text-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <AuthInput 
          label="Driver ID" 
          type="text" 
          placeholder="e.g. D001" 
          value={driverId}
          onChange={(e: any) => setDriverId(e.target.value)}
          required 
        />
        <PasswordInput 
          label="Password" 
          placeholder="Enter password" 
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          required 
        />
        
        <div className="flex justify-end pb-2">
          <a href="#" className="text-sm font-medium text-primary hover:text-primary-hover">
            Forgot Password?
          </a>
        </div>
        
        <LoginButton type="submit">Login</LoginButton>
        
        <div className="pt-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex flex-col space-y-2 text-blue-800">
            <div className="flex items-start space-x-3">
              <Info size={20} className="flex-shrink-0 mt-0.5 text-blue-600" />
              <p className="text-sm">
                Driver accounts are created by SPK Earth Movers management.
              </p>
            </div>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default DriverLogin;

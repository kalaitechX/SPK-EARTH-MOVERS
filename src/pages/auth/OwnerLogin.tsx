import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { AuthInput, PasswordInput } from '../../components/auth/AuthInputs';
import LoginButton from '../../components/auth/LoginButton';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const OwnerLogin = () => {
  const navigate = useNavigate();
  const [ownerId, setOwnerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await api.post('/auth/owner/login', { mobile: ownerId, password }, false);
      if (res.success) {
        login(res.user, res.token);
        navigate('/owner/dashboard');
      } else {
        setError(res.message || 'Invalid Owner ID or Password.');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    }
  };

  return (
    <AuthLayout 
      title="Owner Login" 
      subtitle="Secure access to your business dashboard."
    >
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold flex items-center space-x-2 border border-red-200">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        
        <AuthInput 
          label="Owner ID / Mobile Number" 
          type="text" 
          placeholder="Enter ID or mobile number" 
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
          required 
        />
        <PasswordInput 
          label="Password" 
          placeholder="Enter password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        
        <div className="flex justify-end pb-2">
          <a href="#" className="text-sm font-medium text-primary hover:text-primary-hover">
            Forgot Password?
          </a>
        </div>
        
        <LoginButton type="submit">Secure Login</LoginButton>
        
        <div className="pt-6">
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex items-start space-x-3 text-orange-800">
            <ShieldCheck size={20} className="flex-shrink-0 mt-0.5 text-orange-600" />
            <p className="text-sm">
              Owner access is restricted to authorized SPK Earth Movers management.
            </p>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default OwnerLogin;

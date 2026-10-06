import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();
  const returnPath = user ? `/${user.role}/dashboard` : '/role-selection';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl text-center border-t-4 border-red-500">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-8 font-medium">
          You do not have permission to view this page. Please return to your designated dashboard.
        </p>
        <Link 
          to={returnPath}
          className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-xl transition-all block w-full"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Edit3, LogOut, Mail } from 'lucide-react';
import { PushNotificationSettings } from '../../../components/notifications/PushNotificationSettings';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';

const FarmerProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedPhone, setEditedPhone] = useState(user?.mobile || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');
  const [editedAddress, setEditedAddress] = useState(user?.address || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedName(user.name);
      setEditedPhone(user.mobile);
      setEditedEmail(user.email || '');
      setEditedAddress(user.address || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', {
        name: editedName,
        mobile: editedPhone,
        email: editedEmail,
        address: editedAddress
      });
      if (res.success) {
        updateUser(res.user);
        setIsEditing(false);
      } else {
        alert('Failed to update profile: ' + res.message);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/farmer/login');
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in-up pb-20 md:pb-0">
      <h2 className="text-2xl font-black text-gray-900 mb-6">My Profile</h2>
      
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl font-black shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 font-medium">Farmer Account</p>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
              <input 
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
              <input 
                type="tel"
                value={editedPhone}
                onChange={(e) => setEditedPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <input 
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Saved Address / Location</label>
              <textarea 
                value={editedAddress}
                onChange={(e) => setEditedAddress(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
              ></textarea>
            </div>
            <div className="flex space-x-3 pt-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover shadow-md transition-colors disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3 text-gray-700">
              <User size={20} className="text-gray-400 shrink-0" />
              <div className="flex-1 border-b border-gray-100 pb-2">
                <p className="text-xs font-bold text-gray-400 uppercase">Name</p>
                <p className="font-semibold">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Phone size={20} className="text-gray-400 shrink-0" />
              <div className="flex-1 border-b border-gray-100 pb-2">
                <p className="text-xs font-bold text-gray-400 uppercase">Mobile Number</p>
                <p className="font-semibold">+91 {user.mobile}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Mail size={20} className="text-gray-400 shrink-0" />
              <div className="flex-1 border-b border-gray-100 pb-2">
                <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                <p className="font-semibold">{user.email || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 text-gray-700">
              <MapPin size={20} className="text-gray-400 shrink-0 mt-1" />
              <div className="flex-1 pb-2">
                <p className="text-xs font-bold text-gray-400 uppercase">Saved Address</p>
                <p className="font-semibold whitespace-pre-line">{user.address || 'No address saved'}</p>
              </div>
            </div>
          </div>
        )}

        {!isEditing && (
          <div className="space-y-3">
            <button 
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-50 text-blue-700 py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-100 transition-colors"
            >
              <Edit3 size={20} />
              <span>Edit Profile</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full bg-red-50 text-red-600 py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-red-100 transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>

      <PushNotificationSettings />
    </div>
  );
};

export default FarmerProfile;

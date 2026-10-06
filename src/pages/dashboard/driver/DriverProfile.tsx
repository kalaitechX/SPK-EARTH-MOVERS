import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Edit3, LogOut, CheckCircle, Shield } from 'lucide-react';
import { PushNotificationSettings } from '../../../components/notifications/PushNotificationSettings';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';

const DriverProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedPhone, setEditedPhone] = useState(user?.mobile || '');
  const [locationEnabled, setLocationEnabled] = useState(user?.locationSharingEnabled || false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedName(user.name);
      setEditedPhone(user.mobile);
      setLocationEnabled(user.locationSharingEnabled || false);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', {
        name: editedName,
        mobile: editedPhone,
        locationSharingEnabled: locationEnabled
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

  const handleToggleLocation = async () => {
    const newVal = !locationEnabled;
    setLocationEnabled(newVal);
    try {
      const res = await api.put('/auth/profile', {
        locationSharingEnabled: newVal
      });
      if (res.success) {
        updateUser(res.user);
      }
    } catch (err) {
      console.error(err);
      setLocationEnabled(!newVal);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/driver/login');
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in-up pb-20 md:pb-0">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Driver Profile</h1>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl font-black shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 font-medium">{user.id.substring(0,8).toUpperCase()}</p>
          </div>
        </div>

        <div className="space-y-4 bg-gray-50 p-4 rounded-2xl mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Account Status</span>
            <div className="px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 bg-green-100 text-green-700">
              <CheckCircle size={12} />
              <span>Available</span>
            </div>
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
              <Shield size={20} className="text-gray-400 shrink-0" />
              <div className="flex-1 pb-2 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase">Driver ID</p>
                <p className="font-semibold">{user.id}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 pb-2">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${locationEnabled ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                  <Shield size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Location Sharing</p>
                  <p className="text-xs text-gray-500">Share location with owner during jobs</p>
                </div>
              </div>
              <button 
                onClick={handleToggleLocation}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${locationEnabled ? 'bg-primary' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${locationEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        )}

        <PushNotificationSettings />

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
    </div>
  );
};

export default DriverProfile;

import { api } from './api';

export const notificationService = {
  async getNotifications(params: { page?: number; limit?: number; unreadOnly?: boolean } = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.unreadOnly) query.append('unreadOnly', 'true');

    return await api.get(`/notifications?${query.toString()}`);
  },

  async getUnreadCount() {
    return await api.get('/notifications/unread-count');
  },

  async markAsRead(id: string) {
    const token = localStorage.getItem('spk_token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    const response = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  async markAllAsRead() {
    const token = localStorage.getItem('spk_token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  async getVapidPublicKey() {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${API_URL}/push/config`);
    return response.json();
  },

  async subscribePush(subscription: PushSubscription) {
    const token = localStorage.getItem('spk_token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${API_URL}/push/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        subscription,
        deviceInfo: navigator.userAgent
      })
    });
    return response.json();
  },

  async unsubscribePush(endpoint: string) {
    const token = localStorage.getItem('spk_token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${API_URL}/push/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ endpoint })
    });
    return response.json();
  },

  async testPush() {
    const token = localStorage.getItem('spk_token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${API_URL}/push/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
};

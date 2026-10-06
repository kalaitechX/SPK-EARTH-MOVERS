const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  async get(endpoint: string) {
    const token = localStorage.getItem('spk_token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  async post(endpoint: string, data: any, useToken = true) {
    const headers: any = {
      'Content-Type': 'application/json'
    };
    
    if (useToken) {
      const token = localStorage.getItem('spk_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async put(endpoint: string, data: any) {
    const token = localStorage.getItem('spk_token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

import { api } from './api';

export const bookingService = {
  async createBooking(bookingData: any) {
    return await api.post('/bookings', bookingData);
  },

  async getMyBookings() {
    return await api.get('/bookings/my');
  },

  async getBookingById(id: string) {
    return await api.get(`/bookings/${id}`);
  },

  async getOwnerBookings(params: { page?: number; limit?: number; status?: string; vehicleType?: string; date?: string } = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.vehicleType && params.vehicleType !== 'All') query.append('vehicleType', params.vehicleType);
    if (params.date) query.append('date', params.date);

    return await api.get(`/bookings?${query.toString()}`);
  },

  async updateBookingStatus(id: string, statusData: { status: string; rejectionReason?: string; workStartedAt?: string; workCompletedAt?: string; actualWorkHours?: number; driverNotes?: string }) {
    // API is using PATCH method for this route
    const token = localStorage.getItem('spk_token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    const response = await fetch(`${API_URL}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(statusData)
    });
    return response.json();
  },

  async assignBooking(id: string, assignmentData: { vehicleId: string; driverId: string }) {
    return await api.post(`/bookings/${id}/assign`, assignmentData);
  }
};

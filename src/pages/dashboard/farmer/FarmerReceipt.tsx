import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReceiptView from '../../../components/payments/ReceiptView';

const FarmerReceipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const savedPayments = localStorage.getItem('spk_payments');
    if (savedPayments) {
      const allPayments = JSON.parse(savedPayments);
      const foundPayment = allPayments.find((p: any) => p?.paymentId === id);
      
      if (foundPayment) {
        setPayment(foundPayment);
        const savedBookings = localStorage.getItem('spk_bookings');
        if (savedBookings) {
          const allBookings = JSON.parse(savedBookings);
          const foundBooking = allBookings.find((b: any) => b?.bookingId === foundPayment.bookingId);
          setBooking(foundBooking);
        }
      } else {
        navigate('/farmer/payments');
      }
    } else {
      navigate('/farmer/payments');
    }
  }, [id, navigate]);

  if (!payment) return null;

  return (
    <ReceiptView 
      payment={payment} 
      booking={booking} 
      backPath="/farmer/payments" 
    />
  );
};

export default FarmerReceipt;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, CheckCircle, Clock, Eye, AlertCircle, Calendar } from 'lucide-react';

const FarmerPayments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('spk_payments');
    if (saved) {
      const data = JSON.parse(saved);
      // For demo, assume all payments belong to the logged-in farmer
      data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPayments(data);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Amount Confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cash Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="animate-fade-in-up pb-24 max-w-4xl mx-auto">
      
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Payments</h1>
          <p className="text-gray-500 font-medium mt-1">View your billing history and pending payments.</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <IndianRupee size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No payments yet</h2>
          <p className="text-gray-500">Your completed jobs and bills will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.paymentId} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 hover:border-primary/30 transition-colors">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{payment.vehicleName} Work</h3>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase border ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium mb-4">
                  <Calendar size={14} />
                  <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Booking: {payment.bookingId}</span>
                </div>

                {payment.status === 'Pending' && (
                  <div className="bg-gray-50 text-gray-600 p-3 rounded-xl flex items-start space-x-2 text-sm font-medium">
                    <Clock size={16} className="shrink-0 mt-0.5" />
                    <p>Amount will be confirmed by SPK Earth Movers soon.</p>
                  </div>
                )}
                
                {payment.status === 'Cash Pending' && (
                  <div className="bg-orange-50 text-orange-800 p-3 rounded-xl flex items-start space-x-2 text-sm font-medium">
                    <AlertCircle size={16} className="shrink-0 mt-0.5 text-orange-600" />
                    <p>Please make the cash payment to SPK Earth Movers.</p>
                  </div>
                )}
                
                {payment.status === 'Paid' && (
                  <div className="bg-green-50 text-green-800 p-3 rounded-xl flex items-start space-x-2 text-sm font-medium">
                    <CheckCircle size={16} className="shrink-0 mt-0.5 text-green-600" />
                    <p>Payment completed successfully on {new Date(payment.paidAt).toLocaleDateString()}.</p>
                  </div>
                )}
              </div>
              
              <div className="sm:w-48 shrink-0 flex flex-col justify-between">
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col justify-center mb-3 h-full">
                  <p className="text-xs font-bold text-gray-400 uppercase text-center mb-1">Final Amount</p>
                  <p className={`text-2xl font-black text-center ${payment.amount ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                    {payment.amount ? `₹${payment.amount.toLocaleString()}` : 'Pending'}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 text-center mt-1 uppercase">Payment: {payment.paymentMethod}</p>
                </div>
                
                <button 
                  onClick={() => navigate(`/farmer/payments/${payment.paymentId}`)}
                  className="w-full py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Eye size={16} />
                  <span>View Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default FarmerPayments;

import { Printer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.png';

interface ReceiptViewProps {
  payment: any;
  booking: any;
  backPath: string;
}

const ReceiptView = ({ payment, booking, backPath }: ReceiptViewProps) => {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in-up pb-24 md:pb-0 max-w-2xl mx-auto">
      
      {/* Non-printable Header */}
      <div className="print:hidden mb-6 flex items-center justify-between">
        <button 
          onClick={() => navigate(backPath)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-bold bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-primary text-white hover:bg-primary-hover font-bold px-4 py-2 rounded-xl shadow-sm"
        >
          <Printer size={18} />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* Printable Area */}
      <div className="bg-white rounded-none sm:rounded-3xl p-6 sm:p-10 shadow-sm sm:shadow-lg border sm:border-gray-100 print:shadow-none print:border-none print:p-0">
        
        {/* Receipt Header */}
        <div className="flex flex-col items-center text-center mb-10 pb-10 border-b border-gray-200 border-dashed">
          <img src={logoImage} alt="SPK Earth Movers" className="h-16 mb-4 grayscale print:grayscale-0" />
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">SPK Earth Movers</h1>
          <p className="text-gray-500 font-medium">Payment Receipt</p>
          <div className="mt-4 bg-gray-50 px-4 py-2 rounded-lg font-mono text-sm text-gray-600 border border-gray-200">
            {payment.paymentId}
          </div>
        </div>

        {/* Status */}
        {payment.status === 'Paid' && (
          <div className="mb-10 text-center">
            <div className="inline-block border-4 border-green-500 text-green-600 font-black text-2xl uppercase tracking-widest px-6 py-2 rounded-xl transform -rotate-2">
              PAID
            </div>
            <p className="text-gray-500 font-medium mt-3">Payment completed successfully.</p>
          </div>
        )}

        {/* Grid Info */}
        <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm mb-10">
          
          <div>
            <p className="text-gray-400 font-bold uppercase mb-1 text-[10px] tracking-wider">Booking ID</p>
            <p className="font-bold text-gray-900">{payment.bookingId}</p>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase mb-1 text-[10px] tracking-wider">Date</p>
            <p className="font-bold text-gray-900">{new Date(payment.createdAt).toLocaleDateString()}</p>
          </div>
          
          <div className="col-span-2 pt-4 border-t border-gray-100">
            <p className="text-gray-400 font-bold uppercase mb-1 text-[10px] tracking-wider">Farmer Details</p>
            <p className="font-bold text-gray-900 text-base">{payment.farmerName}</p>
            <p className="text-gray-600 font-medium">+91 {booking?.farmerPhone || '9876543210'}</p>
          </div>

          <div className="col-span-2 pt-4 border-t border-gray-100">
            <p className="text-gray-400 font-bold uppercase mb-1 text-[10px] tracking-wider">Work Details</p>
            <p className="font-bold text-gray-900">{booking?.workType || 'Standard Work'}</p>
            <p className="text-gray-600 font-medium">{booking?.address}, {booking?.village}</p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-gray-400 font-bold uppercase mb-1 text-[10px] tracking-wider">Vehicle</p>
            <p className="font-bold text-gray-900">{payment.vehicleName}</p>
            <p className="text-gray-500 text-xs font-mono">{payment.vehicleId}</p>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <p className="text-gray-400 font-bold uppercase mb-1 text-[10px] tracking-wider">Driver</p>
            <p className="font-bold text-gray-900">{payment.driverName}</p>
          </div>
          
          {booking?.actualWorkHours && (
            <div className="col-span-2 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-gray-500 font-bold">Actual Work Hours</span>
              <span className="font-bold text-gray-900 text-lg">{booking.actualWorkHours} Hrs</span>
            </div>
          )}

        </div>

        {/* Amount Table */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100 print:bg-white print:border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 font-bold">Payment Method</span>
            <span className="font-bold text-gray-900 uppercase tracking-wide">{payment.paymentMethod}</span>
          </div>
          {payment.paidAt && (
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-bold">Paid Date & Time</span>
              <span className="font-bold text-gray-900">{new Date(payment.paidAt).toLocaleString()}</span>
            </div>
          )}
          {payment.receivedBy && (
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <span className="text-gray-500 font-bold">Received By</span>
              <span className="font-bold text-gray-900">{payment.receivedBy}</span>
            </div>
          )}
          
          <div className="flex justify-between items-end mt-6">
            <span className="text-gray-900 font-black text-lg">Total Amount</span>
            <span className="text-3xl font-black text-gray-900">
              {payment.amount ? `₹${payment.amount.toLocaleString()}` : 'PENDING'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 font-medium text-sm pt-6 border-t border-gray-100">
          <p>Thank you for choosing SPK Earth Movers.</p>
        </div>

      </div>
    </div>
  );
};

export default ReceiptView;

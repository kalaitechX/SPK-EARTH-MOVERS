import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, IndianRupee, CheckCircle, Clock, XCircle, CreditCard, Filter, Eye } from 'lucide-react';

const OwnerPayments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  // Modals state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  
  const [finalAmount, setFinalAmount] = useState('');
  const [ownerNotes, setOwnerNotes] = useState('');

  // Summary Metrics
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    pendingCash: 0,
    paidJobs: 0,
    unpaidJobs: 0
  });

  const loadData = () => {
    const saved = localStorage.getItem('spk_payments');
    if (saved) {
      const data = JSON.parse(saved);
      // Sort newest first
      data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPayments(data);
      
      // Calculate Summary
      let totalRev = 0;
      let pendCash = 0;
      let paidCount = 0;
      let unpaidCount = 0;

      data.forEach((p: any) => {
        if (!p) return;
        if (p.status === 'Paid') {
          totalRev += p.amount || 0;
          paidCount++;
        } else if (p.status === 'Cash Pending') {
          pendCash += p.amount || 0;
          unpaidCount++;
        } else if (p.status === 'Pending') {
          unpaidCount++;
        }
      });

      setSummary({ totalRevenue: totalRev, pendingCash: pendCash, paidJobs: paidCount, unpaidJobs: unpaidCount });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let result = payments;
    
    // Apply filter
    if (filter !== 'All') {
      result = result.filter(p => p && p.status === filter);
    }
    
    // Apply search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p && (
        p.paymentId?.toLowerCase().includes(q) ||
        p.bookingId?.toLowerCase().includes(q) ||
        p.farmerName?.toLowerCase().includes(q) ||
        p.vehicleName?.toLowerCase().includes(q) ||
        p.driverName?.toLowerCase().includes(q)
      ));
    }

    setFilteredPayments(result);
  }, [payments, search, filter]);

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

  const updatePayment = (paymentId: string, updates: any) => {
    const updated = payments.map(p => p.paymentId === paymentId ? { ...p, ...updates } : p);
    localStorage.setItem('spk_payments', JSON.stringify(updated));
    setPayments(updated);
    loadData();
  };

  const handleConfirmAmount = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(finalAmount);
    if (!amountNum || amountNum <= 0) return alert('Enter a valid amount > 0');

    updatePayment(selectedPayment.paymentId, {
      amount: amountNum,
      notes: ownerNotes,
      status: 'Cash Pending',
      confirmedAt: new Date().toISOString()
    });

    setShowConfirmModal(false);
    setSelectedPayment(null);
    setFinalAmount('');
    setOwnerNotes('');
  };

  const handleMarkAsPaid = () => {
    updatePayment(selectedPayment.paymentId, {
      status: 'Paid',
      paidAt: new Date().toISOString(),
      receivedBy: 'SPK Owner'
    });
    setShowPaidModal(false);
    setSelectedPayment(null);
  };

  const tabs = ['All', 'Pending', 'Cash Pending', 'Paid', 'Cancelled'];

  return (
    <div className="animate-fade-in-up pb-24 md:pb-0">
      
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Payments</h1>
          <p className="text-gray-500 font-medium mt-1">Manage work charges and cash collections.</p>
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search payments..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-3">
            <IndianRupee size={20} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="text-xl sm:text-2xl font-black text-gray-900">₹{summary.totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-3">
            <Clock size={20} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pending Cash</p>
          <p className="text-xl sm:text-2xl font-black text-gray-900">₹{summary.pendingCash.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3">
            <CheckCircle size={20} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Paid Jobs</p>
          <p className="text-xl sm:text-2xl font-black text-gray-900">{summary.paidJobs}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-3">
            <XCircle size={20} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Unpaid Jobs</p>
          <p className="text-xl sm:text-2xl font-black text-gray-900">{summary.unpaidJobs}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 mb-6 pb-px">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`whitespace-nowrap px-4 py-3 font-bold text-sm border-b-2 transition-colors ${
              filter === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredPayments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No payments found</h2>
          <p className="text-gray-500">There are no payment records matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPayments.map((payment) => (
            <div key={payment.paymentId} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-gray-400">{payment.paymentId}</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase border ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">{payment.farmerName}</h3>
                <p className="text-sm font-bold text-gray-500">{payment.vehicleName} • {payment.driverName}</p>
                <p className="text-xs text-gray-400 font-medium mt-1">Booking: {payment.bookingId}</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 flex-1 flex flex-col justify-center mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase text-center mb-1">Amount</p>
                <p className={`text-2xl font-black text-center ${payment.amount ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                  {payment.amount ? `₹${payment.amount.toLocaleString()}` : 'Pending Confirmation'}
                </p>
                <p className="text-xs font-bold text-primary text-center mt-2 uppercase">{payment.paymentMethod}</p>
              </div>
              
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => {
                    navigate(`/owner/payments/${payment.paymentId}/receipt`);
                  }}
                  className="flex-1 py-2 text-xs font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                >
                  <Eye size={14} />
                  <span>View</span>
                </button>
                
                {payment.status === 'Pending' && (
                  <button 
                    onClick={() => {
                      setSelectedPayment(payment);
                      setShowConfirmModal(true);
                    }}
                    className="flex-[2] py-2 text-xs font-bold text-white bg-primary rounded-xl hover:bg-primary-hover shadow-md transition-colors"
                  >
                    Confirm Amount
                  </button>
                )}
                
                {payment.status === 'Cash Pending' && (
                  <button 
                    onClick={() => {
                      setSelectedPayment(payment);
                      setShowPaidModal(true);
                    }}
                    className="flex-[2] py-2 text-xs font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 shadow-md transition-colors"
                  >
                    Mark as Paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Amount Modal */}
      {showConfirmModal && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up">
            <h3 className="text-xl font-black text-gray-900 mb-2">Confirm Work Amount</h3>
            <p className="text-sm text-gray-500 mb-6 font-medium">Set the final amount for the completed work. The farmer will be notified to pay this amount.</p>
            
            <div className="bg-gray-50 p-4 rounded-xl mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Booking ID</span>
                <span className="font-bold text-gray-900">{selectedPayment.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Farmer</span>
                <span className="font-bold text-gray-900">{selectedPayment.farmerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Vehicle & Driver</span>
                <span className="font-bold text-gray-900">{selectedPayment.vehicleName} ({selectedPayment.driverName})</span>
              </div>
            </div>

            <form onSubmit={handleConfirmAmount}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Final Amount (₹) <span className="text-red-500">*</span></label>
                  <input 
                    type="number"
                    value={finalAmount}
                    onChange={(e) => setFinalAmount(e.target.value)}
                    placeholder="e.g. 3500"
                    min="1"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all font-bold text-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Owner Notes (Optional)</label>
                  <textarea 
                    value={ownerNotes}
                    onChange={(e) => setOwnerNotes(e.target.value)}
                    placeholder="e.g. Includes extra diesel charges"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none h-24"
                  ></textarea>
                </div>
              </div>

              <div className="flex space-x-3">
                <button 
                  type="button"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedPayment(null);
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover shadow-md transition-colors"
                >
                  Confirm Amount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mark Paid Modal */}
      {showPaidModal && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-fade-in-up text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
              <IndianRupee size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Confirm Cash Payment</h3>
            <p className="text-sm text-gray-500 mb-6 font-medium">Confirm that you have received the cash payment for this booking.</p>
            
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Amount to collect</p>
              <p className="text-3xl font-black text-green-600">₹{selectedPayment.amount?.toLocaleString()}</p>
              <p className="text-sm font-bold text-gray-600 mt-2">from {selectedPayment.farmerName}</p>
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => {
                  setShowPaidModal(false);
                  setSelectedPayment(null);
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleMarkAsPaid}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-md transition-colors"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OwnerPayments;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BaseLayout from './layouts/BaseLayout';
import FarmerLayout from './layouts/FarmerLayout';
import OwnerLayout from './layouts/OwnerLayout';
import Home from './pages/Home';
import RoleSelection from './pages/auth/RoleSelection';
import FarmerLogin from './pages/auth/FarmerLogin';
import FarmerRegister from './pages/auth/FarmerRegister';
import DriverLogin from './pages/auth/DriverLogin';
import OwnerLogin from './pages/auth/OwnerLogin';
import FarmerDashboard from './pages/dashboard/FarmerDashboard';
import FarmerBook from './pages/dashboard/farmer/FarmerBook';
import FarmerBookWork from './pages/dashboard/farmer/FarmerBookWork';
import FarmerBookEquipment from './pages/dashboard/farmer/FarmerBookEquipment';
import FarmerBookLocation from './pages/dashboard/farmer/FarmerBookLocation';
import FarmerBookReview from './pages/dashboard/farmer/FarmerBookReview';
import FarmerBookSuccess from './pages/dashboard/farmer/FarmerBookSuccess';
import FarmerBookings from './pages/dashboard/farmer/FarmerBookings';
import FarmerBookingDetails from './pages/dashboard/farmer/FarmerBookingDetails';
import FarmerTracking from './pages/dashboard/farmer/FarmerTracking';
import DriverDashboard from './pages/dashboard/driver/DriverDashboard';
import DriverJobs from './pages/dashboard/driver/DriverJobs';
import DriverJobDetails from './pages/dashboard/driver/DriverJobDetails';
import DriverHistory from './pages/dashboard/driver/DriverHistory';
import DriverProfile from './pages/dashboard/driver/DriverProfile';
import DriverLayout from './layouts/DriverLayout';
import OwnerDashboard from './pages/dashboard/OwnerDashboard';
import OwnerVehicles from './pages/dashboard/OwnerVehicles';
import OwnerBookings from './pages/dashboard/owner/OwnerBookings';
import OwnerBookingDetails from './pages/dashboard/owner/OwnerBookingDetails';
import OwnerNotifications from './pages/dashboard/owner/OwnerNotifications';
import OwnerTracking from './pages/dashboard/owner/OwnerTracking';
import OwnerPayments from './pages/dashboard/owner/OwnerPayments';
import OwnerReceipt from './pages/dashboard/owner/OwnerReceipt';
import FarmerPayments from './pages/dashboard/farmer/FarmerPayments';
import FarmerReceipt from './pages/dashboard/farmer/FarmerReceipt';
import FarmerProfile from './pages/dashboard/farmer/FarmerProfile';
import OwnerDrivers from './pages/dashboard/owner/OwnerDrivers';
import OwnerReports from './pages/dashboard/owner/OwnerReports';
import OwnerSettings from './pages/dashboard/owner/OwnerSettings';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
        </Route>
        
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route path="/farmer/login" element={<FarmerLogin />} />
        <Route path="/farmer/register" element={<FarmerRegister />} />
        
        <Route path="/driver/login" element={<DriverLogin />} />
        <Route path="/owner/login" element={<OwnerLogin />} />
        
        {/* Farmer Portal Routes */}
        <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
          <Route path="/farmer" element={<FarmerLayout />}>
            <Route path="dashboard" element={<FarmerDashboard />} />
            <Route path="book" element={<FarmerBook />} />
            <Route path="book/equipment" element={<FarmerBookEquipment />} />
            <Route path="book/details" element={<FarmerBookWork />} />
            <Route path="book/location" element={<FarmerBookLocation />} />
            <Route path="book/review" element={<FarmerBookReview />} />
            <Route path="book/success" element={<FarmerBookSuccess />} />
            <Route path="bookings" element={<FarmerBookings />} />
            <Route path="bookings/:id" element={<FarmerBookingDetails />} />
            <Route path="tracking" element={<FarmerTracking />} />
            <Route path="payments" element={<FarmerPayments />} />
            <Route path="payments/:id" element={<FarmerReceipt />} />
            <Route path="profile" element={<FarmerProfile />} />
          </Route>
        </Route>

        {/* Owner Portal Routes */}
        <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
          <Route path="/owner" element={<OwnerLayout />}>
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="vehicles" element={<OwnerVehicles />} />
            <Route path="drivers" element={<OwnerDrivers />} />
            <Route path="bookings" element={<OwnerBookings />} />
            <Route path="bookings/:id" element={<OwnerBookingDetails />} />
            <Route path="notifications" element={<OwnerNotifications />} />
            <Route path="tracking" element={<OwnerTracking />} />
            <Route path="payments" element={<OwnerPayments />} />
            <Route path="payments/:id/receipt" element={<OwnerReceipt />} />
            <Route path="reports" element={<OwnerReports />} />
            <Route path="settings" element={<OwnerSettings />} />
          </Route>
        </Route>

        {/* Driver Portal Routes */}
        <Route element={<ProtectedRoute allowedRoles={['driver']} />}>
          <Route path="/driver" element={<DriverLayout />}>
            <Route path="dashboard" element={<DriverDashboard />} />
            <Route path="jobs" element={<DriverJobs />} />
            <Route path="jobs/:id" element={<DriverJobDetails />} />
            <Route path="history" element={<DriverHistory />} />
            <Route path="profile" element={<DriverProfile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

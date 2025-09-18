import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import PricingManagement from "./pages/admin/PricingManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";
import ShippingManagement from "./pages/admin/ShippingManagement";
import CouponManagement from "./pages/admin/CouponManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics";
import SettingsPage from "./pages/admin/SettingsPage";
import Login from "./pages/Login";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import UserManagement from "./pages/admin/UserManagement";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/dashboard/products" element={<AdminLayout><ProductManagement /></AdminLayout>} />
            <Route path="/dashboard/orders" element={<AdminLayout><OrderManagement /></AdminLayout>} />
            <Route path="/dashboard/shipping" element={<AdminLayout><ShippingManagement /></AdminLayout>} />
            <Route path="/dashboard/customers" element={<AdminLayout><CustomerManagement /></AdminLayout>} />
            <Route path="/dashboard/pricing" element={<AdminLayout><PricingManagement /></AdminLayout>} />
            <Route path="/dashboard/coupons" element={<AdminLayout><CouponManagement /></AdminLayout>} />
            <Route path="/dashboard/content" element={<AdminLayout><ContentManagement /></AdminLayout>} />
            <Route path="/dashboard/reports" element={<AdminLayout><ReportsAnalytics /></AdminLayout>} />
            <Route path="/dashboard/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
            <Route path="/dashboard/settings" element={<AdminLayout><SettingsPage /></AdminLayout>} />
          </Routes>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
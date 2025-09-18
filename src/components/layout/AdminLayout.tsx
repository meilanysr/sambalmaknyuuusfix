import { ReactNode, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Percent,
  LogOut,
  Users,
  Truck,
  Ticket,
  FileText,
  BarChart2,
  Settings,
  UserCog,
  Menu,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Produk", href: "/dashboard/products", icon: Package },
  { name: "Pesanan", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Pengiriman", href: "/dashboard/shipping", icon: Truck },
  { name: "Pelanggan", href: "/dashboard/customers", icon: Users },
  { name: "Harga & Diskon", href: "/dashboard/pricing", icon: Percent },
  { name: "Kupon", href: "/dashboard/coupons", icon: Ticket },
  { name: "Konten", href: "/dashboard/content", icon: FileText },
  { name: "Laporan", href: "/dashboard/reports", icon: BarChart2 },
  { name: "Manajemen Admin", href: "/dashboard/users", icon: UserCog },
  { name: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate('/login');
    }
  }, [session, loading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading || !session) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Memuat...</p>
      </div>
    );
  }

  const sidebarContent = (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b border-red-800 px-4 lg:h-[60px] lg:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="">Sambal Maknyuuus</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive
                    ? "bg-white text-red-700 font-bold animate-kedip"
                    : "text-red-100 hover:bg-red-600 hover:text-white"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t border-red-800">
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-transparent border-white text-white hover:bg-white hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Keluar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-red-700 md:block">
        {sidebarContent}
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 bg-red-700 border-r-0 w-full max-w-xs sm:max-w-sm">
              {sidebarContent}
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <h1 className="font-semibold text-lg">Admin Panel</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6" style={{ backgroundImage: "url('/dashboard-background.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
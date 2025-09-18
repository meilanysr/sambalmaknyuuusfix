import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

// Data dummy untuk KPI
const kpiData = [
  { title: "Pendapatan Hari Ini", value: "Rp 920.000", icon: DollarSign, change: "+15.2%" },
  { title: "Pesanan Hari Ini", value: "32", icon: ShoppingCart, change: "+8.5%" },
  { title: "Pelanggan Baru (7 Hari)", value: "12", icon: Users, change: "+3" },
  { title: "Total Produk", value: "15", icon: Package, change: "" },
];

// Data dummy untuk grafik penjualan
const salesData = [
  { date: "Senin", sales: 450000 },
  { date: "Selasa", sales: 600000 },
  { date: "Rabu", sales: 520000 },
  { date: "Kamis", sales: 780000 },
  { date: "Jumat", sales: 650000 },
  { date: "Sabtu", sales: 920000 },
  { date: "Minggu", sales: 810000 },
];

// Data dummy untuk pesanan terbaru
const recentOrders = [
  { id: "ORD001", customer: "Budi Santoso", date: "2023-09-07", total: 75000, status: "Selesai" },
  { id: "ORD002", customer: "Citra Lestari", date: "2023-09-07", total: 120000, status: "Dikirim" },
  { id: "ORD003", customer: "Agus Wijaya", date: "2023-09-06", total: 45000, status: "Diproses" },
  { id: "ORD004", customer: "Dewi Anggraini", date: "2023-09-06", total: 250000, status: "Selesai" },
  { id: "ORD005", customer: "Eko Prasetyo", date: "2023-09-05", total: 95000, status: "Dibatalkan" },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "selesai": return "default";
    case "dikirim": return "secondary";
    case "diproses": return "outline";
    case "dibatalkan": return "destructive";
    default: return "default";
  }
};

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] mb-6">Dashboard</h1>
      
      {/* Kartu KPI */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              {kpi.change && <p className="text-xs text-muted-foreground">{kpi.change} dari kemarin</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Grafik Penjualan */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Analitik Penjualan (7 Hari Terakhir)</CardTitle>
              <CardDescription>Grafik ini menunjukkan total pendapatan per hari.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `Rp ${Number(value) / 1000}k`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" name="Penjualan" stroke="#c026d3" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Pesanan Terbaru */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Pesanan Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pelanggan</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.slice(0, 5).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.customer}</TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadge(order.status) as any}>{order.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
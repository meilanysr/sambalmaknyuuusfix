import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  ShoppingCart,
  Users,
  BarChart,
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

// Data dummy untuk analitik
const salesData = [
  { date: "01 Sep", sales: 450000 },
  { date: "02 Sep", sales: 600000 },
  { date: "03 Sep", sales: 520000 },
  { date: "04 Sep", sales: 780000 },
  { date: "05 Sep", sales: 650000 },
  { date: "06 Sep", sales: 920000 },
  { date: "07 Sep", sales: 810000 },
];

const topProducts = [
  { name: "Sambal Bawang 100g", unitsSold: 152, revenue: 2280000 },
  { name: "Sambal Terasi 200g", unitsSold: 110, revenue: 2750000 },
  { name: "Sambal Ijo 100g", unitsSold: 98, revenue: 1470000 },
  { name: "Sambal Matah 100g", unitsSold: 75, revenue: 1125000 },
];

const kpiData = [
  { title: "Total Pendapatan", value: "Rp 15.750.000", icon: DollarSign },
  { title: "Total Pesanan", value: "543", icon: ShoppingCart },
  { title: "Pelanggan Baru (Bulan Ini)", value: "45", icon: Users },
  { title: "Rata-rata Nilai Pesanan", value: "Rp 89.500", icon: BarChart },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const ReportsAnalytics = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] mb-6">Laporan & Analitik</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Tren Penjualan (7 Hari Terakhir)</CardTitle>
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
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Produk Terlaris</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produk</TableHead>
                      <TableHead className="text-right">Terjual</TableHead>
                      <TableHead className="text-right">Pendapatan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product) => (
                      <TableRow key={product.name}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right">{product.unitsSold}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
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

export default ReportsAnalytics;
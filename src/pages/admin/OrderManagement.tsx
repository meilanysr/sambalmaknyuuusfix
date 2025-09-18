import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ListFilter, MoreHorizontal } from "lucide-react";

const orders = [
  { id: "ORD001", customer: "Budi Santoso", date: "2024-09-14", total: "Rp 75.000", status: "Dikirim" },
  { id: "ORD002", customer: "Citra Lestari", date: "2024-09-14", total: "Rp 45.000", status: "Pending" },
  { id: "ORD003", customer: "Agus Wijaya", date: "2024-09-13", total: "Rp 120.000", status: "Selesai" },
  { id: "ORD004", customer: "Dewi Anggraini", date: "2024-09-13", total: "Rp 30.000", status: "Dikirim" },
  { id: "ORD005", customer: "Eko Prasetyo", date: "2024-09-12", total: "Rp 90.000", status: "Dibatalkan" },
  { id: "ORD006", customer: "Fitriani", date: "2024-09-12", total: "Rp 200.000", status: "Selesai" },
  { id: "ORD007", customer: "Gunawan", date: "2024-09-11", total: "Rp 60.000", status: "Pending" },
];

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "selesai": return "default";
    case "dikirim": return "secondary";
    case "pending": return "outline";
    case "dibatalkan": return "destructive";
    default: return "default";
  }
};

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const handleStatusChange = (status: string) => {
    setStatusFilter(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const filteredOrders = orders
    .filter(order => 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(order => 
      statusFilter.length === 0 || statusFilter.includes(order.status)
    );

  return (
    <div>
      <h1 className="text-3xl font-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] mb-6">Manajemen Pesanan</h1>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan ID atau nama..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter Status
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {["Pending", "Dikirim", "Selesai", "Dibatalkan"].map(status => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={() => handleStatusChange(status)}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                          <DropdownMenuItem>Ubah Status</DropdownMenuItem>
                          <DropdownMenuItem>Cetak Faktur</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;
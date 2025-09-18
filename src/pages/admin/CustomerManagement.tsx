import { useState, useMemo } from "react";
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
}

// Data dummy - di aplikasi nyata, ini akan diambil dari database
const dummyCustomers: Customer[] = [
  { id: "CUS001", name: "Budi Santoso", email: "budi.s@example.com", joinDate: "2024-08-01", totalOrders: 5, totalSpent: 350000 },
  { id: "CUS002", name: "Citra Lestari", email: "citra.l@example.com", joinDate: "2024-08-05", totalOrders: 2, totalSpent: 90000 },
  { id: "CUS003", name: "Agus Wijaya", email: "agus.w@example.com", joinDate: "2024-07-20", totalOrders: 8, totalSpent: 720000 },
  { id: "CUS004", name: "Dewi Anggraini", email: "dewi.a@example.com", joinDate: "2024-09-01", totalOrders: 1, totalSpent: 30000 },
  { id: "CUS005", name: "Eko Prasetyo", email: "eko.p@example.com", joinDate: "2024-06-15", totalOrders: 3, totalSpent: 150000 },
  { id: "CUS006", name: "Fitriani", email: "fitriani@example.com", joinDate: "2024-05-10", totalOrders: 12, totalSpent: 1100000 },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const getLoyaltyStatus = (totalSpent: number): { text: string; variant: "default" | "secondary" | "outline" } => {
  if (totalSpent > 500000) {
    return { text: "VIP", variant: "default" };
  }
  if (totalSpent > 100000) {
    return { text: "Setia", variant: "secondary" };
  }
  return { text: "Baru", variant: "outline" };
};

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Customer; direction: 'asc' | 'desc' } | null>(null);

  const sortedAndFilteredCustomers = useMemo(() => {
    let filtered = dummyCustomers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, sortConfig]);

  const requestSort = (key: keyof Customer) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Customer) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] mb-6">Manajemen Pelanggan & Loyalitas</h1>
      
      <Card>
        <CardHeader>
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau email pelanggan..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Pelanggan</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('totalOrders')}>
                      Jumlah Pesanan {getSortIcon('totalOrders')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('totalSpent')}>
                      Total Belanja {getSortIcon('totalSpent')}
                    </Button>
                  </TableHead>
                  <TableHead>Status Loyalitas</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredCustomers.map((customer) => {
                  const loyalty = getLoyaltyStatus(customer.totalSpent);
                  return (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.totalOrders}</TableCell>
                      <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                      <TableCell>
                        <Badge variant={loyalty.variant}>{loyalty.text}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                            <DropdownMenuItem>Kirim Promo</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManagement;
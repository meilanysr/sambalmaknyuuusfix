import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showSuccess } from "@/utils/toast";

type ShipmentStatus = "Menunggu Diproses" | "Dikemas" | "Dikirim" | "Tiba di Tujuan" | "Selesai";

interface Shipment {
  orderId: string;
  customerName: string;
  address: string;
  status: ShipmentStatus;
  trackingNumber: string | null;
}

const initialShipments: Shipment[] = [
  { orderId: "ORD001", customerName: "Budi Santoso", address: "Jl. Merdeka No. 1, Jakarta", status: "Dikirim", trackingNumber: "JN1234567890" },
  { orderId: "ORD002", customerName: "Citra Lestari", address: "Jl. Kembang No. 2, Bandung", status: "Dikemas", trackingNumber: null },
  { orderId: "ORD004", customerName: "Dewi Anggraini", address: "Jl. Pahlawan No. 4, Surabaya", status: "Tiba di Tujuan", trackingNumber: "SC1234567890" },
  { orderId: "ORD006", customerName: "Fitriani", address: "Jl. Sudirman No. 6, Medan", status: "Selesai", trackingNumber: "ID1234567890" },
  { orderId: "ORD007", customerName: "Gunawan", address: "Jl. Gatot Subroto No. 7, Semarang", status: "Menunggu Diproses", trackingNumber: null },
];

const getStatusVariant = (status: ShipmentStatus) => {
  switch (status) {
    case "Selesai": return "default";
    case "Dikirim":
    case "Tiba di Tujuan":
      return "secondary";
    case "Dikemas": return "outline";
    case "Menunggu Diproses": return "destructive";
    default: return "default";
  }
};

const ShippingManagement = () => {
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [editStatus, setEditStatus] = useState<ShipmentStatus>("Menunggu Diproses");
  const [editTracking, setEditTracking] = useState("");

  const handleEditClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setEditStatus(shipment.status);
    setEditTracking(shipment.trackingNumber || "");
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!selectedShipment) return;

    setShipments(prev =>
      prev.map(s =>
        s.orderId === selectedShipment.orderId
          ? { ...s, status: editStatus, trackingNumber: editTracking || null }
          : s
      )
    );
    showSuccess(`Pengiriman untuk order ${selectedShipment.orderId} telah diperbarui.`);
    setIsDialogOpen(false);
  };

  const filteredShipments = shipments.filter(shipment =>
    shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] mb-6">Manajemen Pengiriman</h1>
      
      <Card>
        <CardHeader>
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari order ID atau nama pelanggan..."
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
                  <TableHead>Order ID</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>No. Resi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.map((shipment) => (
                  <TableRow key={shipment.orderId}>
                    <TableCell className="font-medium">{shipment.orderId}</TableCell>
                    <TableCell>{shipment.customerName}</TableCell>
                    <TableCell className="max-w-xs truncate">{shipment.address}</TableCell>
                    <TableCell>{shipment.trackingNumber || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(shipment.status) as any}>{shipment.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="icon" onClick={() => handleEditClick(shipment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status Pengiriman - {selectedShipment?.orderId}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="status">Status Pengiriman</Label>
              <Select value={editStatus} onValueChange={(value) => setEditStatus(value as ShipmentStatus)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Menunggu Diproses">Menunggu Diproses</SelectItem>
                  <SelectItem value="Dikemas">Dikemas</SelectItem>
                  <SelectItem value="Dikirim">Dikirim</SelectItem>
                  <SelectItem value="Tiba di Tujuan">Tiba di Tujuan</SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tracking">Nomor Resi</Label>
              <Input id="tracking" value={editTracking} onChange={(e) => setEditTracking(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Batal</Button>
            </DialogClose>
            <Button type="button" onClick={handleSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShippingManagement;
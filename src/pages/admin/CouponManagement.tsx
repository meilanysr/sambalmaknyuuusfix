import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Coupon } from "@/types/coupon";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { showSuccess, showError } from "@/utils/toast";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

const couponSchema = z.object({
  code: z.string().min(3, "Kode minimal 3 karakter").toUpperCase(),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.coerce.number().min(1, "Nilai diskon tidak boleh kosong"),
  valid_from: z.string().min(1, "Tanggal mulai tidak boleh kosong"),
  valid_until: z.string().min(1, "Tanggal berakhir tidak boleh kosong"),
  usage_limit: z.coerce.number().min(0).optional().nullable(),
  is_active: z.boolean(),
}).refine(data => new Date(data.valid_from) < new Date(data.valid_until), {
  message: "Tanggal berakhir harus setelah tanggal mulai",
  path: ["valid_until"],
});

type CouponFormData = z.infer<typeof couponSchema>;

const CouponDialog = ({
  isOpen,
  onClose,
  onSave,
  coupon,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CouponFormData, id?: string) => void;
  coupon?: Coupon | null;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
  });

  useEffect(() => {
    if (isOpen) {
      const defaultValues: CouponFormData = coupon
        ? {
            ...coupon,
            valid_from: coupon.valid_from.split('T')[0],
            valid_until: coupon.valid_until.split('T')[0],
          }
        : { code: "", discount_type: "percentage", discount_value: 0, valid_from: "", valid_until: "", usage_limit: null, is_active: true };
      reset(defaultValues);
    }
  }, [isOpen, coupon, reset]);

  const onSubmit = (data: CouponFormData) => {
    onSave(data, coupon?.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{coupon ? "Edit Kupon" : "Tambah Kupon Baru"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="code">Kode Kupon</Label>
            <Input id="code" {...register("code")} />
            {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discount_type">Tipe Diskon</Label>
              <Controller
                name="discount_type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Persentase (%)</SelectItem>
                      <SelectItem value="fixed">Nominal Tetap (Rp)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="discount_value">Nilai Diskon</Label>
              <Input id="discount_value" type="number" {...register("discount_value")} />
              {errors.discount_value && <p className="text-red-500 text-sm">{errors.discount_value.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valid_from">Berlaku Mulai</Label>
              <Input id="valid_from" type="date" {...register("valid_from")} />
              {errors.valid_from && <p className="text-red-500 text-sm">{errors.valid_from.message}</p>}
            </div>
            <div>
              <Label htmlFor="valid_until">Berlaku Hingga</Label>
              <Input id="valid_until" type="date" {...register("valid_until")} />
              {errors.valid_until && <p className="text-red-500 text-sm">{errors.valid_until.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="usage_limit">Batas Penggunaan (kosongkan jika tak terbatas)</Label>
            <Input id="usage_limit" type="number" {...register("usage_limit")} />
          </div>
          <div className="flex items-center space-x-2">
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <Switch id="is_active" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="is_active">Aktifkan Kupon</Label>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Batal</Button>
            </DialogClose>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CouponManagement = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const { data, error } = await supabase.from("coupons").select("*").order('created_at', { ascending: false });
    if (error) console.error("Error fetching coupons:", error);
    else setCoupons(data || []);
  };

  const handleSaveCoupon = async (data: CouponFormData, id?: string) => {
    let error;
    if (id) {
      ({ error } = await supabase.from("coupons").update(data).eq("id", id));
    } else {
      ({ error } = await supabase.from("coupons").insert(data));
    }

    if (error) {
      showError(error.message);
    } else {
      showSuccess(`Kupon berhasil ${id ? 'diperbarui' : 'disimpan'}.`);
      fetchCoupons();
      setIsDialogOpen(false);
    }
  };

  const handleDeleteCoupon = async () => {
    if (!selectedCoupon) return;
    const { error } = await supabase.from("coupons").delete().eq("id", selectedCoupon.id);
    if (error) {
      showError(error.message);
    } else {
      showSuccess("Kupon berhasil dihapus.");
      fetchCoupons();
    }
    setIsDeleteDialogOpen(false);
    setSelectedCoupon(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">Manajemen Kupon & Promo</h1>
        <Button onClick={() => { setSelectedCoupon(null); setIsDialogOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Kupon
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Diskon</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Penggunaan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium">{coupon.code}</TableCell>
                  <TableCell>
                    {coupon.discount_type === 'percentage'
                      ? `${coupon.discount_value}%`
                      : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(coupon.discount_value)}
                  </TableCell>
                  <TableCell>{new Date(coupon.valid_from).toLocaleDateString('id-ID')} - {new Date(coupon.valid_until).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>{coupon.usage_count} / {coupon.usage_limit || '∞'}</TableCell>
                  <TableCell>
                    <Badge variant={coupon.is_active ? "default" : "destructive"}>
                      {coupon.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => { setSelectedCoupon(coupon); setIsDialogOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => { setSelectedCoupon(coupon); setIsDeleteDialogOpen(true); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <CouponDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveCoupon}
        coupon={selectedCoupon}
      />
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini akan menghapus kupon secara permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedCoupon(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCoupon}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CouponManagement;
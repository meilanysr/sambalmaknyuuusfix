import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Promotion } from "@/types/promotion";
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
import { useForm } from "react-hook-form";
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

const promotionSchema = z.object({
  name: z.string().min(1, "Nama promo tidak boleh kosong"),
  discount_percentage: z.coerce.number().min(1, "Diskon minimal 1%").max(100, "Diskon maksimal 100%"),
  start_date: z.string().min(1, "Tanggal mulai tidak boleh kosong"),
  end_date: z.string().min(1, "Tanggal berakhir tidak boleh kosong"),
}).refine(data => new Date(data.start_date) < new Date(data.end_date), {
  message: "Tanggal berakhir harus setelah tanggal mulai",
  path: ["end_date"],
});

type PromotionFormData = z.infer<typeof promotionSchema>;

const PromotionDialog = ({
  isOpen,
  onClose,
  onSave,
  promotion,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PromotionFormData, id?: string) => void;
  promotion?: Promotion | null;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
  });

  useEffect(() => {
    if (isOpen) {
      const defaultValues = promotion
        ? {
            ...promotion,
            start_date: promotion.start_date.split('T')[0],
            end_date: promotion.end_date.split('T')[0],
          }
        : { name: "", discount_percentage: 0, start_date: "", end_date: "" };
      reset(defaultValues);
    }
  }, [isOpen, promotion, reset]);

  const onSubmit = (data: PromotionFormData) => {
    onSave(data, promotion?.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{promotion ? "Edit Promo" : "Tambah Promo Baru"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Promo</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="discount_percentage">Diskon (%)</Label>
            <Input id="discount_percentage" type="number" {...register("discount_percentage")} />
            {errors.discount_percentage && <p className="text-red-500 text-sm">{errors.discount_percentage.message}</p>}
          </div>
          <div>
            <Label htmlFor="start_date">Tanggal Mulai</Label>
            <Input id="start_date" type="date" {...register("start_date")} />
            {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date.message}</p>}
          </div>
          <div>
            <Label htmlFor="end_date">Tanggal Berakhir</Label>
            <Input id="end_date" type="date" {...register("end_date")} />
            {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date.message}</p>}
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

const PricingManagement = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    const { data, error } = await supabase.from("promotions").select("*").order('start_date', { ascending: false });
    if (error) {
      console.error("Error fetching promotions:", error);
    } else {
      setPromotions(data || []);
    }
  };

  const handleSavePromotion = async (data: PromotionFormData, id?: string) => {
    let error;
    if (id) {
      ({ error } = await supabase.from("promotions").update(data).eq("id", id));
    } else {
      ({ error } = await supabase.from("promotions").insert(data));
    }

    if (error) {
      showError(error.message);
    } else {
      showSuccess(`Promo berhasil ${id ? 'diperbarui' : 'disimpan'}.`);
      fetchPromotions();
      setIsDialogOpen(false);
    }
  };

  const handleDeletePromotion = async () => {
    if (!selectedPromotion) return;
    const { error } = await supabase.from("promotions").delete().eq("id", selectedPromotion.id);
    if (error) {
      showError(error.message);
    } else {
      showSuccess("Promo berhasil dihapus.");
      fetchPromotions();
    }
    setIsDeleteDialogOpen(false);
    setSelectedPromotion(null);
  };

  const getStatus = (promo: Promotion): { text: string; variant: "default" | "secondary" | "outline" | "destructive" } => {
    const now = new Date();
    const startDate = new Date(promo.start_date);
    const endDate = new Date(promo.end_date);
    endDate.setHours(23, 59, 59, 999); // Set end date to end of day

    if (now >= startDate && now <= endDate) {
      return { text: "Aktif", variant: "default" };
    }
    if (now < startDate) {
      return { text: "Terjadwal", variant: "secondary" };
    }
    return { text: "Berakhir", variant: "outline" };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">Manajemen Harga & Diskon</h1>
        <Button onClick={() => { setSelectedPromotion(null); setIsDialogOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Promo
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Promo</TableHead>
                <TableHead>Diskon</TableHead>
                <TableHead>Periode Aktif</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promo) => {
                const status = getStatus(promo);
                return (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.name}</TableCell>
                    <TableCell>{promo.discount_percentage}%</TableCell>
                    <TableCell>{new Date(promo.start_date).toLocaleDateString('id-ID')} - {new Date(promo.end_date).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell><Badge variant={status.variant}>{status.text}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => { setSelectedPromotion(promo); setIsDialogOpen(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => { setSelectedPromotion(promo); setIsDeleteDialogOpen(true); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      <PromotionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSavePromotion}
        promotion={selectedPromotion}
      />
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus promo secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedPromotion(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePromotion}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PricingManagement;
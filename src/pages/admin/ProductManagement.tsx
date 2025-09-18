import { useState, useEffect, ChangeEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/types/product";
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
import { compressImage } from "@/utils/imageCompressor";

const productSchema = z.object({
  title: z.string().min(1, "Nama produk tidak boleh kosong"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Harga harus angka positif"),
  stock: z.coerce.number().int().min(0, "Stok harus bilangan bulat positif"),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductDialog = ({
  isOpen,
  onClose,
  onSave,
  product,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData, imageFile: File | null, id?: string) => void;
  product?: Product | null;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      reset(product || { title: "", description: "", price: 0, stock: 0 });
      setImageFile(null);
      setImageUrlPreview(product?.image_url || null);
    }
  }, [isOpen, product, reset]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setImageUrlPreview(URL.createObjectURL(file));
    } else {
      setImageUrlPreview(product?.image_url || null);
    }
  };

  const onSubmit = (formData: ProductFormData) => {
    onSave(formData, imageFile, product?.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Edit Produk" : "Tambah Produk Baru"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Nama Produk</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Input id="description" {...register("description")} />
          </div>
          <div>
            <Label htmlFor="price">Harga</Label>
            <Input id="price" type="number" {...register("price")} />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>
          <div>
            <Label htmlFor="stock">Stok</Label>
            <Input id="stock" type="number" {...register("stock")} />
            {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
          </div>
          <div>
            <Label htmlFor="image">Gambar Produk</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {imageUrlPreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Pratinjau Gambar:</p>
                <img src={imageUrlPreview} alt="Pratinjau" className="w-32 h-32 object-cover rounded-md" />
              </div>
            )}
            {product && !imageFile && <p className="text-sm text-gray-500 mt-1">Biarkan kosong untuk mempertahankan gambar saat ini.</p>}
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

const ProductManagement = () => {
  const { session } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) {
      showError("Gagal memuat produk.");
    } else {
      setProducts(data || []);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaveProduct = async (formData: ProductFormData, imageFile: File | null, id?: string) => {
    if (!session) {
      showError("Anda harus login untuk menyimpan produk.");
      return;
    }

    let finalImageUrl = selectedProduct?.image_url || '';

    if (imageFile) {
      const compressedFile = await compressImage(imageFile);
      const fileExt = compressedFile.name.split(".").pop();
      const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, compressedFile);

      if (uploadError) {
        showError(`Gagal mengunggah gambar: ${uploadError.message}`);
        return;
      }

      const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName);
      finalImageUrl = urlData.publicUrl;
    }

    if (!finalImageUrl) {
      showError("Gambar produk wajib diisi.");
      return;
    }

    const productData = {
      ...formData,
      image_url: finalImageUrl,
      user_id: session.user.id,
    };

    if (id) {
      const { data, error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        showError(`Gagal memperbarui produk: ${error.message}`);
      } else if (data) {
        showSuccess("Produk berhasil diperbarui!");
        setIsDialogOpen(false);
        fetchProducts();
      } else {
        showError("Pembaruan gagal. Produk tidak ditemukan atau Anda tidak memiliki izin untuk mengeditnya.");
      }
    } else {
      const { error } = await supabase.from("products").insert(productData);

      if (error) {
        showError(`Gagal menambahkan produk: ${error.message}`);
      } else {
        showSuccess("Produk berhasil ditambahkan!");
        setIsDialogOpen(false);
        fetchProducts();
      }
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    if (selectedProduct.image_url) {
      const path = selectedProduct.image_url.split('/images/')[1];
      if (path) {
        await supabase.storage.from("images").remove([path]);
      }
    }

    const { error } = await supabase.from("products").delete().eq("id", selectedProduct.id);

    if (error) {
      showError(error.message);
    } else {
      showSuccess("Produk berhasil dihapus.");
      fetchProducts();
    }
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">Manajemen Produk</h1>
        <Button onClick={() => { setSelectedProduct(null); setIsDialogOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gambar</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img src={product.image_url} alt={product.title} className="h-16 w-16 object-cover rounded-md" />
                  </TableCell>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price || 0)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => { setSelectedProduct(product); setIsDialogOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => { setSelectedProduct(product); setIsDeleteDialogOpen(true); }}>
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
      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus produk secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedProduct(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductManagement;
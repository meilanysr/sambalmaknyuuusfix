import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { showError, showSuccess } from "@/utils/toast";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: () => void;
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const { session } = useAuth();

  const handleDelete = async () => {
    if (!session) {
      showError("Anda harus login untuk menghapus produk.");
      return;
    }

    const urlParts = product.image_url.split('/');
    const bucketName = urlParts[urlParts.indexOf('storage') + 1];
    const filePath = urlParts.slice(urlParts.indexOf(bucketName) + 1).join('/');

    const { error: storageError } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (storageError) {
      showError(`Kesalahan Penyimpanan: ${storageError.message}`);
    }

    const { error: dbError } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (dbError) {
      showError(`Kesalahan Database: ${dbError.message}`);
    } else {
      showSuccess("Produk berhasil dihapus!");
      onDelete();
    }
  };

  const isOwner = session?.user?.id === product.user_id;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{product.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-40 object-cover rounded-md"
        />
        <p className="text-lg font-bold text-red-800 mt-4">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price || 0)}</p>
        <p className="text-sm text-gray-600 mt-1 truncate">
          {product.description}
        </p>
      </CardContent>
      {isOwner && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus produk secara permanen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Lanjutkan
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext"; // Corrected import path
import { useEffect, useState } from "react";
import { showError, showSuccess } from "@/utils/toast";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client"; // Import supabase directly

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (product: Product, action: "add" | "update") => void;
  productToEdit?: Product | null;
}

const ProductForm = ({
  isOpen,
  onClose,
  onSuccess,
  productToEdit,
}: ProductFormProps) => {
  const { session } = useAuth(); // Corrected hook name
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">(""); // Added stock state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setDescription(productToEdit.description || "");
      setPrice(productToEdit.price || "");
      setStock(productToEdit.stock); // Set stock for editing
    } else {
      setTitle("");
      setDescription("");
      setPrice("");
      setStock(""); // Reset stock for new product
    }
    setImageFile(null);
  }, [productToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      showError("You must be logged in.");
      return;
    }
    if (!title || price === "" || stock === "") { // Added stock validation
      showError("Title, Price, and Stock are required.");
      return;
    }
    if (!productToEdit && !imageFile) {
      showError("Image file is required for new entries.");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = productToEdit?.image_url;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }

      if (!imageUrl) {
        throw new Error("Could not get image URL.");
      }

      const productData = {
        user_id: session.user.id,
        title,
        description,
        price: price || 0,
        stock: stock || 0, // Include stock in product data
        image_url: imageUrl,
      };

      if (productToEdit) {
        const { data, error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", productToEdit.id)
          .select()
          .single();

        if (error) throw error;
        showSuccess("Product updated successfully!");
        onSuccess(data, "update");
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();

        if (error) throw error;
        showSuccess("Product added successfully!");
        onSuccess(data, "add");
      }

      onClose();
    } catch (error: any)
{
      showError(error.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {productToEdit ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title (e.g., '100g')</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price (e.g., '15000')</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value === "" ? "" : Number(e.target.value))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label> {/* Added stock input */}
            <Input
              id="stock"
              type="number"
              value={stock}
              onChange={(e) =>
                setStock(e.target.value === "" ? "" : Number(e.target.value))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="image">Image File</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files ? setImageFile(e.target.files[0]) : null
              }
            />
             {productToEdit && !imageFile && (
              <p className="text-sm text-gray-500 mt-2">Leave empty to keep the current image.</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
export interface Product {
  id: string;
  user_id?: string;
  title: string;
  description: string | null;
  price: number | null;
  image_url: string;
  created_at?: string;
  stock: number;
}
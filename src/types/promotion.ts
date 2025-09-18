export interface Promotion {
  id: string;
  name: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  created_at?: string;
}
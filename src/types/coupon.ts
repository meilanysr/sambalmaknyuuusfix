export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  valid_from: string;
  valid_until: string;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
  created_at?: string;
}
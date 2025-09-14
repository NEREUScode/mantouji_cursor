export interface Product {
  id: number;
  producer_id: number;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  currency?: string;
  unit?: string;
  stock_quantity: number;
  min_order_quantity?: number;
  max_order_quantity?: number;
  image_url?: string;
  images?: string[];
  tags: string[];
  is_organic?: boolean;
  is_active: boolean;
  is_available?: boolean;
  views?: number;
  favorites_count?: number;
  harvest_date?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
  producer?: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    city?: string;
    region?: string;
  };
  reviews?: Review[];
  average_rating?: number;
  review_count?: number;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  title?: string;
  comment?: string;
  is_verified_purchase?: boolean;
  is_flagged?: boolean;
  flag_reason?: string;
  created_at: string;
  updated_at?: string;
  user?: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  min_price?: number;
  max_price?: number;
  is_organic?: boolean;
  is_available?: boolean;
  region?: string;
  tags?: string[];
  search?: string;
}

export interface ProductSearchParams {
  page?: number;
  limit?: number;
  sort_by?: "name" | "price" | "created_at" | "rating";
  sort_order?: "asc" | "desc";
  filters?: ProductFilters;
}

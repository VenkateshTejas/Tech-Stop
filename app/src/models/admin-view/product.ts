export interface ProductFormData {
  image: string | null;
  title: string;
  description: string;
  category: string;
  brand: string;
  price: string;
  salePrice?: string;
  totalStock: string;
  averageReview: number;
}
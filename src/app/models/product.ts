import { ProductFeature } from "./ProductFeatures";

export interface Product {
  id: number;
  name: string;
  description: string;
  pictureUrl: string;
  price: number;
  brand: string;
  isFeatured: boolean;
  type?: string;
  quantityInStock?: number;
  features: IFeatures[];
  isActive: boolean;
  nameEn: string | null;
  descriptionEn: string | null;
  size: string | null;
  usage: string | null;
  priority: number;
  showPrice: boolean;
  subCategory: string;
}

export interface IFeatures {
  featureId: number;
  feature: ProductFeature;
}
export interface ProductParams {
  orderBy: string;
  searchTerm?: string;
  types: string[];
  brands: string[];
  size: string[];
  usage: string[];
  pageNumber: number;
  pageSize: number;
}

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
  size: string;
  usage: ProductUsage;
}

export enum ProductUsage {
  HomeUse = 1,
  Portable,
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
  pageNumber: number;
  pageSize: number;
}

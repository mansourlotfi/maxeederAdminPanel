import { ProductFeature } from "./ProductFeatures";
import { Comment } from "../models/Comment";

export interface Product {
  id: number;
  name: string;
  description: string;
  pictureUrl: string;
  price: number;
  brand: string;
  isFeatured: boolean;
  quantityInStock?: number;
  features: IFeatures[];
  isActive: boolean;
  nameEn: string | null;
  descriptionEn: string | null;
  size: string | null;
  usage: string | null;
  priority: number;
  showPrice: boolean;
  subCategory: ISubCategoryDto | null;
  subCategoryId: number | null;
  commentList: Comment[];
  mediaList: { mediaFileName: string }[];
}

export interface ISubCategoryDto {
  id: number;
  isActive: boolean;
  link: string;
  name: string;
  nameEn: string;
  pictureUrl: string;
  priority: number;
  categoryId: number;
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
  showPrice: boolean | null;
  isActive: boolean | null;
}

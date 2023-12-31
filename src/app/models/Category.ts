import { SubCategory } from "./SubCategory";

export interface Category {
  id: number;
  name: string;
  nameEn: string | null;
  link: string;
  pictureUrl: string;
  priority: number;
  isActive: boolean;
  subCategory: SubCategory[];
}

export interface CategoryParams {
  searchTerm?: string;
  pageNumber: number;
  pageSize: number;
}

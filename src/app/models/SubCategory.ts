export interface SubCategory {
  id: number;
  name: string;
  nameEn: string | null;
  link: string;
  pictureUrl: string;
  priority: number;
  isActive: boolean;
  categoryId: number;
}

export interface SubCategoryParams {
  searchTerm?: string;
  pageNumber: number;
  pageSize: number;
}

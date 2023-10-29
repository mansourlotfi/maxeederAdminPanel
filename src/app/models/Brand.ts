export interface Brand {
  id: number;
  name: string;
  nameEn: string;
  pictureUrl: string;
  isActive: boolean;
}

export interface BrandParams {
  searchTerm?: string;
  pageNumber: number;
  pageSize: number;
}

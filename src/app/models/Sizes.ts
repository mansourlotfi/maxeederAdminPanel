export interface Size {
  id: number;
  sizeName: string;
  sizeNameEn: string | null;
  isActive: boolean;
}

export interface SizeParams {
  searchTerm?: string;
  pageNumber: number;
  pageSize: number;
}

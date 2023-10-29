export interface Usage {
  id: number;
  name: string;
  nameEn: string | null;
  isActive: boolean;
}

export interface UsageParams {
  searchTerm?: string;
  pageNumber: number;
  pageSize: number;
}

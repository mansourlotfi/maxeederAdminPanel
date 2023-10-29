export interface Department {
  id: number;
  name: string;
  nameEn: string | null;
  isActive: boolean;
}

export interface DepartmentParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
}

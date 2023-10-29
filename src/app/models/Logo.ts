export interface Logo {
  id: number;
  name: string;
  nameEn: string | null;
  link: string;
  pictureUrl: string;
  priority: number;
  isActive: boolean;
}

export interface LogoParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
}

export interface QuickAccessMenu {
  id: number;
  title: string;
  titleEn: string | null;
  link: string;
  priority: number;
  isActive: boolean;
}

export interface QuickAccessMenuParams {
  pageNumber: number;
  pageSize: number;
}

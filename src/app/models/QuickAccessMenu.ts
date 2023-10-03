export interface QuickAccessMenu {
  id: number;
  title: string;
  link: string;
  priority: number;
}

export interface QuickAccessMenuParams {
  pageNumber: number;
  pageSize: number;
}

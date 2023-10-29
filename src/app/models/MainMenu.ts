export interface MainMenu {
  id: number;
  title: string;
  titleEn: string | null;
  link: string;
  priority: number;
  isActive: boolean;
}

export interface MainMenuParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
}

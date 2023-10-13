export interface MainMenu {
  id: number;
  title: string;
  titleEn: string;
  link: string;
  priority: number;
  isActive: boolean;
}

export interface MainMenuParams {
  pageNumber: number;
  pageSize: number;
}

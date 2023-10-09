export interface MainMenu {
  id: number;
  title: string;
  link: string;
  priority: number;
  isActive: boolean;
}

export interface MainMenuParams {
  pageNumber: number;
  pageSize: number;
}

export interface MainMenu {
  id: number;
  title: string;
  link: string;
  priority: number;
}

export interface MainMenuParams {
  pageNumber: number;
  pageSize: number;
}

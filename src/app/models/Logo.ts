export interface Logo {
  id: number;
  name: string;
  link: string;
  pictureUrl: string;
  priority: number;
}

export interface LogoParams {
  pageNumber: number;
  pageSize: number;
}

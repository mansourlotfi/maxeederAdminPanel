export interface Artist {
  id: number;
  name: string;
  text: string;
  pictureUrl: string;
  priority: number;
  isActive: boolean;
}

export interface ArtistParams {
  pageNumber: number;
  pageSize: number;
}

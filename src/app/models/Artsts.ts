export interface Artist {
  id: number;
  name: string;
  text: string;
  pictureUrl: string;
  priority: number;
}

export interface ArtistParams {
  pageNumber: number;
  pageSize: number;
}

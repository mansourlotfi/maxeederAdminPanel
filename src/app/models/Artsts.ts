export interface Artist {
  id: number;
  name: string;
  text: string;
  nameEn: string | null;
  textEn: string | null;
  pictureUrl: string;
  priority: number;
  isActive: boolean;
}

export interface ArtistParams {
  pageNumber: number;
  pageSize: number;
}

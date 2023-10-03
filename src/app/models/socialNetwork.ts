export interface SocialNetworks {
  id: number;
  name: string;
  link: string;
  pictureUrl: string;
  priority: number;
}

export interface SocialNetworksParams {
  searchTerm?: string;
  pageNumber: number;
  pageSize: number;
}

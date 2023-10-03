export interface SocialNetworks {
  id: number;
  name: string;
  link: string;
  pictureUrl: string;
  priority: number;
}

export interface SocialNetworksParams {
  pageNumber: number;
  pageSize: number;
}

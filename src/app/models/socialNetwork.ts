export interface SocialNetworks {
  id: number;
  name: string;
  link: string;
  pictureUrl: string;
  priority: number;
  isActive: boolean;
}

export interface SocialNetworksParams {
  pageNumber: number;
  pageSize: number;
}

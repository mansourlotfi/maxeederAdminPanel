export interface SocialNetworks {
  id: number;
  name: string;
  link: string;
  pictureUrl: string;
  priority: number;
  isActive: boolean;
  nameEn: string;
}

export interface SocialNetworksParams {
  pageNumber: number;
  pageSize: number;
}

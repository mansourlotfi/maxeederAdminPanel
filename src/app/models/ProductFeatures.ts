export interface ProductFeature {
  id: number;
  name: string;
  description: string | null;
  pictureUrl: string;
  isActive: boolean;
}

export interface ProductFeatureParams {
  pageNumber: number;
  pageSize: number;
}

export interface ProductFeature {
  id: number;
  name: string;
  description: string | null;
  pictureUrl: string;
}

export interface ProductFeatureParams {
  pageNumber: number;
  pageSize: number;
}

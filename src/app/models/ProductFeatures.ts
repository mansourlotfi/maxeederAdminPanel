export interface ProductFeature {
  id: number;
  name: string;
  description: string | null;
  nameEn: string | null;
  descriptionEn: string | null;
  pictureUrl: string;
  isActive: boolean;
}

export interface ProductFeatureParams {
  pageNumber: number;
  pageSize: number;
}

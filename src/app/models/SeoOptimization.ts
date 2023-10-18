export interface SeoOptimization {
  id: number;
  text: string | null;
  textEn: string | null;
  description: string | null;
  descriptionEn: string | null;
  metaTagKeyWords: string | null;
  metaTagKeyWordsEn: string | null;
  metaTagDescription: string | null;
  metaTagDescriptionEn: string | null;
  priority: string | null;
  page: PageEnum;
  isActive: boolean;
}

export enum PageEnum {
  All = 1,
  Home,
  Products,
  Services,
  MaxPlus,
  WikiMax,
  ContactUs,
  AboutUs,
  Partners,
}

export interface SeoOptimizationParams {
  pageNumber: number;
  pageSize: number;
  page: PageEnum;
}

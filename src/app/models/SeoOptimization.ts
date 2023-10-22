export interface SeoOptimization {
  id: number;
  text: string;
  textEn: string;
  description: string;
  descriptionEn: string;
  metaTagKeyWords: string;
  metaTagKeyWordsEn: string;
  metaTagDescription: string;
  metaTagDescriptionEn: string;
  priority: number;
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

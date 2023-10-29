export interface pageItems {
  id: number;
  title: string | null;
  text: string | null;
  link: string | null;
  pictureUrl: string | null;
  priority: number;
  ritchText: string | null;
  page: PageItemsEnum;
  isActive: boolean;
  titleEn: string | null;
  textEn: string | null;
  shortDesc: string | null;
  shortDescEn: string | null;
}

export interface pageItemsParams {
  pageNumber: number;
  pageSize: number;
  page: PageItemsEnum;
  searchTerm?: string;
}

export enum PageItemsEnum {
  ServiceMain = 1,
  ServiceItems,
  ContactUs,
  AboutUsHeader,
  AboutUsHistory,
  AboutUsTestimonials,
  AboutUsWarranty,
  AboutUsHonors,
  CoWorkersHead,
  CoWorkersTabs,
  CoWorkersWarranty,
}

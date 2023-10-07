export interface pageItems {
  id: number;
  title: string;
  text: string;
  link: string;
  pictureUrl: string;
  priority: number;
  ritchText: string | null;
  page: PageItemsEnum;
}

export interface pageItemsParams {
  pageNumber: number;
  pageSize: number;
  page: PageItemsEnum;
}

export enum PageItemsEnum {
  ServiceMain = 1,
  ServiceItems,
  MaxPlus,
  WikiMax,
  ContactUs,
  AboutUsHeader,
  AboutUsHistory,
  AboutUsTestimonials,
  AboutUsWarranty,
  AboutUsHonors,
}

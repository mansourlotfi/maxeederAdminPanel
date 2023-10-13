export interface Slide {
  id: number;
  name: string;
  nameEn: string;
  link: string;
  pictureUrl: string;
  priority: number;
  page: PagesEnum;
  isActive: boolean;
}

export interface SlideParams {
  pageNumber: number;
  pageSize: number;
  page: PagesEnum;
}

export enum PagesEnum {
  Home = 1,
  Products,
  Services,
  MaxPlus,
  WikiMax,
  ContactUs,
  AboutUs,
  Coworkers,
}

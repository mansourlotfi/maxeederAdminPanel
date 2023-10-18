export interface Article {
  id: number;
  title: string;
  link: string;
  pictureUrl: string;
  priority: number;
  ritchText: string | null;
  isActive: boolean;
  titleEn: string | null;
  ritchTextEn: string | null;
  page: ArticlesEnum;
  shortDesc: string | null;
  shortDescEn: string | null;
}

export interface ArticleParams {
  pageNumber: number;
  pageSize: number;
  page: ArticlesEnum;
}

export enum ArticlesEnum {
  WikiMax = 1,
  MaxPlus,
}

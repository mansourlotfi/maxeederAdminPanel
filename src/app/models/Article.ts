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
}

export interface ArticleParams {
  pageNumber: number;
  pageSize: number;
}

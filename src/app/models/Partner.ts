export interface Partner {
  id: number;
  title: string;
  ceo: string;
  state: string;
  city: string;
  tel: string;
  long: string;
  lat: string;
}

export interface PartnerParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
}
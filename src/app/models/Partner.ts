export interface Partner {
  id: number;
  title: string | null;
  ceo: string | null;
  state: string | null;
  city: string | null;
  tel: string | null;
  long: string | null;
  lat: string | null;
  isActive: boolean;
  titleEn: string | null;
  ceoEn: string | null;
  stateEn: string | null;
  cityEn: string | null;
  address: string | null;
  addressEn: string | null;
}

export interface PartnerParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
}

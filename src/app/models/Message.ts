export interface Message {
  id: number;
  department: string;
  fullName: string;
  email: string;
  subject: string;
  tel: string;
  text: string;
  addedDate: string;
  isActive: boolean;
}

export interface MessageParams {
  pageNumber: number;
  pageSize: number;
}

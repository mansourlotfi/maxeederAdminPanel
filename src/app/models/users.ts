export interface Users {
  id: number;
  email: string;
  isActive: boolean;
}

export interface User {
  id: number;
  phoneNumber: string;
  email: string;
  isActive: boolean;
}

export interface ICustomUserRoles {
  id: number;
  name: string;
}

export interface UsersParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
}

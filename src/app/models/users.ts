export interface Users {
  id: number;
  email: string;
  customUserRoles: ICustomUserRoles[];
  isActive: boolean;
}

export interface ICustomUserRoles {
  id: number;
  name: string;
}

export interface UsersParams {
  pageNumber: number;
  pageSize: number;
}

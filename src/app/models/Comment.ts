export interface Comment {
  id: number;
  name: string;
  email: string;
  text: string;
  isActive: boolean;
}

export interface CommentParams {
  pageNumber: number;
  pageSize: number;
}

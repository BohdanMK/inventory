export interface ApiResponse<T> {
  data: T;
  isError: boolean;
  errorText?: string;
  errorFull?: any;
}

export interface FetchParams {
  [key: string]: any;
}

export interface IUserProfile {
  _id?: string;
  email?: string;
  username?: string;
  avatar?: string;
  role?: string;
  avatarFullPath?: string;
}

export interface DataFile {
  fileName: string | null;
  filePath: string | null;
}

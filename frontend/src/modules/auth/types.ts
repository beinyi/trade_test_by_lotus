export interface ILoginReq {
  username: string;
  password: string;
}

export interface ILoginRes {
  jwttoken: string;
}

export interface IAuthRes {
  isAuthenticated: boolean;
  jwttoken: string;
}

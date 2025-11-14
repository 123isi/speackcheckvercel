// Auth API Types

export interface SignUpRequest {
  email: string;
  password: string;
  age: number;
  major: string;
}

export interface SignUpResponse {
  code: number;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  code: number;
  message: string;
}

export interface LogoutResponse {
  code: number;
  message: string;
}

export interface RefreshResponse {
  access_token: string;
  code: number;
  message: string;
}

export interface ErrorResponse {
  status: number;
  code: string;
  message: string;
}

export interface ServiceErrorResponse {
  code: number;
  message: string;
}

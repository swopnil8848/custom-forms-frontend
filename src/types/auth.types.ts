export interface User {
  id: number;
  name: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthSuccessResponse {
  status: string;
  message: string;
  data: User;
  token?: string;
}

export interface AuthErrorResponse {
  status: string;
  message: string;
  errors?: FormErrors;
}

export interface FormErrors {
  [key: string]: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  errors: FormErrors;
  message: string | null;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
}

export interface SimpleAPIResponse {
  status: string;
  message: string;
}

export interface forgotPasswordRequest {
  email: string;
}

export interface ResetPasswordPayload {
  resetToken: string;
  password: string;
}
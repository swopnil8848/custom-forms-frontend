import axiosInstance from "../../services/axiosInstance";
import type {
  LoginRequest,
  SignupRequest,
  AuthSuccessResponse,
  User,
  ApiResponse,
  SimpleAPIResponse,
  forgotPasswordRequest,
  ResetPasswordPayload,
} from "../../types/auth.types";

export class AuthAPI {
  static async login(credentials: LoginRequest): Promise<AuthSuccessResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const response = await axiosInstance.post<AuthSuccessResponse>(
      "/api/auth/login",
      credentials
    );

    return response.data;
  }

  static async signup(userData: SignupRequest): Promise<AuthSuccessResponse> {
    const response = await axiosInstance.post<AuthSuccessResponse>(
      "/api/auth/signup",
      userData
    );

    return response.data;
  }

  static async getMe(): Promise<ApiResponse<User>> {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axiosInstance.get<ApiResponse<User>>(
      "/api/auth/me",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return response.data;
  }

  static async forgotPassword(
    data: forgotPasswordRequest
  ): Promise<SimpleAPIResponse> {
    const response = await axiosInstance.patch<SimpleAPIResponse>(
      "/api/auth/forgot-password",
      { email: data.email },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data;
  }

  static async resetPassword(
    data: ResetPasswordPayload
  ): Promise<AuthSuccessResponse> {
    const response = await axiosInstance.patch<AuthSuccessResponse>(
      `/api/auth/reset-password/${data.resetToken}`,
      { password: data.password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data;
  }

  static async verifyEmail(token: string): Promise<ApiResponse<User>> {
    const response = await axiosInstance.post<ApiResponse<User>>(
      `/api/auth/verify-email/${token}`
    );

    return response.data;
  }
}
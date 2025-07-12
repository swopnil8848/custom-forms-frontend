import axiosInstance from "../services/axiosInstance";
import type {
  Form,
  CreateFormRequest,
  ApiResponse,
  PaginatedResponse,
} from "../types/form.types";

export class FormsAPI {
  static async createForm(formData: CreateFormRequest): Promise<ApiResponse<Form>> {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post<ApiResponse<Form>>(
      "/api/form",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  static async getForms(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Form>>> {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Form>>>(
      `/api/form?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  static async getFormById(id: number): Promise<ApiResponse<Form>> {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get<ApiResponse<Form>>(
      `/api/form/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  static async updateForm(id: number, formData: Partial<CreateFormRequest>): Promise<ApiResponse<Form>> {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put<ApiResponse<Form>>(
      `/api/form/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  static async deleteForm(id: number): Promise<ApiResponse<null>> {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/api/form/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}
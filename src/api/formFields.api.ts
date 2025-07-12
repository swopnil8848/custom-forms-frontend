import axiosInstance from "../services/axiosInstance";
import type {
  FormField,
  CreateFormFieldRequest,
  ApiResponse,
} from "../types/form.types";

export class FormFieldsAPI {
  static async createFormField(
    formId: number,
    fieldData: CreateFormFieldRequest
  ): Promise<ApiResponse<FormField>> {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post<ApiResponse<FormField>>(
      `/api/form/${formId}/fields`,
      fieldData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  static async getFormFields(
    formId: number
  ): Promise<ApiResponse<FormField[]>> {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get<ApiResponse<FormField[]>>(
      `/api/form/${formId}/fields`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  static async updateFormField(
    fieldId: number,
    fieldData: Partial<CreateFormFieldRequest>
  ): Promise<ApiResponse<FormField>> {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put<ApiResponse<FormField>>(
      `/api/form/fields/${fieldId}`,
      fieldData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  static async deleteFormField(fieldId: number): Promise<ApiResponse<null>> {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/api/form/fields/${fieldId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  static async reorderFormFields(
    formId: number,
    fieldOrders: { fieldId: number; order: number }[]
  ): Promise<ApiResponse<FormField[]>> {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.patch<ApiResponse<FormField[]>>(
      `/api/form/${formId}/fields/reorder`,
      { fieldOrders },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}

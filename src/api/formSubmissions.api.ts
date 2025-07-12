import axiosInstance from "../services/axiosInstance";
import type {
  FormSubmission,
  SubmissionStats,
  ApiResponse,
  PaginatedResponse,
} from "../types/form.types";

export class FormSubmissionsAPI {
  static async submitForm(
    formId: number,
    submissionData: any[],
    files?: File[]
  ): Promise<ApiResponse<{ submissionId: number }>> {
    const formData = new FormData();
    formData.append("submissionData", JSON.stringify(submissionData));

    if (files) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    const response = await axiosInstance.post<
      ApiResponse<{ submissionId: number }>
    >(`/api/form/${formId}/submit`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  static async getFormSubmissions(
    formId: number,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<FormSubmission>>> {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<FormSubmission>>
    >(`/api/form/${formId}/submissions?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  static async getSubmissionById(
    id: number
  ): Promise<ApiResponse<FormSubmission>> {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get<ApiResponse<FormSubmission>>(
      `/api/form/submissions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  static async deleteSubmission(id: number): Promise<ApiResponse<null>> {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/api/form/submissions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  static async getSubmissionStats(
    formId: number
  ): Promise<ApiResponse<SubmissionStats>> {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get<ApiResponse<SubmissionStats>>(
      `/api/form/${formId}/submissions/stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  static async exportSubmissions(
    formId: number,
    format = "csv"
  ): Promise<Blob> {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get(
      `/api/form/${formId}/submissions/export?format=${format}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );
    return response.data;
  }
}

export interface FormField {
  id: number;
  formId: number;
  fieldType: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Form {
  id: number;
  title: string;
  description?: string;
  isPublished: boolean;
  expiresAt?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  fields?: FormField[];
}

export interface FormSubmission {
  id: number;
  formId: number;
  submissionData: any[];
  files?: string[];
  submittedAt: string;
}

export interface SubmissionStats {
  totalSubmissions: number;
  todaySubmissions: number;
  weekSubmissions: number;
  monthSubmissions: number;
}

export interface CreateFormRequest {
  title: string;
  description?: string;
  isPublished?: boolean;
  expiresAt?: string;
}

export interface CreateFormFieldRequest {
  fieldName: string;
  fieldType: string;
  label: string;
  placeholder?: string;
  isRequired: boolean;
  orderNumber: number;
  options?: string[];
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FormsState {
  forms: Form[];
  currentForm: Form | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FormFieldsState {
  fields: FormField[];
  loading: boolean;
  error: string | null;
}

export interface FormSubmissionsState {
  submissions: FormSubmission[];
  currentSubmission: FormSubmission | null;
  stats: SubmissionStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

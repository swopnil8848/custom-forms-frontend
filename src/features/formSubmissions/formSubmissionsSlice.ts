import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FormSubmissionsAPI } from '../../api/formSubmissions.api';
import type { FormSubmissionsState } from '../../types/form.types';

const initialState: FormSubmissionsState = {
  submissions: [],
  currentSubmission: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const submitForm = createAsyncThunk(
  'formSubmissions/submit',
  async ({ formId, submissionData, files }: { formId: number; submissionData: any[]; files?: File[] }) => {
    const response = await FormSubmissionsAPI.submitForm(formId, submissionData, files);
    return response.data;
  }
);

export const fetchFormSubmissions = createAsyncThunk(
  'formSubmissions/fetchAll',
  async ({ formId, page = 1, limit = 10 }: { formId: number; page?: number; limit?: number }) => {
    const response = await FormSubmissionsAPI.getFormSubmissions(formId, page, limit);
    return response.data;
  }
);

export const fetchSubmissionById = createAsyncThunk(
  'formSubmissions/fetchById',
  async (id: number) => {
    const response = await FormSubmissionsAPI.getSubmissionById(id);
    return response.data;
  }
);

export const deleteSubmission = createAsyncThunk(
  'formSubmissions/delete',
  async (id: number) => {
    await FormSubmissionsAPI.deleteSubmission(id);
    return id;
  }
);

export const fetchSubmissionStats = createAsyncThunk(
  'formSubmissions/fetchStats',
  async (formId: number) => {
    const response = await FormSubmissionsAPI.getSubmissionStats(formId);
    return response.data;
  }
);

export const exportSubmissions = createAsyncThunk(
  'formSubmissions/export',
  async ({ formId, format = 'csv' }: { formId: number; format?: string }) => {
    const blob = await FormSubmissionsAPI.exportSubmissions(formId, format);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form_${formId}_submissions.${format}`;
    a.click();
    window.URL.revokeObjectURL(url);
    return 'Export successful';
  }
);

const formSubmissionsSlice = createSlice({
  name: 'formSubmissions',
  initialState,
  reducers: {
    clearCurrentSubmission: (state) => {
      state.currentSubmission = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitForm.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to submit form';
      })
      .addCase(fetchFormSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchFormSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch submissions';
      })
      .addCase(fetchSubmissionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubmission = action.payload;
      })
      .addCase(fetchSubmissionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch submission';
      })
      .addCase(deleteSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubmission.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = state.submissions.filter(submission => submission.id !== action.payload);
      })
      .addCase(deleteSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete submission';
      })
      .addCase(fetchSubmissionStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(exportSubmissions.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to export submissions';
      });
  },
});

export const { clearCurrentSubmission, clearError } = formSubmissionsSlice.actions;
export default formSubmissionsSlice.reducer;
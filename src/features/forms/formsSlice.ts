import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FormsAPI } from '../../api/forms.api';
import type { FormsState, CreateFormRequest } from '../../types/form.types';

const initialState: FormsState = {
  forms: [],
  currentForm: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const createForm = createAsyncThunk(
  'forms/create',
  async (formData: CreateFormRequest) => {
    const response = await FormsAPI.createForm(formData);
    return response.data;
  }
);

export const fetchForms = createAsyncThunk(
  'forms/fetchAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const response = await FormsAPI.getForms(page, limit);
    return response.data;
  }
);

export const fetchFormById = createAsyncThunk(
  'forms/fetchById',
  async (id: number) => {
    const response = await FormsAPI.getFormById(id);
    return response.data;
  }
);

export const updateForm = createAsyncThunk(
  'forms/update',
  async ({ id, formData }: { id: number; formData: Partial<CreateFormRequest> }) => {
    const response = await FormsAPI.updateForm(id, formData);
    return response.data;
  }
);

export const deleteForm = createAsyncThunk(
  'forms/delete',
  async (id: number) => {
    await FormsAPI.deleteForm(id);
    return id;
  }
);

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    clearCurrentForm: (state) => {
      state.currentForm = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createForm.fulfilled, (state, action) => {
        state.loading = false;
        state.forms.unshift(action.payload);
      })
      .addCase(createForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create form';
      })
      .addCase(fetchForms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForms.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch forms';
      })
      .addCase(fetchFormById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentForm = action.payload;
      })
      .addCase(fetchFormById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch form';
      })
      .addCase(updateForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateForm.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.forms.findIndex(form => form.id === action.payload.id);
        if (index !== -1) {
          state.forms[index] = action.payload;
        }
        if (state.currentForm?.id === action.payload.id) {
          state.currentForm = action.payload;
        }
      })
      .addCase(updateForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update form';
      })
      .addCase(deleteForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteForm.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = state.forms.filter(form => form.id !== action.payload);
      })
      .addCase(deleteForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete form';
      });
  },
});

export const { clearCurrentForm, clearError } = formsSlice.actions;
export default formsSlice.reducer;
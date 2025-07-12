import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FormFieldsAPI } from '../../api/formFields.api';
import type { FormFieldsState, CreateFormFieldRequest } from '../../types/form.types';

const initialState: FormFieldsState = {
  fields: [],
  loading: false,
  error: null,
};

export const createFormField = createAsyncThunk(
  'formFields/create',
  async ({ formId, fieldData }: { formId: number; fieldData: CreateFormFieldRequest }) => {
    const response = await FormFieldsAPI.createFormField(formId, fieldData);
    return response.data;
  }
);

export const fetchFormFields = createAsyncThunk(
  'formFields/fetchAll',
  async (formId: number) => {
    const response = await FormFieldsAPI.getFormFields(formId);
    return response.data;
  }
);

export const updateFormField = createAsyncThunk(
  'formFields/update',
  async ({ fieldId, fieldData }: { fieldId: number; fieldData: Partial<CreateFormFieldRequest> }) => {
    const response = await FormFieldsAPI.updateFormField(fieldId, fieldData);
    return response.data;
  }
);

export const deleteFormField = createAsyncThunk(
  'formFields/delete',
  async (fieldId: number) => {
    await FormFieldsAPI.deleteFormField(fieldId);
    return fieldId;
  }
);

export const reorderFormFields = createAsyncThunk(
  'formFields/reorder',
  async ({ formId, fieldOrders }: { formId: number; fieldOrders: { fieldId: number; order: number }[] }) => {
    const response = await FormFieldsAPI.reorderFormFields(formId, fieldOrders);
    return response.data;
  }
);

const formFieldsSlice = createSlice({
  name: 'formFields',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFormField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFormField.fulfilled, (state, action) => {
        state.loading = false;
        state.fields.push(action.payload);
      })
      .addCase(createFormField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create form field';
      })
      .addCase(fetchFormFields.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormFields.fulfilled, (state, action) => {
        state.loading = false;
        state.fields = action.payload;
      })
      .addCase(fetchFormFields.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch form fields';
      })
      .addCase(updateFormField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFormField.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.fields.findIndex(field => field.id === action.payload.id);
        if (index !== -1) {
          state.fields[index] = action.payload;
        }
      })
      .addCase(updateFormField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update form field';
      })
      .addCase(deleteFormField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFormField.fulfilled, (state, action) => {
        state.loading = false;
        state.fields = state.fields.filter(field => field.id !== action.payload);
      })
      .addCase(deleteFormField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete form field';
      })
      .addCase(reorderFormFields.fulfilled, (state, action) => {
        state.fields = action.payload;
      });
  },
});

export const { clearError } = formFieldsSlice.actions;
export default formFieldsSlice.reducer;
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import formsReducer from '../features/forms/formsSlice';
import formFieldsReducer from '../features/formFields/formFieldsSlice';
import formSubmissionsReducer from '../features/formSubmissions/formSubmissionsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forms: formsReducer,
    formFields: formFieldsReducer,
    formSubmissions: formSubmissionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
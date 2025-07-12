import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AuthAPI } from "./authApi";
import type {
  AuthState,
  LoginRequest,
  SignupRequest,
  AuthSuccessResponse,
  AuthErrorResponse,
  FormErrors,
  SimpleAPIResponse,
  forgotPasswordRequest,
  ApiResponse,
  User,
  ResetPasswordPayload,
} from "../../types/auth.types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  errors: {},
  message: null,
};

const extractErrors = (errorResponse: any): FormErrors => {
  if (errorResponse?.errors && typeof errorResponse.errors === "object") {
    return errorResponse.errors;
  }
  return {};
};

export const loginUser = createAsyncThunk<
  AuthSuccessResponse,
  LoginRequest,
  { rejectValue: AuthErrorResponse }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    return await AuthAPI.login(credentials);
  } catch (error: any) {
    const errorData = error.response?.data;
    return rejectWithValue({
      status: errorData?.status || "fail",
      message: errorData?.message || "Login failed",
      errors: errorData?.errors || {},
    });
  }
});

export const signupUser = createAsyncThunk<
  AuthSuccessResponse,
  SignupRequest,
  { rejectValue: AuthErrorResponse }
>("auth/signup", async (userData, { rejectWithValue }) => {
  try {
    return await AuthAPI.signup(userData);
  } catch (error: any) {
    const errorData = error.response?.data;
    return rejectWithValue({
      status: errorData?.status || "fail",
      message: errorData?.message || "Signup failed",
      errors: errorData?.error || {},
    });
  }
});

export const getMe = createAsyncThunk<
  AuthSuccessResponse,
  void,
  { rejectValue: AuthErrorResponse }
>("auth/profile", async (_, { rejectWithValue }) => {
  try {
    const response = await AuthAPI.getMe();
    return {
      status: "success",
      message: "Profile loaded successfully",
      data: response.data!,
    };
  } catch (error: any) {
    const errorData = error.response?.data;
    return rejectWithValue({
      status: errorData?.status || "fail",
      message: errorData?.message || "Failed to load profile",
    });
  }
});

export const forgotPassword = createAsyncThunk<
  SimpleAPIResponse,
  forgotPasswordRequest,
  { rejectValue: AuthErrorResponse }
>("auth/forgot-password", async (email, { rejectWithValue }) => {
  try {
    const response = await AuthAPI.forgotPassword(email);
    return response as SimpleAPIResponse;
  } catch (error: any) {
    const errorData = error.response?.data;
    return rejectWithValue({
      status: errorData?.status || "fail",
      message: errorData?.message || "Failed to send email",
    });
  }
});

export const resetPassword = createAsyncThunk<
  AuthSuccessResponse,
  ResetPasswordPayload,
  { rejectValue: ApiResponse<null> }
>(
  "auth/reset-password",
  async (data: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      const response = await AuthAPI.resetPassword(data);
      return response;
    } catch (error: any) {
      const errorData = error.response?.data;
      return rejectWithValue({
        status: errorData?.status || "fail",
        message: errorData?.message || "Failed to reset password",
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.errors = {};
      state.message = null;
      localStorage.removeItem("token");
    },
    clearErrors: (state) => {
      state.errors = {};
      state.message = null;
    },
    setFieldError: (
      state,
      action: PayloadAction<{ field: string; error: string }>
    ) => {
      state.errors[action.payload.field] = action.payload.error;
    },
    clearFieldError: (state, action: PayloadAction<string>) => {
      delete state.errors[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.errors = {};
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.message = action.payload.message;
        state.isAuthenticated = true;

        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Login failed";
        state.errors = extractErrors(action.payload);
        state.isAuthenticated = false;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.errors = {};
        state.message = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Signup failed";
        state.errors = extractErrors(action.payload);
      })
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Failed to load profile";
        if (action.payload?.status === "error") {
          state.user = null;
          state.isAuthenticated = false;
          localStorage.removeItem("token");
        }
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.message = action.payload.message;
        state.isAuthenticated = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.message = action.payload?.message || "Failed Sending Email";
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data!;
        state.message = action.payload.message || "Password Reset Sucessfull";
        state.isAuthenticated = true;

        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.message = action.payload?.message || "Reset Password Failed!";
      });
  },
});

export const { logout, clearErrors, setFieldError, clearFieldError } =
  authSlice.actions;
export default authSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// Async thunk for token validation
export const validateToken = createAsyncThunk(
  'auth/validateToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      // You can add a token validation API call here if needed
      // For now, we'll just check if token exists
      return { valid: true };
    } catch (error) {
      return rejectWithValue('Token validation failed');
    }
  }
);

// Get initial state from localStorage
const getInitialState = () => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('userData');
  
  return {
    user: userData ? JSON.parse(userData) : null,
    token: token,
    isAuthenticated: !!token,
    isLoading: false,
    error: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(user));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.error = null;
        localStorage.setItem('token', action.payload.data.token);
        localStorage.setItem('userData', JSON.stringify(action.payload.data.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      .addCase(validateToken.fulfilled, (state) => {
        // Token is valid, keep the current state
        state.isLoading = false;
      })
      .addCase(validateToken.rejected, (state) => {
        // Token is invalid, clear everything
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      });
  },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;

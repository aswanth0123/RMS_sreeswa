import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { shopAPI } from '../../services/api';

// Async thunks for shop operations
export const fetchShops = createAsyncThunk(
  'shops/fetchShops',
  async (_, { rejectWithValue }) => {
    try {
      const response = await shopAPI.getAllShops();
      console.log(response.data.data,'response');
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shops');
    }
  }
);

export const createShop = createAsyncThunk(
  'shops/createShop',
  async (shopData, { rejectWithValue }) => {
    try {
      const response = await shopAPI.createShop(shopData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create shop');
    }
  }
);

export const updateShop = createAsyncThunk(
  'shops/updateShop',
  async ({ id, shopData }, { rejectWithValue }) => {
    try {
      const response = await shopAPI.updateShop(id, shopData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update shop');
    }
  }
);

export const deleteShop = createAsyncThunk(
  'shops/deleteShop',
  async (id, { rejectWithValue }) => {
    try {
      await shopAPI.deleteShop(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete shop');
    }
  }
);

export const fetchShopById = createAsyncThunk(
  'shops/fetchShopById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await shopAPI.getShopById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shop');
    }
  }
);

const shopSlice = createSlice({
  name: 'shops',
  initialState: {
    shops: [],
    currentShop: null,
    isLoading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setCurrentShop: (state, action) => {
      state.currentShop = action.payload;
    },
    clearCurrentShop: (state) => {
      state.currentShop = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch shops
      .addCase(fetchShops.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shops = action.payload || [];
        state.error = null;
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create shop
      .addCase(createShop.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createShop.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shops.unshift(action.payload); // Add to beginning of array
        state.success = 'Shop created successfully';
        state.error = null;
      })
      .addCase(createShop.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      
      // Update shop
      .addCase(updateShop.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateShop.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.shops.findIndex(shop => shop._id === action.payload._id);
        if (index !== -1) {
          state.shops[index] = action.payload;
        }
        state.success = 'Shop updated successfully';
        state.error = null;
      })
      .addCase(updateShop.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      
      // Delete shop
      .addCase(deleteShop.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteShop.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shops = state.shops.filter(shop => shop._id !== action.payload);
        state.success = 'Shop deleted successfully';
        state.error = null;
      })
      .addCase(deleteShop.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = null;
      })
      
      // Fetch shop by ID
      .addCase(fetchShopById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShopById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentShop = action.payload;
        state.error = null;
      })
      .addCase(fetchShopById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, setCurrentShop, clearCurrentShop } = shopSlice.actions;
export default shopSlice.reducer;

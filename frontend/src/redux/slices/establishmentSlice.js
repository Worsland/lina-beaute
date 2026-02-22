import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { establishmentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const initialState = {
  establishments: [],
  currentEstablishment: null,
  myEstablishment: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

// Get all establishments
export const getEstablishments = createAsyncThunk(
  'establishments/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await establishmentAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Get establishment by ID
export const getEstablishmentById = createAsyncThunk(
  'establishments/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await establishmentAPI.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const establishmentSlice = createSlice({
  name: 'establishments',
  initialState,
  reducers: {
    clearCurrentEstablishment: (state) => {
      state.currentEstablishment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEstablishments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEstablishments.fulfilled, (state, action) => {
        state.loading = false;
        state.establishments = action.payload.data;
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(getEstablishments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEstablishmentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEstablishmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEstablishment = action.payload;
      })
      .addCase(getEstablishmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentEstablishment } = establishmentSlice.actions;
export default establishmentSlice.reducer;
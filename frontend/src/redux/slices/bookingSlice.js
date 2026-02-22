import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingAPI } from '../../services/api';
import toast from 'react-hot-toast';

const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
};

// Create booking
export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.create(bookingData);
      toast.success('Réservation créée avec succès ! 🎉');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la réservation';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Get my bookings
export const getMyBookings = createAsyncThunk(
  'bookings/getMy',
  async (params, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.getMy(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Cancel booking
export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.cancel(id, reason);
      toast.success('Réservation annulée');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de l\'annulation';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get my bookings
      .addCase(getMyBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  },
});

export const { clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
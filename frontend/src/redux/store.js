import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import establishmentReducer from './slices/establishmentSlice';
import bookingReducer from './slices/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    establishments: establishmentReducer,
    bookings: bookingReducer,
  },
});
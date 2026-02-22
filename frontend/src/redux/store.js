import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import establishmentReducer from './slices/establishmentSlice';
import serviceReducer from './slices/serviceSlice';
import bookingReducer from './slices/bookingSlice';
import reviewReducer from './slices/reviewSlice';
import aiReducer from './slices/aiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    establishments: establishmentReducer,
    services: serviceReducer,
    bookings: bookingReducer,
    reviews: reviewReducer,
    ai: aiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
import { createSlice } from '@reduxjs/toolkit';

const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    services: [],
    loading: false,
    error: null,
  },
  reducers: {},
});

export default serviceSlice.reducer;
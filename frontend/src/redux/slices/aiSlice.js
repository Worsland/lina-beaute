import { createSlice } from '@reduxjs/toolkit';

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {},
});

export default aiSlice.reducer;
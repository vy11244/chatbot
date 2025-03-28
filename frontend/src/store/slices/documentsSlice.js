// src/store/slices/documentsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const documentsSlice = createSlice({
  name: 'documents',
  initialState: {
    documents: [],
    loading: false,
    error: null
  },
  reducers: {
    setDocuments: (state, action) => {
      state.documents = action.payload;
    },
    addDocuments: (state, action) => {
      state.documents = [...state.documents, ...action.payload];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setDocuments, addDocuments, setLoading, setError } = documentsSlice.actions;
export default documentsSlice.reducer;
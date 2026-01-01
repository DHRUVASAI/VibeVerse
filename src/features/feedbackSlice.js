// Feedback slice for Redux state management
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  feedback: [],
  loading: false,
  error: null,
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    addFeedback: (state, action) => {
      state.feedback.push(action.payload);
    },
    removeFeedback: (state, action) => {
      state.feedback = state.feedback.filter(
        (item) => item.id !== action.payload
      );
    },
    updateFeedback: (state, action) => {
      const index = state.feedback.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.feedback[index] = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  addFeedback,
  removeFeedback,
  updateFeedback,
  setLoading,
  setError,
} = feedbackSlice.actions;

export default feedbackSlice.reducer;

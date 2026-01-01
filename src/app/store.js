// Redux store configuration
import { configureStore } from '@reduxjs/toolkit';
import feedbackSliceReducer from '../features/feedbackSlice';

export const store = configureStore({
  reducer: {
    feedback: feedbackSliceReducer,
  },
});

export default store;

import { configureStore } from '@reduxjs/toolkit';
import historyReducer from '../state/features/HistorySlice';
import userReducer from '../state/features/UserSlice';

const store = configureStore({
  reducer: {
    history: historyReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

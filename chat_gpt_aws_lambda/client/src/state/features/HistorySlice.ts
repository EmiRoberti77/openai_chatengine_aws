import { ChatHistory } from '../../API/model/ChatHistory';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ChatHistory[] = [];

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    pushToHistory: (state, action: PayloadAction<ChatHistory>) => {
      state.push(action.payload);
    },
    deleteAllHistory: (state) => {
      return [];
    },
  },
});

export const { pushToHistory, deleteAllHistory } = historySlice.actions;
export default historySlice.reducer;

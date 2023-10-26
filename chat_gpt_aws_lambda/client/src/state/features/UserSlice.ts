import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ReduxUser, reduxUser } from '../../API/model/ReduxUser';

const initialState = reduxUser;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<ReduxUser>) => {
      Object.assign(state, action.payload); // mutate current state
    },
    removeUser: (state) => {
      Object.assign(state, reduxUser);
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;

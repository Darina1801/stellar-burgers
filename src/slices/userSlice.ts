import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserApi, logoutApi, updateUserApi } from '@api';
import { TUser } from '@utils-types';

type UserState = {
  user: TUser | null;
  isAuthChecked: boolean;
};

const initialState: UserState = {
  user: null,
  isAuthChecked: true
};

export const loadUser = createAsyncThunk(
  'user/load',
  async () => await getUserApi()
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: TUser) => await updateUserApi(data)
);

export const logout = createAsyncThunk(
  'user/logout',
  async () => await logoutApi()
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logout.rejected, (state) => {
        state.isAuthChecked = true;
      });
    builder
      .addCase(loadUser.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(loadUser.rejected, (state) => {
        state.isAuthChecked = true;
      });
    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        console.log('error', action);
      });
  }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;

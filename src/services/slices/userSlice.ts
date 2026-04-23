import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserApi, logoutApi, updateUserApi } from '@api';
import { TUser } from '@utils-types';

type UserState = {
  user: TUser | null;
  isAuthChecked: boolean;
};

const initialState: UserState = {
  user: null,
  isAuthChecked: false
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
    setUser(state, action: PayloadAction<TUser | null>) {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.pending, (state) => {
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
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
      .addCase(updateUser.rejected, (_state) => {});
  }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;

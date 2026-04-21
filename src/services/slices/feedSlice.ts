import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  TFeedsResponse
} from '@api';
import { TOrder } from '@utils-types';

type FeedState = {
  feedData: TFeedsResponse;
  orders: TOrder[];
  isOrdersLoading: boolean;
  selectedOrder: TOrder | null;
};

const initialState: FeedState = {
  feedData: { success: true, orders: [], total: 0, totalToday: 0 },
  orders: [],
  isOrdersLoading: false,
  selectedOrder: null
};

export const loadFeedData = createAsyncThunk<TFeedsResponse>(
  'feed/loadFeed',
  async () => await getFeedsApi()
);

export const loadOrders = createAsyncThunk<TOrder[]>(
  'feed/loadOrders',
  async () => await getOrdersApi()
);

export const loadOrder = createAsyncThunk(
  'feed/loadOrder',
  async (number: number) => await getOrderByNumberApi(number)
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setSelectedOrder(state, action: PayloadAction<string>) {
      if (action.payload === 'close') {
        state.selectedOrder = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFeedData.pending, (state) => {
        state.feedData = initialState.feedData;
      })
      .addCase(loadFeedData.fulfilled, (state, action) => {
        state.feedData = action.payload;
      })
      .addCase(loadFeedData.rejected, (state) => {
        state.feedData = initialState.feedData;
      });
    builder
      .addCase(loadOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.orders = [];
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orders = action.payload;
      })
      .addCase(loadOrders.rejected, (state) => {
        state.isOrdersLoading = false;
        state.orders = [];
      });
    builder
      .addCase(loadOrder.pending, (state) => {
        state.selectedOrder = null;
      })
      .addCase(loadOrder.fulfilled, (state, action) => {
        state.selectedOrder = action.payload.orders[0];
      })
      .addCase(loadOrder.rejected, (state) => {
        state.selectedOrder = null;
      });
  }
});

export const { setSelectedOrder } = feedSlice.actions;
export default feedSlice.reducer;

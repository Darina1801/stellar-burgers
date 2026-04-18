import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
  selectedOrder: TOrder;
};

const emptyOrder: TOrder = {
  createdAt: '',
  ingredients: [],
  _id: '',
  status: '',
  name: '',
  updatedAt: '',
  number: 0
};

const initialState: FeedState = {
  feedData: { success: true, orders: [], total: 0, totalToday: 0 },
  orders: [],
  selectedOrder: emptyOrder
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
    setSelectedOrder(state, action) {
      if (action.payload === 'close') {
        state.selectedOrder = initialState.selectedOrder;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFeedData.fulfilled, (state, action) => {
        state.feedData = action.payload;
      })
      .addCase(loadFeedData.rejected, (state) => {
        state.feedData = initialState.feedData;
      });
    builder
      .addCase(loadOrders.pending, (state) => {
        state.orders = [];
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(loadOrders.rejected, (state) => {
        state.orders = [];
      });
    builder
      .addCase(loadOrder.fulfilled, (state, action) => {
        state.selectedOrder = action.payload.orders[0];
      })
      .addCase(loadOrder.rejected, (state) => {
        state.selectedOrder = initialState.selectedOrder;
      });
  }
});

export const { setSelectedOrder } = feedSlice.actions;
export default feedSlice.reducer;

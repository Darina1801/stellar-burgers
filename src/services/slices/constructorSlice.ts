import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

type ConstructorState = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: ConstructorState = {
  constructorItems: { bun: null, ingredients: [] },
  orderRequest: false,
  orderModalData: null
};

export const makeOrder = createAsyncThunk(
  'constructor/makeOrder',
  async (data: string[]) => await orderBurgerApi(data)
);

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TIngredient>) {
      state.constructorItems.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      state.constructorItems.ingredients.push(action.payload);
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },
    moveIngredientUp(state, action: PayloadAction<number>) {
      const index = action.payload;
      const items = state.constructorItems.ingredients;
      if (index > 0) {
        [items[index - 1], items[index]] = [items[index], items[index - 1]];
      }
    },
    moveIngredientDown(state, action: PayloadAction<number>) {
      const index = action.payload;
      const items = state.constructorItems.ingredients;
      if (index < items.length - 1) {
        [items[index + 1], items[index]] = [items[index], items[index + 1]];
      }
    },
    setOrderRequest(state, action: PayloadAction<boolean>) {
      state.orderRequest = action.payload;
    },
    setOrderModalData(state, action: PayloadAction<TOrder | null>) {
      state.orderModalData = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(makeOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
        state.constructorItems = initialState.constructorItems;
      })
      .addCase(makeOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  setOrderRequest,
  setOrderModalData
} = constructorSlice.actions;
export default constructorSlice.reducer;

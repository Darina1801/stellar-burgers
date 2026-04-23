import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { getStoreItems } from '../../utils/store-items.getter';

type IngredientsState = {
  ingredients: {
    buns: TIngredient[];
    mains: TIngredient[];
    sauces: TIngredient[];
  };
  selectedItem: TIngredient | null;
  isIngredientsLoading: boolean;
  error: string | null;
};

const initialState: IngredientsState = {
  ingredients: { buns: [], mains: [], sauces: [] },
  selectedItem: null,
  isIngredientsLoading: false,
  error: null
};

export const loadIngredients = createAsyncThunk(
  'ingredients/loadAll',
  async () => await getIngredientsApi()
);

export const loadIngredient = createAsyncThunk(
  'ingredients/loadOne',
  async (data: string) => {
    const items = await getIngredientsApi();
    return { items, data };
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setSelectItem(state, action: PayloadAction<TIngredient | null>) {
      state.selectedItem = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(loadIngredients.fulfilled, (state, action) => {
        const [buns, mains, sauces] = getStoreItems(action.payload);
        state.ingredients.buns = buns;
        state.ingredients.sauces = sauces;
        state.ingredients.mains = mains;
        state.isIngredientsLoading = false;
        state.error = null;
      })
      .addCase(loadIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error =
          action.error.message ?? 'Не удалось загрузить ингредиенты';
      });
    builder
      .addCase(loadIngredient.pending, (state) => {
        state.selectedItem = null;
      })
      .addCase(loadIngredient.fulfilled, (state, action) => {
        const [buns, mains, sauces] = getStoreItems(action.payload.items);
        const ingredient = [...buns, ...sauces, ...mains].find(
          (el) => el._id === action.payload.data
        );
        if (ingredient) {
          state.selectedItem = ingredient;
        }
      })
      .addCase(loadIngredient.rejected, (state) => {
        state.selectedItem = null;
      });
  }
});

export const { setSelectItem } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { getStoreItems } from '../utils/store-items.getter';

type IngredientsState = {
  ingredients: {
    buns: TIngredient[];
    mains: TIngredient[];
    sauces: TIngredient[];
  };
  selectedItem: TIngredient | null;
  isIngredientsLoading: boolean;
};

const initialState: IngredientsState = {
  ingredients: { buns: [], mains: [], sauces: [] },
  selectedItem: null,
  isIngredientsLoading: false
};

export const loadIngridients = createAsyncThunk(
  'ingredients/loadAll',
  async () => await getIngredientsApi()
);

export const loadIngridient = createAsyncThunk(
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
    setSelectItem(state, action) {
      state.selectedItem = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadIngridients.pending, (state) => {
        state.isIngredientsLoading = true;
      })
      .addCase(loadIngridients.fulfilled, (state, action) => {
        const [buns, mains, sauces] = getStoreItems(action.payload);
        state.ingredients.buns = buns;
        state.ingredients.sauces = sauces;
        state.ingredients.mains = mains;
        state.isIngredientsLoading = false;
      })
      .addCase(loadIngridients.rejected, (state) => {
        state.isIngredientsLoading = false;
      });
    builder.addCase(loadIngridient.fulfilled, (state, action) => {
      const [buns, mains, sauces] = getStoreItems(action.payload.items);
      const ingredient = [...buns, ...sauces, ...mains].find(
        (el) => el._id === action.payload.data
      );
      if (ingredient) {
        state.selectedItem = ingredient;
      }
    });
  }
});

export const { setSelectItem } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;

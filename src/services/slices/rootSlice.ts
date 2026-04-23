import { combineReducers } from '@reduxjs/toolkit';
import feedReducer from './feedSlice';
import ingredientsReducer from './ingredientsSlice';
import constructorReducer from './constructorSlice';
import userReducer from './userSlice';

export * from './feedSlice';
export * from './ingredientsSlice';
export * from './constructorSlice';
export * from './userSlice';

const rootReducer = combineReducers({
  feed: feedReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  user: userReducer
});

type RootState = ReturnType<typeof rootReducer>;

export const selectFeedData = (state: RootState) => state.feed.feedData;
export const selectIsFeedLoading = (state: RootState) =>
  state.feed.isFeedLoading;
export const selectOrders = (state: RootState) => state.feed.orders;
export const selectIsOrdersLoading = (state: RootState) =>
  state.feed.isOrdersLoading;
export const selectOrder = (state: RootState) => state.feed.selectedOrder;

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const selectItem = (state: RootState) => state.ingredients.selectedItem;
export const selectIsIngredientsLoading = (state: RootState) =>
  state.ingredients.isIngredientsLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor.constructorItems;
export const selectOrderRequest = (state: RootState) =>
  state.burgerConstructor.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.burgerConstructor.orderModalData;

export const userDataSelector = (state: RootState) => state.user.user;
export const isAuthCheckedSelector = (state: RootState) =>
  state.user.isAuthChecked;

export default rootReducer;

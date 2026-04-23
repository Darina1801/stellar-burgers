import { FC, memo, useEffect } from 'react';

import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { loadIngredients, selectIngredients } from '@slices/rootSlice';
import { TIngredient } from '@utils-types';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  const dispatch = useDispatch();
  const data = useSelector(selectIngredients);
  const ingredients: TIngredient[] = [
    ...data.buns,
    ...data.mains,
    ...data.sauces
  ];

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(loadIngredients());
    }
  }, []);

  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return <OrdersListUI orderByDate={orderByDate} />;
});

import { FC, useEffect, useMemo } from 'react';
import { Preloader, OrderInfoUI } from '@ui';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  loadOrder,
  selectIngredients,
  selectOrder
} from '@slices/rootSlice';
import { useParams } from 'react-router-dom';

type TIngredientsWithCount = {
  [key: string]: TIngredient & { count: number };
};

export const OrderInfo: FC = () => {
  const orderData: TOrder | null = useSelector(selectOrder);
  const dispatch = useDispatch();
  const params = useParams();
  const data = useSelector(selectIngredients);
  const ingredients: TIngredient[] = [
    ...data.buns,
    ...data.mains,
    ...data.sauces
  ];

  useEffect(() => {
    if (params.number) {
      dispatch(loadOrder(Number(params.number)));
    }
  }, [params.number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  loadOrders,
  selectIsOrdersLoading,
  selectOrders
} from '@slices/rootSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(selectOrders);
  const isOrdersLoading = useSelector(selectIsOrdersLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadOrders());
  }, []);

  if (isOrdersLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};

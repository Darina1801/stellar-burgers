import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectFeedData } from '@slices/rootSlice';

const MAX_ORDERS_DISPLAY = 20;

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, MAX_ORDERS_DISPLAY);

export const FeedInfo: FC = () => {
  const feed = useSelector(selectFeedData);
  const orders: TOrder[] = feed.orders;

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};

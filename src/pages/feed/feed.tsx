import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { loadFeedData, selectFeedData } from '@slices/rootSlice';
import { TFeedsResponse } from '@api';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const data: TFeedsResponse = useSelector(selectFeedData);
  const orders = data.orders || [];

  const handleGetFeeds = () => {
    dispatch(loadFeedData());
  };

  useEffect(() => {
    dispatch(loadFeedData());
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};

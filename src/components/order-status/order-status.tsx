import { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const STATUS_COLOR_PENDING = '#E52B1A';
const STATUS_COLOR_DONE = '#00CCCC';
const STATUS_COLOR_DEFAULT = '#F2F2F3';

const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

const statusColor: { [key: string]: string } = {
  pending: STATUS_COLOR_PENDING,
  done: STATUS_COLOR_DONE,
  created: STATUS_COLOR_DEFAULT
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => (
  <OrderStatusUI
    textStyle={statusColor[status] ?? STATUS_COLOR_DEFAULT}
    text={statusText[status] ?? ''}
  />
);

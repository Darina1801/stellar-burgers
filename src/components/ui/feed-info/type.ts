export type FeedInfoUIProps = {
  feed: {
    orders: object[];
    total: number;
    totalToday: number;
    isLoading?: boolean;
    error?: string | null;
  };
  readyOrders: number[];
  pendingOrders: number[];
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};

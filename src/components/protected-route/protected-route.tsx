import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { isAuthCheckedSelector, userDataSelector } from '@slices/rootSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children?: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const user = useSelector(userDataSelector);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children ?? <Outlet />;
};
